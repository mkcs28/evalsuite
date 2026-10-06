"""Runtime configuration, read from environment variables (prefix ``EVALSUITE_``)."""

from __future__ import annotations

from functools import lru_cache
from typing import Literal

from pydantic import Field, model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

_DEV_PLACEHOLDER = "dev-only-insecure-secret-change-me-0000000000"


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_prefix="EVALSUITE_", env_file=".env", extra="ignore")

    env: Literal["development", "test", "production"] = "development"
    database_url: str = "sqlite:///./evalsuite-dev.db"
    # Create tables on start-up (development and tests). Production uses `alembic upgrade head`.
    auto_create_tables: bool = True
    # Shared rate-limit store. Without it, limits are per process.
    redis_url: str | None = None

    # Secrets. Both must be set to long random values in production.
    jwt_secret: str = Field(default=_DEV_PLACEHOLDER, min_length=32)
    api_key_pepper: str = Field(default=_DEV_PLACEHOLDER, min_length=32)
    # Signs short-lived download links. The website verifies them with the same secret.
    download_token_secret: str = Field(default=_DEV_PLACEHOLDER, min_length=32)
    download_token_minutes: int = Field(default=10, ge=1, le=60)

    jwt_issuer: str = "evalsuite-api"
    jwt_audience: str = "evalsuite-web"
    access_token_minutes: int = Field(default=60, ge=5, le=24 * 60)

    # Public URL of the website, used to build password-reset links.
    site_url: str = "http://localhost:3000"
    cors_origins: list[str] = ["http://localhost:3000"]

    password_reset_minutes: int = Field(default=30, ge=5, le=24 * 60)
    email_backend: Literal["console", "smtp", "memory"] = "console"
    email_from: str = "EvalSuite <no-reply@localhost>"
    smtp_host: str | None = None
    smtp_port: int = 587
    smtp_username: str | None = None
    smtp_password: str | None = None
    smtp_starttls: bool = True

    max_body_bytes: int = Field(default=1_000_000, ge=10_000)
    evaluate_requests_per_minute: int = Field(default=60, ge=1)
    auth_attempts_per_minute: int = Field(default=10, ge=1)

    log_level: Literal["DEBUG", "INFO", "WARNING", "ERROR"] = "INFO"

    @model_validator(mode="after")
    def _production_rules(self) -> Settings:
        if self.env != "production":
            return self
        for name in ("jwt_secret", "api_key_pepper", "download_token_secret"):
            if getattr(self, name) == _DEV_PLACEHOLDER:
                raise ValueError(f"EVALSUITE_{name.upper()} must be set in production.")
        secrets = (self.jwt_secret, self.api_key_pepper, self.download_token_secret)
        if len(set(secrets)) != len(secrets):
            raise ValueError(
                "EVALSUITE_JWT_SECRET, EVALSUITE_API_KEY_PEPPER and "
                "EVALSUITE_DOWNLOAD_TOKEN_SECRET must all differ."
            )
        if self.database_url.startswith("sqlite"):
            raise ValueError("Use PostgreSQL (EVALSUITE_DATABASE_URL) in production.")
        if self.email_backend != "smtp" or not self.smtp_host:
            raise ValueError("Production needs EVALSUITE_EMAIL_BACKEND=smtp and EVALSUITE_SMTP_HOST.")
        if not self.site_url.startswith("https://"):
            raise ValueError("EVALSUITE_SITE_URL must use https in production.")
        return self


@lru_cache
def get_settings() -> Settings:
    return Settings()
