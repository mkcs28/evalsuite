"""Request dependencies: database session, settings, authenticated principals."""

from __future__ import annotations

import hmac
from collections.abc import Iterator
from dataclasses import dataclass

from fastapi import Depends, Header, Request
from sqlalchemy import select
from sqlalchemy.orm import Session

from .config import Settings
from .errors import ApiError
from .models import ApiKey, User, utcnow
from .security import API_KEY_PREFIX, decode_access_token, hash_api_key, parse_api_key, password_version

_UNAUTHORISED = {"WWW-Authenticate": "Bearer"}


def get_settings_dep(request: Request) -> Settings:
    settings: Settings = request.app.state.settings
    return settings


def get_db(request: Request) -> Iterator[Session]:
    yield from request.app.state.db.session()


def client_ip(request: Request) -> str:
    # Behind a reverse proxy, configure uvicorn --proxy-headers so this is the real client address.
    return request.client.host if request.client else "unknown"


def _bearer(authorization: str | None) -> str | None:
    if not authorization:
        return None
    scheme, _, token = authorization.partition(" ")
    return token.strip() if scheme.lower() == "bearer" and token.strip() else None


def _user_from_jwt(token: str, db: Session, settings: Settings) -> User:
    claims = decode_access_token(token, settings)
    user = db.get(User, claims[0]) if claims else None
    if (
        user is None
        or not user.is_active
        or claims is None
        or claims[1] != password_version(user.password_changed_at)
    ):
        raise ApiError(
            401, "invalid_token", "Your session has expired or is invalid. Sign in again.", _UNAUTHORISED
        )
    return user


def current_user(
    authorization: str | None = Header(default=None),
    db: Session = Depends(get_db),
    settings: Settings = Depends(get_settings_dep),
) -> User:
    """Dashboard routes: require a JWT access token (API keys are not accepted)."""
    token = _bearer(authorization)
    if token is None or token.startswith(API_KEY_PREFIX):
        raise ApiError(401, "not_authenticated", "Sign in to access this resource.", _UNAUTHORISED)
    return _user_from_jwt(token, db, settings)


@dataclass(frozen=True)
class Principal:
    user: User
    api_key_id: str | None


def api_principal(
    authorization: str | None = Header(default=None),
    x_api_key: str | None = Header(default=None),
    db: Session = Depends(get_db),
    settings: Settings = Depends(get_settings_dep),
) -> Principal:
    """API routes: accept a personal API key (X-API-Key or Bearer) or a dashboard JWT."""
    token = x_api_key or _bearer(authorization)
    if not token:
        raise ApiError(
            401,
            "not_authenticated",
            "Provide an API key in the X-API-Key header or as a Bearer token.",
            _UNAUTHORISED,
        )
    if not token.startswith(API_KEY_PREFIX):
        return Principal(user=_user_from_jwt(token, db, settings), api_key_id=None)

    prefix = parse_api_key(token)
    key = (
        db.scalar(select(ApiKey).where(ApiKey.prefix == prefix, ApiKey.revoked_at.is_(None)))
        if prefix
        else None
    )
    expected = key.key_hash if key else "0" * 64
    valid = hmac.compare_digest(hash_api_key(token, settings.api_key_pepper), expected)
    if key is None or not valid or not key.user.is_active:
        raise ApiError(401, "invalid_api_key", "The API key is invalid or has been revoked.", _UNAUTHORISED)
    key.last_used_at = utcnow()
    db.commit()
    return Principal(user=key.user, api_key_id=key.id)
