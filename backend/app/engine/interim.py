"""Interim NumPy evaluation engine.

This is NOT EvalSuite. It exists so the authenticated API can be built and tested
before the EvalSuite package is released, and it is labelled as interim in every
response. It mirrors the website's demo engine (src/lib/demo/stats.ts).
Undefined values are returned as None, never as 0.
"""

from __future__ import annotations

from collections.abc import Callable
from dataclasses import dataclass
from statistics import NormalDist

import numpy as np
from numpy.typing import NDArray

from ..schemas import (
    ConfusionCounts,
    CurvePoint,
    Engine,
    EvaluationRequest,
    EvaluationResult,
    Interval,
    MetricResult,
)

ENGINE = Engine(label="Interim NumPy engine (not EvalSuite)", version=None)
Arr = NDArray[np.float64]
LOG_LOSS_EPS = 1e-15
BC, REG = "binary-classification", "regression"


@dataclass(frozen=True)
class Data:
    y_true: Arr
    y_pred: Arr
    y_prob: Arr | None

    def take(self, idx: NDArray[np.intp]) -> Data:
        return Data(self.y_true[idx], self.y_pred[idx], None if self.y_prob is None else self.y_prob[idx])


def _div(num: float, den: float) -> float | None:
    return None if den == 0 else num / den


def confusion(d: Data) -> ConfusionCounts:
    t = d.y_true == 1
    p = d.y_pred == 1
    return ConfusionCounts(
        tp=int(np.sum(t & p)), fp=int(np.sum(~t & p)), tn=int(np.sum(~t & ~p)), fn=int(np.sum(t & ~p))
    )


def roc_points(y_true: Arr, scores: Arr) -> list[tuple[float, float]]:
    """ROC points with one point per distinct threshold (ties handled)."""
    order = np.argsort(-scores, kind="mergesort")
    s, y = scores[order], y_true[order]
    pos = float(np.sum(y == 1))
    neg = float(len(y) - pos)
    if pos == 0 or neg == 0:
        return []
    distinct = np.r_[np.where(np.diff(s) != 0)[0], len(s) - 1]
    tps = np.cumsum(y == 1)[distinct]
    fps = (distinct + 1) - tps
    return [(0.0, 0.0)] + [(float(f / neg), float(t / pos)) for f, t in zip(fps, tps, strict=True)]


def roc_auc(d: Data) -> float | None:
    if d.y_prob is None:
        return None
    pts = roc_points(d.y_true, d.y_prob)
    if len(pts) < 2:
        return None
    x, y = np.array(pts).T
    return float(np.sum(np.diff(x) * (y[1:] + y[:-1]) / 2))


def _counts(fn: Callable[[ConfusionCounts], float | None]) -> Callable[[Data], float | None]:
    return lambda d: fn(confusion(d))


def _mcc(c: ConfusionCounts) -> float | None:
    den = float(np.sqrt(float((c.tp + c.fp) * (c.tp + c.fn) * (c.tn + c.fp) * (c.tn + c.fn))))
    return _div(c.tp * c.tn - c.fp * c.fn, den)


def _balanced(c: ConfusionCounts) -> float | None:
    r, s = _div(c.tp, c.tp + c.fn), _div(c.tn, c.tn + c.fp)
    return None if r is None or s is None else (r + s) / 2


def _r2(d: Data) -> float | None:
    ss_tot = float(np.sum((d.y_true - d.y_true.mean()) ** 2))
    return None if ss_tot == 0 else 1 - float(np.sum((d.y_true - d.y_pred) ** 2)) / ss_tot


def _brier(d: Data) -> float | None:
    return None if d.y_prob is None else float(np.mean((d.y_prob - d.y_true) ** 2))


def _log_loss(d: Data) -> float | None:
    if d.y_prob is None:
        return None
    p = np.clip(d.y_prob, LOG_LOSS_EPS, 1 - LOG_LOSS_EPS)
    return float(-np.mean(d.y_true * np.log(p) + (1 - d.y_true) * np.log(1 - p)))


@dataclass(frozen=True)
class Metric:
    id: str
    name: str
    task: str
    fn: Callable[[Data], float | None]
    needs_prob: bool = False
    proportion: Callable[[ConfusionCounts], tuple[int, int]] | None = None


METRICS: tuple[Metric, ...] = (
    Metric(
        "classification.accuracy",
        "Accuracy",
        BC,
        _counts(lambda c: _div(c.tp + c.tn, c.tp + c.fp + c.tn + c.fn)),
        proportion=lambda c: (c.tp + c.tn, c.tp + c.fp + c.tn + c.fn),
    ),
    Metric(
        "classification.precision",
        "Precision",
        BC,
        _counts(lambda c: _div(c.tp, c.tp + c.fp)),
        proportion=lambda c: (c.tp, c.tp + c.fp),
    ),
    Metric(
        "classification.recall",
        "Recall (sensitivity)",
        BC,
        _counts(lambda c: _div(c.tp, c.tp + c.fn)),
        proportion=lambda c: (c.tp, c.tp + c.fn),
    ),
    Metric(
        "clinical.specificity",
        "Specificity",
        BC,
        _counts(lambda c: _div(c.tn, c.tn + c.fp)),
        proportion=lambda c: (c.tn, c.tn + c.fp),
    ),
    Metric(
        "clinical.npv",
        "Negative predictive value",
        BC,
        _counts(lambda c: _div(c.tn, c.tn + c.fn)),
        proportion=lambda c: (c.tn, c.tn + c.fn),
    ),
    Metric("classification.f1", "F1 score", BC, _counts(lambda c: _div(2 * c.tp, 2 * c.tp + c.fp + c.fn))),
    Metric("classification.balanced_accuracy", "Balanced accuracy", BC, _counts(_balanced)),
    Metric("classification.mcc", "Matthews correlation coefficient", BC, _counts(_mcc)),
    Metric("classification.roc_auc", "ROC AUC", BC, roc_auc, needs_prob=True),
    Metric("calibration.brier_score", "Brier score", BC, _brier, needs_prob=True),
    Metric("classification.log_loss", "Log loss", BC, _log_loss, needs_prob=True),
    Metric(
        "regression.mae", "Mean absolute error", REG, lambda d: float(np.mean(np.abs(d.y_true - d.y_pred)))
    ),
    Metric("regression.mse", "Mean squared error", REG, lambda d: float(np.mean((d.y_true - d.y_pred) ** 2))),
    Metric(
        "regression.rmse",
        "Root mean squared error",
        REG,
        lambda d: float(np.sqrt(np.mean((d.y_true - d.y_pred) ** 2))),
    ),
    Metric("regression.r2", "R²", REG, _r2),
    Metric(
        "regression.median_absolute_error",
        "Median absolute error",
        REG,
        lambda d: float(np.median(np.abs(d.y_true - d.y_pred))),
    ),
)
BY_ID = {m.id: m for m in METRICS}


def wilson(k: int, n: int, level: float) -> tuple[float, float] | None:
    if n == 0:
        return None
    z = NormalDist().inv_cdf(1 - (1 - level) / 2)
    p = k / n
    denom = 1 + z * z / n
    centre = (p + z * z / (2 * n)) / denom
    half = z * float(np.sqrt(p * (1 - p) / n + z * z / (4 * n * n))) / denom
    return max(0.0, centre - half), min(1.0, centre + half)


def bootstrap(metric: Metric, d: Data, n_boot: int, level: float, seed: int) -> Interval | None:
    rng = np.random.default_rng(seed)  # local generator; global RNG state is untouched
    n = len(d.y_true)
    values: list[float] = []
    for _ in range(n_boot):
        v = metric.fn(d.take(rng.integers(0, n, size=n)))
        if v is not None and np.isfinite(v):
            values.append(v)
    if len(values) < 0.9 * n_boot:
        return None
    alpha = 1 - level
    lo, hi = np.quantile(values, [alpha / 2, 1 - alpha / 2])  # linear interpolation (type 7)
    return Interval(
        lower=float(lo),
        upper=float(hi),
        level=level,
        method=f"percentile bootstrap ({n_boot} resamples, seed {seed})",
    )


def evaluate(req: EvaluationRequest) -> EvaluationResult:
    d = Data(
        np.asarray(req.y_true, dtype=np.float64),
        np.asarray(req.y_pred, dtype=np.float64),
        None if req.y_prob is None else np.asarray(req.y_prob, dtype=np.float64),
    )
    warnings: list[str] = []
    if req.task == BC:
        positives = int(np.sum(d.y_true == 1))
        if positives in (0, len(d.y_true)):
            warnings.append(
                "y_true contains a single class. Metrics that need both classes are reported as undefined."
            )

    conf = req.confidence
    results: list[MetricResult] = []
    for mid in req.metrics:
        metric = BY_ID.get(mid)
        if metric is None or metric.task != req.task:
            warnings.append(f"{mid} is not available in the interim engine for this task.")
            continue
        if metric.needs_prob and d.y_prob is None:
            results.append(
                MetricResult(
                    id=mid, name=metric.name, value=None, note="Requires predicted probabilities (y_prob)."
                )
            )
            continue
        value = metric.fn(d)
        res = MetricResult(
            id=mid,
            name=metric.name,
            value=value,
            note="Undefined for this input (zero denominator)." if value is None else None,
        )
        if value is not None and conf.method == "wilson":
            if metric.proportion is not None:
                k, n = metric.proportion(confusion(d))
                ci = wilson(k, n, conf.level)
                if ci:
                    res.interval = Interval(lower=ci[0], upper=ci[1], level=conf.level, method="Wilson score")
            else:
                res.note = "Wilson intervals apply to proportions only."
        if value is not None and conf.method == "bootstrap-percentile":
            iv = bootstrap(metric, d, conf.n_bootstrap, conf.level, conf.random_state)
            if iv:
                res.interval = iv
            else:
                res.note = "Too many bootstrap resamples were undefined to report an interval."
        results.append(res)

    roc = None
    if req.task == BC and d.y_prob is not None:
        roc = [CurvePoint(x=x, y=y) for x, y in roc_points(d.y_true, d.y_prob)] or None
    return EvaluationResult(
        task=req.task,
        n_observations=len(d.y_true),
        metrics=results,
        confusion_matrix=confusion(d) if req.task == BC else None,
        roc_curve=roc,
        engine=ENGINE,
        warnings=warnings,
    )
