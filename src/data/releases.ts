import type { ReleaseTarget } from "@/types/status";

export type ChangeKind = "Added" | "Changed" | "Fixed" | "Deprecated" | "Removed" | "Security";

export interface ReleaseNote {
  version: ReleaseTarget;
  /** ISO date once published; null while unreleased. */
  date: string | null;
  changes: Array<{ kind: ChangeKind; items: string[] }>;
}

/**
 * Published releases only, mirroring the package's CHANGELOG.md.
 */
export const RELEASE_NOTES: ReleaseNote[] = [
  {
    version: "v0.1.0",
    date: "2026-10-08",
    changes: [
      {
        kind: "Added",
        items: [
          "Classification metrics: binary, multiclass and multilabel, with micro, macro, weighted, samples and per-class averaging and sample weights.",
          "Regression metrics, single and multi-output, including MAPE, sMAPE, RMSLE, Huber and quantile loss.",
          "evaluate(): one call for every applicable metric, with inputs validated and the confusion matrix built once.",
          "Immutable, number-like results with JSON, pandas, Markdown, LaTeX, HTML and CSV export.",
          "Metric registry with definitions, formulas, ranges and references.",
          "Model comparison: compare() with confidence intervals (bootstrap BCa, Wilson, Clopper–Pearson, DeLong), paired tests (McNemar, DeLong, paired bootstrap), effect sizes and multiple-testing corrections.",
          "Calibration curve and expected calibration error.",
          "Plots: ROC, precision-recall, calibration, confusion matrix, residuals and model comparison (optional matplotlib extra).",
          "Classification report table matching scikit-learn.",
          "Command-line tool: evalsuite evaluate, report, compare, plot, metrics, info and benchmark.",
          "Benchmarks against scikit-learn: identical results, about 10x faster for many metrics at once.",
          "Tested on Python 3.9 to 3.14 on Linux, Windows and macOS; released to PyPI with Trusted Publishing.",
        ],
      },
    ],
  },
];
