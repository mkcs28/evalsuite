from __future__ import annotations

import json
from functools import lru_cache
from pathlib import Path
from typing import Any

from fastapi import APIRouter, Depends, Request, Response
from fastapi.responses import JSONResponse
from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from .. import __version__
from ..deps import Principal, api_principal, get_db
from ..engine.interim import evaluate as run_interim
from ..errors import ApiError
from ..models import UsageEvent
from ..schemas import EvaluationRequest, EvaluationResult, HealthResponse, ReadinessResponse, to_wire
from .keys import require_eligible

router = APIRouter()
_REGISTRY = Path(__file__).resolve().parent.parent / "data" / "metrics.json"


@lru_cache
def _metrics() -> list[dict[str, Any]]:
    data: list[dict[str, Any]] = json.loads(_REGISTRY.read_text(encoding="utf-8"))
    return data


@router.get("/health", response_model=HealthResponse, tags=["meta"])
def health() -> HealthResponse:
    """Liveness. ``version`` is the EvalSuite package version; None until it is released."""
    return HealthResponse(status="ok", version=None)


@router.get("/health/ready", response_model=ReadinessResponse, tags=["meta"])
def ready(request: Request, response: Response, db: Session = Depends(get_db)) -> ReadinessResponse:
    """Readiness: the database and the rate-limit store must both answer."""
    try:
        db.execute(text("SELECT 1"))
        database = True
    except SQLAlchemyError:
        database = False
    store = request.app.state.eval_limiter.ping()
    ok = database and store
    if not ok:
        response.status_code = 503
    return ReadinessResponse(status="ok" if ok else "degraded", database=database, rate_limit_store=store)


@router.get("/version", tags=["meta"])
def version() -> dict[str, str | None]:
    return {"api": __version__, "evalsuite": None, "engine": "interim"}


@router.get("/metrics", tags=["metrics"])
def list_metrics() -> list[dict[str, Any]]:
    return _metrics()


@router.get("/metrics/{metric_id}", tags=["metrics"])
def get_metric(metric_id: str) -> dict[str, Any]:
    for m in _metrics():
        if m["id"] == metric_id:
            return m
    raise ApiError(404, "not_found", f"No metric with id '{metric_id}'.")


@router.post("/evaluate", response_model=EvaluationResult, tags=["evaluation"])
def evaluate(
    body: EvaluationRequest,
    request: Request,
    principal: Principal = Depends(api_principal),
    db: Session = Depends(get_db),
) -> JSONResponse:
    require_eligible(principal.user)
    allowed, retry = request.app.state.eval_limiter.hit(principal.user.id)
    if not allowed:
        raise ApiError(
            429,
            "rate_limited",
            "Rate limit exceeded for your account. Try again shortly.",
            {"Retry-After": str(retry)},
        )
    result = run_interim(body)
    # Only counters are stored; the submitted data is never persisted or logged.
    db.add(
        UsageEvent(
            user_id=principal.user.id,
            api_key_id=principal.api_key_id,
            endpoint="evaluate",
            status_code=200,
            n_observations=result.n_observations,
        )
    )
    db.commit()
    return JSONResponse(to_wire(result))
