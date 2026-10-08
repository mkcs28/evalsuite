"""Evaluation engine backed by the released EvalSuite package (evalsuite-python on PyPI).

Every metric value and interval is computed by EvalSuite itself. Undefined values
(zero denominators, a single class for ROC AUC, constant targets for R²) are returned
as None with a note, never as 0.
"""

from __future__ import annotations

import math
import warnings as _warnings
from collections.abc import Callable
from dataclasses import dataclass
from typing import Any

import evalsuite as es
import numpy as np

from ..schemas import (
    ConfusionCounts,
    CurvePoint,
    Engine,
    EvaluationRequest,
    EvaluationResult,
    Interval,
    MetricResult,
)

ENGINE = Engine(label=f"EvalSuite {es.__version__}", version=es.__version__)
BC, REG = "binary-classification", "regression"
NAN = float("nan")


@dataclass(frozen=True)
class Metric:
    id: str
    name: str
    task: str
    short: str  # name accepted by es.bootstrap_ci
    fn: Callable[[Any, Any, Any], Any]
    needs_prob: bool = False
    proportion: Callable[[ConfusionCounts], tuple[int, int]] | None = None


def _lab(fn: Callable[..., Any], **kw: Any) -> Callable[[Any, Any, Any], Any]:
    return lambda t, p, _q: fn(t, p, **kw)


def _prob(fn: Callable[..., Any]) -> Callable[[Any, Any, Any], Any]:
    return lambda t, _p, q: fn(t, q)


ZD: dict[str, Any] = {"zero_division": NAN}
POS: dict[str, Any] = {"pos_label": 1, "zero_division": NAN}

METRICS: tuple[Metric, ...] = (
    Metric(
        "classification.accuracy",
        "Accuracy",
        BC,
        "accuracy",
        _lab(es.accuracy),
        proportion=lambda c: (c.tp + c.tn, c.tp + c.fp + c.tn + c.fn),
    ),
    Metric(
        "classification.precision",
        "Precision",
        BC,
        "precision",
        _lab(es.precision, **POS),
        proportion=lambda c: (c.tp, c.tp + c.fp),
    ),
    Metric(
        "classification.recall",
        "Recall (sensitivity)",
        BC,
        "recall",
        _lab(es.recall, **POS),
        proportion=lambda c: (c.tp, c.tp + c.fn),
    ),
    Metric(
        "clinical.specificity",
        "Specificity",
        BC,
        "specificity",
        _lab(es.specificity, **POS),
        proportion=lambda c: (c.tn, c.tn + c.fp),
    ),
    Metric(
        "clinical.npv",
        "Negative predictive value",
        BC,
        "npv",
        _lab(es.npv, **POS),
        proportion=lambda c: (c.tn, c.tn + c.fn),
    ),
    Metric("classification.f1", "F1 score", BC, "f1", _lab(es.f1, **POS)),
    Metric(
        "classification.balanced_accuracy",
        "Balanced accuracy",
        BC,
        "balanced_accuracy",
        _lab(es.balanced_accuracy),
    ),
    Metric("classification.mcc", "Matthews correlation coefficient", BC, "mcc", _lab(es.mcc, **ZD)),
    Metric("classification.roc_auc", "ROC AUC", BC, "roc_auc", _prob(es.roc_auc), needs_prob=True),
    Metric(
        "calibration.brier_score", "Brier score", BC, "brier_score", _prob(es.brier_score), needs_prob=True
    ),
    Metric("classification.log_loss", "Log loss", BC, "log_loss", _prob(es.log_loss), needs_prob=True),
    Metric("regression.mae", "Mean absolute error", REG, "mae", _lab(es.mae)),
    Metric("regression.mse", "Mean squared error", REG, "mse", _lab(es.mse)),
    Metric("regression.rmse", "Root mean squared error", REG, "rmse", _lab(es.rmse)),
    Metric("regression.r2", "R²", REG, "r2", _lab(es.r2)),
    Metric(
        "regression.median_absolute_error",
        "Median absolute error",
        REG,
        "median_absolute_error",
        _lab(es.median_absolute_error),
    ),
)
BY_ID = {m.id: m for m in METRICS}


def _value(metric: Metric, t: Any, p: Any, q: Any) -> float | None:
    try:
        with _warnings.catch_warnings():
            _warnings.simplefilter("ignore")
            v = float(metric.fn(t, p, q))
    except es.EvalSuiteError:
        return None
    return v if math.isfinite(v) else None


def confusion(t: Any, p: Any) -> ConfusionCounts:
    (tn, fp), (fn, tp) = np.asarray(es.confusion_matrix(t, p, labels=[0, 1]), dtype=int).tolist()
    return ConfusionCounts(tp=tp, fp=fp, tn=tn, fn=fn)


def _bootstrap(metric: Metric, t: Any, p: Any, q: Any, n: int, level: float, seed: int) -> Interval | None:
    kwargs: dict[str, Any] = {"method": "percentile", "n_resamples": n, "level": level, "random_state": seed}
    if metric.short in {"precision", "recall", "specificity", "npv", "f1"}:
        kwargs["pos_label"] = 1
    try:
        with _warnings.catch_warnings():
            _warnings.simplefilter("ignore")
            if metric.needs_prob:
                ci = es.bootstrap_ci(metric.short, t, y_prob=q, **kwargs)
            else:
                ci = es.bootstrap_ci(metric.short, t, p, **kwargs)
    except es.EvalSuiteError:
        return None
    if not (math.isfinite(ci.low) and math.isfinite(ci.high)):
        return None
    return Interval(
        lower=float(ci.low),
        upper=float(ci.high),
        level=level,
        method=f"percentile bootstrap ({n} resamples, seed {seed})",
    )


def evaluate(req: EvaluationRequest) -> EvaluationResult:
    binary = req.task == BC
    t = np.asarray(req.y_true, dtype=int if binary else np.float64)
    p = np.asarray(req.y_pred, dtype=int if binary else np.float64)
    q = None if req.y_prob is None else np.asarray(req.y_prob, dtype=np.float64)

    warnings: list[str] = []
    if binary and int(np.sum(t == 1)) in (0, len(t)):
        warnings.append(
            "y_true contains a single class. Metrics that need both classes are reported as undefined."
        )
    counts = confusion(t, p) if binary else None

    conf = req.confidence
    results: list[MetricResult] = []
    for mid in req.metrics:
        metric = BY_ID.get(mid)
        if metric is None or metric.task != req.task:
            warnings.append(f"{mid} is not available through the API for this task.")
            continue
        if metric.needs_prob and q is None:
            results.append(
                MetricResult(
                    id=mid, name=metric.name, value=None, note="Requires predicted probabilities (y_prob)."
                )
            )
            continue
        value = _value(metric, t, p, q)
        res = MetricResult(
            id=mid,
            name=metric.name,
            value=value,
            note="Undefined for this input." if value is None else None,
        )
        if value is not None and conf.method == "wilson":
            if metric.proportion is not None and counts is not None:
                k, n = metric.proportion(counts)
                if n > 0:
                    ci = es.proportion_ci(k, n, level=conf.level, method="wilson")
                    res.interval = Interval(
                        lower=ci.low, upper=ci.high, level=conf.level, method="Wilson score"
                    )
            else:
                res.note = "Wilson intervals apply to proportions only."
        if value is not None and conf.method == "bootstrap-percentile":
            iv = _bootstrap(metric, t, p, q, conf.n_bootstrap, conf.level, conf.random_state)
            if iv:
                res.interval = iv
            else:
                res.note = "Too many bootstrap resamples were undefined to report an interval."
        results.append(res)

    roc = None
    if binary and q is not None and 0 < int(np.sum(t == 1)) < len(t):
        fpr, tpr, _ = es.roc_curve(t, q)
        roc = [CurvePoint(x=float(x), y=float(y)) for x, y in zip(fpr, tpr, strict=True)] or None
    return EvaluationResult(
        task=req.task,
        n_observations=len(t),
        metrics=results,
        confusion_matrix=counts,
        roc_curve=roc,
        engine=ENGINE,
        warnings=warnings,
    )
