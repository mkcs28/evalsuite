// Package functions documented from the evalsuite-python registry by scripts/gen_core_metrics.py.
// Every example call was executed against the package. Do not edit by hand.
import type { MetricDefinition } from "@/lib/metrics/schema";

export const CORE_EXTRA_METRICS: MetricDefinition[] = [
  {
    id: "classification.fbeta",
    name: "F-beta score",
    category: "classification",
    description:
      "Weighted harmonic mean of precision and recall; beta > 1 favours recall, beta < 1 precision.",
    formula: "(1+β²)·TP / ((1+β²)·TP + β²·FN + FP)",
    inputs: ["y_true: array of class labels", "y_pred: array of predicted labels"],
    outputs: "MetricResult",
    range: "[0, 1]",
    assumptions: [],
    limitations: [],
    references: [
      {
        citation: "van Rijsbergen CJ. Information Retrieval. 2nd ed. Butterworths; 1979.",
      },
    ],
    version: "v0.1.0",
    status: "implemented",
    apiPath: "es.fbeta",
    example: "es.fbeta(y_true, y_pred, beta=2)",
  },
  {
    id: "classification.hamming_loss",
    name: "Hamming loss",
    category: "classification",
    description:
      "Fraction of labels predicted incorrectly (for single-label targets equal to 1 − accuracy).",
    formula: "(1/(n·L)) Σᵢ Σₗ 1[ŷᵢₗ ≠ yᵢₗ]",
    inputs: ["Y: multilabel indicator matrix", "P: predicted indicator matrix"],
    outputs: "MetricResult",
    range: "[0, 1]",
    assumptions: [],
    limitations: [],
    references: [
      {
        citation:
          "Tsoumakas G, Katakis I. Multi-label classification: an overview. Int J Data Warehousing and Mining. 2007;3(3):1-13.",
      },
    ],
    version: "v0.1.0",
    status: "implemented",
    apiPath: "es.hamming_loss",
    example: "es.hamming_loss(Y, P)",
  },
  {
    id: "classification.jaccard",
    name: "Jaccard index",
    category: "classification",
    description:
      "Size of the intersection over the size of the union of predicted and true positives.",
    formula: "TP / (TP + FP + FN)",
    inputs: ["y_true: array of class labels", "y_pred: array of predicted labels"],
    outputs: "MetricResult",
    range: "[0, 1]",
    assumptions: [],
    limitations: [],
    references: [
      {
        citation:
          "Jaccard P. The distribution of the flora in the alpine zone. New Phytologist. 1912;11(2):37-50.",
      },
    ],
    version: "v0.1.0",
    status: "implemented",
    apiPath: "es.jaccard",
    example: "es.jaccard(y_true, y_pred)",
  },
  {
    id: "classification.top_k_accuracy",
    name: "Top-k accuracy",
    category: "classification",
    description:
      "Proportion of observations whose true class is among the k classes with the highest probability.",
    formula: "(1/n) Σᵢ 1[yᵢ ∈ top-k(p̂ᵢ)]",
    inputs: ["y_true: class labels", "y_prob: (n, k) class probabilities"],
    outputs: "MetricResult",
    range: "[0, 1]",
    assumptions: [],
    limitations: [],
    references: [
      {
        citation:
          "Russakovsky O, et al. ImageNet Large Scale Visual Recognition Challenge. IJCV. 2015;115:211-252.",
      },
    ],
    version: "v0.1.0",
    status: "implemented",
    apiPath: "es.top_k_accuracy",
    example: "es.top_k_accuracy(y_true_k, y_prob_k, k=2)",
  },
  {
    id: "regression.explained_variance",
    name: "Explained variance",
    category: "regression",
    description: "Proportion of target variance explained, ignoring systematic bias (unlike R²).",
    formula: "1 − Var(y − ŷ) / Var(y)",
    inputs: [
      "y_true: array of real targets",
      "y_pred: array of real predictions",
      "sample_weight: optional",
    ],
    outputs: "MetricResult",
    range: "(−∞, 1]",
    assumptions: [],
    limitations: [],
    references: [
      {
        citation: "Draper NR, Smith H. Applied Regression Analysis. 3rd ed. Wiley; 1998.",
      },
    ],
    version: "v0.1.0",
    status: "implemented",
    apiPath: "es.explained_variance",
    example: "es.explained_variance(yr, pr)",
  },
  {
    id: "regression.max_error",
    name: "Maximum error",
    category: "regression",
    description: "Largest absolute error: the worst case.",
    formula: "maxᵢ |ŷᵢ − yᵢ|",
    inputs: [
      "y_true: array of real targets",
      "y_pred: array of real predictions",
      "sample_weight: optional",
    ],
    outputs: "MetricResult",
    range: "[0, ∞)",
    assumptions: [],
    limitations: [],
    references: [
      {
        citation:
          "Hyndman RJ, Athanasopoulos G. Forecasting: Principles and Practice. 3rd ed. OTexts; 2021.",
      },
    ],
    version: "v0.1.0",
    status: "implemented",
    apiPath: "es.max_error",
    example: "es.max_error(yr, pr)",
  },
  {
    id: "regression.mean_bias_error",
    name: "Mean bias error",
    category: "regression",
    description: "Average signed error: positive when the model over-predicts on average.",
    formula: "(1/n) Σ (ŷᵢ − yᵢ)",
    inputs: [
      "y_true: array of real targets",
      "y_pred: array of real predictions",
      "sample_weight: optional",
    ],
    outputs: "MetricResult",
    range: "(−∞, ∞) (0 = unbiased)",
    assumptions: [],
    limitations: [],
    references: [
      {
        citation:
          "Willmott CJ, Matsuura K. Advantages of the mean absolute error (MAE) over the root mean square error (RMSE) in assessing average model performance. Clim Res. 2005;30:79-82.",
      },
    ],
    version: "v0.1.0",
    status: "implemented",
    apiPath: "es.mean_bias_error",
    example: "es.mean_bias_error(yr, pr)",
  },
  {
    id: "regression.msle",
    name: "Mean squared logarithmic error",
    category: "regression",
    description:
      "Mean squared difference of log(1 + y); emphasises relative error and penalises under-prediction.",
    formula: "(1/n) Σ (log(1 + ŷᵢ) − log(1 + yᵢ))²",
    inputs: [
      "y_true: array of real targets",
      "y_pred: array of real predictions",
      "sample_weight: optional",
    ],
    outputs: "MetricResult",
    range: "[0, ∞)",
    assumptions: [],
    limitations: [],
    references: [
      {
        citation:
          "Hyndman RJ, Koehler AB. Another look at measures of forecast accuracy. Int J Forecast. 2006;22(4):679-688.",
      },
    ],
    version: "v0.1.0",
    status: "implemented",
    apiPath: "es.msle",
    example: "es.msle(yr, pr)",
  },
  {
    id: "regression.rae",
    name: "Relative absolute error",
    category: "regression",
    description:
      "Total absolute error relative to that of always predicting the mean; below 1 beats the mean.",
    formula: "Σ|ŷᵢ − yᵢ| / Σ|yᵢ − ȳ|",
    inputs: [
      "y_true: array of real targets",
      "y_pred: array of real predictions",
      "sample_weight: optional",
    ],
    outputs: "MetricResult",
    range: "[0, ∞)",
    assumptions: [],
    limitations: [],
    references: [
      {
        citation: "Witten IH, Frank E, Hall MA. Data Mining. 3rd ed. Morgan Kaufmann; 2011.",
      },
    ],
    version: "v0.1.0",
    status: "implemented",
    apiPath: "es.rae",
    example: "es.rae(yr, pr)",
  },
  {
    id: "regression.rse",
    name: "Relative squared error",
    category: "regression",
    description:
      "Total squared error relative to that of always predicting the mean (equals 1 − R²).",
    formula: "Σ(ŷᵢ − yᵢ)² / Σ(yᵢ − ȳ)²",
    inputs: [
      "y_true: array of real targets",
      "y_pred: array of real predictions",
      "sample_weight: optional",
    ],
    outputs: "MetricResult",
    range: "[0, ∞)",
    assumptions: [],
    limitations: [],
    references: [
      {
        citation: "Witten IH, Frank E, Hall MA. Data Mining. 3rd ed. Morgan Kaufmann; 2011.",
      },
    ],
    version: "v0.1.0",
    status: "implemented",
    apiPath: "es.rse",
    example: "es.rse(yr, pr)",
  },
  {
    id: "calibration.calibration_intercept",
    name: "Calibration intercept",
    category: "calibration",
    description:
      "Calibration-in-the-large: intercept a of logit P(y=1) = a + logit(p) with the slope fixed at 1. 0 is ideal; negative means risks are overestimated on average, positive underestimated.",
    formula: "logit P(y=1) = a + logit(p̂)  (offset)",
    inputs: ["y_true: binary outcomes", "y_prob: predicted risks in (0, 1)"],
    outputs: "MetricResult",
    range: "(−∞, ∞), ideal 0",
    assumptions: [],
    limitations: [],
    references: [
      {
        citation:
          "Cox DR. Two further applications of a model for binary regression. Biometrika. 1958;45(3-4):562-565.",
      },
      {
        citation:
          "Van Calster B, McLernon DJ, van Smeden M, Wynants L, Steyerberg EW. Calibration: the Achilles heel of predictive analytics. BMC Med. 2019;17(1):230.",
      },
    ],
    version: "v0.2.0",
    status: "implemented",
    apiPath: "es.calibration_intercept",
    example: "es.calibration_intercept(y_true, y_prob)",
  },
  {
    id: "segmentation.mean_pixel_accuracy",
    name: "Mean pixel accuracy",
    category: "segmentation",
    description:
      "Per-class pixel recall (correct pixels of the class over its true pixels), averaged over the classes that occur in the truth.",
    formula: "(1/K) Σ_k TP_k / (TP_k + FN_k)",
    inputs: ["y_true: ground-truth label mask", "y_pred: predicted mask with the same shape"],
    outputs: "MetricResult",
    range: "[0, 1]",
    assumptions: [],
    limitations: [],
    references: [
      {
        citation:
          "Long J, Shelhamer E, Darrell T. Fully convolutional networks for semantic segmentation. CVPR 2015:3431-3440.",
      },
    ],
    version: "v0.3.0",
    status: "implemented",
    apiPath: "es.mean_pixel_accuracy",
    example: "es.mean_pixel_accuracy(mask_true, mask_pred)",
  },
  {
    id: "segmentation.average_surface_distance",
    name: "Average symmetric surface distance",
    category: "segmentation",
    description:
      "Mean distance from every boundary point of each mask to the nearest boundary point of the other, pooled over both directions.",
    formula: "ASSD = (Σ_{a∈∂A} d(a, ∂B) + Σ_{b∈∂B} d(b, ∂A)) / (|∂A| + |∂B|)",
    inputs: [
      "y_true: ground-truth label mask",
      "y_pred: predicted mask with the same shape",
      "spacing: optional pixel spacing",
    ],
    outputs: "MetricResult",
    range: "[0, ∞)",
    assumptions: [],
    limitations: [],
    references: [
      {
        citation:
          "Maier-Hein L, Reinke A, Godau P, et al. Metrics reloaded: recommendations for image analysis validation. Nat Methods. 2024;21(2):195-212.",
      },
    ],
    version: "v0.3.0",
    status: "implemented",
    apiPath: "es.average_surface_distance",
    example: "es.average_surface_distance(mask_true, mask_pred, labels=[1])",
  },
  {
    id: "confidence.accuracy_ci",
    name: "Accuracy confidence interval",
    category: "confidence",
    description:
      "Confidence interval for accuracy as a binomial proportion of correct predictions (Wilson by default, or Clopper–Pearson / normal).",
    formula: "Wilson: (p̂ + z²/2n ± z√(p̂(1−p̂)/n + z²/4n²)) / (1 + z²/n)",
    inputs: [
      "y_true: array of class labels",
      "y_pred: array of predicted labels",
      "level: confidence level (default 0.95)",
      "method: wilson, clopper-pearson or normal",
    ],
    outputs: "result object",
    range: "[0, 1]",
    assumptions: [],
    limitations: [],
    references: [
      {
        citation:
          "Wilson EB. Probable inference, the law of succession, and statistical inference. JASA. 1927;22:209-212.",
      },
    ],
    version: "v0.1.0",
    status: "implemented",
    apiPath: "es.accuracy_ci",
    example: 'es.accuracy_ci(y_true, y_pred, method="wilson")',
  },
  {
    id: "confidence.roc_auc_ci",
    name: "ROC AUC confidence interval (DeLong)",
    category: "confidence",
    description:
      "Confidence interval for the area under the ROC curve from DeLong's structural-component variance, without resampling.",
    formula: "AUC ± z·√Var_DeLong(AUC), computed on the logit scale",
    inputs: [
      "y_true: binary labels",
      "y_prob: scores for the positive class",
      "level: confidence level",
    ],
    outputs: "result object",
    range: "[0, 1]",
    assumptions: [],
    limitations: [],
    references: [
      {
        citation:
          "DeLong ER, DeLong DM, Clarke-Pearson DL. Comparing the areas under two or more correlated receiver operating characteristic curves. Biometrics. 1988;44(3):837-845.",
      },
    ],
    version: "v0.1.0",
    status: "implemented",
    apiPath: "es.roc_auc_ci",
    example: "es.roc_auc_ci(y_true, y_prob)",
  },
  {
    id: "statistics.chi_square_test",
    name: "Chi-square test of independence",
    category: "statistics",
    description:
      "Pearson's χ² test of independence for a contingency table, with Yates' continuity correction for 2×2 tables by default.",
    formula: "χ² = Σ (O − E)² / E, E = row total · column total / n",
    inputs: ["table: contingency table of counts", "correction: Yates' correction for 2×2"],
    outputs: "result object",
    range: "p in [0, 1]",
    assumptions: [],
    limitations: [],
    references: [
      {
        citation:
          "Pearson K. On the criterion that a given system of deviations from the probable... Philosophical Magazine. 1900;50(302):157-175.",
      },
    ],
    version: "v0.2.0",
    status: "implemented",
    apiPath: "es.chi_square_test",
    example: "es.chi_square_test(table)",
  },
  {
    id: "statistics.fisher_exact_test",
    name: "Fisher's exact test",
    category: "statistics",
    description:
      "Exact test of association for a 2×2 table from the hypergeometric distribution; preferred over χ² when expected counts are small.",
    formula: "P = Σ hypergeometric probabilities of tables as or more extreme",
    inputs: ["table: 2×2 table of counts", "alternative: two-sided, less or greater"],
    outputs: "result object",
    range: "p in [0, 1]",
    assumptions: [],
    limitations: [],
    references: [
      {
        citation:
          "Fisher RA. On the interpretation of χ² from contingency tables, and the calculation of P. J R Stat Soc. 1922;85(1):87-94.",
      },
    ],
    version: "v0.2.0",
    status: "implemented",
    apiPath: "es.fisher_exact_test",
    example: "es.fisher_exact_test(table2x2)",
  },
  {
    id: "effect-size.cliffs_delta",
    name: "Cliff's delta",
    category: "effect-size",
    description:
      "Non-parametric effect size: the probability that a value from one group exceeds a value from the other, minus the reverse.",
    formula: "δ = (#(a_i > b_j) − #(a_i < b_j)) / (n_a · n_b)",
    inputs: ["a: first sample", "b: second sample"],
    outputs: "result object",
    range: "[−1, 1]",
    assumptions: [],
    limitations: [],
    references: [
      {
        citation:
          "Cliff N. Dominance statistics: ordinal analyses to answer ordinal questions. Psychol Bull. 1993;114(3):494-509.",
      },
    ],
    version: "v0.1.0",
    status: "implemented",
    apiPath: "es.cliffs_delta",
    example: "es.cliffs_delta(a, b)",
  },
  {
    id: "statistics.paired_bootstrap_test",
    name: "Paired bootstrap test",
    category: "statistics",
    description:
      "Test whether two models differ on any metric by resampling the same examples for both and counting how often the difference changes sign.",
    formula: "p = 2 · min(P*(Δ ≤ 0), P*(Δ ≥ 0)) over paired resamples",
    inputs: [
      "metric: any EvalSuite metric",
      "y_true",
      "y_pred_a, y_pred_b: the two models' predictions",
      "n_resamples, random_state",
    ],
    outputs: "result object",
    range: "p in [0, 1]",
    assumptions: [],
    limitations: [],
    references: [
      {
        citation:
          "Koehn P. Statistical significance tests for machine translation evaluation. EMNLP. 2004:388-395.",
      },
    ],
    version: "v0.1.0",
    status: "implemented",
    apiPath: "es.paired_bootstrap_test",
    example:
      "es.paired_bootstrap_test(es.accuracy, y_true, pred_a, pred_b, n_resamples=500, random_state=0)",
  },
  {
    id: "statistics.compare",
    name: "Model comparison",
    category: "statistics",
    description:
      "Compare several models on the same examples: every metric with a bootstrap interval, pairwise paired tests and multiple-testing correction, in one report.",
    formula: "per metric: estimate, bootstrap CI; per pair: paired test p-value, adjusted",
    inputs: [
      "y_true",
      "predictions: mapping model name → predictions",
      "metrics: metric names",
      "n_resamples, random_state",
    ],
    outputs: "result object",
    range: "report",
    assumptions: [],
    limitations: [],
    references: [
      {
        citation: "Efron B, Tibshirani RJ. An Introduction to the Bootstrap. Chapman & Hall; 1993.",
      },
    ],
    version: "v0.1.0",
    status: "implemented",
    apiPath: "es.compare",
    example:
      'es.compare(y_true, {"a": pred_a, "b": pred_b}, metrics=["accuracy"], n_resamples=200, random_state=0)',
  },
];
