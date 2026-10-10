"""Generate reference entries for package functions that had no page of their own on the website.

Registered metrics take their name, definition, formula, range and references from the package registry;
the statistics helpers (not in the registry) are described below. Every example is executed first.

    python scripts/gen_core_metrics.py .
"""

import json
import sys
import warnings

import numpy as np

import evalsuite as es

SITE = sys.argv[1]
rng = np.random.default_rng(0)
y = rng.integers(0, 2, 200)
p = np.where(rng.random(200) < 0.8, y, 1 - y)
prob = np.clip(y * 0.6 + rng.uniform(0, 0.4, 200), 0, 1)
yk = rng.integers(0, 3, 200)
pk = rng.dirichlet(np.ones(3), 200)
yr = rng.gamma(3, 2, 100) + 1
pr = np.abs(yr + rng.normal(0, 1, 100)) + 0.1
mask_t = np.zeros((32, 32), int)
mask_t[8:20, 8:20] = 1
mask_p = np.roll(mask_t, 2, axis=1)
NS = {"es": es, "y_true": y, "y_pred": p, "y_prob": prob, "y_true_k": yk, "y_prob_k": pk, "Y": np.column_stack([y, p]),
      "P": np.column_stack([p, y]), "yr": yr, "pr": pr, "mask_true": mask_t, "mask_pred": mask_p,
      "table2x2": [[20, 5], [8, 30]], "table": [[20, 5, 7], [8, 30, 4]], "a": rng.normal(0, 1, 50),
      "b": rng.normal(0.3, 1, 50), "pred_a": p, "pred_b": y}

LABELS = ["y_true: array of class labels", "y_pred: array of predicted labels"]
REG = ["y_true: array of real targets", "y_pred: array of real predictions", "sample_weight: optional"]
MASKS = ["y_true: ground-truth label mask", "y_pred: predicted mask with the same shape"]

REGISTERED = {
    "classification.fbeta": ("classification", "v0.1.0", LABELS, "es.fbeta(y_true, y_pred, beta=2)"),
    "classification.hamming_loss": ("classification", "v0.1.0", ["Y: multilabel indicator matrix", "P: predicted indicator matrix"], "es.hamming_loss(Y, P)"),
    "classification.jaccard": ("classification", "v0.1.0", LABELS, "es.jaccard(y_true, y_pred)"),
    "classification.top_k_accuracy": ("classification", "v0.1.0", ["y_true: class labels", "y_prob: (n, k) class probabilities"], "es.top_k_accuracy(y_true_k, y_prob_k, k=2)"),
    "regression.explained_variance": ("regression", "v0.1.0", REG, "es.explained_variance(yr, pr)"),
    "regression.max_error": ("regression", "v0.1.0", REG, "es.max_error(yr, pr)"),
    "regression.mean_bias_error": ("regression", "v0.1.0", REG, "es.mean_bias_error(yr, pr)"),
    "regression.msle": ("regression", "v0.1.0", REG, "es.msle(yr, pr)"),
    "regression.rae": ("regression", "v0.1.0", REG, "es.rae(yr, pr)"),
    "regression.rse": ("regression", "v0.1.0", REG, "es.rse(yr, pr)"),
    "calibration.calibration_intercept": ("calibration", "v0.2.0", ["y_true: binary outcomes", "y_prob: predicted risks in (0, 1)"], "es.calibration_intercept(y_true, y_prob)"),
    "segmentation.mean_pixel_accuracy": ("segmentation", "v0.3.0", MASKS, "es.mean_pixel_accuracy(mask_true, mask_pred)"),
    "segmentation.average_surface_distance": ("segmentation", "v0.3.0", MASKS + ["spacing: optional pixel spacing"], "es.average_surface_distance(mask_true, mask_pred, labels=[1])"),
}

STATS = [
    dict(id="confidence.accuracy_ci", name="Accuracy confidence interval", category="confidence", version="v0.1.0",
         description="Confidence interval for accuracy as a binomial proportion of correct predictions (Wilson by default, or Clopper–Pearson / normal).",
         formula="Wilson: (p̂ + z²/2n ± z√(p̂(1−p̂)/n + z²/4n²)) / (1 + z²/n)", range="[0, 1]",
         inputs=LABELS + ["level: confidence level (default 0.95)", "method: wilson, clopper-pearson or normal"],
         references=["Wilson EB. Probable inference, the law of succession, and statistical inference. JASA. 1927;22:209-212."],
         example="es.accuracy_ci(y_true, y_pred, method=\"wilson\")"),
    dict(id="confidence.roc_auc_ci", name="ROC AUC confidence interval (DeLong)", category="confidence", version="v0.1.0",
         description="Confidence interval for the area under the ROC curve from DeLong's structural-component variance, without resampling.",
         formula="AUC ± z·√Var_DeLong(AUC), computed on the logit scale", range="[0, 1]",
         inputs=["y_true: binary labels", "y_prob: scores for the positive class", "level: confidence level"],
         references=["DeLong ER, DeLong DM, Clarke-Pearson DL. Comparing the areas under two or more correlated receiver operating characteristic curves. Biometrics. 1988;44(3):837-845."],
         example="es.roc_auc_ci(y_true, y_prob)"),
    dict(id="statistics.chi_square_test", name="Chi-square test of independence", category="statistics", version="v0.2.0",
         description="Pearson's χ² test of independence for a contingency table, with Yates' continuity correction for 2×2 tables by default.",
         formula="χ² = Σ (O − E)² / E, E = row total · column total / n", range="p in [0, 1]",
         inputs=["table: contingency table of counts", "correction: Yates' correction for 2×2"],
         references=["Pearson K. On the criterion that a given system of deviations from the probable... Philosophical Magazine. 1900;50(302):157-175."],
         example="es.chi_square_test(table)"),
    dict(id="statistics.fisher_exact_test", name="Fisher's exact test", category="statistics", version="v0.2.0",
         description="Exact test of association for a 2×2 table from the hypergeometric distribution; preferred over χ² when expected counts are small.",
         formula="P = Σ hypergeometric probabilities of tables as or more extreme", range="p in [0, 1]",
         inputs=["table: 2×2 table of counts", "alternative: two-sided, less or greater"],
         references=["Fisher RA. On the interpretation of χ² from contingency tables, and the calculation of P. J R Stat Soc. 1922;85(1):87-94."],
         example="es.fisher_exact_test(table2x2)"),
    dict(id="effect-size.cliffs_delta", name="Cliff's delta", category="effect-size", version="v0.1.0",
         description="Non-parametric effect size: the probability that a value from one group exceeds a value from the other, minus the reverse.",
         formula="δ = (#(a_i > b_j) − #(a_i < b_j)) / (n_a · n_b)", range="[−1, 1]",
         inputs=["a: first sample", "b: second sample"],
         references=["Cliff N. Dominance statistics: ordinal analyses to answer ordinal questions. Psychol Bull. 1993;114(3):494-509."],
         example="es.cliffs_delta(a, b)"),
    dict(id="statistics.paired_bootstrap_test", name="Paired bootstrap test", category="statistics", version="v0.1.0",
         description="Test whether two models differ on any metric by resampling the same examples for both and counting how often the difference changes sign.",
         formula="p = 2 · min(P*(Δ ≤ 0), P*(Δ ≥ 0)) over paired resamples", range="p in [0, 1]",
         inputs=["metric: any EvalSuite metric", "y_true", "y_pred_a, y_pred_b: the two models' predictions", "n_resamples, random_state"],
         references=["Koehn P. Statistical significance tests for machine translation evaluation. EMNLP. 2004:388-395."],
         example="es.paired_bootstrap_test(es.accuracy, y_true, pred_a, pred_b, n_resamples=500, random_state=0)"),
    dict(id="statistics.compare", name="Model comparison", category="statistics", version="v0.1.0",
         description="Compare several models on the same examples: every metric with a bootstrap interval, pairwise paired tests and multiple-testing correction, in one report.",
         formula="per metric: estimate, bootstrap CI; per pair: paired test p-value, adjusted", range="report",
         inputs=["y_true", "predictions: mapping model name → predictions", "metrics: metric names", "n_resamples, random_state"],
         references=["Efron B, Tibshirani RJ. An Introduction to the Bootstrap. Chapman & Hall; 1993."],
         example="es.compare(y_true, {\"a\": pred_a, \"b\": pred_b}, metrics=[\"accuracy\"], n_resamples=200, random_state=0)"),
]

entries = []
with warnings.catch_warnings():
    warnings.simplefilter("ignore")
    for mid, (cat, ver, inputs, example) in REGISTERED.items():
        eval(example, dict(NS))  # noqa: S307 - verify the example runs
        info = es.metric_info(mid)
        entries.append({
            "id": f"{cat}.{mid.split('.')[1]}", "name": info.name, "category": cat,
            "description": info.definition, "formula": info.formula, "inputs": inputs,
            "outputs": "MetricResult", "range": info.range, "assumptions": [], "limitations": [],
            "references": [{"citation": c} for c in info.references] or [{"citation": "See the package documentation."}],
            "version": ver, "status": "implemented", "apiPath": f"es.{mid.split('.')[1]}", "example": example,
        })
    for s in STATS:
        eval(s["example"], dict(NS))  # noqa: S307
        entries.append({
            "id": s["id"], "name": s["name"], "category": s["category"], "description": s["description"],
            "formula": s["formula"], "inputs": s["inputs"], "outputs": "result object", "range": s["range"],
            "assumptions": [], "limitations": [], "references": [{"citation": c} for c in s["references"]],
            "version": s["version"], "status": "implemented", "apiPath": "es." + s["id"].split(".")[1],
            "example": s["example"],
        })

ts = (
    "// Package functions documented from the evalsuite-python registry by scripts/gen_core_metrics.py.\n"
    "// Every example call was executed against the package. Do not edit by hand.\n"
    'import type { MetricDefinition } from "@/lib/metrics/schema";\n\n'
    "export const CORE_EXTRA_METRICS: MetricDefinition[] = " + json.dumps(entries, ensure_ascii=False, indent=2) + ";\n"
)
open(f"{SITE}/src/data/metrics/core.generated.ts", "w", encoding="utf-8").write(ts)
print(f"wrote {len(entries)} entries")
