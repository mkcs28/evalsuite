from __future__ import annotations

from fastapi.testclient import TestClient
from sqlalchemy import select

from app.models import ApiKey

from .conftest import BINARY, create_key, register_and_login


def test_key_lifecycle(client: TestClient) -> None:
    jwt_headers = register_and_login(client)
    created = create_key(client, jwt_headers)
    assert created["key"].startswith("es_live_")
    listed = client.get("/api/v1/keys", headers=jwt_headers).json()
    assert len(listed) == 1 and "key" not in listed[0]
    assert listed[0]["prefix"] == created["prefix"]

    key_headers = {"X-API-Key": created["key"]}
    assert client.post("/api/v1/evaluate", json=BINARY, headers=key_headers).status_code == 200
    assert client.get("/api/v1/keys", headers=jwt_headers).json()[0]["lastUsedAt"] is not None

    assert client.delete(f"/api/v1/keys/{created['id']}", headers=jwt_headers).status_code == 204
    r = client.post("/api/v1/evaluate", json=BINARY, headers=key_headers)
    assert r.status_code == 401 and r.json()["error"]["code"] == "invalid_api_key"


def test_key_as_bearer_token(client: TestClient) -> None:
    key = create_key(client, register_and_login(client))["key"]
    r = client.post("/api/v1/evaluate", json=BINARY, headers={"Authorization": f"Bearer {key}"})
    assert r.status_code == 200


def test_keys_cannot_manage_keys(client: TestClient) -> None:
    key = create_key(client, register_and_login(client))["key"]
    assert client.get("/api/v1/keys", headers={"Authorization": f"Bearer {key}"}).status_code == 401


def test_tampered_key_rejected(client: TestClient) -> None:
    key = create_key(client, register_and_login(client))["key"]
    tampered = key[:-1] + ("A" if key[-1] != "A" else "B")
    assert client.post("/api/v1/evaluate", json=BINARY, headers={"X-API-Key": tampered}).status_code == 401


def test_users_cannot_revoke_each_others_keys(client: TestClient) -> None:
    a = register_and_login(client, "a@gmail.com")
    b = register_and_login(client, "b@gmail.com")
    key = create_key(client, a)
    assert client.delete(f"/api/v1/keys/{key['id']}", headers=b).status_code == 404
    assert client.get("/api/v1/keys", headers=b).json() == []


def test_one_active_key_per_account(client: TestClient) -> None:
    h = register_and_login(client)
    first = create_key(client, h, "one")
    r = client.post("/api/v1/keys", json={"name": "two"}, headers=h)
    assert r.status_code == 409
    assert r.json()["error"]["code"] == "key_exists"
    # After revoking, a new key can be created.
    client.delete(f"/api/v1/keys/{first['id']}", headers=h)
    assert client.post("/api/v1/keys", json={"name": "two"}, headers=h).status_code == 201


def test_rotate_replaces_the_key(client: TestClient) -> None:
    h = register_and_login(client)
    old = create_key(client, h, "laptop")
    r = client.post(f"/api/v1/keys/{old['id']}/rotate", headers=h)
    assert r.status_code == 201
    new = r.json()
    assert new["name"] == "laptop" and new["key"] != old["key"]
    assert client.post("/api/v1/evaluate", json=BINARY, headers={"X-API-Key": old["key"]}).status_code == 401
    assert client.post("/api/v1/evaluate", json=BINARY, headers={"X-API-Key": new["key"]}).status_code == 200
    active = [k for k in client.get("/api/v1/keys", headers=h).json() if k["revokedAt"] is None]
    assert [k["id"] for k in active] == [new["id"]]
    # A revoked key cannot be rotated.
    assert client.post(f"/api/v1/keys/{old['id']}/rotate", headers=h).status_code == 404


def test_database_enforces_one_active_key(client: TestClient) -> None:
    """Even a direct insert that bypasses the API cannot create a second active key."""
    import pytest
    from sqlalchemy.exc import IntegrityError

    h = register_and_login(client)
    create_key(client, h)
    db = client.app.state.db  # type: ignore[attr-defined]
    with db.sessions() as s:
        user = s.scalar(select(ApiKey)).user
        s.add(ApiKey(user_id=user.id, name="sneaky", prefix="ffffffff", key_hash="0" * 64))
        with pytest.raises(IntegrityError):
            s.commit()


def test_key_is_not_stored_in_plaintext(client: TestClient) -> None:
    key = create_key(client, register_and_login(client))["key"]
    from sqlalchemy import select

    from app.models import ApiKey

    db = client.app.state.db  # type: ignore[attr-defined]
    with db.sessions() as s:
        row = s.scalar(select(ApiKey))
        assert row is not None and key not in (row.key_hash, row.prefix)
