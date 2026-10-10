"""Reports, bootstrap intervals and plot data, computed by the released EvalSuite package."""

from __future__ import annotations

import csv
import html
import io
import json
import math
from typing import Any

import evalsuite as es
import numpy as np
from fastapi import APIRouter, Depends, Request
from sqlalchemy.orm import Session

from ..deps import Principal, api_principal, get_db
from ..engine.evalsuite_engine import BY_ID, ENGINE
from ..engine.evalsuite_engine import evaluate as run_engine
from ..errors import ApiError
from ..models import UsageEvent
from ..schemas import (
    BootstrapRequest,
    BootstrapResponse,
    CurvePoint,
    EvaluationResult,
    Interval,
    PlotRequest,
    PlotResponse,
    PlotSeries,
    ReportRequest,
    ReportResponse,
)
from .keys import require_eligible

router = APIRouter(tags=["evaluation"])


def _guard(request: Request, principal: Principal) -> None:
    require_eligible(principal.user)
    allowed, retry = request.app.state.eval_limiter.hit(principal.user.id)
    if not allowed:
        raise ApiError(
            429,
            "rate_limited",
            "Rate limit exceeded for your account. Try again shortly.",
            {"Retry-After": str(retry)},
        )


def _record(db: Session, principal: Principal, endpoint: str, n: int) -> None:
    # Only counters are stored; the submitted data is never persisted or logged.
    db.add(
        UsageEvent(
            user_id=principal.user.id,
            api_key_id=principal.api_key_id,
            endpoint=endpoint,
            status_code=200,
            n_observations=n,
        )
    )
    db.commit()


def _fmt(v: float | None) -> str:
    return "–" if v is None or not math.isfinite(v) else f"{v:.4f}"


def _rows(result: EvaluationResult) -> list[tuple[str, str, str, str]]:
    out = []
    for m in result.metrics:
        iv = m.interval
        ci = f"[{_fmt(iv.lower)}, {_fmt(iv.upper)}]" if iv else ""
        out.append((m.name, _fmt(m.value), ci, (iv.method if iv else (m.note or ""))))
    return out


def render(result: EvaluationResult, fmt: str) -> str:
    """The evaluation as a table in the requested format."""
    rows = _rows(result)
    head = ("Metric", "Value", "Interval", "Method / note")
    title = f"EvalSuite {ENGINE.version} — {result.task}, n = {result.n_observations}"
    if fmt == "json":
        return json.dumps(result.model_dump(mode="json", by_alias=True), indent=2)
    if fmt == "csv":
        buf = io.StringIO()
        w = csv.writer(buf)
        w.writerow(head)
        w.writerows(rows)
        return buf.getvalue()
    if fmt == "markdown":
        lines = [f"**{title}**", "", "| " + " | ".join(head) + " |", "| --- | ---: | --- | --- |"]
        lines += ["| " + " | ".join(r) + " |" for r in rows]
        return "\n".join(lines) + "\n"
    if fmt == "html":
        cells = "".join("<tr>" + "".join(f"<td>{html.escape(c)}</td>" for c in r) + "</tr>" for r in rows)
        heads = "".join(f"<th>{h}</th>" for h in head)
        caption = f"<caption>{html.escape(title)}</caption>"
        return f"<table>{caption}<thead><tr>{heads}</tr></thead><tbody>{cells}</tbody></table>\n"

    def tex(s: str) -> str:
        for a, b in (("\\", r"\textbackslash{}"), ("&", r"\&"), ("%", r"\%"), ("_", r"\_"), ("#", r"\#")):
            s = s.replace(a, b)
        return s

    body = "\n".join(" & ".join(tex(c) for c in r) + r" \\" for r in rows)
    return (
        "\\begin{table}[ht]\n\\centering\n\\begin{tabular}{lrll}\n\\hline\n"
        + " & ".join(head)
        + r" \\"
        + "\n\\hline\n"
        + body
        + "\n\\hline\n\\end{tabular}\n"
        + f"\\caption{{{tex(title)}}}\n\\end{{table}}\n"
    )


@router.post("/report", response_model=ReportResponse)
def report(
    body: ReportRequest,
    request: Request,
    principal: Principal = Depends(api_principal),
    db: Session = Depends(get_db),
) -> ReportResponse:
    """Run an evaluation and return it as Markdown, HTML, LaTeX, CSV or JSON."""
    _guard(request, principal)
    result = run_engine(body)
    _record(db, principal, "report", result.n_observations)
    return ReportResponse(format=body.format, content=render(result, body.format), engine=ENGINE)


@router.post("/bootstrap", response_model=BootstrapResponse)
def bootstrap(
    body: BootstrapRequest,
    request: Request,
    principal: Principal = Depends(api_principal),
    db: Session = Depends(get_db),
) -> BootstrapResponse:
    """Bootstrap confidence interval (percentile, basic or BCa) for one metric."""
    _guard(request, principal)
    metric = BY_ID.get(body.metric)
    if metric is None or metric.task != body.task:
        raise ApiError(422, "validation_error", f"{body.metric} is not available for {body.task}.")
    binary = body.task == "binary-classification"
    t = np.asarray(body.y_true, dtype=int if binary else np.float64)
    p = np.asarray(body.y_pred, dtype=int if binary else np.float64)
    if metric.needs_prob and body.y_prob is None:
        raise ApiError(422, "validation_error", f"{body.metric} needs predicted probabilities (yProb).")
    try:
        if metric.needs_prob:
            q = np.asarray(body.y_prob, dtype=np.float64)
            ci = es.bootstrap_ci(
                metric.short,
                t,
                y_prob=q,
                method=body.method,
                level=body.level,
                n_resamples=body.n_resamples,
                random_state=body.random_state,
            )
        else:
            ci = es.bootstrap_ci(
                metric.short,
                t,
                p,
                method=body.method,
                level=body.level,
                n_resamples=body.n_resamples,
                random_state=body.random_state,
            )
    except es.EvalSuiteError as exc:
        raise ApiError(422, "validation_error", str(exc)) from exc
    if not (math.isfinite(ci.low) and math.isfinite(ci.high)):
        raise ApiError(422, "validation_error", "The interval is undefined for this input.")
    _record(db, principal, "bootstrap", len(t))
    return BootstrapResponse(
        metric=body.metric,
        estimate=float(ci.estimate),
        interval=Interval(
            lower=float(ci.low),
            upper=float(ci.high),
            level=body.level,
            method=f"{body.method} bootstrap ({body.n_resamples} resamples, seed {body.random_state})",
        ),
        n_resamples=body.n_resamples,
        engine=ENGINE,
    )


def _points(x: Any, y: Any) -> list[CurvePoint]:
    return [CurvePoint(x=float(a), y=float(b)) for a, b in zip(x, y, strict=True)]


@router.post("/plot", response_model=PlotResponse)
def plot(
    body: PlotRequest,
    request: Request,
    principal: Principal = Depends(api_principal),
    db: Session = Depends(get_db),
) -> PlotResponse:
    """Plot data (ROC, precision-recall, calibration or residuals) as point series to draw on the client."""
    _guard(request, principal)
    t = np.asarray(body.y_true, dtype=np.float64)
    s = np.asarray(body.y_score, dtype=np.float64)
    try:
        if body.kind in ("roc", "pr", "calibration"):
            if not np.isin(t, (0, 1)).all():
                raise ApiError(422, "validation_error", "y_true must be binary (0 or 1) for this plot.")
            if np.any((s < 0) | (s > 1)):
                raise ApiError(422, "validation_error", "y_score must be probabilities in [0, 1].")
            ti = t.astype(int)
            if body.kind == "roc":
                fpr, tpr, _ = es.roc_curve(ti, s)
                series = [PlotSeries(name="ROC", points=_points(fpr, tpr))]
                summary = {"rocAuc": float(es.roc_auc(ti, s))}
                labels = ("False positive rate", "True positive rate")
            elif body.kind == "pr":
                prec, rec, _ = es.pr_curve(ti, s)
                series = [PlotSeries(name="Precision-recall", points=_points(rec, prec))]
                summary = {"averagePrecision": float(es.average_precision(ti, s))}
                labels = ("Recall", "Precision")
            else:
                curve = es.calibration_curve(ti, s, n_bins=body.n_bins)
                mean_pred, frac_pos = np.asarray(curve[1], float), np.asarray(curve[0], float)
                series = [PlotSeries(name="Calibration", points=_points(mean_pred, frac_pos))]
                summary = {
                    "expectedCalibrationError": float(
                        es.expected_calibration_error(ti, s, n_bins=body.n_bins)
                    )
                }
                labels = ("Mean predicted probability", "Observed frequency")
        else:
            resid = t - s
            series = [PlotSeries(name="Residuals", points=_points(s, resid))]
            summary = {"meanResidual": float(resid.mean()), "rmse": float(es.rmse(t, s))}
            labels = ("Predicted value", "Residual (true − predicted)")
    except es.EvalSuiteError as exc:
        raise ApiError(422, "validation_error", str(exc)) from exc
    _record(db, principal, "plot", len(t))
    return PlotResponse(
        kind=body.kind, x_label=labels[0], y_label=labels[1], series=series, summary=summary, engine=ENGINE
    )
