"""Request and response models. Evaluation models mirror src/lib/api/types.ts in the website."""

from __future__ import annotations

import math
from datetime import date, datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator, model_validator
from pydantic.alias_generators import to_camel

from .eligibility import MINIMUM_AGE, age_on, today_utc
from .personal_email import require_personal_email

MAX_OBSERVATIONS = 5000
MIN_BOOTSTRAP = 100
MAX_BOOTSTRAP = 2000


class CamelModel(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True, extra="forbid")


# ---------------- auth ----------------
def check_password_policy(v: str) -> str:
    if v.strip() != v or len(set(v)) < 5:
        raise ValueError("Password is too simple. Use at least 10 characters with some variety.")
    return v


Password = Field(min_length=10, max_length=128)


Role = Literal["student", "academic-researcher", "industry-practitioner", "clinician", "educator", "other"]


class RegisterRequest(CamelModel):
    email: EmailStr
    password: str = Password
    name: str = Field(min_length=2, max_length=120)
    date_of_birth: date
    role: Role
    organization: str = Field(min_length=2, max_length=160)
    country: str = Field(min_length=2, max_length=80)
    intended_use: str = Field(min_length=20, max_length=500)
    accept_terms: bool

    @field_validator("password")
    @classmethod
    def _policy(cls, v: str) -> str:
        return check_password_policy(v)

    @field_validator("name", "country", "intended_use", "organization", mode="before")
    @classmethod
    def _collapse_whitespace(cls, v: object) -> object:
        # Runs before length checks, so whitespace-only input fails them.
        if isinstance(v, str):
            v = " ".join(v.split())
        return v

    @field_validator("email")
    @classmethod
    def _personal(cls, v: str) -> str:
        return require_personal_email(v)

    @field_validator("date_of_birth")
    @classmethod
    def _adult(cls, v: date) -> date:
        today = today_utc()
        if v > today or v.year < 1900:
            raise ValueError("Enter a valid date of birth.")
        if age_on(v, today) < MINIMUM_AGE:
            raise ValueError(f"You must be at least {MINIMUM_AGE} years old to register.")
        return v

    @field_validator("accept_terms")
    @classmethod
    def _terms(cls, v: bool) -> bool:
        if not v:
            raise ValueError("You must accept the terms of use.")
        return v


class ForgotPasswordRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")
    email: EmailStr


class ResetPasswordRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")
    token: str = Field(min_length=20, max_length=200)
    password: str = Password

    @field_validator("password")
    @classmethod
    def _policy(cls, v: str) -> str:
        return check_password_policy(v)


class ChangePasswordRequest(CamelModel):
    current_password: str = Field(min_length=1, max_length=128)
    new_password: str = Password

    @field_validator("new_password")
    @classmethod
    def _policy(cls, v: str) -> str:
        return check_password_policy(v)


class DeleteAccountRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")
    password: str = Field(min_length=1, max_length=128)


class MessageResponse(BaseModel):
    message: str


class LoginRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")
    email: EmailStr
    password: str = Field(min_length=1, max_length=128)


class TokenResponse(CamelModel):
    access_token: str
    token_type: Literal["bearer"] = "bearer"  # noqa: S105 (OAuth token type, not a secret)
    expires_in: int


class UserResponse(CamelModel):
    id: str
    email: str
    name: str | None
    role: str | None = None
    organization: str | None = None
    country: str | None = None
    created_at: datetime
    # Derived from the date of birth; the date itself is not returned.
    eligible_for_api: bool = False


# ---------------- API keys ----------------
class CreateKeyRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")
    name: str = Field(min_length=1, max_length=80)


class ApiKeyResponse(CamelModel):
    id: str
    name: str
    prefix: str
    created_at: datetime
    last_used_at: datetime | None
    revoked_at: datetime | None


class CreatedKeyResponse(ApiKeyResponse):
    """Includes the plaintext key. Returned exactly once, at creation."""

    key: str


class UsageResponse(CamelModel):
    requests_last_24h: int = Field(alias="requestsLast24h")
    requests_last_30d: int = Field(alias="requestsLast30d")
    observations_last_30d: int = Field(alias="observationsLast30d")
    rate_limit_per_minute: int


# ---------------- evaluation ----------------
Task = Literal["binary-classification", "regression"]
CiMethod = Literal["none", "wilson", "bootstrap-percentile"]


class ConfidenceOptions(CamelModel):
    method: CiMethod
    level: float = Field(gt=0.5, lt=1)
    n_bootstrap: int = Field(ge=MIN_BOOTSTRAP, le=MAX_BOOTSTRAP)
    random_state: int = Field(ge=0, le=2**31 - 1)


def _finite(values: list[float], name: str) -> list[float]:
    if any(not math.isfinite(v) for v in values):
        raise ValueError(f"{name} contains NaN or infinite values.")
    return values


class EvaluationRequest(CamelModel):
    task: Task
    y_true: list[float] = Field(min_length=2, max_length=MAX_OBSERVATIONS)
    y_pred: list[float] = Field(min_length=2, max_length=MAX_OBSERVATIONS)
    y_prob: list[float] | None = Field(default=None, max_length=MAX_OBSERVATIONS)
    metrics: list[str] = Field(min_length=1, max_length=50)
    confidence: ConfidenceOptions

    @field_validator("y_true", "y_pred")
    @classmethod
    def _check_finite(cls, v: list[float]) -> list[float]:
        return _finite(v, "values")

    @field_validator("y_prob")
    @classmethod
    def _check_prob(cls, v: list[float] | None) -> list[float] | None:
        if v is not None and any(not (0.0 <= p <= 1.0) for p in v):
            raise ValueError("y_prob values must be probabilities in [0, 1].")
        return v

    @model_validator(mode="after")
    def _consistent(self) -> EvaluationRequest:
        if len(self.y_true) != len(self.y_pred):
            raise ValueError(
                "y_true and y_pred must contain the same number of observations. "
                f"Received {len(self.y_true)} and {len(self.y_pred)}."
            )
        if self.y_prob is not None and len(self.y_prob) != len(self.y_true):
            raise ValueError(
                f"y_prob must contain one probability per observation. "
                f"Received {len(self.y_prob)} for {len(self.y_true)} observations."
            )
        if self.task == "binary-classification":
            for name, values in (("y_true", self.y_true), ("y_pred", self.y_pred)):
                if any(v not in (0, 1) for v in values):
                    raise ValueError(f"Binary classification labels in {name} must be 0 or 1.")
        return self


class Interval(CamelModel):
    lower: float
    upper: float
    level: float
    method: str


class MetricResult(CamelModel):
    id: str
    name: str
    value: float | None
    note: str | None = None
    interval: Interval | None = None


class ConfusionCounts(CamelModel):
    tp: int
    fp: int
    tn: int
    fn: int


class CurvePoint(CamelModel):
    x: float
    y: float


class Engine(CamelModel):
    kind: Literal["api"] = "api"
    label: str
    version: str | None


class EvaluationResult(CamelModel):
    task: Task
    n_observations: int
    metrics: list[MetricResult]
    confusion_matrix: ConfusionCounts | None = None
    roc_curve: list[CurvePoint] | None = None
    engine: Engine
    warnings: list[str]


def to_wire(result: EvaluationResult) -> dict[str, object]:
    """Serialise for the website contract: optional fields that are absent are omitted,
    while required nullable fields (``value``, ``engine.version``) stay as ``null``."""
    data = result.model_dump(mode="json", by_alias=True)
    for key in ("confusionMatrix", "rocCurve"):
        if data.get(key) is None:
            data.pop(key, None)
    for metric in data["metrics"]:
        for key in ("note", "interval"):
            if metric.get(key) is None:
                metric.pop(key, None)
    return data


class HealthResponse(CamelModel):
    status: Literal["ok", "degraded"]
    version: str | None


class ReadinessResponse(CamelModel):
    status: Literal["ok", "degraded"]
    database: bool
    rate_limit_store: bool


# ---------------- reports, bootstrap intervals and plot data ----------------
ReportFormat = Literal["markdown", "html", "latex", "csv", "json"]
BootstrapMethod = Literal["percentile", "basic", "bca"]
PlotKind = Literal["roc", "pr", "calibration", "residuals"]


class ReportRequest(EvaluationRequest):
    format: ReportFormat = "markdown"


class ReportResponse(CamelModel):
    format: ReportFormat
    content: str
    engine: Engine


class BootstrapRequest(CamelModel):
    task: Task
    y_true: list[float] = Field(min_length=2, max_length=MAX_OBSERVATIONS)
    y_pred: list[float] = Field(min_length=2, max_length=MAX_OBSERVATIONS)
    y_prob: list[float] | None = Field(default=None, max_length=MAX_OBSERVATIONS)
    metric: str = Field(min_length=3, max_length=80)
    method: BootstrapMethod = "percentile"
    level: float = Field(default=0.95, gt=0.5, lt=1)
    n_resamples: int = Field(default=1000, ge=MIN_BOOTSTRAP, le=MAX_BOOTSTRAP)
    random_state: int = Field(default=0, ge=0, le=2**31 - 1)

    @field_validator("y_true", "y_pred")
    @classmethod
    def _check_finite(cls, v: list[float]) -> list[float]:
        return _finite(v, "values")

    @model_validator(mode="after")
    def _consistent(self) -> BootstrapRequest:
        if len(self.y_true) != len(self.y_pred):
            raise ValueError("y_true and y_pred must contain the same number of observations.")
        if self.y_prob is not None and len(self.y_prob) != len(self.y_true):
            raise ValueError("y_prob must contain one probability per observation.")
        if self.y_prob is not None and any(not (0.0 <= p <= 1.0) for p in self.y_prob):
            raise ValueError("y_prob values must be probabilities in [0, 1].")
        return self


class BootstrapResponse(CamelModel):
    metric: str
    estimate: float
    interval: Interval
    n_resamples: int
    engine: Engine


class PlotRequest(CamelModel):
    kind: PlotKind
    y_true: list[float] = Field(min_length=2, max_length=MAX_OBSERVATIONS)
    y_score: list[float] = Field(min_length=2, max_length=MAX_OBSERVATIONS)
    n_bins: int = Field(default=10, ge=2, le=50)

    @field_validator("y_true", "y_score")
    @classmethod
    def _check_finite(cls, v: list[float]) -> list[float]:
        return _finite(v, "values")

    @model_validator(mode="after")
    def _consistent(self) -> PlotRequest:
        if len(self.y_true) != len(self.y_score):
            raise ValueError("y_true and y_score must contain the same number of observations.")
        return self


class PlotSeries(CamelModel):
    name: str
    points: list[CurvePoint]


class PlotResponse(CamelModel):
    kind: PlotKind
    x_label: str
    y_label: str
    series: list[PlotSeries]
    summary: dict[str, float]
    engine: Engine
