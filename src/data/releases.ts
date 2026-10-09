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
    version: "v0.2.1",
    date: "2026-10-09",
    changes: [
      {
        kind: "Added",
        items: [
          "Benchmarks for the v0.2.0 functions (evalsuite benchmark --suite clinical) against scikit-learn, statsmodels, SciPy and the textbook NumPy loop; every row names its reference.",
        ],
      },
      {
        kind: "Changed",
        items: [
          "Faster label handling: 8 label metrics at a million samples are now 34× faster than scikit-learn (from 10×), macro F1 5.8× (from 1.6×).",
          "Decision curves computed from cumulative sums instead of a samples × thresholds matrix.",
        ],
      },
    ],
  },
  {
    version: "v0.2.0",
    date: "2026-10-08",
    changes: [
      {
        kind: "Added",
        items: [
          "Clinical: sensitivity, PPV, positive and negative likelihood ratios, diagnostic odds ratio, Youden's J and net benefit; diagnostic_report with a confidence interval for every measure; decision_curve with treat-all and treat-none references.",
          "Calibration: maximum calibration error, calibration slope and intercept, Hosmer–Lemeshow test and calibration_report.",
          "Hypothesis tests with effect sizes: Welch, Student and paired t-tests, Mann–Whitney, Wilcoxon, Kruskal–Wallis, Friedman, Shapiro–Wilk, χ² and Fisher's exact; Cramér's V; Hochberg correction.",
          "Decision curve plot; CLI commands evalsuite diagnostic, evalsuite calibration and evalsuite plot decision.",
          "Validated against statsmodels and SciPy.",
        ],
      },
    ],
  },
  {
    version: "v0.1.2",
    date: "2026-10-08",
    changes: [
      {
        kind: "Changed",
        items: ["LICENSE: copyright held by Manoj Kumar C S and Nikhil D Bharadwaj."],
      },
    ],
  },
  {
    version: "v0.1.1",
    date: "2026-10-08",
    changes: [
      {
        kind: "Changed",
        items: [
          "Credits: Manoj Kumar C S and Nikhil D Bharadwaj listed as authors and maintainers in the README and package metadata.",
        ],
      },
    ],
  },
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
