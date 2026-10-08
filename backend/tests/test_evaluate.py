from __future__ import annotations

from collections.abc import Callable

import evalsuite as es
import numpy as np
import pytest
from fastapi.testclient import TestClient

from .conftest import BINARY, create_key, register_and_login


def _auth(c: TestClient) -> dict[str, str]:
    return {"X-API-Key": create_key(c, register_and_login(c))["key"]}


def test_requires_authentication(client: TestClient) -> None:
    r = client.post("/api/v1/evaluate", json=BINARY)
    assert r.status_code == 401
    assert r.headers["www-authenticate"] == "Bearer"


def test_binary_values_match_analytic_results(client: TestClient) -> None:
    body = client.post("/api/v1/evaluate", json=BINARY, headers=_auth(client)).json()
    values = {m["id"]: m for m in body["metrics"]}
    assert values["classification.accuracy"]["value"] == pytest.approx(0.75)
    assert values["classification.mcc"]["value"] == pytest.approx(0.5)
    assert values["classification.roc_auc"]["value"] == pytest.approx(15 / 16)
    assert body["confusionMatrix"] == {"tp": 3, "fp": 1, "tn": 3, "fn": 1}
    assert body["engine"] == {
        "kind": "api",
        "label": f"EvalSuite {es.__version__}",
        "version": es.__version__,
    }
    acc = values["classification.accuracy"]["interval"]
    assert acc["method"] == "Wilson score" and acc["lower"] < 0.75 < acc["upper"]


def test_wilson_reference_values() -> None:
    ci = es.proportion_ci(8, 10, level=0.95, method="wilson")
    assert ci.low == pytest.approx(0.4902, abs=1e-4)
    assert ci.high == pytest.approx(0.9433, abs=1e-4)


def test_values_match_evalsuite_directly(client: TestClient) -> None:
    req = {**BINARY, "metrics": ["classification.f1", "classification.balanced_accuracy"]}
    body = client.post("/api/v1/evaluate", json=req, headers=_auth(client)).json()
    values = {m["id"]: m["value"] for m in body["metrics"]}
    y, p = BINARY["yTrue"], BINARY["yPred"]
    assert values["classification.f1"] == pytest.approx(float(es.f1(y, p)))
    assert values["classification.balanced_accuracy"] == pytest.approx(float(es.balanced_accuracy(y, p)))


def test_bootstrap_is_reproducible_and_leaves_global_rng_alone(client: TestClient) -> None:
    h = _auth(client)
    req = {
        **BINARY,
        "confidence": {**BINARY["confidence"], "method": "bootstrap-percentile", "nBootstrap": 300},
    }
    np.random.seed(123)
    before = np.random.random()
    np.random.seed(123)
    a = client.post("/api/v1/evaluate", json=req, headers=h).json()
    b = client.post("/api/v1/evaluate", json=req, headers=h).json()
    assert np.random.random() == before
    assert a == b


def test_regression(client: TestClient) -> None:
    req = {
        "task": "regression",
        "yTrue": [1, 2, 3, 4],
        "yPred": [1, 2, 3, 5],
        "metrics": ["regression.mae", "regression.rmse", "regression.r2"],
        "confidence": {"method": "none", "level": 0.95, "nBootstrap": 1000, "randomState": 0},
    }
    vals = {
        m["id"]: m["value"]
        for m in client.post("/api/v1/evaluate", json=req, headers=_auth(client)).json()["metrics"]
    }
    assert vals == pytest.approx({"regression.mae": 0.25, "regression.rmse": 0.5, "regression.r2": 0.8})


def test_undefined_metrics_are_null_not_zero(client: TestClient) -> None:
    req = {
        **BINARY,
        "yTrue": [0, 0, 0, 0],
        "yPred": [0, 0, 0, 0],
        "yProb": [0.1, 0.2, 0.3, 0.4],
        "metrics": ["classification.precision", "classification.roc_auc"],
    }
    body = client.post("/api/v1/evaluate", json=req, headers=_auth(client)).json()
    assert all(m["value"] is None for m in body["metrics"])
    assert body["warnings"]


@pytest.mark.parametrize(
    ("patch", "fragment"),
    [
        ({"yPred": [1, 0]}, "same number of observations"),
        ({"yTrue": [1, 2, 1, 0, 0, 0, 0, 1]}, "must be 0 or 1"),
        ({"yProb": [1.5] * 8}, "probabilities"),
        ({"confidence": {**BINARY["confidence"], "nBootstrap": 99999}}, "nBootstrap"),
        ({"unexpected": 1}, "unexpected"),
    ],
)
def test_validation_errors_are_explicit(client: TestClient, patch: dict[str, object], fragment: str) -> None:
    r = client.post("/api/v1/evaluate", json={**BINARY, **patch}, headers=_auth(client))
    assert r.status_code == 422
    assert fragment in r.json()["error"]["message"]


def test_rate_limit_per_user(make_client: Callable[..., TestClient]) -> None:
    c = make_client(evaluate_requests_per_minute=2)
    h = _auth(c)
    codes = [c.post("/api/v1/evaluate", json=BINARY, headers=h).status_code for _ in range(3)]
    assert codes == [200, 200, 429]


def test_body_size_limit(make_client: Callable[..., TestClient]) -> None:
    c = make_client(max_body_bytes=10_000)
    h = _auth(c)
    big = {**BINARY, "yTrue": [1] * 4000, "yPred": [1] * 4000, "yProb": None}
    r = c.post("/api/v1/evaluate", json=big, headers=h)
    assert r.status_code == 413


def test_usage_counts_without_storing_data(client: TestClient) -> None:
    jwt_h = register_and_login(client)
    key_h = {"X-API-Key": create_key(client, jwt_h)["key"]}
    client.post("/api/v1/evaluate", json=BINARY, headers=key_h)
    usage = client.get("/api/v1/usage", headers=jwt_h).json()
    assert usage["requestsLast24h"] == 1 and usage["observationsLast30d"] == 8


def test_public_endpoints(client: TestClient) -> None:
    assert client.get("/api/v1/health").json() == {"status": "ok", "version": es.__version__}
    assert client.get("/api/v1/version").json()["engine"] == "evalsuite"
    metrics = client.get("/api/v1/metrics").json()
    assert len(metrics) == 65
    assert (
        client.get("/api/v1/metrics/classification.mcc").json()["name"] == "Matthews correlation coefficient"
    )
    assert client.get("/api/v1/metrics/nope").status_code == 404
    r = client.get("/api/v1/health")
    assert r.headers["x-content-type-options"] == "nosniff"


def test_wire_format_keeps_required_nulls(client: TestClient) -> None:
    h = _auth(client)
    body = client.post("/api/v1/evaluate", json=BINARY, headers=h).json()
    assert body["engine"]["version"] == es.__version__
    assert "note" not in body["metrics"][0]
    reg = {**BINARY, "task": "regression", "yProb": None, "metrics": ["regression.mae"]}
    reg_body = client.post("/api/v1/evaluate", json=reg, headers=h).json()
    assert "confusionMatrix" not in reg_body and "rocCurve" not in reg_body
