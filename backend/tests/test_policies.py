from __future__ import annotations

import uuid
from collections.abc import Callable

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import select

from app.models import Visitor
from app.personal_email import is_personal_email

from .conftest import registration


@pytest.mark.parametrize(
    "email",
    ["ada@gmail.com", "Ada@GMAIL.com", "x@outlook.com", "y@yahoo.co.in", "z@proton.me", "w@icloud.com"],
)
def test_personal_addresses_accepted(email: str) -> None:
    assert is_personal_email(email)


@pytest.mark.parametrize(
    "email",
    [
        "ada@jssstu.ac.in",
        "ada@university.edu",
        "ada@company.com",
        "ada@gmail.com.evil.org",
        "ada@sub.gmail.com",
        "ada@mailinator.com",
        "no-at-sign",
    ],
)
def test_organisation_and_other_addresses_rejected(email: str) -> None:
    assert not is_personal_email(email)


def test_registration_requires_personal_email(client: TestClient) -> None:
    r = client.post("/api/v1/auth/register", json=registration(email="ada@jssstu.ac.in"))
    assert r.status_code == 422
    assert "personal email" in r.json()["error"]["message"]
    assert client.post("/api/v1/auth/register", json=registration(email="ada@outlook.com")).status_code == 201


def test_download_requires_personal_email(client: TestClient) -> None:
    body = {"email": "reader@company.com", "version": "upcoming", "acceptSecurityNotices": True}
    r = client.post("/api/v1/downloads/request", json=body)
    assert r.status_code == 422 and "personal email" in r.json()["error"]["message"]
    assert (
        client.post("/api/v1/downloads/request", json={**body, "email": "reader@gmail.com"}).status_code
        == 200
    )


def test_visitor_counter_counts_each_browser_once(client: TestClient) -> None:
    assert client.get("/api/v1/stats").json() == {"totalVisitors": 0}
    a, b = str(uuid.uuid4()), str(uuid.uuid4())
    assert client.post("/api/v1/stats/visit", json={"visitorId": a}).json() == {"totalVisitors": 1}
    assert client.post("/api/v1/stats/visit", json={"visitorId": a}).json() == {"totalVisitors": 1}
    assert client.post("/api/v1/stats/visit", json={"visitorId": b.upper()}).json() == {"totalVisitors": 2}
    assert client.get("/api/v1/stats").json() == {"totalVisitors": 2}


def test_visitor_ids_are_not_stored_raw(client: TestClient) -> None:
    vid = str(uuid.uuid4())
    client.post("/api/v1/stats/visit", json={"visitorId": vid})
    db = client.app.state.db  # type: ignore[attr-defined]
    with db.sessions() as s:
        row = s.scalar(select(Visitor))
        assert row is not None and vid not in row.id_hash and len(row.id_hash) == 64


@pytest.mark.parametrize("bad", ["not-a-uuid-at-all-not-a-uuid-at-all", "1" * 36, ""])
def test_visitor_id_must_be_uuid(client: TestClient, bad: str) -> None:
    assert client.post("/api/v1/stats/visit", json={"visitorId": bad}).status_code == 422


def test_visit_rate_limited(make_client: Callable[..., TestClient]) -> None:
    c = make_client(auth_attempts_per_minute=2)
    codes = [
        c.post("/api/v1/stats/visit", json={"visitorId": str(uuid.uuid4())}).status_code for _ in range(3)
    ]
    assert codes == [200, 200, 429]
