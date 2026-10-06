"""Password hashing, JWT access tokens and API-key generation."""

from __future__ import annotations

import hashlib
import hmac
import secrets
from datetime import datetime, timedelta, timezone

import jwt
from argon2 import PasswordHasher
from argon2.exceptions import InvalidHashError, VerificationError, VerifyMismatchError

from .config import Settings

_hasher = PasswordHasher()
# Used to equalise timing when the email does not exist.
_DUMMY_HASH = _hasher.hash("timing-equaliser-not-a-real-password")

API_KEY_PREFIX = "es_live_"


def hash_password(password: str) -> str:
    return _hasher.hash(password)


def verify_password(password: str, password_hash: str | None) -> bool:
    try:
        return _hasher.verify(password_hash or _DUMMY_HASH, password) and password_hash is not None
    except (VerifyMismatchError, VerificationError, InvalidHashError):
        return False


def password_version(changed_at: datetime) -> str:
    """Opaque claim tying a session to the password it was issued under."""
    return hashlib.sha256(changed_at.replace(tzinfo=None).isoformat().encode()).hexdigest()[:16]


def create_access_token(user_id: str, changed_at: datetime, settings: Settings) -> tuple[str, int]:
    now = datetime.now(timezone.utc)
    expires = timedelta(minutes=settings.access_token_minutes)
    payload = {
        "sub": user_id,
        "pwv": password_version(changed_at),
        "iss": settings.jwt_issuer,
        "aud": settings.jwt_audience,
        "iat": now,
        "nbf": now,
        "exp": now + expires,
        "typ": "access",
    }
    return jwt.encode(payload, settings.jwt_secret, algorithm="HS256"), int(expires.total_seconds())


def decode_access_token(token: str, settings: Settings) -> tuple[str, str] | None:
    """Return (user id, password version) for a valid access token, else None."""
    try:
        payload = jwt.decode(
            token,
            settings.jwt_secret,
            algorithms=["HS256"],
            audience=settings.jwt_audience,
            issuer=settings.jwt_issuer,
            options={"require": ["exp", "iat", "sub", "iss", "aud"]},
        )
    except jwt.PyJWTError:
        return None
    if payload.get("typ") != "access":
        return None
    sub, pwv = payload.get("sub"), payload.get("pwv")
    return (sub, pwv) if isinstance(sub, str) and isinstance(pwv, str) else None


def hash_api_key(key: str, pepper: str) -> str:
    return hmac.new(pepper.encode(), key.encode(), hashlib.sha256).hexdigest()


def generate_api_key(pepper: str) -> tuple[str, str, str]:
    """Return (plaintext key, lookup prefix, HMAC hash). The plaintext is shown to the user once."""
    prefix = secrets.token_hex(4)  # 8 hex chars
    secret = secrets.token_urlsafe(32)
    key = f"{API_KEY_PREFIX}{prefix}_{secret}"
    return key, prefix, hash_api_key(key, pepper)


def new_reset_token() -> tuple[str, str]:
    """Return (token for the email link, SHA-256 hash to store)."""
    token = secrets.token_urlsafe(32)
    return token, hash_token(token)


def hash_token(token: str) -> str:
    return hashlib.sha256(token.encode()).hexdigest()


def parse_api_key(key: str) -> str | None:
    """Return the lookup prefix of a well-formed key, else None."""
    if not key.startswith(API_KEY_PREFIX):
        return None
    rest = key[len(API_KEY_PREFIX) :]
    prefix, sep, secret = rest.partition("_")
    if not sep or len(prefix) != 8 or len(secret) < 32:
        return None
    return prefix
