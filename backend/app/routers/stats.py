from __future__ import annotations

import hashlib
import hmac
import uuid

from fastapi import APIRouter, Depends, Request
from pydantic import Field
from sqlalchemy import func, select
from sqlalchemy.dialects.postgresql import insert as pg_insert
from sqlalchemy.dialects.sqlite import insert as sqlite_insert
from sqlalchemy.orm import Session

from ..config import Settings
from ..deps import client_ip, get_db, get_settings_dep
from ..errors import ApiError
from ..models import Visitor
from ..schemas import CamelModel

router = APIRouter(prefix="/stats", tags=["stats"])


class VisitRequest(CamelModel):
    # Random UUID generated and kept by the browser.
    visitor_id: str = Field(min_length=36, max_length=36)


class StatsResponse(CamelModel):
    total_visitors: int


def _total(db: Session) -> int:
    return int(db.scalar(select(func.count()).select_from(Visitor)) or 0)


@router.get("", response_model=StatsResponse)
def stats(db: Session = Depends(get_db)) -> StatsResponse:
    return StatsResponse(total_visitors=_total(db))


@router.post("/visit", response_model=StatsResponse)
def visit(
    body: VisitRequest,
    request: Request,
    db: Session = Depends(get_db),
    settings: Settings = Depends(get_settings_dep),
) -> StatsResponse:
    """Count a browser once. Repeat visits from the same browser do not change the total."""
    try:
        uuid.UUID(body.visitor_id, version=4)
    except ValueError as exc:
        raise ApiError(422, "validation_error", "visitorId must be a UUID.") from exc
    allowed, retry = request.app.state.auth_limiter.hit(f"visit:{client_ip(request)}")
    if not allowed:
        raise ApiError(429, "rate_limited", "Too many requests.", {"Retry-After": str(retry)})
    digest = hmac.new(
        settings.api_key_pepper.encode(), body.visitor_id.lower().encode(), hashlib.sha256
    ).hexdigest()
    dialect = db.get_bind().dialect.name
    insert = pg_insert if dialect == "postgresql" else sqlite_insert
    db.execute(insert(Visitor).values(id_hash=digest).on_conflict_do_nothing(index_elements=["id_hash"]))
    db.commit()
    return StatsResponse(total_visitors=_total(db))
