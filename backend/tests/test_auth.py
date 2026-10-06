from __future__ import annotations

from collections.abc import Callable

import pytest
from fastapi.testclient import TestClient

from app.config import Settings
from app.models import utcnow
from app.security import create_access_token

from .conftest import PASSWORD, make_settings, register_and_login, registration


def test_register_login_me(client: TestClient) -> None:
    headers = register_and_login(client, "Ada@Gmail.com")
    me = client.get("/api/v1/auth/me", headers=headers)
    assert me.status_code == 200
    assert me.json()["email"] == "ada@gmail.com"
    assert "passwordHash" not in me.json() and "password_hash" not in me.json()


def test_duplicate_email_rejected(client: TestClient) -> None:
    register_and_login(client)
    r = client.post("/api/v1/auth/register", json=registration("ADA@gmail.com", PASSWORD))
    assert r.status_code == 409
    assert r.json()["error"]["code"] == "email_taken"


def test_weak_password_rejected(client: TestClient) -> None:
    r = client.post("/api/v1/auth/register", json=registration("b@gmail.com", "aaaaaaaaaa"))
    assert r.status_code == 422
    assert "too simple" in r.json()["error"]["message"]


def test_wrong_password_and_unknown_user_look_identical(client: TestClient) -> None:
    register_and_login(client)
    a = client.post("/api/v1/auth/login", json={"email": "ada@gmail.com", "password": "wrong-password-1"})
    b = client.post("/api/v1/auth/login", json={"email": "nobody@gmail.com", "password": "wrong-password-1"})
    assert a.status_code == b.status_code == 401
    assert a.json() == b.json()


def test_invalid_and_foreign_tokens(client: TestClient) -> None:
    assert client.get("/api/v1/auth/me").status_code == 401
    assert client.get("/api/v1/auth/me", headers={"Authorization": "Bearer nonsense"}).status_code == 401
    other = make_settings(jwt_secret="x" * 40)
    forged, _ = create_access_token("someone", utcnow(), other)
    assert client.get("/api/v1/auth/me", headers={"Authorization": f"Bearer {forged}"}).status_code == 401


def test_login_rate_limited(make_client: Callable[..., TestClient]) -> None:
    c = make_client(auth_attempts_per_minute=3)
    codes = [
        c.post("/api/v1/auth/login", json={"email": "x@gmail.com", "password": "nope-nope-1"}).status_code
        for _ in range(4)
    ]
    assert codes[:3] == [401, 401, 401]
    assert codes[3] == 429


@pytest.mark.parametrize(
    ("overrides", "fragment"),
    [
        ({}, "JWT_SECRET"),
        ({"jwt_secret": "s" * 40, "api_key_pepper": "s" * 40}, "must all differ"),
        ({"download_token_secret": "a" * 40}, "must all differ"),
        ({"database_url": "sqlite:///x.db"}, "PostgreSQL"),
        ({"email_backend": "console"}, "SMTP"),
        ({"site_url": "http://insecure.example"}, "https"),
    ],
)
def test_production_configuration_is_enforced(overrides: dict[str, object], fragment: str) -> None:
    base: dict[str, object] = {
        "env": "production",
        "database_url": "postgresql://u:p@h/db",
        "jwt_secret": "a" * 40,
        "api_key_pepper": "b" * 40,
        "download_token_secret": "c" * 40,
        "email_backend": "smtp",
        "smtp_host": "smtp.example.org",
        "site_url": "https://evalsuite.example.org",
    }
    if fragment == "JWT_SECRET":
        base.pop("jwt_secret")
    base.update(overrides)
    with pytest.raises(ValueError, match=fragment):
        Settings(**base)  # type: ignore[arg-type]


def test_valid_production_configuration() -> None:
    Settings(
        env="production",
        database_url="postgresql://u:p@h/db",
        jwt_secret="a" * 40,
        api_key_pepper="b" * 40,
        download_token_secret="c" * 40,
        email_backend="smtp",
        smtp_host="smtp.example.org",
        site_url="https://evalsuite.example.org",
    )
