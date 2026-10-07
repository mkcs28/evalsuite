from __future__ import annotations

import logging
from collections.abc import Callable

import pytest
from fastapi import APIRouter
from fastapi.testclient import TestClient

ORIGIN = "https://evalsuite-nine.vercel.app"


class BrokenSender:
    def send(self, message: object) -> None:
        raise OSError("SMTP connect timed out")


def test_email_failure_does_not_break_notify_me(
    make_client: Callable[..., TestClient], caplog: pytest.LogCaptureFixture
) -> None:
    c = make_client(cors_origins=[ORIGIN])
    c.app.state.email = BrokenSender()  # type: ignore[attr-defined]
    logger = logging.getLogger("evalsuite.email")
    logger.addHandler(caplog.handler)
    try:
        r = c.post(
            "/api/v1/downloads/request",
            json={"email": "manoj@gmail.com", "version": "upcoming", "acceptSecurityNotices": True},
            headers={"Origin": ORIGIN},
        )
    finally:
        logger.removeHandler(caplog.handler)
    assert r.status_code == 200
    assert r.headers["access-control-allow-origin"] == ORIGIN
    assert any("Email delivery failed: OSError" in rec.getMessage() for rec in caplog.records)
    assert not any("manoj@gmail.com" in rec.getMessage() for rec in caplog.records)


def test_email_failure_does_not_break_forgot_password(make_client: Callable[..., TestClient]) -> None:
    from .conftest import register_and_login

    c = make_client(cors_origins=[ORIGIN])
    register_and_login(c)
    c.app.state.email = BrokenSender()  # type: ignore[attr-defined]
    r = c.post("/api/v1/auth/password/forgot", json={"email": "ada@gmail.com"}, headers={"Origin": ORIGIN})
    assert r.status_code == 202


def test_unexpected_errors_keep_cors_headers(make_client: Callable[..., TestClient]) -> None:
    c = make_client(cors_origins=[ORIGIN])
    boom = APIRouter()

    @boom.get("/api/v1/_boom")
    def _boom() -> None:
        raise RuntimeError("unexpected")

    c.app.include_router(boom)  # type: ignore[attr-defined]
    with TestClient(c.app, raise_server_exceptions=False) as raw:  # type: ignore[arg-type]
        r = raw.get("/api/v1/_boom", headers={"Origin": ORIGIN})
    assert r.status_code == 500
    assert r.json() == {"error": {"code": "internal_error", "message": "An internal error occurred."}}
    assert r.headers.get("access-control-allow-origin") == ORIGIN


def test_brevo_api_sender_payload_and_request(monkeypatch: pytest.MonkeyPatch) -> None:
    import json
    import urllib.request

    from app.email import BrevoApiSender, Message
    from tests.conftest import make_settings

    sender = BrevoApiSender(
        make_settings(
            email_backend="brevo", brevo_api_key="xkeysib-test", email_from="EvalSuite <me@gmail.com>"
        )
    )
    sent: dict[str, object] = {}

    class Resp:
        status = 201

        def __enter__(self) -> Resp:
            return self

        def __exit__(self, *a: object) -> None:
            return None

    def fake_urlopen(req: urllib.request.Request, timeout: float) -> Resp:
        sent["url"] = req.full_url
        sent["key"] = req.get_header("Api-key")
        sent["body"] = json.loads(req.data)  # type: ignore[arg-type]
        return Resp()

    monkeypatch.setattr(urllib.request, "urlopen", fake_urlopen)
    sender.send(Message(to="reader@gmail.com", subject="Hi", body="Body"))
    assert sent["url"] == "https://api.brevo.com/v3/smtp/email"
    assert sent["key"] == "xkeysib-test"
    assert sent["body"] == {
        "sender": {"name": "EvalSuite", "email": "me@gmail.com"},
        "to": [{"email": "reader@gmail.com"}],
        "subject": "Hi",
        "textContent": "Body",
    }


def test_production_accepts_brevo_api_email() -> None:
    from app.config import Settings

    Settings(
        env="production",
        database_url="postgresql://u:p@h/db",
        jwt_secret="a" * 40,
        api_key_pepper="b" * 40,
        download_token_secret="c" * 40,
        email_backend="brevo",
        brevo_api_key="xkeysib-real",
        site_url="https://evalsuite-nine.vercel.app",
    )
    with pytest.raises(ValueError, match="BREVO_API_KEY"):
        Settings(
            env="production",
            database_url="postgresql://u:p@h/db",
            jwt_secret="a" * 40,
            api_key_pepper="b" * 40,
            download_token_secret="c" * 40,
            email_backend="brevo",
            site_url="https://evalsuite-nine.vercel.app",
        )
