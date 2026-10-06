from __future__ import annotations

import re
import time
from collections.abc import Callable
from urllib.parse import parse_qs, urlparse

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import select

from app.download_tokens import sign, verify
from app.email import MemoryEmailSender
from app.models import DownloadSubscriber

WHEEL = "evalsuite-0.1.0-py3-none-any.whl"
SECRET = "d" * 40

# Shared with the website's TypeScript verifier (tests/unit/download-token.test.ts).
CROSS_LANGUAGE_VECTOR = (
    "eyJleHAiOjE4MDAwMDA2MDAsImYiOiJldmFsc3VpdGUtMC4xLjAtcHkzLW5vbmUtYW55LndobCIsInYiOiIwLjEuMCJ9."
)


def _req(**overrides: object) -> dict[str, object]:
    body: dict[str, object] = {
        "email": "Reader@Gmail.com",
        "version": "0.1.0",
        "filename": WHEEL,
        "acceptSecurityNotices": True,
    }
    body.update(overrides)
    return body


def _outbox(c: TestClient) -> MemoryEmailSender:
    sender = c.app.state.email  # type: ignore[attr-defined]
    assert isinstance(sender, MemoryEmailSender)
    return sender


def test_email_is_required_and_a_signed_link_is_issued(make_client: Callable[..., TestClient]) -> None:
    c = make_client(download_token_secret=SECRET)
    assert (
        c.post(
            "/api/v1/downloads/request", json={k: v for k, v in _req().items() if k != "email"}
        ).status_code
        == 422
    )
    r = c.post("/api/v1/downloads/request", json=_req())
    assert r.status_code == 200, r.text
    grant = r.json()
    url = urlparse(grant["downloadPath"])
    assert url.path == f"/api/download/0.1.0/{WHEEL}"
    token = parse_qs(url.query)["token"][0]
    assert verify(token, "0.1.0", WHEEL, SECRET)
    assert not verify(token, "0.1.0", "evalsuite-0.1.0.tar.gz", SECRET)
    assert not verify(token, "0.1.0", WHEEL, "x" * 40)
    assert grant["expiresIn"] == 600
    db = c.app.state.db  # type: ignore[attr-defined]
    with db.sessions() as s:
        row = s.scalar(select(DownloadSubscriber))
        assert row is not None and row.email == "reader@gmail.com" and row.version == "0.1.0"


def test_consent_is_mandatory(client: TestClient) -> None:
    r = client.post("/api/v1/downloads/request", json=_req(acceptSecurityNotices=False))
    assert r.status_code == 422
    assert "security notices" in r.json()["error"]["message"]


@pytest.mark.parametrize(
    "overrides",
    [
        {"filename": "evalsuite-0.2.0.tar.gz"},
        {"filename": "../../etc/passwd"},
        {"filename": None},
        {"version": "latest"},
        {"email": "not-an-email"},
    ],
)
def test_invalid_requests_are_rejected(client: TestClient, overrides: dict[str, object]) -> None:
    assert client.post("/api/v1/downloads/request", json=_req(**overrides)).status_code == 422


def test_upcoming_signup_has_no_link(client: TestClient) -> None:
    r = client.post("/api/v1/downloads/request", json=_req(version="upcoming", filename=None))
    assert r.status_code == 200
    assert r.json()["downloadPath"] is None
    assert "v0.1.0" in r.json()["message"]


def test_one_confirmation_email_with_unsubscribe_link(client: TestClient) -> None:
    client.post("/api/v1/downloads/request", json=_req())
    client.post("/api/v1/downloads/request", json=_req())
    sent = _outbox(client).outbox
    assert len(sent) == 1
    assert sent[0].to == "reader@gmail.com"
    assert "security notices" in sent[0].body
    assert re.search(r"https://evalsuite\.test/unsubscribe#token=[A-Za-z0-9_-]+", sent[0].body)


def test_unsubscribe(client: TestClient) -> None:
    client.post("/api/v1/downloads/request", json=_req())
    token = re.search(r"#token=([A-Za-z0-9_-]+)", _outbox(client).outbox[0].body).group(1)  # type: ignore[union-attr]
    good = client.post("/api/v1/downloads/unsubscribe", json={"token": token})
    bad = client.post("/api/v1/downloads/unsubscribe", json={"token": "x" * 43})
    assert good.status_code == bad.status_code == 200
    assert good.json() == bad.json()
    db = client.app.state.db  # type: ignore[attr-defined]
    with db.sessions() as s:
        row = s.scalar(select(DownloadSubscriber))
        assert row is not None and row.unsubscribed_at is not None
    # Downloading again re-subscribes and sends a fresh confirmation.
    client.post("/api/v1/downloads/request", json=_req())
    assert len(_outbox(client).outbox) == 2


def test_token_expiry_and_tampering() -> None:
    now = time.time()
    token = sign("0.1.0", WHEEL, SECRET, 60, now=now)
    assert verify(token, "0.1.0", WHEEL, SECRET, now=now + 59)
    assert not verify(token, "0.1.0", WHEEL, SECRET, now=now + 61)
    payload, mac = token.split(".")
    assert not verify(
        payload + "." + mac[:-1] + ("0" if mac[-1] != "0" else "1"), "0.1.0", WHEEL, SECRET, now=now
    )
    assert not verify("garbage", "0.1.0", WHEEL, SECRET)


def test_cross_language_vector() -> None:
    token = sign("0.1.0", WHEEL, "s" * 40, 600, now=1_800_000_000)
    assert token.startswith(CROSS_LANGUAGE_VECTOR)
    assert verify(token, "0.1.0", WHEEL, "s" * 40, now=1_800_000_000)


def test_download_requests_are_rate_limited(make_client: Callable[..., TestClient]) -> None:
    c = make_client(auth_attempts_per_minute=2)
    codes = [c.post("/api/v1/downloads/request", json=_req()).status_code for _ in range(3)]
    assert codes == [200, 200, 429]
