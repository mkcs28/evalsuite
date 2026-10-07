from __future__ import annotations

from datetime import timedelta

from fastapi import APIRouter, BackgroundTasks, Depends, Request, Response, status
from sqlalchemy import func, select, update
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from ..config import Settings
from ..deps import client_ip, current_user, get_db, get_settings_dep
from ..eligibility import is_adult
from ..email import Message, send_quietly
from ..errors import ApiError
from ..models import PasswordResetToken, User, as_utc, utcnow
from ..schemas import (
    ChangePasswordRequest,
    DeleteAccountRequest,
    ForgotPasswordRequest,
    LoginRequest,
    MessageResponse,
    RegisterRequest,
    ResetPasswordRequest,
    TokenResponse,
    UserResponse,
)
from ..security import create_access_token, hash_password, hash_token, new_reset_token, verify_password

router = APIRouter(prefix="/auth", tags=["auth"])

_RESET_SENT = "If an account exists for that email, a reset link has been sent."
_BAD_LINK = "This reset link is invalid or has expired. Request a new one."


def _throttle(request: Request, key: str) -> None:
    allowed, retry = request.app.state.auth_limiter.hit(key)
    if not allowed:
        raise ApiError(
            429, "rate_limited", "Too many attempts. Try again shortly.", {"Retry-After": str(retry)}
        )


def _set_password(user: User, password: str) -> None:
    user.password_hash = hash_password(password)
    # Invalidates every session issued under the previous password.
    user.password_changed_at = utcnow()


def user_out(user: User) -> UserResponse:
    return UserResponse(
        id=user.id,
        email=user.email,
        name=user.name,
        role=user.role,
        organization=user.organization,
        country=user.country,
        created_at=user.created_at,
        eligible_for_api=is_adult(user.date_of_birth),
    )


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register(body: RegisterRequest, request: Request, db: Session = Depends(get_db)) -> UserResponse:
    _throttle(request, f"register:{client_ip(request)}")
    email = body.email.lower()
    if db.scalar(select(func.count()).select_from(User).where(User.email == email)):
        raise ApiError(409, "email_taken", "An account with this email already exists.")
    user = User(
        email=email,
        name=body.name,
        password_hash=hash_password(body.password),
        date_of_birth=body.date_of_birth,
        role=body.role,
        organization=body.organization,
        country=body.country,
        intended_use=body.intended_use,
        terms_accepted_at=utcnow(),
    )
    db.add(user)
    try:
        db.commit()
    except IntegrityError as exc:
        db.rollback()
        raise ApiError(409, "email_taken", "An account with this email already exists.") from exc
    return user_out(user)


@router.post("/login", response_model=TokenResponse)
def login(
    body: LoginRequest,
    request: Request,
    db: Session = Depends(get_db),
    settings: Settings = Depends(get_settings_dep),
) -> TokenResponse:
    email = body.email.lower()
    _throttle(request, f"login:{client_ip(request)}:{email}")
    user = db.scalar(select(User).where(User.email == email))
    if (
        not verify_password(body.password, user.password_hash if user else None)
        or not user
        or not user.is_active
    ):
        raise ApiError(401, "invalid_credentials", "Email or password is incorrect.")
    token, expires_in = create_access_token(user.id, user.password_changed_at, settings)
    return TokenResponse(access_token=token, expires_in=expires_in)


@router.get("/me", response_model=UserResponse)
def me(user: User = Depends(current_user)) -> UserResponse:
    return user_out(user)


@router.post("/password/forgot", response_model=MessageResponse, status_code=status.HTTP_202_ACCEPTED)
def forgot_password(
    body: ForgotPasswordRequest,
    request: Request,
    background: BackgroundTasks,
    db: Session = Depends(get_db),
    settings: Settings = Depends(get_settings_dep),
) -> MessageResponse:
    """Always answers the same way, so it cannot be used to discover registered emails."""
    email = body.email.lower()
    _throttle(request, f"forgot:{client_ip(request)}")
    _throttle(request, f"forgot-email:{email}")
    user = db.scalar(select(User).where(User.email == email))
    if user is not None and user.is_active:
        token, token_hash = new_reset_token()
        db.add(
            PasswordResetToken(
                user_id=user.id,
                token_hash=token_hash,
                expires_at=utcnow() + timedelta(minutes=settings.password_reset_minutes),
            )
        )
        db.commit()
        # The token travels in the URL fragment, which browsers never send to servers or in Referer headers.
        link = f"{settings.site_url.rstrip('/')}/reset-password#token={token}"
        background.add_task(
            send_quietly,
            request.app.state.email,
            Message(
                to=user.email,
                subject="Reset your EvalSuite password",
                body=(
                    "Someone asked to reset the password for this EvalSuite account.\n\n"
                    f"Open this link within {settings.password_reset_minutes} minutes "
                    "to choose a new password:\n"
                    f"{link}\n\nIf it was not you, ignore this email; your password will not change."
                ),
            ),
        )
    return MessageResponse(message=_RESET_SENT)


@router.post("/password/reset", response_model=MessageResponse)
def reset_password(
    body: ResetPasswordRequest, request: Request, db: Session = Depends(get_db)
) -> MessageResponse:
    _throttle(request, f"reset:{client_ip(request)}")
    row = db.scalar(select(PasswordResetToken).where(PasswordResetToken.token_hash == hash_token(body.token)))
    if row is None or row.used_at is not None or as_utc(row.expires_at) <= utcnow():
        raise ApiError(
            400, "invalid_reset_token", "This reset link is invalid or has expired. Request a new one."
        )
    user = db.get(User, row.user_id)
    if user is None or not user.is_active:
        raise ApiError(
            400, "invalid_reset_token", "This reset link is invalid or has expired. Request a new one."
        )
    _set_password(user, body.password)
    now = utcnow()
    # One use only, and any other outstanding links for this account stop working.
    db.execute(
        update(PasswordResetToken)
        .where(PasswordResetToken.user_id == user.id, PasswordResetToken.used_at.is_(None))
        .values(used_at=now)
    )
    db.commit()
    return MessageResponse(message="Your password has been changed. Sign in with the new password.")


@router.post("/password/change", response_model=TokenResponse)
def change_password(
    body: ChangePasswordRequest,
    user: User = Depends(current_user),
    db: Session = Depends(get_db),
    settings: Settings = Depends(get_settings_dep),
) -> TokenResponse:
    if not verify_password(body.current_password, user.password_hash):
        raise ApiError(400, "invalid_password", "The current password is incorrect.")
    _set_password(user, body.new_password)
    db.commit()
    # Other sessions end; this one continues with a fresh token.
    token, expires_in = create_access_token(user.id, user.password_changed_at, settings)
    return TokenResponse(access_token=token, expires_in=expires_in)


@router.delete("/me", status_code=status.HTTP_204_NO_CONTENT)
def delete_account(
    body: DeleteAccountRequest,
    user: User = Depends(current_user),
    db: Session = Depends(get_db),
) -> Response:
    if not verify_password(body.password, user.password_hash):
        raise ApiError(400, "invalid_password", "The password is incorrect.")
    # Deletes keys, usage counters and reset tokens with the account.
    db.delete(user)
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)
