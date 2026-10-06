"""Shared fixtures.

By default tests use in-memory SQLite and the in-process rate limiter. Set
EVALSUITE_TEST_DATABASE_URL (PostgreSQL) and/or EVALSUITE_TEST_REDIS_URL to run
the same suite against real services, as CI does.
"""

from __future__ import annotations

import os
from collections.abc import Iterator
from datetime import date, timedelta

import pytest
from fastapi.testclient import TestClient

from app.config import Settings
from app.db import Base
from app.main import create_app

TEST_DB = os.environ.get("EVALSUITE_TEST_DATABASE_URL", "sqlite://")
TEST_REDIS = os.environ.get("EVALSUITE_TEST_REDIS_URL") or None


def make_settings(**overrides: object) -> Settings:
    base: dict[str, object] = {
        "env": "test",
        "database_url": TEST_DB,
        "redis_url": TEST_REDIS,
        "jwt_secret": "t" * 40,
        "api_key_pepper": "p" * 40,
        "download_token_secret": "d" * 40,
        "evaluate_requests_per_minute": 1000,
        "auth_attempts_per_minute": 1000,
        "email_backend": "memory",
        "site_url": "https://evalsuite.test",
    }
    base.update(overrides)
    return Settings(**base)  # type: ignore[arg-type]


def _reset_external_state() -> None:
    if TEST_REDIS:
        import redis

        redis.Redis.from_url(TEST_REDIS).flushdb()


@pytest.fixture
def make_client() -> Iterator[object]:
    """Factory for clients with custom settings; cleans the database afterwards."""
    clients: list[TestClient] = []

    def factory(**overrides: object) -> TestClient:
        _reset_external_state()
        c = TestClient(create_app(make_settings(**overrides)))
        c.__enter__()
        clients.append(c)
        return c

    yield factory
    for c in clients:
        db = c.app.state.db  # type: ignore[attr-defined]
        c.__exit__(None, None, None)
        if not TEST_DB.startswith("sqlite"):
            Base.metadata.drop_all(db.engine)
        db.engine.dispose()
    _reset_external_state()


@pytest.fixture
def client(make_client: object) -> TestClient:
    return make_client()  # type: ignore[operator, no-any-return]


PASSWORD = "correct-horse-battery"


def years_ago(years: int, days: int = 0) -> str:
    today = date.today()
    try:
        d = today.replace(year=today.year - years)
    except ValueError:  # 29 February
        d = today.replace(year=today.year - years, day=28)
    return (d + timedelta(days=days)).isoformat()


def registration(
    email: str = "ada@gmail.com", password: str = PASSWORD, **overrides: object
) -> dict[str, object]:
    body: dict[str, object] = {
        "email": email,
        "password": password,
        "name": "Ada Lovelace",
        "dateOfBirth": years_ago(30),
        "role": "academic-researcher",
        "organization": "Analytical Engine Lab",
        "country": "United Kingdom",
        "intendedUse": "Evaluating clinical risk models for a research study.",
        "acceptTerms": True,
    }
    body.update(overrides)
    return body


def register_and_login(
    c: TestClient, email: str = "ada@gmail.com", password: str = PASSWORD
) -> dict[str, str]:
    r = c.post("/api/v1/auth/register", json=registration(email, password))
    assert r.status_code == 201, r.text
    r = c.post("/api/v1/auth/login", json={"email": email, "password": password})
    assert r.status_code == 200, r.text
    return {"Authorization": f"Bearer {r.json()['accessToken']}"}


def create_key(c: TestClient, headers: dict[str, str], name: str = "laptop") -> dict[str, str]:
    r = c.post("/api/v1/keys", json={"name": name}, headers=headers)
    assert r.status_code == 201, r.text
    data: dict[str, str] = r.json()
    return data


BINARY = {
    "task": "binary-classification",
    "yTrue": [1, 1, 1, 0, 0, 0, 0, 1],
    "yPred": [1, 1, 0, 0, 0, 1, 0, 1],
    "yProb": [0.9, 0.8, 0.4, 0.2, 0.1, 0.6, 0.3, 0.7],
    "metrics": ["classification.accuracy", "classification.mcc", "classification.roc_auc"],
    "confidence": {"method": "wilson", "level": 0.95, "nBootstrap": 1000, "randomState": 42},
}
