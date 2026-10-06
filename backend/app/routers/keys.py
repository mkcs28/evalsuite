from __future__ import annotations

from datetime import timedelta

from fastapi import APIRouter, Depends, Response, status
from sqlalchemy import func, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from ..config import Settings
from ..deps import current_user, get_db, get_settings_dep
from ..eligibility import MINIMUM_AGE, is_adult
from ..errors import ApiError
from ..models import ApiKey, UsageEvent, User, utcnow
from ..schemas import ApiKeyResponse, CreatedKeyResponse, CreateKeyRequest, UsageResponse
from ..security import generate_api_key

router = APIRouter(tags=["account"])


@router.get("/keys", response_model=list[ApiKeyResponse])
def list_keys(user: User = Depends(current_user), db: Session = Depends(get_db)) -> list[ApiKey]:
    return list(
        db.scalars(select(ApiKey).where(ApiKey.user_id == user.id).order_by(ApiKey.created_at.desc()))
    )


def require_eligible(user: User) -> None:
    if not is_adult(user.date_of_birth):
        raise ApiError(
            403,
            "age_requirement",
            f"API access is available only to account holders aged {MINIMUM_AGE} or over.",
        )


def _issue_key(db: Session, user: User, name: str, settings: Settings) -> CreatedKeyResponse:
    plaintext, prefix, key_hash = generate_api_key(settings.api_key_pepper)
    key = ApiKey(user_id=user.id, name=name, prefix=prefix, key_hash=key_hash)
    db.add(key)
    try:
        db.commit()
    except IntegrityError as exc:
        # Two concurrent requests: the partial unique index lets only one active key through.
        db.rollback()
        raise ApiError(409, "key_exists", _ONE_KEY) from exc
    return CreatedKeyResponse(
        id=key.id,
        name=key.name,
        prefix=key.prefix,
        created_at=key.created_at,
        last_used_at=None,
        revoked_at=None,
        key=plaintext,
    )


_ONE_KEY = "Each account can have one active API key. Rotate or revoke the current key to get a new one."


@router.post("/keys", response_model=CreatedKeyResponse, status_code=status.HTTP_201_CREATED)
def create_key(
    body: CreateKeyRequest,
    user: User = Depends(current_user),
    db: Session = Depends(get_db),
    settings: Settings = Depends(get_settings_dep),
) -> CreatedKeyResponse:
    require_eligible(user)
    active = db.scalar(
        select(func.count()).select_from(ApiKey).where(ApiKey.user_id == user.id, ApiKey.revoked_at.is_(None))
    )
    if active:
        raise ApiError(409, "key_exists", _ONE_KEY)
    return _issue_key(db, user, body.name.strip(), settings)


@router.post("/keys/{key_id}/rotate", response_model=CreatedKeyResponse, status_code=status.HTTP_201_CREATED)
def rotate_key(
    key_id: str,
    user: User = Depends(current_user),
    db: Session = Depends(get_db),
    settings: Settings = Depends(get_settings_dep),
) -> CreatedKeyResponse:
    """Revoke the active key and issue a replacement with the same name, in one transaction."""
    require_eligible(user)
    key = db.get(ApiKey, key_id)
    if key is None or key.user_id != user.id or key.revoked_at is not None:
        raise ApiError(404, "not_found", "No active API key with this id exists in your account.")
    key.revoked_at = utcnow()
    db.flush()
    return _issue_key(db, user, key.name, settings)


@router.delete("/keys/{key_id}", status_code=status.HTTP_204_NO_CONTENT)
def revoke_key(key_id: str, user: User = Depends(current_user), db: Session = Depends(get_db)) -> Response:
    key = db.get(ApiKey, key_id)
    if key is None or key.user_id != user.id:
        raise ApiError(404, "not_found", "No API key with this id exists in your account.")
    if key.revoked_at is None:
        key.revoked_at = utcnow()
        db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.get("/usage", response_model=UsageResponse)
def usage(
    user: User = Depends(current_user),
    db: Session = Depends(get_db),
    settings: Settings = Depends(get_settings_dep),
) -> UsageResponse:
    now = utcnow()

    def count(since: timedelta) -> int:
        q = (
            select(func.count())
            .select_from(UsageEvent)
            .where(UsageEvent.user_id == user.id, UsageEvent.created_at >= now - since)
        )
        return int(db.scalar(q) or 0)

    obs = db.scalar(
        select(func.coalesce(func.sum(UsageEvent.n_observations), 0)).where(
            UsageEvent.user_id == user.id, UsageEvent.created_at >= now - timedelta(days=30)
        )
    )
    return UsageResponse(
        requests_last_24h=count(timedelta(hours=24)),
        requests_last_30d=count(timedelta(days=30)),
        observations_last_30d=int(obs or 0),
        rate_limit_per_minute=settings.evaluate_requests_per_minute,
    )
