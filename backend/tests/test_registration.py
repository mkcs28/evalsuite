from __future__ import annotations

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import select

from app.eligibility import age_on
from app.models import User

from .conftest import BINARY, create_key, register_and_login, registration, years_ago


def test_profile_is_stored_and_dob_not_returned(client: TestClient) -> None:
    r = client.post("/api/v1/auth/register", json=registration(name="  Ada   Lovelace  "))
    assert r.status_code == 201, r.text
    body = r.json()
    assert body["name"] == "Ada Lovelace"
    assert body["role"] == "academic-researcher"
    assert body["eligibleForApi"] is True
    assert "dateOfBirth" not in body and "intendedUse" not in body
    db = client.app.state.db  # type: ignore[attr-defined]
    with db.sessions() as s:
        user = s.scalar(select(User))
        assert user is not None
        assert user.intended_use and user.terms_accepted_at is not None and user.country == "United Kingdom"


@pytest.mark.parametrize(
    ("overrides", "fragment"),
    [
        ({"dateOfBirth": years_ago(17)}, "at least 18"),
        ({"dateOfBirth": years_ago(18, days=1)}, "at least 18"),  # 18th birthday is tomorrow
        ({"dateOfBirth": years_ago(-1)}, "valid date of birth"),
        ({"dateOfBirth": "1850-01-01"}, "valid date of birth"),
        ({"acceptTerms": False}, "terms"),
        ({"name": "   "}, "name"),
        ({"intendedUse": "testing"}, "intendedUse"),
        ({"role": "astronaut"}, "role"),
        ({"country": ""}, "country"),
        ({"organization": " "}, "organization"),
    ],
)
def test_invalid_registrations_are_rejected(
    client: TestClient, overrides: dict[str, object], fragment: str
) -> None:
    r = client.post("/api/v1/auth/register", json=registration(**overrides))
    assert r.status_code == 422, r.text
    assert fragment in r.json()["error"]["message"]


@pytest.mark.parametrize(
    "field",
    [
        "name",
        "email",
        "password",
        "dateOfBirth",
        "role",
        "organization",
        "country",
        "intendedUse",
        "acceptTerms",
    ],
)
def test_required_fields(client: TestClient, field: str) -> None:
    body = registration()
    body.pop(field)
    assert client.post("/api/v1/auth/register", json=body).status_code == 422


def test_eighteenth_birthday_today_is_allowed(client: TestClient) -> None:
    assert (
        client.post("/api/v1/auth/register", json=registration(dateOfBirth=years_ago(18))).status_code == 201
    )


def _set_dob(client: TestClient, iso: str | None) -> None:
    from datetime import date

    db = client.app.state.db  # type: ignore[attr-defined]
    with db.sessions() as s:
        user = s.scalar(select(User))
        assert user is not None
        user.date_of_birth = date.fromisoformat(iso) if iso else None
        s.commit()


@pytest.mark.parametrize("dob", [None, "under-18"])
def test_ineligible_accounts_cannot_get_or_use_keys(client: TestClient, dob: str | None) -> None:
    """Server-side enforcement, e.g. for accounts created before the age field existed."""
    h = register_and_login(client)
    key = create_key(client, h)["key"]
    _set_dob(client, years_ago(16) if dob else None)

    r = client.post("/api/v1/keys", json={"name": "x"}, headers=h)
    assert r.status_code == 403 and r.json()["error"]["code"] == "age_requirement"
    r = client.post("/api/v1/evaluate", json=BINARY, headers={"X-API-Key": key})
    assert r.status_code == 403
    assert client.get("/api/v1/auth/me", headers=h).json()["eligibleForApi"] is False


def test_age_calculation() -> None:
    from datetime import date

    assert age_on(date(2008, 10, 6), date(2026, 10, 6)) == 18
    assert age_on(date(2008, 10, 7), date(2026, 10, 6)) == 17
    assert age_on(date(2008, 2, 29), date(2026, 2, 28)) == 17
    assert age_on(date(2008, 2, 29), date(2026, 3, 1)) == 18
