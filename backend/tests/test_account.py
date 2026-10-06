from __future__ import annotations

import re
from datetime import timedelta

from fastapi.testclient import TestClient
from sqlalchemy import select

from app.email import MemoryEmailSender
from app.models import ApiKey, PasswordResetToken, UsageEvent, User, utcnow

from .conftest import BINARY, PASSWORD, create_key, register_and_login

NEW_PASSWORD = "another-strong-pass-2"


def _outbox(c: TestClient) -> MemoryEmailSender:
    sender = c.app.state.email  # type: ignore[attr-defined]
    assert isinstance(sender, MemoryEmailSender)
    return sender


def _token_from_email(c: TestClient) -> str:
    body = _outbox(c).outbox[-1].body
    match = re.search(r"/reset-password#token=([A-Za-z0-9_-]+)", body)
    assert match, body
    return match.group(1)


def test_forgot_password_does_not_reveal_accounts(client: TestClient) -> None:
    register_and_login(client)
    known = client.post("/api/v1/auth/password/forgot", json={"email": "ada@gmail.com"})
    unknown = client.post("/api/v1/auth/password/forgot", json={"email": "nobody@gmail.com"})
    assert known.status_code == unknown.status_code == 202
    assert known.json() == unknown.json()
    assert len(_outbox(client).outbox) == 1
    assert _outbox(client).outbox[0].to == "ada@gmail.com"


def test_reset_link_uses_fragment_and_site_url(client: TestClient) -> None:
    register_and_login(client)
    client.post("/api/v1/auth/password/forgot", json={"email": "ada@gmail.com"})
    assert "https://evalsuite.test/reset-password#token=" in _outbox(client).outbox[0].body


def test_full_reset_flow(client: TestClient) -> None:
    old_session = register_and_login(client)
    client.post("/api/v1/auth/password/forgot", json={"email": "ada@gmail.com"})
    token = _token_from_email(client)

    r = client.post("/api/v1/auth/password/reset", json={"token": token, "password": NEW_PASSWORD})
    assert r.status_code == 200, r.text

    # Old password and old sessions stop working; the new password works.
    assert client.get("/api/v1/auth/me", headers=old_session).status_code == 401
    bad = client.post("/api/v1/auth/login", json={"email": "ada@gmail.com", "password": PASSWORD})
    assert bad.status_code == 401
    good = client.post("/api/v1/auth/login", json={"email": "ada@gmail.com", "password": NEW_PASSWORD})
    assert good.status_code == 200

    # Single use.
    again = client.post(
        "/api/v1/auth/password/reset", json={"token": token, "password": "yet-another-pass-3"}
    )
    assert again.status_code == 400
    assert again.json()["error"]["code"] == "invalid_reset_token"


def test_new_reset_link_invalidates_after_use_of_another(client: TestClient) -> None:
    register_and_login(client)
    client.post("/api/v1/auth/password/forgot", json={"email": "ada@gmail.com"})
    first = _token_from_email(client)
    client.post("/api/v1/auth/password/forgot", json={"email": "ada@gmail.com"})
    second = _token_from_email(client)
    assert (
        client.post(
            "/api/v1/auth/password/reset", json={"token": second, "password": NEW_PASSWORD}
        ).status_code
        == 200
    )
    r = client.post("/api/v1/auth/password/reset", json={"token": first, "password": "yet-another-pass-3"})
    assert r.status_code == 400


def test_expired_reset_token(client: TestClient) -> None:
    register_and_login(client)
    client.post("/api/v1/auth/password/forgot", json={"email": "ada@gmail.com"})
    token = _token_from_email(client)
    db = client.app.state.db  # type: ignore[attr-defined]
    with db.sessions() as s:
        row = s.scalar(select(PasswordResetToken))
        assert row is not None and token not in (row.token_hash,)
        row.expires_at = utcnow() - timedelta(minutes=1)
        s.commit()
    r = client.post("/api/v1/auth/password/reset", json={"token": token, "password": NEW_PASSWORD})
    assert r.status_code == 400


def test_reset_rejects_weak_password_and_garbage_token(client: TestClient) -> None:
    r = client.post("/api/v1/auth/password/reset", json={"token": "x" * 43, "password": "aaaaaaaaaa"})
    assert r.status_code == 422
    r = client.post("/api/v1/auth/password/reset", json={"token": "x" * 43, "password": NEW_PASSWORD})
    assert r.status_code == 400


def test_change_password_rotates_sessions(client: TestClient) -> None:
    session = register_and_login(client)
    wrong = client.post(
        "/api/v1/auth/password/change",
        json={"currentPassword": "not-my-password", "newPassword": NEW_PASSWORD},
        headers=session,
    )
    assert wrong.status_code == 400
    r = client.post(
        "/api/v1/auth/password/change",
        json={"currentPassword": PASSWORD, "newPassword": NEW_PASSWORD},
        headers=session,
    )
    assert r.status_code == 200
    fresh = {"Authorization": f"Bearer {r.json()['accessToken']}"}
    assert client.get("/api/v1/auth/me", headers=session).status_code == 401
    assert client.get("/api/v1/auth/me", headers=fresh).status_code == 200


def test_api_keys_survive_password_change(client: TestClient) -> None:
    session = register_and_login(client)
    key = create_key(client, session)["key"]
    client.post(
        "/api/v1/auth/password/change",
        json={"currentPassword": PASSWORD, "newPassword": NEW_PASSWORD},
        headers=session,
    )
    assert client.post("/api/v1/evaluate", json=BINARY, headers={"X-API-Key": key}).status_code == 200


def test_delete_account_removes_everything(client: TestClient) -> None:
    session = register_and_login(client)
    key = create_key(client, session)["key"]
    client.post("/api/v1/evaluate", json=BINARY, headers={"X-API-Key": key})
    client.post("/api/v1/auth/password/forgot", json={"email": "ada@gmail.com"})

    wrong = client.request("DELETE", "/api/v1/auth/me", json={"password": "nope-nope-nope"}, headers=session)
    assert wrong.status_code == 400
    r = client.request("DELETE", "/api/v1/auth/me", json={"password": PASSWORD}, headers=session)
    assert r.status_code == 204

    assert client.get("/api/v1/auth/me", headers=session).status_code == 401
    assert client.post("/api/v1/evaluate", json=BINARY, headers={"X-API-Key": key}).status_code == 401
    db = client.app.state.db  # type: ignore[attr-defined]
    with db.sessions() as s:
        for model in (User, ApiKey, UsageEvent, PasswordResetToken):
            assert s.scalar(select(model)) is None, model.__name__
    # The email can be registered again.
    register_and_login(client)
