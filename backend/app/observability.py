"""Structured access logging and request ids. Request and response bodies are never logged."""

from __future__ import annotations

import json
import logging
import re
import time
import uuid

from starlette.types import ASGIApp, Message, Receive, Scope, Send

access_log = logging.getLogger("evalsuite.access")
_SAFE_ID = re.compile(r"^[A-Za-z0-9._-]{1,64}$")


class JsonFormatter(logging.Formatter):
    def format(self, record: logging.LogRecord) -> str:
        payload: dict[str, object] = {
            "time": self.formatTime(record, "%Y-%m-%dT%H:%M:%S%z"),
            "level": record.levelname,
            "logger": record.name,
            "message": record.getMessage(),
        }
        extra = getattr(record, "fields", None)
        if isinstance(extra, dict):
            payload.update(extra)
        return json.dumps(payload, default=str)


def configure_logging(level: str) -> None:
    handler = logging.StreamHandler()
    handler.setFormatter(JsonFormatter())
    root = logging.getLogger("evalsuite")
    root.handlers[:] = [handler]
    root.setLevel(level)
    root.propagate = False


class RequestContext:
    """Assigns an X-Request-ID and writes one access-log line per request (path only, no query string)."""

    def __init__(self, app: ASGIApp) -> None:
        self.app = app

    async def __call__(self, scope: Scope, receive: Receive, send: Send) -> None:
        if scope["type"] != "http":
            await self.app(scope, receive, send)
            return
        incoming = dict(scope.get("headers", [])).get(b"x-request-id", b"").decode("latin-1")
        request_id = incoming if _SAFE_ID.match(incoming) else uuid.uuid4().hex
        start = time.perf_counter()
        status = 500

        async def wrapped(message: Message) -> None:
            nonlocal status
            if message["type"] == "http.response.start":
                status = message["status"]
                message["headers"] = [*message.get("headers", []), (b"x-request-id", request_id.encode())]
            await send(message)

        try:
            await self.app(scope, receive, wrapped)
        finally:
            if scope.get("method") == "OPTIONS" and status == 400:
                origin = dict(scope.get("headers", [])).get(b"origin", b"").decode("latin-1")[:200]
                logging.getLogger("evalsuite.cors").warning(
                    "CORS preflight rejected for origin %r. Add it to EVALSUITE_CORS_ORIGINS "
                    "(or EVALSUITE_SITE_URL) if it is your website.",
                    origin,
                )
            access_log.info(
                "request",
                extra={
                    "fields": {
                        "request_id": request_id,
                        "method": scope.get("method"),
                        "path": scope.get("path"),
                        "status": status,
                        "duration_ms": round((time.perf_counter() - start) * 1000, 1),
                    }
                },
            )


class CatchUnhandled:
    """Turn unexpected exceptions into a JSON 500 *inside* the CORS middleware.

    Starlette's own handler for unhandled errors runs outside every middleware, so its 500
    response has no CORS headers and browsers report it as a network failure. Placing this
    middleware inside CORS keeps real errors visible to the website.
    """

    def __init__(self, app: ASGIApp) -> None:
        self.app = app

    async def __call__(self, scope: Scope, receive: Receive, send: Send) -> None:
        if scope["type"] != "http":
            await self.app(scope, receive, send)
            return
        started = False

        async def tracking_send(message: Message) -> None:
            nonlocal started
            if message["type"] == "http.response.start":
                started = True
            await send(message)

        try:
            await self.app(scope, receive, tracking_send)
        except Exception as exc:
            logging.getLogger("evalsuite.error").error(
                "Unhandled error on %s %s: %s", scope.get("method"), scope.get("path"), type(exc).__name__
            )
            if started:
                raise
            body = b'{"error":{"code":"internal_error","message":"An internal error occurred."}}'
            await send(
                {
                    "type": "http.response.start",
                    "status": 500,
                    "headers": [
                        (b"content-type", b"application/json"),
                        (b"content-length", str(len(body)).encode()),
                    ],
                }
            )
            await send({"type": "http.response.body", "body": body})
