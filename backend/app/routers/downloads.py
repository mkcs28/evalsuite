from __future__ import annotations

from fastapi import APIRouter, Depends, Request
from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator
from sqlalchemy import select
from sqlalchemy.orm import Session

from ..config import Settings
from ..deps import client_ip, get_db, get_settings_dep
from ..download_tokens import VERSION, filename_matches, sign
from ..email import Message
from ..errors import ApiError
from ..models import DownloadSubscriber, utcnow
from ..personal_email import require_personal_email
from ..schemas import CamelModel, MessageResponse
from ..security import hash_token, new_reset_token

router = APIRouter(prefix="/downloads", tags=["downloads"])

UPCOMING = "upcoming"


class DownloadRequest(CamelModel):
    email: EmailStr
    # A released version with a file name, or "upcoming" (no file) to be notified of v0.1.0.
    version: str = Field(min_length=1, max_length=32)
    filename: str | None = Field(default=None, max_length=80)
    accept_security_notices: bool

    @field_validator("email")
    @classmethod
    def _personal(cls, v: str) -> str:
        return require_personal_email(v)

    @field_validator("accept_security_notices")
    @classmethod
    def _consent(cls, v: bool) -> bool:
        if not v:
            raise ValueError("Agree to receive security notices for this download to continue.")
        return v


class DownloadGrant(CamelModel):
    """Signed path on the website, valid for ``expiresIn`` seconds. Absent for 'upcoming'."""

    download_path: str | None
    expires_in: int | None
    message: str


class UnsubscribeRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")
    token: str = Field(min_length=20, max_length=200)


def _throttle(request: Request, key: str) -> None:
    allowed, retry = request.app.state.auth_limiter.hit(key)
    if not allowed:
        raise ApiError(
            429, "rate_limited", "Too many requests. Try again shortly.", {"Retry-After": str(retry)}
        )


@router.post("/request", response_model=DownloadGrant)
def request_download(
    body: DownloadRequest,
    request: Request,
    db: Session = Depends(get_db),
    settings: Settings = Depends(get_settings_dep),
) -> DownloadGrant:
    """Record the email for security notices, then issue a short-lived signed download link."""
    known = body.version == UPCOMING or (
        VERSION.match(body.version) is not None
        and body.filename is not None
        and filename_matches(body.version, body.filename)
    )
    if not known:
        raise ApiError(422, "validation_error", "Unknown release file.")
    _throttle(request, f"download:{client_ip(request)}")
    email = body.email.lower()

    row = db.scalar(
        select(DownloadSubscriber).where(
            DownloadSubscriber.email == email, DownloadSubscriber.version == body.version
        )
    )
    is_new = row is None or row.unsubscribed_at is not None
    token, token_hash = new_reset_token()
    if row is None:
        row = DownloadSubscriber(email=email, version=body.version, unsubscribe_token_hash=token_hash)
        db.add(row)
    else:
        row.last_requested_at = utcnow()
        if row.unsubscribed_at is not None:
            row.unsubscribed_at = None
            row.unsubscribe_token_hash = token_hash
    db.commit()

    if is_new:
        unsubscribe_link = f"{settings.site_url.rstrip('/')}/unsubscribe#token={token}"
        what = (
            "the first EvalSuite release (v0.1.0)"
            if body.version == UPCOMING
            else f"EvalSuite {body.version}"
        )
        request.app.state.email.send(
            Message(
                to=email,
                subject="EvalSuite security notices",
                body=(
                    f"You will receive security notices about {what}, and nothing else.\n\n"
                    f"Stop these emails at any time: {unsubscribe_link}\n"
                ),
            )
        )

    if body.version == UPCOMING:
        return DownloadGrant(
            download_path=None,
            expires_in=None,
            message=(
                "You will be emailed when v0.1.0 is released and about any security issue affecting it."
            ),
        )
    ttl = settings.download_token_minutes * 60
    signed = sign(body.version, body.filename or "", settings.download_token_secret, ttl)
    return DownloadGrant(
        download_path=f"/api/download/{body.version}/{body.filename}?token={signed}",
        expires_in=ttl,
        message="Your download is ready.",
    )


@router.post("/unsubscribe", response_model=MessageResponse)
def unsubscribe(body: UnsubscribeRequest, request: Request, db: Session = Depends(get_db)) -> MessageResponse:
    _throttle(request, f"unsubscribe:{client_ip(request)}")
    row = db.scalar(
        select(DownloadSubscriber).where(DownloadSubscriber.unsubscribe_token_hash == hash_token(body.token))
    )
    if row is not None and row.unsubscribed_at is None:
        row.unsubscribed_at = utcnow()
        db.commit()
    # Same answer whether or not the token matched, so tokens cannot be probed.
    return MessageResponse(message="You will not receive further security notices for this download.")
