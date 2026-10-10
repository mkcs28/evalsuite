from __future__ import annotations

import evalsuite as es
import numpy as np
import pytest
from fastapi.testclient import TestClient

from .conftest import BINARY, create_key, register_and_login


def _auth(c: TestClient) -> dict[str, str]:
    return {"X-API-Key": create_key(c, register_and_login(c))["key"]}


def test_endpoints_require_authentication(client: TestClient) -> None:
    for path, body in (("/api/v1/report", BINARY), ("/api/v1/bootstrap", {}), ("/api/v1/plot", {})):
        assert client.post(path, json=body).status_code in (401, 422)
    assert client.post("/api/v1/report", json=BINARY).status_code == 401


@pytest.mark.parametrize("fmt", ["markdown", "html", "latex", "csv", "json"])
def test_report_formats(client: TestClient, fmt: str) -> None:
    r = client.post("/api/v1/report", json={**BINARY, "format": fmt}, headers=_auth(client))
    assert r.status_code == 200
    body = r.json()
    assert body["format"] == fmt and body["engine"]["version"] == es.__version__
    content = body["content"]
    if fmt == "json":
        assert any(m["id"] == "classification.accuracy" for m in __import__("json").loads(content)["metrics"])
    else:
        assert "Accuracy" in content and "0.7500" in content
    if fmt == "html":
        assert content.startswith("<table>")
    if fmt == "latex":
        assert "\\begin{tabular}" in content


def test_bootstrap_matches_evalsuite(client: TestClient) -> None:
    h = _auth(client)
    req = {
        "task": "binary-classification",
        "yTrue": BINARY["yTrue"],
        "yPred": BINARY["yPred"],
        "metric": "classification.accuracy",
        "method": "percentile",
        "nResamples": 500,
        "randomState": 7,
    }
    body = client.post("/api/v1/bootstrap", json=req, headers=h).json()
    ref = es.bootstrap_ci(
        "accuracy", BINARY["yTrue"], BINARY["yPred"], method="percentile", n_resamples=500, random_state=7
    )
    assert body["estimate"] == pytest.approx(ref.estimate)
    assert (body["interval"]["lower"], body["interval"]["upper"]) == pytest.approx((ref.low, ref.high))
    prob = client.post(
        "/api/v1/bootstrap",
        json={**req, "metric": "classification.roc_auc", "yProb": BINARY["yProb"], "method": "bca"},
        headers=h,
    )
    assert prob.status_code == 200
    bad = client.post("/api/v1/bootstrap", json={**req, "metric": "classification.roc_auc"}, headers=h)
    assert bad.status_code == 422
    unknown = client.post("/api/v1/bootstrap", json={**req, "metric": "regression.mae"}, headers=h)
    assert unknown.status_code == 422


def test_plot_data(client: TestClient) -> None:
    h = _auth(client)
    y, s = BINARY["yTrue"], BINARY["yProb"]
    roc = client.post("/api/v1/plot", json={"kind": "roc", "yTrue": y, "yScore": s}, headers=h).json()
    fpr, tpr, _ = es.roc_curve(y, s)
    assert [p["x"] for p in roc["series"][0]["points"]] == pytest.approx(fpr.tolist())
    assert roc["summary"]["rocAuc"] == pytest.approx(15 / 16)
    pr = client.post("/api/v1/plot", json={"kind": "pr", "yTrue": y, "yScore": s}, headers=h).json()
    assert pr["xLabel"] == "Recall" and pr["summary"]["averagePrecision"] > 0
    cal = client.post(
        "/api/v1/plot", json={"kind": "calibration", "yTrue": y, "yScore": s, "nBins": 4}, headers=h
    )
    assert cal.status_code == 200 and cal.json()["series"][0]["points"]
    yr, pr_ = [3.0, 1.0, 2.0, 5.0], [2.5, 1.5, 2.0, 4.0]
    res = client.post(
        "/api/v1/plot", json={"kind": "residuals", "yTrue": yr, "yScore": pr_}, headers=h
    ).json()
    assert res["summary"]["rmse"] == pytest.approx(float(np.sqrt(np.mean((np.array(yr) - pr_) ** 2))))
    for bad in (
        {"kind": "roc", "yTrue": [0, 2], "yScore": [0.1, 0.2]},
        {"kind": "roc", "yTrue": [0, 1], "yScore": [0.1, 1.2]},
        {"kind": "roc", "yTrue": [1, 1], "yScore": [0.1, 0.2]},
        {"kind": "roc", "yTrue": [0, 1, 1], "yScore": [0.1, 0.2]},
    ):
        assert client.post("/api/v1/plot", json=bad, headers=h).status_code == 422
