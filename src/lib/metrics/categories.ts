/** Category constants with no runtime dependencies (safe for client bundles). */
export const METRIC_CATEGORIES = [
  "classification",
  "regression",
  "clinical",
  "calibration",
  "confidence",
  "statistics",
  "effect-size",
  "multiple-testing",
  "segmentation",
  "detection",
] as const;

export type MetricCategory = (typeof METRIC_CATEGORIES)[number];

export const CATEGORY_LABEL: Record<MetricCategory, string> = {
  classification: "Classification",
  regression: "Regression",
  clinical: "Clinical",
  calibration: "Calibration",
  confidence: "Confidence intervals",
  statistics: "Statistical tests",
  "effect-size": "Effect sizes",
  "multiple-testing": "Multiple testing",
  segmentation: "Segmentation",
  detection: "Object detection",
};
