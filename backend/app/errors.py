"""Uniform error responses: {"error": {"code": ..., "message": ...}}."""

from __future__ import annotations

import logging

from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException as StarletteHTTPException


class ApiError(Exception):
    def __init__(self, status: int, code: str, message: str, headers: dict[str, str] | None = None) -> None:
        self.status = status
        self.code = code
        self.message = message
        self.headers = headers


def _body(code: str, message: str) -> dict[str, dict[str, str]]:
    return {"error": {"code": code, "message": message}}


def _location(loc: tuple[object, ...]) -> str:
    parts = [str(p) for p in loc if p not in ("body", "query", "path")]
    return ".".join(parts)


def install_error_handlers(app: FastAPI) -> None:
    @app.exception_handler(ApiError)
    async def _api_error(_: Request, exc: ApiError) -> JSONResponse:
        return JSONResponse(_body(exc.code, exc.message), status_code=exc.status, headers=exc.headers)

    @app.exception_handler(RequestValidationError)
    async def _validation(_: Request, exc: RequestValidationError) -> JSONResponse:
        first = exc.errors()[0] if exc.errors() else {"loc": (), "msg": "Invalid request."}
        where = _location(tuple(first.get("loc", ())))
        msg = str(first.get("msg", "Invalid request.")).removeprefix("Value error, ")
        return JSONResponse(_body("validation_error", f"{where}: {msg}" if where else msg), status_code=422)

    @app.exception_handler(StarletteHTTPException)
    async def _http(_: Request, exc: StarletteHTTPException) -> JSONResponse:
        code = {404: "not_found", 405: "method_not_allowed"}.get(exc.status_code, "http_error")
        return JSONResponse(_body(code, str(exc.detail)), status_code=exc.status_code)

    from .ratelimit import RateLimitStoreError

    @app.exception_handler(RateLimitStoreError)
    async def _store(_: Request, exc: RateLimitStoreError) -> JSONResponse:
        logging.getLogger("evalsuite.error").error("Rate-limit store unavailable: %s", exc)
        return JSONResponse(
            _body("service_unavailable", "The service is temporarily unavailable. Please try again shortly."),
            status_code=503,
            headers={"Retry-After": "30"},
        )

    @app.exception_handler(Exception)
    async def _unexpected(_: Request, __: Exception) -> JSONResponse:
        # Never leak internals or stack traces.
        return JSONResponse(_body("internal_error", "An internal error occurred."), status_code=500)
