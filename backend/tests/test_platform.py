from __future__ import annotations

import logging
import os
import threading
from collections.abc import Callable
from pathlib import Path

import pytest
from alembic import command
from alembic.autogenerate import compare_metadata
from alembic.config import Config
from alembic.migration import MigrationContext
from fastapi.testclient import TestClient

from app.db import Base, make_engine
from app.ratelimit import MemoryRateLimiter, RedisRateLimiter

from .conftest import BINARY, TEST_REDIS, create_key, register_and_login

BACKEND = Path(__file__).resolve().parents[1]


def test_readiness_ok(client: TestClient) -> None:
    r = client.get("/api/v1/health/ready")
    assert r.status_code == 200
    assert r.json() == {"status": "ok", "database": True, "rateLimitStore": True}


def test_readiness_reports_unreachable_redis(make_client: Callable[..., TestClient]) -> None:
    c = make_client(redis_url="redis://127.0.0.1:1/0")
    r = c.get("/api/v1/health/ready")
    assert r.status_code == 503
    assert r.json()["rateLimitStore"] is False


def test_request_id_is_echoed_or_generated(client: TestClient) -> None:
    assert (
        client.get("/api/v1/health", headers={"X-Request-ID": "abc-123"}).headers["x-request-id"] == "abc-123"
    )
    generated = client.get("/api/v1/health", headers={"X-Request-ID": "bad id with spaces"}).headers[
        "x-request-id"
    ]
    assert len(generated) == 32


def test_access_log_never_contains_bodies_or_keys(
    client: TestClient, caplog: pytest.LogCaptureFixture
) -> None:
    session = register_and_login(client)
    key = create_key(client, session)["key"]
    access = logging.getLogger("evalsuite.access")
    access.addHandler(caplog.handler)  # the evalsuite logger does not propagate to root
    try:
        with caplog.at_level(logging.INFO, logger="evalsuite.access"):
            body = {**BINARY, "yProb": [0.987654321] * 8}
            client.post("/api/v1/evaluate?debug=secret-query", json=body, headers={"X-API-Key": key})
    finally:
        access.removeHandler(caplog.handler)
    text = "\n".join(str(getattr(r, "fields", "")) + r.getMessage() for r in caplog.records)
    assert "/api/v1/evaluate" in text
    # A distinctive input value (not a short substring that could appear in timings).
    for leaked in (key, "987654321", "secret-query", "correct-horse"):
        assert leaked not in text


def test_memory_limiter_window() -> None:
    limiter = MemoryRateLimiter(2, window_seconds=60)
    assert [limiter.hit("k")[0] for _ in range(3)] == [True, True, False]
    assert limiter.hit("other")[0] is True


@pytest.mark.skipif(not TEST_REDIS, reason="EVALSUITE_TEST_REDIS_URL not set")
def test_redis_limiter_is_atomic_under_concurrency() -> None:
    import redis

    client = redis.Redis.from_url(TEST_REDIS or "")
    client.flushdb()
    limiter = RedisRateLimiter(client, limit=25, namespace="concurrency")
    results: list[bool] = []
    lock = threading.Lock()

    def worker() -> None:
        for _ in range(10):
            allowed, _ = limiter.hit("shared")
            with lock:
                results.append(allowed)

    threads = [threading.Thread(target=worker) for _ in range(8)]
    for t in threads:
        t.start()
    for t in threads:
        t.join()
    assert results.count(True) == 25
    assert limiter.hit("shared")[1] >= 1
    client.flushdb()


def _alembic(url: str) -> Config:
    cfg = Config(str(BACKEND / "alembic.ini"))
    cfg.set_main_option("script_location", str(BACKEND / "migrations"))
    cfg.set_main_option("sqlalchemy.url", url)
    return cfg


def test_migrations_match_models(tmp_path: Path) -> None:
    """`alembic upgrade head` on an empty database yields exactly the ORM schema, and downgrades cleanly."""
    url = os.environ.get("EVALSUITE_TEST_MIGRATIONS_URL", f"sqlite:///{tmp_path / 'migrations.db'}")
    cfg = _alembic(url)
    command.upgrade(cfg, "head")
    engine = make_engine(url)
    with engine.connect() as conn:
        diff = compare_metadata(MigrationContext.configure(conn, opts={"compare_type": True}), Base.metadata)
    assert diff == []
    command.downgrade(cfg, "base")
    command.upgrade(cfg, "head")
    engine.dispose()


def test_hosted_database_url_forms_use_psycopg() -> None:
    for url in (
        "postgres://u:p@host.neon.tech/db?sslmode=require",
        "postgresql://u:p@host.neon.tech/db?sslmode=require",
    ):
        engine = make_engine(url)
        assert engine.url.drivername == "postgresql+psycopg"
        assert engine.url.query.get("sslmode") == "require"
        engine.dispose()


def test_cors_allows_exact_origins_and_optional_pattern(make_client: Callable[..., TestClient]) -> None:
    c = make_client(
        cors_origins=["https://evalsuite-mkcs28.vercel.app"],
        cors_origin_regex=r"^https://evalsuite-[a-z0-9-]+-mkcs\.vercel\.app$",
    )

    def allowed(origin: str) -> str | None:
        r = c.options(
            "/api/v1/downloads/request",
            headers={"Origin": origin, "Access-Control-Request-Method": "POST"},
        )
        return r.headers.get("access-control-allow-origin")

    assert allowed("https://evalsuite-mkcs28.vercel.app") == "https://evalsuite-mkcs28.vercel.app"
    assert allowed("https://evalsuite-abc123-mkcs.vercel.app") == "https://evalsuite-abc123-mkcs.vercel.app"
    assert allowed("https://evil.vercel.app") is None
    assert allowed("https://evalsuite-x-mkcs.vercel.app.evil.com") is None


def test_production_regex_must_be_https() -> None:
    from app.config import Settings

    with pytest.raises(ValueError, match="CORS_ORIGIN_REGEX"):
        Settings(
            env="production",
            database_url="postgresql://u:p@h/db",
            jwt_secret="a" * 40,
            api_key_pepper="b" * 40,
            download_token_secret="c" * 40,
            email_backend="smtp",
            smtp_host="smtp.example.org",
            site_url="https://evalsuite.example.org",
            cors_origin_regex=".*",
        )
