import type { MetricDefinition } from "@/lib/metrics/schema";
import type { ReleaseTarget } from "@/types/status";
import { REF } from "./references";

/**
 * Hand-maintained registry for the website.
 *
 * A metric is "implemented" only when it ships in a released EvalSuite version
 * (SHIPPED below, checked against the package's own registry and functions);
 * everything else stays "planned" for the release it is scheduled for.
 */
type Draft = Omit<
  MetricDefinition,
  "status" | "assumptions" | "limitations" | "references" | "version"
> &
  Partial<Pick<MetricDefinition, "assumptions" | "limitations" | "references">>;

/**
 * Metrics available in evalsuite-python (since v0.1.0 unless `since` says otherwise; some v0.2.0 items shipped early),
 * with the real function and an example call. Every example was run against the released package.
 */
export const SHIPPED: Record<string, { apiPath: string; example: string; since?: ReleaseTarget }> =
  {
    "classification.accuracy": { apiPath: "es.accuracy", example: "es.accuracy(y_true, y_pred)" },
    "classification.precision": {
      apiPath: "es.precision",
      example: 'es.precision(y_true, y_pred, average="macro")',
    },
    "classification.recall": {
      apiPath: "es.recall",
      example: 'es.recall(y_true, y_pred, average="macro")',
    },
    "classification.f1": { apiPath: "es.f1", example: 'es.f1(y_true, y_pred, average="macro")' },
    "classification.balanced_accuracy": {
      apiPath: "es.balanced_accuracy",
      example: "es.balanced_accuracy(y_true, y_pred)",
    },
    "classification.mcc": { apiPath: "es.mcc", example: "es.mcc(y_true, y_pred)" },
    "classification.cohen_kappa": {
      apiPath: "es.cohen_kappa",
      example: 'es.cohen_kappa(y_true, y_pred, weights="quadratic")',
    },
    "classification.roc_auc": { apiPath: "es.roc_auc", example: "es.roc_auc(y_true, y_prob)" },
    "classification.pr_auc": {
      apiPath: "es.average_precision",
      example: "es.average_precision(y_true, y_prob)",
    },
    "classification.log_loss": { apiPath: "es.log_loss", example: "es.log_loss(y_true, y_prob)" },
    "classification.confusion_matrix": {
      apiPath: "es.confusion_matrix",
      example: 'es.confusion_matrix(y_true, y_pred, normalize="true")',
    },
    "regression.mae": { apiPath: "es.mae", example: "es.mae(y_true_r, y_pred_r)" },
    "regression.mse": { apiPath: "es.mse", example: "es.mse(y_true_r, y_pred_r)" },
    "regression.rmse": { apiPath: "es.rmse", example: "es.rmse(y_true_r, y_pred_r)" },
    "regression.r2": { apiPath: "es.r2", example: "es.r2(y_true_r, y_pred_r)" },
    "regression.adjusted_r2": {
      apiPath: "es.adjusted_r2",
      example: "es.adjusted_r2(y_true_r, y_pred_r, n_features=3)",
    },
    "regression.mape": { apiPath: "es.mape", example: "es.mape(y_true_r, y_pred_r)" },
    "regression.smape": { apiPath: "es.smape", example: "es.smape(y_true_r, y_pred_r)" },
    "regression.rmsle": { apiPath: "es.rmsle", example: "es.rmsle(y_true_r, y_pred_r)" },
    "regression.median_absolute_error": {
      apiPath: "es.median_absolute_error",
      example: "es.median_absolute_error(y_true_r, y_pred_r)",
    },
    "regression.huber_loss": {
      apiPath: "es.huber_loss",
      example: "es.huber_loss(y_true_r, y_pred_r, delta=1.0)",
    },
    "regression.quantile_loss": {
      apiPath: "es.quantile_loss",
      example: "es.quantile_loss(y_true_r, y_pred_r, alpha=0.9)",
    },
    "clinical.sensitivity": {
      apiPath: "es.recall",
      example: "es.recall(y_true, y_pred)  # sensitivity",
    },
    "clinical.specificity": {
      apiPath: "es.specificity",
      example: "es.specificity(y_true, y_pred)",
    },
    "clinical.ppv": {
      apiPath: "es.precision",
      example: "es.precision(y_true, y_pred)  # positive predictive value",
    },
    "clinical.npv": { apiPath: "es.npv", example: "es.npv(y_true, y_pred)" },
    "calibration.brier_score": {
      apiPath: "es.brier_score",
      example: "es.brier_score(y_true, y_prob)",
    },
    "calibration.ece": {
      apiPath: "es.expected_calibration_error",
      example: "es.expected_calibration_error(y_true, y_prob, n_bins=10)",
    },
    "confidence.wilson": {
      apiPath: "es.proportion_ci",
      example: 'es.proportion_ci(8, 10, method="wilson")\nes.accuracy_ci(y_true, y_pred)',
    },
    "confidence.clopper_pearson": {
      apiPath: "es.proportion_ci",
      example: 'es.proportion_ci(8, 10, method="clopper-pearson")',
    },
    "confidence.bootstrap_percentile": {
      apiPath: "es.bootstrap_ci",
      example: 'es.bootstrap_ci("f1", y_true, y_pred, method="percentile", random_state=0)',
    },
    "confidence.bootstrap_bca": {
      apiPath: "es.bootstrap_ci",
      example: 'es.bootstrap_ci("f1", y_true, y_pred, method="bca", random_state=0)',
    },
    "statistics.mcnemar": {
      apiPath: "es.mcnemar_test",
      example: "es.mcnemar_test(y_true, y_pred_a, y_pred_b)",
    },
    "statistics.delong": {
      apiPath: "es.delong_test",
      example: "es.delong_test(y_true, y_prob_a, y_prob_b)",
    },
    "effect-size.cohens_d": {
      apiPath: "es.cohens_d",
      example: "es.cohens_d(scores_a, scores_b, paired=True)",
    },
    "effect-size.hedges_g": { apiPath: "es.hedges_g", example: "es.hedges_g(scores_a, scores_b)" },
    "multiple-testing.bonferroni": {
      apiPath: "es.adjust_pvalues",
      example: 'es.adjust_pvalues(p_values, method="bonferroni")',
    },
    "multiple-testing.holm": {
      apiPath: "es.adjust_pvalues",
      example: 'es.adjust_pvalues(p_values, method="holm")',
    },
    "multiple-testing.benjamini_hochberg": {
      apiPath: "es.adjust_pvalues",
      example: 'es.adjust_pvalues(p_values, method="bh")',
    },
    "clinical.lr_positive": {
      apiPath: "es.lr_positive",
      example: "es.lr_positive(y_true, y_pred)",
      since: "v0.2.0",
    },
    "clinical.lr_negative": {
      apiPath: "es.lr_negative",
      example: "es.lr_negative(y_true, y_pred)",
      since: "v0.2.0",
    },
    "clinical.diagnostic_odds_ratio": {
      apiPath: "es.diagnostic_odds_ratio",
      example:
        "es.diagnostic_odds_ratio(y_true, y_pred)\nes.diagnostic_report(y_true, y_pred)  # every measure with a CI",
      since: "v0.2.0",
    },
    "clinical.youden_j": {
      apiPath: "es.youden_j",
      example: "es.youden_j(y_true, y_pred)",
      since: "v0.2.0",
    },
    "clinical.net_benefit": {
      apiPath: "es.decision_curve",
      example:
        'es.net_benefit(y_true, y_prob, threshold=0.2)\nes.decision_curve(y_true, {"model": y_prob})',
      since: "v0.2.0",
    },
    "calibration.mce": {
      apiPath: "es.maximum_calibration_error",
      example: "es.maximum_calibration_error(y_true, y_prob, n_bins=10)",
      since: "v0.2.0",
    },
    "calibration.calibration_slope": {
      apiPath: "es.calibration_slope",
      example: "es.calibration_slope(y_true, y_prob)\nes.calibration_intercept(y_true, y_prob)",
      since: "v0.2.0",
    },
    "calibration.hosmer_lemeshow": {
      apiPath: "es.hosmer_lemeshow",
      example: "es.hosmer_lemeshow(y_true, y_prob, n_groups=10)",
      since: "v0.2.0",
    },
    "statistics.t_test_independent": {
      apiPath: "es.t_test",
      example: "es.t_test(scores_a, scores_b)  # Welch; equal_var=True for Student",
      since: "v0.2.0",
    },
    "statistics.t_test_paired": {
      apiPath: "es.paired_t_test",
      example: "es.paired_t_test(scores_a, scores_b)",
      since: "v0.2.0",
    },
    "statistics.mann_whitney": {
      apiPath: "es.mann_whitney_test",
      example: "es.mann_whitney_test(scores_a, scores_b)",
      since: "v0.2.0",
    },
    "statistics.wilcoxon": {
      apiPath: "es.wilcoxon_test",
      example: "es.wilcoxon_test(scores_a, scores_b)",
      since: "v0.2.0",
    },
    "statistics.kruskal_wallis": {
      apiPath: "es.kruskal_wallis_test",
      example: "es.kruskal_wallis_test(scores_a, scores_b, scores_c)",
      since: "v0.2.0",
    },
    "statistics.friedman": {
      apiPath: "es.friedman_test",
      example: "es.friedman_test(scores_a, scores_b, scores_c)",
      since: "v0.2.0",
    },
    "statistics.shapiro_wilk": {
      apiPath: "es.shapiro_wilk_test",
      example: "es.shapiro_wilk_test(scores_a)",
      since: "v0.2.0",
    },
    "effect-size.cramers_v": {
      apiPath: "es.cramers_v",
      example: "es.cramers_v(table)",
      since: "v0.2.0",
    },
    "multiple-testing.hochberg": {
      apiPath: "es.adjust_pvalues",
      example: 'es.adjust_pvalues(p_values, method="hochberg")',
      since: "v0.2.0",
    },
    "segmentation.dice": {
      apiPath: "es.dice",
      example:
        'es.dice(y_true, y_pred)                    # macro over classes\nes.dice(y_true, y_pred, aggregate="image")  # mean of per-image scores',
      since: "v0.3.0",
    },
    "segmentation.iou": {
      apiPath: "es.iou",
      example: "es.iou(y_true, y_pred, average=None)  # per class; absent classes are NaN",
      since: "v0.3.0",
    },
    "segmentation.miou": {
      apiPath: "es.miou",
      example: "es.miou(y_true, y_pred, ignore_index=255)",
      since: "v0.3.0",
    },
    "segmentation.pixel_accuracy": {
      apiPath: "es.pixel_accuracy",
      example:
        "es.pixel_accuracy(y_true, y_pred, ignore_index=255)\nes.mean_pixel_accuracy(y_true, y_pred)",
      since: "v0.3.0",
    },
    "segmentation.boundary_iou": {
      apiPath: "es.boundary_iou",
      example: "es.boundary_iou(y_true, y_pred, dilation_ratio=0.02)",
      since: "v0.3.0",
    },
    "segmentation.hausdorff": {
      apiPath: "es.hausdorff_distance",
      example:
        "es.hausdorff_distance(y_true, y_pred)                   # HD\nes.hausdorff_distance(y_true, y_pred, percentile=95, spacing=(0.8, 0.8))  # HD95 in mm\nes.average_surface_distance(y_true, y_pred)",
      since: "v0.3.0",
    },
    "detection.box_iou": {
      apiPath: "es.box_iou",
      example:
        'es.box_iou(boxes_a, boxes_b)                    # (n, m) matrix, xyxy\nes.box_iou(boxes_a, boxes_b, box_format="xywh")',
      since: "v0.3.0",
    },
    "detection.average_precision": {
      apiPath: "es.average_precision_detection",
      example:
        'es.average_precision_detection(gt, preds, iou_threshold=0.5)  # per class\nes.average_precision_detection(gt, preds, interpolation="voc")',
      since: "v0.3.0",
    },
    "detection.map50_95": {
      apiPath: "es.mean_average_precision",
      example:
        "es.mean_average_precision(gt, preds)                     # COCO mAP@[.50:.95]\nes.mean_average_precision(gt, preds, iou_threshold=0.5)  # mAP@.50\nes.detection_report(gt, preds)                           # all 12 COCO numbers",
      since: "v0.3.0",
    },
  };

export const SHIPPED_IN_V010 = new Set<string>(
  Object.entries(SHIPPED)
    .filter(([, v]) => !v.since)
    .map(([k]) => k),
);
export const SHIPPED_IDS = new Set<string>(Object.keys(SHIPPED));

const planned =
  (version: ReleaseTarget) =>
  (d: Draft): MetricDefinition => {
    const shipped = SHIPPED[d.id];
    return {
      assumptions: [],
      limitations: [],
      references: [],
      ...d,
      ...(shipped ? { apiPath: shipped.apiPath, example: shipped.example } : {}),
      version: shipped ? (shipped.since ?? "v0.1.0") : version,
      status: shipped ? "implemented" : "planned",
    };
  };

const v1 = planned("v0.1.0");
const v2 = planned("v0.2.0");
const v3 = planned("v0.3.0");

const LABELS = ["y_true: array of class labels", "y_pred: array of predicted labels"];
const SCORES = [
  "y_true: array of binary labels {0, 1}",
  "y_prob: predicted probability of the positive class in [0, 1]",
];
const REG = [
  "y_true: array of real targets",
  "y_pred: array of real predictions",
  "sample_weight: optional",
];
const AVG =
  "Multiclass and multilabel inputs require an explicit `average` (micro, macro, weighted, samples, or None).";
const MASKS = [
  "y_true: ground-truth mask (H×W or N×H×W)",
  "y_pred: predicted mask with the same shape",
];
const BOXES = [
  "ground truth: boxes [x1, y1, x2, y2] with class labels",
  "predictions: boxes with class labels and confidence scores",
];

export const METRICS: MetricDefinition[] = [
  // ---------------- Classification (v0.1.0) ----------------
  v1({
    id: "classification.accuracy",
    name: "Accuracy",
    category: "classification",
    description: "Fraction of observations whose predicted label equals the true label.",
    formula: "Accuracy = (TP + TN) / (TP + TN + FP + FN)",
    inputs: LABELS,
    outputs: "float",
    range: "[0, 1]",
    limitations: [
      "Misleading under class imbalance: a constant majority-class predictor can score highly.",
    ],
    apiPath: "es.classification.accuracy",
  }),
  v1({
    id: "classification.precision",
    name: "Precision",
    category: "classification",
    description: "Of the observations predicted positive, the fraction that are truly positive.",
    formula: "Precision = TP / (TP + FP)",
    inputs: LABELS,
    outputs: "float or per-class array",
    range: "[0, 1]",
    assumptions: [AVG],
    limitations: ["Undefined when there are no positive predictions; handled by `zero_division`."],
    apiPath: "es.classification.precision",
  }),
  v1({
    id: "classification.recall",
    name: "Recall",
    category: "classification",
    description:
      "Of the truly positive observations, the fraction predicted positive. Equal to sensitivity in the binary case.",
    formula: "Recall = TP / (TP + FN)",
    inputs: LABELS,
    outputs: "float or per-class array",
    range: "[0, 1]",
    assumptions: [AVG],
    limitations: ["Undefined when a class has no true instances; handled by `zero_division`."],
    apiPath: "es.classification.recall",
  }),
  v1({
    id: "classification.f1",
    name: "F1 score",
    category: "classification",
    description: "Harmonic mean of precision and recall.",
    formula: "F1 = 2 · Precision · Recall / (Precision + Recall) = 2TP / (2TP + FP + FN)",
    inputs: LABELS,
    outputs: "float or per-class array",
    range: "[0, 1]",
    assumptions: [AVG],
    limitations: [
      "Ignores true negatives.",
      "Macro, micro, and weighted averages can rank models differently.",
    ],
    references: [REF.vanrijsbergen1979],
    apiPath: "es.classification.f1",
  }),
  v1({
    id: "classification.balanced_accuracy",
    name: "Balanced accuracy",
    category: "classification",
    description:
      "Mean of per-class recall. Reduces the influence of class imbalance compared with accuracy.",
    formula: "Balanced accuracy = (1/K) Σₖ TPₖ / (TPₖ + FNₖ)",
    inputs: LABELS,
    outputs: "float",
    range: "[0, 1]",
    references: [REF.brodersen2010],
    apiPath: "es.classification.balanced_accuracy",
  }),
  v1({
    id: "classification.mcc",
    name: "Matthews correlation coefficient",
    category: "classification",
    description:
      "Correlation between observed and predicted binary labels that uses all four confusion-matrix cells.",
    formula: "MCC = (TP·TN − FP·FN) / √((TP+FP)(TP+FN)(TN+FP)(TN+FN))",
    inputs: LABELS,
    outputs: "float",
    range: "[−1, 1]",
    limitations: [
      "Undefined when any marginal of the confusion matrix is zero; EvalSuite reports this explicitly rather than returning a silent value.",
    ],
    references: [REF.matthews1975],
    apiPath: "es.classification.mcc",
  }),
  v1({
    id: "classification.cohen_kappa",
    name: "Cohen's kappa",
    category: "classification",
    description:
      "Agreement between predicted and true labels corrected for agreement expected by chance.",
    formula: "κ = (pₒ − pₑ) / (1 − pₑ)",
    inputs: LABELS,
    outputs: "float",
    range: "[−1, 1]",
    limitations: [
      "Depends on the marginal distributions, so values are hard to compare across datasets with different prevalence.",
    ],
    references: [REF.cohen1960],
    apiPath: "es.classification.cohen_kappa",
  }),
  v1({
    id: "classification.roc_auc",
    name: "ROC AUC",
    category: "classification",
    description:
      "Area under the receiver operating characteristic curve; the probability that a random positive is ranked above a random negative.",
    formula: "AUC = ∫₀¹ TPR(FPR) dFPR",
    inputs: SCORES,
    outputs: "float",
    range: "[0, 1]",
    assumptions: ["Requires both classes to be present in y_true."],
    limitations: [
      "Insensitive to calibration.",
      "Can look optimistic on heavily imbalanced data; consider PR AUC alongside it.",
    ],
    references: [REF.hanley1982, REF.fawcett2006],
    apiPath: "es.classification.roc_auc",
  }),
  v1({
    id: "classification.pr_auc",
    name: "PR AUC (average precision)",
    category: "classification",
    description:
      "Summary of the precision-recall curve, computed as average precision over recall steps.",
    formula: "AP = Σₙ (Rₙ − Rₙ₋₁) · Pₙ",
    inputs: SCORES,
    outputs: "float",
    range: "[0, 1]",
    limitations: [
      "The baseline equals prevalence, so values are not comparable across datasets with different prevalence.",
      "Trapezoidal interpolation of PR curves is optimistic; average precision avoids it.",
    ],
    references: [REF.davis2006, REF.saito2015],
    apiPath: "es.classification.pr_auc",
  }),
  v1({
    id: "classification.log_loss",
    name: "Log loss",
    category: "classification",
    description:
      "Negative mean log-likelihood of the true labels under the predicted probabilities.",
    formula: "LogLoss = −(1/N) Σᵢ [yᵢ log pᵢ + (1 − yᵢ) log(1 − pᵢ)]",
    inputs: SCORES,
    outputs: "float",
    range: "[0, ∞)",
    limitations: [
      "Unbounded for confident wrong predictions; probabilities are clipped and the clipping value is reported.",
    ],
    apiPath: "es.classification.log_loss",
  }),
  v1({
    id: "classification.confusion_matrix",
    name: "Confusion matrix",
    category: "classification",
    description:
      "Counts of true versus predicted labels. Computed once per evaluation and shared by every count-based metric.",
    formula: "Cᵢⱼ = #{n : yₙ = i and ŷₙ = j}",
    inputs: LABELS,
    outputs: "K×K integer array",
    range: "non-negative counts",
    apiPath: "es.classification.confusion_matrix",
  }),
  // ---------------- Regression (v0.1.0) ----------------
  v1({
    id: "regression.mae",
    name: "Mean absolute error",
    category: "regression",
    description: "Average absolute difference between predictions and targets, in target units.",
    formula: "MAE = (1/N) Σᵢ |yᵢ − ŷᵢ|",
    inputs: REG,
    outputs: "float",
    range: "[0, ∞)",
    references: [REF.willmott2005],
    apiPath: "es.regression.mae",
  }),
  v1({
    id: "regression.mse",
    name: "Mean squared error",
    category: "regression",
    description: "Average squared difference between predictions and targets.",
    formula: "MSE = (1/N) Σᵢ (yᵢ − ŷᵢ)²",
    inputs: REG,
    outputs: "float",
    range: "[0, ∞)",
    limitations: ["Sensitive to outliers because errors are squared."],
    apiPath: "es.regression.mse",
  }),
  v1({
    id: "regression.rmse",
    name: "Root mean squared error",
    category: "regression",
    description: "Square root of MSE, expressed in target units.",
    formula: "RMSE = √MSE",
    inputs: REG,
    outputs: "float",
    range: "[0, ∞)",
    limitations: ["Sensitive to outliers."],
    references: [REF.willmott2005],
    apiPath: "es.regression.rmse",
  }),
  v1({
    id: "regression.r2",
    name: "Coefficient of determination (R²)",
    category: "regression",
    description:
      "Proportion of variance in the target explained by the predictions, relative to predicting the mean.",
    formula: "R² = 1 − Σᵢ (yᵢ − ŷᵢ)² / Σᵢ (yᵢ − ȳ)²",
    inputs: REG,
    outputs: "float",
    range: "(−∞, 1]",
    limitations: [
      "Undefined for constant targets; reported explicitly rather than returned as a number.",
    ],
    apiPath: "es.regression.r2",
  }),
  v1({
    id: "regression.adjusted_r2",
    name: "Adjusted R²",
    category: "regression",
    description: "R² penalised for the number of predictors in the model.",
    formula: "R²ₐ = 1 − (1 − R²)(N − 1) / (N − p − 1)",
    inputs: [...REG, "n_features: number of predictors p"],
    outputs: "float",
    range: "(−∞, 1]",
    assumptions: ["Requires N > p + 1."],
    apiPath: "es.regression.adjusted_r2",
  }),
  v1({
    id: "regression.mape",
    name: "Mean absolute percentage error",
    category: "regression",
    description: "Average absolute error relative to the magnitude of the target.",
    formula: "MAPE = (1/N) Σᵢ |yᵢ − ŷᵢ| / |yᵢ|",
    inputs: REG,
    outputs: "float",
    range: "[0, ∞)",
    assumptions: ["All targets must be non-zero; zero targets raise a validation error."],
    limitations: ["Asymmetric: penalises over-prediction and under-prediction differently."],
    references: [REF.hyndman2006],
    apiPath: "es.regression.mape",
  }),
  v1({
    id: "regression.smape",
    name: "Symmetric MAPE",
    category: "regression",
    description: "Percentage error scaled by the mean magnitude of target and prediction.",
    formula: "sMAPE = (1/N) Σᵢ 2|yᵢ − ŷᵢ| / (|yᵢ| + |ŷᵢ|)",
    inputs: REG,
    outputs: "float",
    range: "[0, 2]",
    limitations: ["Several conflicting definitions exist; EvalSuite documents the one it uses."],
    references: [REF.hyndman2006],
    apiPath: "es.regression.smape",
  }),
  v1({
    id: "regression.rmsle",
    name: "Root mean squared log error",
    category: "regression",
    description:
      "RMSE computed on log(1 + value), emphasising relative rather than absolute error.",
    formula: "RMSLE = √((1/N) Σᵢ (log(1 + yᵢ) − log(1 + ŷᵢ))²)",
    inputs: REG,
    outputs: "float",
    range: "[0, ∞)",
    assumptions: [
      "Targets and predictions must be greater than −1; invalid domains raise a validation error.",
    ],
    apiPath: "es.regression.rmsle",
  }),
  v1({
    id: "regression.median_absolute_error",
    name: "Median absolute error",
    category: "regression",
    description: "Median of absolute errors; robust to outliers.",
    formula: "MedAE = median(|yᵢ − ŷᵢ|)",
    inputs: REG,
    outputs: "float",
    range: "[0, ∞)",
    apiPath: "es.regression.median_absolute_error",
  }),
  v1({
    id: "regression.huber_loss",
    name: "Huber loss",
    category: "regression",
    description: "Quadratic for small errors and linear for large errors, controlled by δ.",
    formula: "Lδ(e) = ½e² if |e| ≤ δ, else δ(|e| − ½δ)",
    inputs: [...REG, "delta: positive float"],
    outputs: "float",
    range: "[0, ∞)",
    references: [REF.huber1964],
    apiPath: "es.regression.huber_loss",
  }),
  v1({
    id: "regression.quantile_loss",
    name: "Quantile (pinball) loss",
    category: "regression",
    description: "Asymmetric loss used to evaluate quantile predictions.",
    formula: "Lτ(e) = max(τe, (τ − 1)e),  e = y − ŷ",
    inputs: [...REG, "quantile τ in (0, 1)"],
    outputs: "float",
    range: "[0, ∞)",
    references: [REF.koenker1978],
    apiPath: "es.regression.quantile_loss",
  }),
  // ---------------- Clinical (v0.2.0) ----------------
  v2({
    id: "clinical.sensitivity",
    name: "Sensitivity",
    category: "clinical",
    description:
      "Proportion of people with the condition whom the test correctly identifies as positive.",
    formula: "Sensitivity = TP / (TP + FN)",
    inputs: ["y_true: binary reference standard", "y_pred: binary test result"],
    outputs: "float",
    range: "[0, 1]",
    assumptions: [
      "Binary reference standard is treated as ground truth.",
      "Defined for binary tasks only.",
    ],
    references: [REF.altman1994a],
    apiPath: "es.clinical.sensitivity",
  }),
  v2({
    id: "clinical.specificity",
    name: "Specificity",
    category: "clinical",
    description:
      "Proportion of people without the condition whom the test correctly identifies as negative.",
    formula: "Specificity = TN / (TN + FP)",
    inputs: ["y_true: binary reference standard", "y_pred: binary test result"],
    outputs: "float",
    range: "[0, 1]",
    assumptions: ["Defined for binary tasks only."],
    references: [REF.altman1994a],
    apiPath: "es.clinical.specificity",
  }),
  v2({
    id: "clinical.ppv",
    name: "Positive predictive value",
    category: "clinical",
    description: "Probability that a person with a positive result has the condition.",
    formula: "PPV = TP / (TP + FP)",
    inputs: ["y_true: binary reference standard", "y_pred: binary test result"],
    outputs: "float",
    range: "[0, 1]",
    limitations: [
      "Depends on prevalence; values from one population do not transfer to another with different prevalence.",
    ],
    references: [REF.altman1994b],
    apiPath: "es.clinical.ppv",
  }),
  v2({
    id: "clinical.npv",
    name: "Negative predictive value",
    category: "clinical",
    description: "Probability that a person with a negative result does not have the condition.",
    formula: "NPV = TN / (TN + FN)",
    inputs: ["y_true: binary reference standard", "y_pred: binary test result"],
    outputs: "float",
    range: "[0, 1]",
    limitations: ["Depends on prevalence."],
    references: [REF.altman1994b],
    apiPath: "es.clinical.npv",
  }),
  v2({
    id: "clinical.lr_positive",
    name: "Positive likelihood ratio",
    category: "clinical",
    description: "How much a positive result increases the odds of the condition.",
    formula: "LR+ = Sensitivity / (1 − Specificity)",
    inputs: ["y_true: binary reference standard", "y_pred: binary test result"],
    outputs: "float",
    range: "[0, ∞)",
    limitations: ["Infinite when specificity is 1; reported explicitly."],
    apiPath: "es.clinical.lr_positive",
  }),
  v2({
    id: "clinical.lr_negative",
    name: "Negative likelihood ratio",
    category: "clinical",
    description: "How much a negative result decreases the odds of the condition.",
    formula: "LR− = (1 − Sensitivity) / Specificity",
    inputs: ["y_true: binary reference standard", "y_pred: binary test result"],
    outputs: "float",
    range: "[0, ∞)",
    apiPath: "es.clinical.lr_negative",
  }),
  v2({
    id: "clinical.diagnostic_odds_ratio",
    name: "Diagnostic odds ratio",
    category: "clinical",
    description:
      "Ratio of the odds of a positive result in people with the condition to the odds in people without it.",
    formula: "DOR = (TP · TN) / (FP · FN) = LR+ / LR−",
    inputs: ["y_true: binary reference standard", "y_pred: binary test result"],
    outputs: "float",
    range: "[0, ∞)",
    limitations: [
      "Undefined when FP or FN is zero unless a continuity correction is requested explicitly.",
    ],
    references: [REF.glas2003],
    apiPath: "es.clinical.diagnostic_odds_ratio",
  }),
  v2({
    id: "clinical.youden_j",
    name: "Youden's J",
    category: "clinical",
    description: "Single summary of sensitivity and specificity at one threshold.",
    formula: "J = Sensitivity + Specificity − 1",
    inputs: ["y_true: binary reference standard", "y_pred: binary test result"],
    outputs: "float",
    range: "[−1, 1]",
    limitations: [
      "Weights false positives and false negatives equally, which rarely matches clinical costs.",
    ],
    references: [REF.youden1950],
    apiPath: "es.clinical.youden_j",
  }),
  v2({
    id: "clinical.net_benefit",
    name: "Net benefit (decision curve analysis)",
    category: "clinical",
    description:
      "Clinical utility of a model across threshold probabilities, compared with treat-all and treat-none strategies.",
    formula: "NB(pₜ) = TP/N − (FP/N) · pₜ / (1 − pₜ)",
    inputs: [...SCORES, "thresholds: threshold probabilities in (0, 1)"],
    outputs: "DCAResult (threshold, model, treat_all, treat_none)",
    assumptions: [
      "Threshold probability reflects the relative harm of false positives and false negatives.",
    ],
    limitations: ["Net benefit is relative to the evaluation population and its prevalence."],
    references: [REF.vickers2006],
    apiPath: "es.clinical.decision_curve",
  }),
  // ---------------- Calibration (v0.2.0) ----------------
  v2({
    id: "calibration.brier_score",
    name: "Brier score",
    category: "calibration",
    description: "Mean squared difference between predicted probabilities and binary outcomes.",
    formula: "BS = (1/N) Σᵢ (pᵢ − yᵢ)²",
    inputs: SCORES,
    outputs: "float",
    range: "[0, 1]",
    limitations: [
      "Mixes calibration and discrimination; a low score alone does not show good calibration.",
    ],
    references: [REF.brier1950],
    apiPath: "es.calibration.brier_score",
  }),
  v2({
    id: "calibration.ece",
    name: "Expected calibration error",
    category: "calibration",
    description:
      "Weighted average gap between predicted confidence and observed frequency across probability bins.",
    formula: "ECE = Σₘ (|Bₘ| / N) · |acc(Bₘ) − conf(Bₘ)|",
    inputs: [...SCORES, "n_bins, strategy: uniform | quantile"],
    outputs: "float",
    range: "[0, 1]",
    limitations: [
      "Depends on the number of bins and the binning strategy, which are always reported with the value.",
    ],
    references: [REF.naeini2015],
    apiPath: "es.calibration.ece",
  }),
  v2({
    id: "calibration.mce",
    name: "Maximum calibration error",
    category: "calibration",
    description: "Largest gap between confidence and observed frequency over all bins.",
    formula: "MCE = maxₘ |acc(Bₘ) − conf(Bₘ)|",
    inputs: [...SCORES, "n_bins, strategy"],
    outputs: "float",
    range: "[0, 1]",
    limitations: ["Dominated by sparsely populated bins."],
    references: [REF.naeini2015],
    apiPath: "es.calibration.mce",
  }),
  v2({
    id: "calibration.calibration_slope",
    name: "Calibration slope and intercept",
    category: "calibration",
    description:
      "Coefficients of a logistic regression of the outcome on the logit of the predicted probability.",
    formula: "logit P(y = 1) = a + b · logit(p);  ideal a = 0, b = 1",
    inputs: SCORES,
    outputs: "slope, intercept with confidence intervals",
    limitations: [
      "Summarises calibration with two numbers; inspect the calibration curve as well.",
    ],
    references: [REF.cox1958],
    apiPath: "es.calibration.calibration_slope",
  }),
  v2({
    id: "calibration.hosmer_lemeshow",
    name: "Hosmer–Lemeshow test",
    category: "calibration",
    description:
      "Goodness-of-fit test comparing observed and expected event counts across risk groups.",
    formula: "H = Σ_g (O_g − E_g)² / (E_g (1 − E_g / n_g)),  df = G − 2",
    inputs: [...SCORES, "n_groups (default 10)"],
    outputs: "statistic, degrees_of_freedom, p_value, n_groups",
    limitations: [
      "Results depend on the grouping.",
      "Low power in small samples and near-certain rejection in very large samples.",
      "A non-significant result does not show that calibration is good.",
    ],
    references: [REF.hosmer1980],
    apiPath: "es.clinical.hosmer_lemeshow",
  }),
  // ---------------- Confidence intervals (v0.2.0) ----------------
  v2({
    id: "confidence.wilson",
    name: "Wilson score interval",
    category: "confidence",
    description:
      "Confidence interval for a binomial proportion with good coverage for small samples and extreme proportions.",
    formula: "(p̂ + z²/2n ± z√(p̂(1 − p̂)/n + z²/4n²)) / (1 + z²/n)",
    inputs: ["successes k", "trials n", "confidence level"],
    outputs: "ConfidenceInterval",
    references: [REF.wilson1927],
    apiPath: "es.confidence.interval",
  }),
  v2({
    id: "confidence.clopper_pearson",
    name: "Clopper–Pearson interval",
    category: "confidence",
    description: "Exact binomial interval obtained by inverting two one-sided binomial tests.",
    formula: "Lower = B(α/2; k, n − k + 1),  Upper = B(1 − α/2; k + 1, n − k)",
    inputs: ["successes k", "trials n", "confidence level"],
    outputs: "ConfidenceInterval",
    limitations: [
      "Conservative: coverage is at least the nominal level, so intervals are wider than necessary.",
    ],
    references: [REF.clopper1934],
    apiPath: "es.confidence.interval",
  }),
  v2({
    id: "confidence.bootstrap_percentile",
    name: "Percentile bootstrap",
    category: "confidence",
    description:
      "Interval from the empirical quantiles of a statistic recomputed on resampled data.",
    formula: "[θ̂*(α/2), θ̂*(1 − α/2)]",
    inputs: ["data", "statistic", "n_resamples", "random_state"],
    outputs: "BootstrapResult",
    limitations: [
      "Can under-cover for skewed or biased statistics; BCa corrects for bias and skewness.",
    ],
    references: [REF.efron1979],
    apiPath: "es.bootstrap.bootstrap",
  }),
  v2({
    id: "confidence.bootstrap_bca",
    name: "BCa bootstrap",
    category: "confidence",
    description: "Bias-corrected and accelerated bootstrap interval.",
    formula: "Percentiles adjusted by bias correction z₀ and acceleration a (jackknife)",
    inputs: ["data", "statistic", "n_resamples", "random_state"],
    outputs: "BootstrapResult",
    limitations: ["Requires a jackknife pass, which adds N extra evaluations of the statistic."],
    references: [REF.efron1987],
    apiPath: "es.bootstrap.bootstrap",
  }),
  // ---------------- Statistical tests (v0.2.0) ----------------
  v2({
    id: "statistics.t_test_independent",
    name: "Independent-samples t-test",
    category: "statistics",
    description:
      "Tests whether two independent groups have equal means. Welch's version does not assume equal variances.",
    formula: "t = (x̄₁ − x̄₂) / √(s₁²/n₁ + s₂²/n₂)",
    inputs: ["sample a", "sample b", "equal_var: bool"],
    outputs: "StatisticalTestResult",
    assumptions: [
      "Independent observations.",
      "Approximately normal sampling distribution of the mean.",
    ],
    references: [REF.student1908, REF.welch1947],
    apiPath: "es.statistics.t_test",
  }),
  v2({
    id: "statistics.t_test_paired",
    name: "Paired t-test",
    category: "statistics",
    description:
      "Tests whether the mean of paired differences is zero, for example per-fold scores of two models.",
    formula: "t = d̄ / (s_d / √n)",
    inputs: ["paired sample a", "paired sample b"],
    outputs: "StatisticalTestResult",
    assumptions: ["Differences are approximately normal."],
    limitations: [
      "Cross-validation folds are not independent; the test can be anti-conservative for model comparison.",
    ],
    references: [REF.student1908],
    apiPath: "es.statistics.paired_t_test",
  }),
  v2({
    id: "statistics.mann_whitney",
    name: "Mann–Whitney U test",
    category: "statistics",
    description:
      "Rank-based test for whether one of two independent samples tends to have larger values.",
    formula: "U = R₁ − n₁(n₁ + 1)/2",
    inputs: ["sample a", "sample b"],
    outputs: "StatisticalTestResult",
    references: [REF.mann1947],
    apiPath: "es.statistics.mann_whitney",
  }),
  v2({
    id: "statistics.wilcoxon",
    name: "Wilcoxon signed-rank test",
    category: "statistics",
    description: "Rank-based test for paired samples.",
    formula: "W = Σ rank(|dᵢ|) over positive dᵢ",
    inputs: ["paired sample a", "paired sample b"],
    outputs: "StatisticalTestResult",
    assumptions: ["Differences are symmetric about the median."],
    references: [REF.wilcoxon1945],
    apiPath: "es.statistics.wilcoxon",
  }),
  v2({
    id: "statistics.kruskal_wallis",
    name: "Kruskal–Wallis test",
    category: "statistics",
    description: "Rank-based test comparing three or more independent groups.",
    formula: "H = (12 / N(N + 1)) Σ Rⱼ²/nⱼ − 3(N + 1)",
    inputs: ["k independent samples"],
    outputs: "StatisticalTestResult",
    references: [REF.kruskal1952],
    apiPath: "es.statistics.kruskal_wallis",
  }),
  v2({
    id: "statistics.friedman",
    name: "Friedman test",
    category: "statistics",
    description:
      "Rank-based test for three or more related samples, such as several models evaluated on the same datasets.",
    formula: "χ²_F = (12 / nk(k + 1)) Σ Rⱼ² − 3n(k + 1)",
    inputs: ["n × k matrix of scores"],
    outputs: "StatisticalTestResult",
    references: [REF.friedman1937],
    apiPath: "es.statistics.friedman",
  }),
  v2({
    id: "statistics.mcnemar",
    name: "McNemar's test",
    category: "statistics",
    description:
      "Compares two classifiers on the same observations using their discordant predictions.",
    formula: "χ² = (b − c)² / (b + c)",
    inputs: ["y_true", "predictions of model A", "predictions of model B"],
    outputs: "StatisticalTestResult",
    limitations: ["Use the exact binomial version when b + c is small."],
    references: [REF.mcnemar1947],
    apiPath: "es.statistics.mcnemar",
  }),
  v2({
    id: "statistics.shapiro_wilk",
    name: "Shapiro–Wilk test",
    category: "statistics",
    description: "Tests the null hypothesis that a sample comes from a normal distribution.",
    formula: "W = (Σ aᵢ x₍ᵢ₎)² / Σ (xᵢ − x̄)²",
    inputs: ["sample"],
    outputs: "StatisticalTestResult",
    limitations: ["With large samples, trivial departures from normality become significant."],
    references: [REF.shapiro1965],
    apiPath: "es.statistics.shapiro_wilk",
  }),
  v2({
    id: "statistics.delong",
    name: "DeLong test for correlated ROC AUCs",
    category: "statistics",
    description: "Compares the ROC AUCs of two models evaluated on the same observations.",
    formula: "z = (AUC₁ − AUC₂) / √Var(AUC₁ − AUC₂), variance from structural components",
    inputs: ["y_true", "scores of model A", "scores of model B"],
    outputs: "StatisticalTestResult",
    references: [REF.delong1988],
    apiPath: "es.comparison.delong",
  }),
  // ---------------- Effect sizes (v0.2.0) ----------------
  v2({
    id: "effect-size.cohens_d",
    name: "Cohen's d",
    category: "effect-size",
    description: "Standardised mean difference using the pooled standard deviation.",
    formula: "d = (x̄₁ − x̄₂) / s_pooled",
    inputs: ["sample a", "sample b"],
    outputs: "EffectSizeResult",
    limitations: ["Conventional small/medium/large thresholds are context-free rules of thumb."],
    references: [REF.cohen1988],
    apiPath: "es.effect_size.cohens_d",
  }),
  v2({
    id: "effect-size.hedges_g",
    name: "Hedges' g",
    category: "effect-size",
    description: "Cohen's d with a small-sample bias correction.",
    formula: "g = d · (1 − 3 / (4(n₁ + n₂) − 9))",
    inputs: ["sample a", "sample b"],
    outputs: "EffectSizeResult",
    references: [REF.hedges1981],
    apiPath: "es.effect_size.hedges_g",
  }),
  v2({
    id: "effect-size.cramers_v",
    name: "Cramér's V",
    category: "effect-size",
    description: "Strength of association between two categorical variables.",
    formula: "V = √(χ² / (N · (min(r, c) − 1)))",
    inputs: ["contingency table"],
    outputs: "EffectSizeResult",
    range: "[0, 1]",
    references: [REF.cramer1946],
    apiPath: "es.effect_size.cramers_v",
  }),
  // ---------------- Multiple testing (v0.2.0) ----------------
  v2({
    id: "multiple-testing.bonferroni",
    name: "Bonferroni correction",
    category: "multiple-testing",
    description:
      "Controls the family-wise error rate by multiplying each p-value by the number of tests.",
    formula: "p̃ᵢ = min(1, m · pᵢ)",
    inputs: ["p_values", "alpha"],
    outputs: "adjusted p-values, reject flags",
    limitations: ["Conservative when tests are positively correlated."],
    references: [REF.dunn1961],
    apiPath: "es.multiple_testing.correct",
  }),
  v2({
    id: "multiple-testing.holm",
    name: "Holm step-down",
    category: "multiple-testing",
    description:
      "Sequentially rejective procedure that controls the family-wise error rate and is uniformly more powerful than Bonferroni.",
    formula: "p̃₍ᵢ₎ = maxⱼ≤ᵢ min(1, (m − j + 1) p₍ⱼ₎)",
    inputs: ["p_values", "alpha"],
    outputs: "adjusted p-values, reject flags",
    references: [REF.holm1979],
    apiPath: "es.multiple_testing.correct",
  }),
  v2({
    id: "multiple-testing.hochberg",
    name: "Hochberg step-up",
    category: "multiple-testing",
    description:
      "Step-up procedure controlling the family-wise error rate under independence or certain positive dependence.",
    formula: "Reject H₍₁₎…H₍ₖ₎ for the largest k with p₍ₖ₎ ≤ α / (m − k + 1)",
    inputs: ["p_values", "alpha"],
    outputs: "adjusted p-values, reject flags",
    references: [REF.hochberg1988],
    apiPath: "es.multiple_testing.correct",
  }),
  v2({
    id: "multiple-testing.benjamini_hochberg",
    name: "Benjamini–Hochberg (FDR)",
    category: "multiple-testing",
    description: "Controls the expected proportion of false discoveries among rejected hypotheses.",
    formula: "Reject H₍₁₎…H₍ₖ₎ for the largest k with p₍ₖ₎ ≤ (k / m) α",
    inputs: ["p_values", "alpha"],
    outputs: "adjusted p-values, reject flags",
    assumptions: ["Independent or positively dependent test statistics."],
    references: [REF.bh1995],
    apiPath: "es.multiple_testing.correct",
  }),
  // ---------------- Segmentation (v0.3.0) ----------------
  v3({
    id: "segmentation.dice",
    name: "Dice coefficient",
    category: "segmentation",
    description:
      "Overlap between predicted and ground-truth masks, weighting the intersection twice.",
    formula: "Dice = 2|A ∩ B| / (|A| + |B|)",
    inputs: MASKS,
    outputs: "float or per-class array",
    range: "[0, 1]",
    limitations: [
      "Undefined when both masks are empty; the `empty` policy (1.0, NaN, or exclude) is always explicit.",
    ],
    references: [REF.dice1945],
    apiPath: "es.segmentation.dice",
  }),
  v3({
    id: "segmentation.iou",
    name: "Intersection over union",
    category: "segmentation",
    description:
      "Ratio of the intersection to the union of predicted and ground-truth masks (Jaccard index).",
    formula: "IoU = |A ∩ B| / |A ∪ B|",
    inputs: MASKS,
    outputs: "float or per-class array",
    range: "[0, 1]",
    references: [REF.jaccard1912],
    apiPath: "es.segmentation.iou",
  }),
  v3({
    id: "segmentation.miou",
    name: "Mean IoU",
    category: "segmentation",
    description: "IoU averaged over classes, with support for ignore_index.",
    formula: "mIoU = (1/K) Σₖ IoUₖ",
    inputs: [...MASKS, "num_classes", "ignore_index"],
    outputs: "float",
    range: "[0, 1]",
    references: [REF.long2015],
    apiPath: "es.segmentation.miou",
  }),
  v3({
    id: "segmentation.pixel_accuracy",
    name: "Pixel accuracy",
    category: "segmentation",
    description: "Fraction of correctly labelled pixels.",
    formula: "PA = Σₖ nₖₖ / Σₖ tₖ",
    inputs: MASKS,
    outputs: "float",
    range: "[0, 1]",
    limitations: ["Dominated by large classes such as background."],
    references: [REF.long2015],
    apiPath: "es.segmentation.pixel_accuracy",
  }),
  v3({
    id: "segmentation.boundary_iou",
    name: "Boundary IoU",
    category: "segmentation",
    description: "IoU computed on contour bands of fixed width, emphasising boundary quality.",
    formula: "Boundary IoU = |(G_d ∩ G) ∩ (P_d ∩ P)| / |(G_d ∩ G) ∪ (P_d ∩ P)|",
    inputs: [...MASKS, "dilation ratio d"],
    outputs: "float",
    range: "[0, 1]",
    references: [REF.cheng2021],
    apiPath: "es.segmentation.boundary_iou",
  }),
  v3({
    id: "segmentation.hausdorff",
    name: "Hausdorff distance",
    category: "segmentation",
    description: "Largest distance from a point on one boundary to the nearest point on the other.",
    formula: "H(A, B) = max(supₐ inf_b d(a, b), sup_b infₐ d(a, b))",
    inputs: [...MASKS, "voxel spacing"],
    outputs: "float (physical units)",
    range: "[0, ∞)",
    limitations: ["Sensitive to single outlier pixels; a percentile variant (HD95) is planned."],
    references: [REF.huttenlocher1993],
    apiPath: "es.segmentation.hausdorff",
  }),
  // ---------------- Detection (v0.3.0) ----------------
  v3({
    id: "detection.box_iou",
    name: "Box IoU",
    category: "detection",
    description: "Intersection over union of two axis-aligned bounding boxes.",
    formula: "IoU = area(A ∩ B) / area(A ∪ B)",
    inputs: ["boxes A [x1, y1, x2, y2]", "boxes B [x1, y1, x2, y2]"],
    outputs: "pairwise IoU matrix",
    range: "[0, 1]",
    assumptions: [
      "Boxes must satisfy x2 ≥ x1 and y2 ≥ y1; invalid boxes raise a validation error.",
    ],
    apiPath: "es.detection.box_iou",
  }),
  v3({
    id: "detection.average_precision",
    name: "Average precision",
    category: "detection",
    description:
      "Area under the interpolated precision-recall curve for one class at one IoU threshold.",
    formula: "AP = Σ (r_{n+1} − r_n) · p_interp(r_{n+1})",
    inputs: [...BOXES, "iou_threshold"],
    outputs: "float per class",
    range: "[0, 1]",
    limitations: [
      "Interpolation and matching conventions differ between VOC and COCO; the convention used is documented with every result.",
    ],
    references: [REF.everingham2010],
    apiPath: "es.detection.average_precision",
  }),
  v3({
    id: "detection.map50_95",
    name: "mAP@[.50:.95]",
    category: "detection",
    description: "Mean AP over classes and over IoU thresholds 0.50, 0.55, …, 0.95.",
    formula: "mAP = (1/10) Σ_{t ∈ {0.50, …, 0.95}} (1/K) Σₖ AP_k(t)",
    inputs: BOXES,
    outputs: "float",
    range: "[0, 1]",
    limitations: [
      "Not claimed to be COCO-compatible unless verified against the reference COCO evaluation protocol.",
    ],
    references: [REF.lin2014],
    apiPath: "es.detection.map",
  }),
];
