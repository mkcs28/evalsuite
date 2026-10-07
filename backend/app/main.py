"""Application factory."""

from __future__ import annotations

from collections.abc import AsyncIterator
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.types import ASGIApp, Message, Receive, Scope, Send

from . import __version__
from .config import Settings, get_settings
from .db import Database
from .email import make_sender
from .errors import install_error_handlers
from .observability import CatchUnhandled, RequestContext, configure_logging
from .ratelimit import make_limiters
from .routers import auth, downloads, evaluate, keys, stats


class BodySizeLimit:
    """Reject request bodies larger than ``limit`` bytes (declared or streamed)."""

    def __init__(self, app: ASGIApp, limit: int) -> None:
        self.app = app
        self.limit = limit

    async def __call__(self, scope: Scope, receive: Receive, send: Send) -> None:
        if scope["type"] != "http":
            await self.app(scope, receive, send)
            return
        declared = dict(scope.get("headers", [])).get(b"content-length")
        if declared is not None and declared.isdigit() and int(declared) > self.limit:
            await _too_large(send, self.limit)
            return
        received = 0

        async def limited_receive() -> Message:
            nonlocal received
            message = await receive()
            if message["type"] == "http.request":
                received += len(message.get("body", b""))
                if received > self.limit:
                    raise _BodyTooLargeError
            return message

        try:
            await self.app(scope, limited_receive, send)
        except _BodyTooLargeError:
            await _too_large(send, self.limit)


class _BodyTooLargeError(Exception):
    pass


async def _too_large(send: Send, limit: int) -> None:
    body = (
        b'{"error":{"code":"payload_too_large","message":"Request body exceeds '
        + str(limit).encode()
        + b' bytes."}}'
    )
    await send(
        {"type": "http.response.start", "status": 413, "headers": [(b"content-type", b"application/json")]}
    )
    await send({"type": "http.response.body", "body": body})


class SecurityHeaders:
    def __init__(self, app: ASGIApp) -> None:
        self.app = app

    async def __call__(self, scope: Scope, receive: Receive, send: Send) -> None:
        async def wrapped(message: Message) -> None:
            if message["type"] == "http.response.start":
                headers = list(message.get("headers", []))
                headers += [
                    (b"x-content-type-options", b"nosniff"),
                    (b"x-frame-options", b"DENY"),
                    (b"referrer-policy", b"no-referrer"),
                    (b"cache-control", b"no-store"),
                ]
                message["headers"] = headers
            await send(message)

        await self.app(scope, receive, wrapped)


def create_app(settings: Settings | None = None) -> FastAPI:
    settings = settings or get_settings()
    configure_logging(settings.log_level)
    db = Database(settings.database_url)

    @asynccontextmanager
    async def lifespan(_: FastAPI) -> AsyncIterator[None]:
        if settings.auto_create_tables:
            db.create_all()
        yield
        db.engine.dispose()

    app = FastAPI(
        title="EvalSuite API",
        version=__version__,
        description="Accounts, personal API keys and authenticated evaluation for EvalSuite. "
        "Evaluation currently runs an interim NumPy engine, not the EvalSuite package.",
        docs_url="/api/docs",
        redoc_url=None,
        openapi_url="/api/openapi.json",
        lifespan=lifespan,
    )
    app.state.settings = settings
    app.state.db = db
    app.state.eval_limiter, app.state.auth_limiter = make_limiters(
        settings.redis_url, settings.evaluate_requests_per_minute, settings.auth_attempts_per_minute
    )
    app.state.email = make_sender(settings)

    install_error_handlers(app)
    for router in (evaluate.router, auth.router, keys.router, downloads.router, stats.router):
        app.include_router(router, prefix="/api/v1")

    # Added first, so it sits inside CORS: error responses keep their CORS headers.
    app.add_middleware(CatchUnhandled)
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_origin_regex=settings.cors_origin_regex,
        allow_credentials=False,
        allow_methods=["GET", "POST", "DELETE"],
        allow_headers=["Authorization", "Content-Type", "X-API-Key", "X-Request-ID"],
        expose_headers=["X-Request-ID", "Retry-After"],
        max_age=600,
    )
    app.add_middleware(SecurityHeaders)
    app.add_middleware(BodySizeLimit, limit=settings.max_body_bytes)
    app.add_middleware(RequestContext)
    return app


app = create_app()
