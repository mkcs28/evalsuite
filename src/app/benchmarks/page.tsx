import type { Metadata } from "next";
import { Callout } from "@/components/ui/callout";
import { PageHeader, Section } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  METRIC_BENCHMARK_COUNT,
  MetricBenchmarkSummaryTable,
  MetricBenchmarkTables,
} from "@/components/benchmarks/metric-benchmarks";

export const metadata: Metadata = {
  title: "Benchmarks",
  description:
    "Every EvalSuite metric benchmarked: speed and memory against scikit-learn, statsmodels, SciPy, pycocotools, sacreBLEU, rouge-score, NLTK, ranx and jsonschema on the same data, with identical results.",
  alternates: { canonical: "/benchmarks" },
};

type Row = {
  case: string;
  n: string;
  reference: string;
  evalsuite: string;
  ref: string;
  speedup: string;
  memEs: string;
  memRef: string;
  diff: string;
};

type SuiteSummary = {
  suite: string;
  cases: number;
  rows: number;
  match: string;
  faster: string;
  geomean: string;
  range: string;
};

/** From BENCHMARKS.md in the package repository (evalsuite benchmark, EvalSuite 0.4.0, fastest of 5 runs). */
const SUITE_SUMMARY: SuiteSummary[] = [
  {
    suite: "Classification and regression",
    cases: 4,
    rows: 12,
    match: "12/12",
    faster: "10/12",
    geomean: "5.88×",
    range: "0.47×–49.07×",
  },
  {
    suite: "Clinical, calibration and statistics",
    cases: 8,
    rows: 24,
    match: "24/24",
    faster: "17/24",
    geomean: "1.71×",
    range: "0.25×–11.13×",
  },
  {
    suite: "LLM evaluation",
    cases: 6,
    rows: 18,
    match: "18/18",
    faster: "10/18",
    geomean: "1.48×",
    range: "0.83×–7.72×",
  },
  {
    suite: "Segmentation and object detection",
    cases: 3,
    rows: 9,
    match: "9/9",
    faster: "5/9",
    geomean: "1.97×",
    range: "0.64×–10.39×",
  },
  {
    suite: "Overall",
    cases: 21,
    rows: 63,
    match: "63/63",
    faster: "42/63",
    geomean: "2.12×",
    range: "0.25×–49.07×",
  },
];

/** Rows in alphabetical order of case, then by size. */
const CORE: Row[] = [
  {
    case: "10 classes: macro F1",
    n: "1,000",
    reference: "scikit-learn",
    evalsuite: "0.101",
    ref: "1.342",
    speedup: "13.25×",
    memEs: "0.05",
    memRef: "0.03",
    diff: "0",
  },
  {
    case: "10 classes: macro F1",
    n: "100,000",
    reference: "scikit-learn",
    evalsuite: "2.995",
    ref: "15.218",
    speedup: "5.08×",
    memEs: "3.05",
    memRef: "2.18",
    diff: "0",
  },
  {
    case: "10 classes: macro F1",
    n: "1,000,000",
    reference: "scikit-learn",
    evalsuite: "23.809",
    ref: "135.515",
    speedup: "5.69×",
    memEs: "30.52",
    memRef: "21.79",
    diff: "0",
  },
  {
    case: "Binary: 8 label metrics via evaluate()",
    n: "1,000",
    reference: "scikit-learn",
    evalsuite: "0.256",
    ref: "9.178",
    speedup: "35.87×",
    memEs: "0.05",
    memRef: "0.05",
    diff: "0",
  },
  {
    case: "Binary: 8 label metrics via evaluate()",
    n: "100,000",
    reference: "scikit-learn",
    evalsuite: "2.350",
    ref: "115.325",
    speedup: "49.07×",
    memEs: "3.21",
    memRef: "3.07",
    diff: "0",
  },
  {
    case: "Binary: 8 label metrics via evaluate()",
    n: "1,000,000",
    reference: "scikit-learn",
    evalsuite: "28.459",
    ref: "1023.820",
    speedup: "35.98×",
    memEs: "31.54",
    memRef: "30.53",
    diff: "0",
  },
  {
    case: "Binary: ROC AUC",
    n: "1,000",
    reference: "scikit-learn",
    evalsuite: "0.167",
    ref: "1.460",
    speedup: "8.73×",
    memEs: "0.09",
    memRef: "0.08",
    diff: "1.1e-16",
  },
  {
    case: "Binary: ROC AUC",
    n: "100,000",
    reference: "scikit-learn",
    evalsuite: "17.642",
    ref: "27.624",
    speedup: "1.57×",
    memEs: "9.16",
    memRef: "7.64",
    diff: "0",
  },
  {
    case: "Binary: ROC AUC",
    n: "1,000,000",
    reference: "scikit-learn",
    evalsuite: "187.361",
    ref: "327.279",
    speedup: "1.75×",
    memEs: "91.56",
    memRef: "76.30",
    diff: "0",
  },
  {
    case: "Regression: MAE, MSE, RMSE, R² via evaluate()",
    n: "1,000",
    reference: "scikit-learn",
    evalsuite: "0.095",
    ref: "0.650",
    speedup: "6.85×",
    memEs: "0.03",
    memRef: "0.02",
    diff: "0",
  },
  {
    case: "Regression: MAE, MSE, RMSE, R² via evaluate()",
    n: "100,000",
    reference: "scikit-learn",
    evalsuite: "1.912",
    ref: "1.763",
    speedup: "0.92×",
    memEs: "2.29",
    memRef: "1.53",
    diff: "0",
  },
  {
    case: "Regression: MAE, MSE, RMSE, R² via evaluate()",
    n: "1,000,000",
    reference: "scikit-learn",
    evalsuite: "22.854",
    ref: "10.633",
    speedup: "0.47×",
    memEs: "22.89",
    memRef: "15.26",
    diff: "0",
  },
];

const CLINICAL: Row[] = [
  {
    case: "Calibration: slope and intercept",
    n: "1,000",
    reference: "statsmodels",
    evalsuite: "0.559",
    ref: "2.578",
    speedup: "4.61×",
    memEs: "0.10",
    memRef: "0.60",
    diff: "2.8e-16",
  },
  {
    case: "Calibration: slope and intercept",
    n: "100,000",
    reference: "statsmodels",
    evalsuite: "15.730",
    ref: "115.193",
    speedup: "7.32×",
    memEs: "8.46",
    memRef: "58.00",
    diff: "5.6e-17",
  },
  {
    case: "Calibration: slope and intercept",
    n: "1,000,000",
    reference: "statsmodels",
    evalsuite: "205.659",
    ref: "1173.684",
    speedup: "5.71×",
    memEs: "83.99",
    memRef: "579.85",
    diff: "3.9e-16",
  },
  {
    case: "Clinical: diagnostic report (7 CIs)",
    n: "1,000",
    reference: "statsmodels",
    evalsuite: "0.235",
    ref: "0.523",
    speedup: "2.23×",
    memEs: "0.05",
    memRef: "0.01",
    diff: "1.1e-14",
  },
  {
    case: "Clinical: diagnostic report (7 CIs)",
    n: "100,000",
    reference: "statsmodels",
    evalsuite: "1.951",
    ref: "1.602",
    speedup: "0.82×",
    memEs: "3.05",
    memRef: "0.29",
    diff: "7.1e-15",
  },
  {
    case: "Clinical: diagnostic report (7 CIs)",
    n: "1,000,000",
    reference: "statsmodels",
    evalsuite: "19.570",
    ref: "4.878",
    speedup: "0.25×",
    memEs: "30.52",
    memRef: "1.91",
    diff: "7.1e-15",
  },
  {
    case: "Clinical: sensitivity, specificity, LR+, LR−",
    n: "1,000",
    reference: "scikit-learn",
    evalsuite: "0.309",
    ref: "3.440",
    speedup: "11.13×",
    memEs: "0.05",
    memRef: "0.03",
    diff: "4.4e-16",
  },
  {
    case: "Clinical: sensitivity, specificity, LR+, LR−",
    n: "100,000",
    reference: "scikit-learn",
    evalsuite: "6.632",
    ref: "43.403",
    speedup: "6.54×",
    memEs: "3.05",
    memRef: "2.24",
    diff: "5.6e-17",
  },
  {
    case: "Clinical: sensitivity, specificity, LR+, LR−",
    n: "1,000,000",
    reference: "scikit-learn",
    evalsuite: "75.166",
    ref: "411.527",
    speedup: "5.47×",
    memEs: "30.52",
    memRef: "22.32",
    diff: "4.4e-16",
  },
  {
    case: "Decision curve: 99 thresholds",
    n: "1,000",
    reference: "NumPy loop",
    evalsuite: "0.268",
    ref: "1.437",
    speedup: "5.36×",
    memEs: "0.07",
    memRef: "0.01",
    diff: "5.6e-17",
  },
  {
    case: "Decision curve: 99 thresholds",
    n: "100,000",
    reference: "NumPy loop",
    evalsuite: "11.350",
    ref: "15.891",
    speedup: "1.40×",
    memEs: "6.87",
    memRef: "0.29",
    diff: "5.6e-17",
  },
  {
    case: "Decision curve: 99 thresholds",
    n: "1,000,000",
    reference: "NumPy loop",
    evalsuite: "165.010",
    ref: "201.852",
    speedup: "1.22×",
    memEs: "68.67",
    memRef: "1.97",
    diff: "5.6e-17",
  },
  {
    case: "Multiple testing: Hochberg (n p-values)",
    n: "1,000",
    reference: "statsmodels",
    evalsuite: "0.045",
    ref: "0.077",
    speedup: "1.71×",
    memEs: "0.05",
    memRef: "0.05",
    diff: "0",
  },
  {
    case: "Multiple testing: Hochberg (n p-values)",
    n: "100,000",
    reference: "statsmodels",
    evalsuite: "4.867",
    ref: "4.675",
    speedup: "0.96×",
    memEs: "4.58",
    memRef: "3.97",
    diff: "0",
  },
  {
    case: "Multiple testing: Hochberg (n p-values)",
    n: "1,000,000",
    reference: "statsmodels",
    evalsuite: "72.148",
    ref: "78.964",
    speedup: "1.09×",
    memEs: "45.78",
    memRef: "39.17",
    diff: "0",
  },
  {
    case: "Statistics: Cramér's V (5×5 table)",
    n: "1,000",
    reference: "SciPy",
    evalsuite: "0.259",
    ref: "0.409",
    speedup: "1.58×",
    memEs: "0.00",
    memRef: "0.00",
    diff: "0",
  },
  {
    case: "Statistics: Cramér's V (5×5 table)",
    n: "100,000",
    reference: "SciPy",
    evalsuite: "0.259",
    ref: "0.275",
    speedup: "1.07×",
    memEs: "0.00",
    memRef: "0.00",
    diff: "0",
  },
  {
    case: "Statistics: Cramér's V (5×5 table)",
    n: "1,000,000",
    reference: "SciPy",
    evalsuite: "0.231",
    ref: "0.232",
    speedup: "1.00×",
    memEs: "0.00",
    memRef: "0.00",
    diff: "0",
  },
  {
    case: "Statistics: Mann–Whitney U",
    n: "1,000",
    reference: "SciPy",
    evalsuite: "0.640",
    ref: "0.564",
    speedup: "0.88×",
    memEs: "0.16",
    memRef: "0.14",
    diff: "0",
  },
  {
    case: "Statistics: Mann–Whitney U",
    n: "100,000",
    reference: "SciPy",
    evalsuite: "33.722",
    ref: "38.490",
    speedup: "1.14×",
    memEs: "15.45",
    memRef: "13.93",
    diff: "0",
  },
  {
    case: "Statistics: Mann–Whitney U",
    n: "1,000,000",
    reference: "SciPy",
    evalsuite: "353.520",
    ref: "340.573",
    speedup: "0.96×",
    memEs: "154.50",
    memRef: "139.24",
    diff: "0",
  },
  {
    case: "Statistics: Welch t-test",
    n: "1,000",
    reference: "SciPy",
    evalsuite: "0.821",
    ref: "0.987",
    speedup: "1.20×",
    memEs: "0.04",
    memRef: "0.02",
    diff: "0",
  },
  {
    case: "Statistics: Welch t-test",
    n: "100,000",
    reference: "SciPy",
    evalsuite: "2.097",
    ref: "1.382",
    speedup: "0.66×",
    memEs: "3.06",
    memRef: "1.53",
    diff: "0",
  },
  {
    case: "Statistics: Welch t-test",
    n: "1,000,000",
    reference: "SciPy",
    evalsuite: "16.124",
    ref: "8.349",
    speedup: "0.52×",
    memEs: "30.52",
    memRef: "15.26",
    diff: "0",
  },
];

const VISION: Row[] = [
  {
    case: "Detection: COCO evaluation (10 images)",
    n: "1,000",
    reference: "pycocotools",
    evalsuite: "13.097",
    ref: "21.589",
    speedup: "1.65×",
    memEs: "0.54",
    memRef: "1.33",
    diff: "0",
  },
  {
    case: "Detection: COCO evaluation (100 images)",
    n: "100,000",
    reference: "pycocotools",
    evalsuite: "102.270",
    ref: "93.783",
    speedup: "0.92×",
    memEs: "1.15",
    memRef: "4.29",
    diff: "0",
  },
  {
    case: "Detection: COCO evaluation (1000 images)",
    n: "1,000,000",
    reference: "pycocotools",
    evalsuite: "838.714",
    ref: "848.551",
    speedup: "1.01×",
    memEs: "6.92",
    memRef: "34.02",
    diff: "0",
  },
  {
    case: "Segmentation: Dice and IoU per class (n = pixels)",
    n: "1,000",
    reference: "scikit-learn",
    evalsuite: "0.314",
    ref: "2.882",
    speedup: "9.19×",
    memEs: "0.16",
    memRef: "0.10",
    diff: "0",
  },
  {
    case: "Segmentation: Dice and IoU per class (n = pixels)",
    n: "100,000",
    reference: "scikit-learn",
    evalsuite: "3.864",
    ref: "40.162",
    speedup: "10.39×",
    memEs: "0.17",
    memRef: "2.32",
    diff: "0",
  },
  {
    case: "Segmentation: Dice and IoU per class (n = pixels)",
    n: "1,000,000",
    reference: "scikit-learn",
    evalsuite: "34.283",
    ref: "256.019",
    speedup: "7.47×",
    memEs: "0.25",
    memRef: "23.48",
    diff: "0",
  },
  {
    case: "Segmentation: Hausdorff distance (1 image)",
    n: "1,000",
    reference: "SciPy",
    evalsuite: "0.515",
    ref: "0.397",
    speedup: "0.77×",
    memEs: "0.15",
    memRef: "0.03",
    diff: "0",
  },
  {
    case: "Segmentation: Hausdorff distance (24 images)",
    n: "100,000",
    reference: "SciPy",
    evalsuite: "21.556",
    ref: "13.741",
    speedup: "0.64×",
    memEs: "0.15",
    memRef: "0.03",
    diff: "0",
  },
  {
    case: "Segmentation: Hausdorff distance (50 images)",
    n: "1,000,000",
    reference: "SciPy",
    evalsuite: "24.165",
    ref: "19.832",
    speedup: "0.82×",
    memEs: "0.15",
    memRef: "0.03",
    diff: "0",
  },
];

const LLM: Row[] = [
  {
    case: "Agreement: Krippendorff's alpha, interval (4 raters × 10 items)",
    n: "1,000",
    reference: "krippendorff",
    evalsuite: "0.049",
    ref: "0.045",
    speedup: "0.92×",
    memEs: "0.01",
    memRef: "0.01",
    diff: "0",
  },
  {
    case: "Agreement: Krippendorff's alpha, interval (4 raters × 1000 items)",
    n: "100,000",
    reference: "krippendorff",
    evalsuite: "0.412",
    ref: "0.387",
    speedup: "0.94×",
    memEs: "0.26",
    memRef: "0.69",
    diff: "3.3e-15",
  },
  {
    case: "Agreement: Krippendorff's alpha, interval (4 raters × 10000 items)",
    n: "1,000,000",
    reference: "krippendorff",
    evalsuite: "3.511",
    ref: "3.372",
    speedup: "0.96×",
    memEs: "2.26",
    memRef: "6.32",
    diff: "1.8e-14",
  },
  {
    case: "Retrieval: MRR, MAP@20, NDCG@10 (10 queries)",
    n: "1,000",
    reference: "ranx",
    evalsuite: "0.182",
    ref: "1.407",
    speedup: "7.72×",
    memEs: "0.01",
    memRef: "0.04",
    diff: "0",
  },
  {
    case: "Retrieval: MRR, MAP@20, NDCG@10 (1000 queries)",
    n: "100,000",
    reference: "ranx",
    evalsuite: "29.821",
    ref: "77.001",
    speedup: "2.58×",
    memEs: "0.49",
    memRef: "3.12",
    diff: "0",
  },
  {
    case: "Retrieval: MRR, MAP@20, NDCG@10 (10000 queries)",
    n: "1,000,000",
    reference: "ranx",
    evalsuite: "170.388",
    ref: "861.009",
    speedup: "5.05×",
    memEs: "5.36",
    memRef: "31.01",
    diff: "6.9e-18",
  },
  {
    case: "Structured: JSON Schema compliance (10 documents)",
    n: "1,000",
    reference: "jsonschema",
    evalsuite: "0.157",
    ref: "0.421",
    speedup: "2.67×",
    memEs: "0.00",
    memRef: "0.00",
    diff: "0",
  },
  {
    case: "Structured: JSON Schema compliance (1000 documents)",
    n: "100,000",
    reference: "jsonschema",
    evalsuite: "14.393",
    ref: "33.995",
    speedup: "2.36×",
    memEs: "0.05",
    memRef: "0.02",
    diff: "0",
  },
  {
    case: "Structured: JSON Schema compliance (10000 documents)",
    n: "1,000,000",
    reference: "jsonschema",
    evalsuite: "144.622",
    ref: "330.462",
    speedup: "2.29×",
    memEs: "0.50",
    memRef: "0.16",
    diff: "0",
  },
  {
    case: "Text: corpus BLEU and chrF (10 sentences)",
    n: "1,000",
    reference: "sacreBLEU",
    evalsuite: "2.206",
    ref: "1.960",
    speedup: "0.89×",
    memEs: "0.10",
    memRef: "0.22",
    diff: "1.4e-14",
  },
  {
    case: "Text: corpus BLEU and chrF (1000 sentences)",
    n: "100,000",
    reference: "sacreBLEU",
    evalsuite: "255.898",
    ref: "250.494",
    speedup: "0.98×",
    memEs: "0.74",
    memRef: "21.91",
    diff: "1.4e-14",
  },
  {
    case: "Text: corpus BLEU and chrF (10000 sentences)",
    n: "1,000,000",
    reference: "sacreBLEU",
    evalsuite: "2789.790",
    ref: "3051.755",
    speedup: "1.09×",
    memEs: "7.26",
    memRef: "210.17",
    diff: "0",
  },
  {
    case: "Text: METEOR, exact and stem matches (10 sentences)",
    n: "1,000",
    reference: "NLTK",
    evalsuite: "0.459",
    ref: "0.501",
    speedup: "1.09×",
    memEs: "0.01",
    memRef: "0.01",
    diff: "0",
  },
  {
    case: "Text: METEOR, exact and stem matches (1000 sentences)",
    n: "100,000",
    reference: "NLTK",
    evalsuite: "52.275",
    ref: "58.965",
    speedup: "1.13×",
    memEs: "0.12",
    memRef: "0.04",
    diff: "0",
  },
  {
    case: "Text: METEOR, exact and stem matches (10000 sentences)",
    n: "1,000,000",
    reference: "NLTK",
    evalsuite: "488.126",
    ref: "626.693",
    speedup: "1.28×",
    memEs: "1.15",
    memRef: "0.39",
    diff: "0",
  },
  {
    case: "Text: ROUGE-1, ROUGE-2, ROUGE-L (10 sentences)",
    n: "1,000",
    reference: "rouge-score",
    evalsuite: "1.145",
    ref: "0.947",
    speedup: "0.83×",
    memEs: "0.01",
    memRef: "0.01",
    diff: "0",
  },
  {
    case: "Text: ROUGE-1, ROUGE-2, ROUGE-L (1000 sentences)",
    n: "100,000",
    reference: "rouge-score",
    evalsuite: "120.724",
    ref: "111.884",
    speedup: "0.93×",
    memEs: "0.12",
    memRef: "0.64",
    diff: "0",
  },
  {
    case: "Text: ROUGE-1, ROUGE-2, ROUGE-L (10000 sentences)",
    n: "1,000,000",
    reference: "rouge-score",
    evalsuite: "1290.112",
    ref: "1095.609",
    speedup: "0.85×",
    memEs: "1.16",
    memRef: "6.55",
    diff: "0",
  },
];

const COLUMNS = [
  "Case",
  "n",
  "Reference",
  "EvalSuite (ms)",
  "Reference (ms)",
  "Speed-up",
  "EvalSuite peak (MiB)",
  "Reference peak (MiB)",
  "Max |difference|",
];

const SIZES = ["1,000", "100,000", "1,000,000"] as const;
const num = (n: string) => Number(n.replace(/,/g, ""));

/** Rows ordered alphabetically by case, then by size. */
function sortRows(rows: Row[]): Row[] {
  return [...rows].sort(
    (a, b) => a.case.localeCompare(b.case, "en", { sensitivity: "base" }) || num(a.n) - num(b.n),
  );
}

type OverallRow = {
  case: string;
  release: string;
  reference: string;
  speedups: Record<string, string>;
  diff: string;
};

/** One row per case across every release, alphabetical, with the speed-up at each size. */
function overallRows(): OverallRow[] {
  const groups: Array<[string, Row[]]> = [
    ["v0.1", CORE],
    ["v0.2", CLINICAL],
    ["v0.3", VISION],
    ["v0.4", LLM],
  ];
  const byCase = new Map<string, OverallRow>();
  for (const [release, rows] of groups) {
    for (const r of rows) {
      const key = r.case.replace(/\s*\(\d+ images?\)$/, "");
      const row = byCase.get(key) ?? {
        case: key,
        release,
        reference: r.reference,
        speedups: {},
        diff: "0",
      };
      row.speedups[r.n] = r.speedup;
      if (Number(r.diff) > Number(row.diff)) row.diff = r.diff;
      byCase.set(key, row);
    }
  }
  return [...byCase.values()].sort((a, b) =>
    a.case.localeCompare(b.case, "en", { sensitivity: "base" }),
  );
}

function SuiteSummaryTable() {
  const cols = [
    "Suite",
    "Cases",
    "Measurements",
    "Match reference",
    "EvalSuite faster",
    "Geometric-mean speed-up",
    "Range",
  ];
  return (
    <div className="mt-8 overflow-x-auto rounded-lg border border-border">
      <table className="w-full min-w-[900px] text-sm">
        <caption className="border-b border-border-subtle px-4 py-3 text-left">
          <span className="font-semibold">Overall benchmark</span>
          <span className="ml-2 text-muted-foreground">
            per suite and in total, across 1,000 / 100,000 / 1,000,000 samples
          </span>
        </caption>
        <thead className="bg-surface-muted/70 text-left">
          <tr>
            {cols.map((c, i) => (
              <th
                key={c}
                scope="col"
                className={`px-4 py-2.5 font-semibold ${i === 0 ? "" : "text-right"}`}
              >
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {SUITE_SUMMARY.map((r) => {
            const total = r.suite === "Overall";
            return (
              <tr
                key={r.suite}
                className={`border-t border-border-subtle ${total ? "bg-surface-muted/40 font-semibold" : ""}`}
              >
                <th scope="row" className="px-4 py-2 text-left font-medium">
                  {total ? "All suites" : r.suite}
                </th>
                <td className="px-4 py-2 text-right tabular-nums">{r.cases}</td>
                <td className="px-4 py-2 text-right tabular-nums">{r.rows}</td>
                <td className="px-4 py-2 text-right tabular-nums">{r.match}</td>
                <td className="px-4 py-2 text-right tabular-nums">{r.faster}</td>
                <td className="px-4 py-2 text-right font-semibold tabular-nums text-primary">
                  {r.geomean}
                </td>
                <td className="px-4 py-2 text-right tabular-nums">{r.range}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function OverallTable() {
  const rows = overallRows();
  const all = [...CORE, ...CLINICAL, ...VISION];
  const faster = all.filter((r) => Number(r.speedup.replace("×", "")) >= 1).length;
  return (
    <div className="mt-8 overflow-x-auto rounded-lg border border-border">
      <table className="w-full min-w-[900px] text-sm">
        <caption className="border-b border-border-subtle px-4 py-3 text-left">
          <span className="font-semibold">Overall: every case, all releases</span>
          <span className="ml-2 text-muted-foreground">
            {rows.length} cases, {all.length} measurements; all agree with the reference; EvalSuite
            is faster in {faster} of {all.length}
          </span>
        </caption>
        <thead className="bg-surface-muted/70 text-left">
          <tr>
            <th scope="col" className="px-4 py-2.5 font-semibold">
              Case
            </th>
            <th scope="col" className="px-4 py-2.5 font-semibold">
              Release
            </th>
            <th scope="col" className="px-4 py-2.5 font-semibold">
              Reference
            </th>
            {SIZES.map((n) => (
              <th key={n} scope="col" className="px-4 py-2.5 text-right font-semibold">
                Speed-up, n = {n}
              </th>
            ))}
            <th scope="col" className="px-4 py-2.5 text-right font-semibold">
              Max |difference|
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.case} className="border-t border-border-subtle">
              <th scope="row" className="px-4 py-2 text-left font-medium">
                {r.case}
              </th>
              <td className="px-4 py-2">{r.release}</td>
              <td className="px-4 py-2">{r.reference}</td>
              {SIZES.map((n) => {
                const v = r.speedups[n];
                const fast = v ? Number(v.replace("×", "")) >= 1 : false;
                return (
                  <td
                    key={n}
                    className={`px-4 py-2 text-right font-semibold tabular-nums ${fast ? "text-primary" : "text-muted-foreground"}`}
                  >
                    {v ?? "–"}
                  </td>
                );
              })}
              <td className="px-4 py-2 text-right tabular-nums text-muted-foreground">{r.diff}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ResultsTable({ caption, rows }: { caption: string; rows: Row[] }) {
  return (
    <div className="mt-8 overflow-x-auto rounded-lg border border-border">
      <table className="w-full min-w-[1000px] text-sm">
        <caption className="border-b border-border-subtle px-4 py-3 text-left font-semibold">
          {caption}
        </caption>
        <thead className="bg-surface-muted/70 text-left">
          <tr>
            {COLUMNS.map((c, i) => (
              <th
                key={c}
                scope="col"
                className={`px-4 py-2.5 font-semibold ${i === 0 || i === 2 ? "" : "text-right"}`}
              >
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortRows(rows).map((r) => (
            <tr key={`${r.case}-${r.n}`} className="border-t border-border-subtle">
              <th scope="row" className="px-4 py-2 text-left font-medium">
                {r.case}
              </th>
              <td className="px-4 py-2 text-right tabular-nums">{r.n}</td>
              <td className="px-4 py-2">{r.reference}</td>
              <td className="px-4 py-2 text-right tabular-nums">{r.evalsuite}</td>
              <td className="px-4 py-2 text-right tabular-nums">{r.ref}</td>
              <td className="px-4 py-2 text-right font-semibold tabular-nums">{r.speedup}</td>
              <td className="px-4 py-2 text-right tabular-nums">{r.memEs}</td>
              <td className="px-4 py-2 text-right tabular-nums">{r.memRef}</td>
              <td className="px-4 py-2 text-right tabular-nums text-muted-foreground">{r.diff}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function BenchmarksPage() {
  return (
    <>
      <PageHeader
        title="Benchmarks"
        meta={<StatusBadge status="implemented" label="v0.5.0 results" />}
      >
        Speed and peak memory of EvalSuite against reference implementations (scikit-learn,
        statsmodels, SciPy, pycocotools, sacreBLEU, rouge-score, NLTK, ranx, krippendorff,
        jsonschema, choix, POT, pycocoevalcap, radon), computing the same quantities on the same
        data. Every one of the {METRIC_BENCHMARK_COUNT} metrics and statistics functions has its own
        row below, and every compared result agrees with the reference to floating-point rounding.
      </PageHeader>
      <div className="mx-auto max-w-[1680px] px-4 sm:px-6">
        <Callout title="Environment">
          <p>
            Per-metric tables: EvalSuite 0.5.0, Python 3.13, NumPy 2.5.3, SciPy 1.18.1, scikit-learn
            1.9.1, statsmodels 0.15.0, pycocotools 2.0.11, Linux x86_64. Workload suites (1,000 /
            100,000 / 1,000,000 samples): EvalSuite 0.4.0, Python 3.12.3. Fastest of 5 runs after a
            warm-up; peak memory measured with <code>tracemalloc</code>. Speed-up above 1 means
            EvalSuite is faster. Each row names the reference implementation it is compared with.
            The same results (every answer matching the reference) were reproduced on Windows with
            Python 3.14.
          </p>
        </Callout>

        <MetricBenchmarkSummaryTable />
        <SuiteSummaryTable />
        <OverallTable />

        <ResultsTable
          caption="Classification and regression (v0.1) against scikit-learn"
          rows={CORE}
        />
        <ResultsTable
          caption="Clinical, calibration and statistics (v0.2) against scikit-learn, statsmodels, SciPy"
          rows={CLINICAL}
        />
        <ResultsTable
          caption="Segmentation and object detection (v0.3) against scikit-learn, SciPy, pycocotools"
          rows={VISION}
        />
        <ResultsTable
          caption="LLM evaluation (v0.4) against sacreBLEU, rouge-score, NLTK, ranx, krippendorff, jsonschema"
          rows={LLM}
        />

        <Section title="Every metric, one by one">
          <p>
            Each metric is timed on its own at 10,000 and 100,000 samples (n / 100 examples for
            text, retrieval, RAG, judge and structured-output metrics; n / 1000 for BERTScore,
            MoverScore, MAUVE and detection images). Where a reference library exists it is timed on
            the same data; otherwise EvalSuite is checked against an independent textbook formula in
            NumPy or the Python standard library. A bare formula skips input validation, so it is a
            correctness check and a lower bound on time, not a competitor. Learned, judge-dependent
            and randomised procedures (bootstrap, MAUVE, model_score) are timed alone. The v0.5.0
            LLM-systems metrics (safety, robustness, uncertainty, agents, multilingual, code, long
            context, efficiency) are checked against SciPy, scikit-learn, jsonschema, radon and the
            codebleu package&apos;s n-gram terms where those apply. Metric names link to their
            documentation.
          </p>
        </Section>
        <MetricBenchmarkTables />

        <Section title="Reading the results">
          <p>
            <strong>Many metrics at once is where EvalSuite is fastest.</strong>{" "}
            <code>evaluate()</code> validates the inputs once and builds the confusion matrix once,
            then derives all eight label metrics from it: 36–49× faster than eight separate
            scikit-learn calls. Sensitivity, specificity and both likelihood ratios together are
            5–11× faster.
          </p>
          <p>
            <strong>Calibration slope and intercept</strong> are 5–6× faster than statsmodels&apos;
            GLM and use far less memory (84 MiB against 580 MiB at a million samples), because
            EvalSuite fits the two small logistic models with a dedicated Newton–Raphson solver.
          </p>
          <p>
            <strong>Object detection matches pycocotools exactly</strong> on all twelve COCO numbers
            and is 0.9–1.6× as fast, using a fifth of its memory. Per-class Dice and IoU are 7–10×
            faster than building scikit-learn&apos;s confusion matrix. Hausdorff distance (0.6–0.8×)
            extracts surfaces and computes HD95 and ASSD alongside the maximum that SciPy returns.
          </p>
          <p>
            <strong>LLM metrics give the reference libraries&apos; numbers</strong> and run at about
            their speed: corpus BLEU and chrF 0.89–1.09× sacreBLEU, ROUGE 0.8–0.9× rouge-score,
            METEOR 1.09–1.28× NLTK, ranking metrics 2.6–7.7× ranx, JSON Schema compliance 2.3–2.7×
            jsonschema and Krippendorff&apos;s alpha 0.9–1.0× the krippendorff package.
          </p>
          <p>
            <strong>Hypothesis tests call SciPy</strong> for the statistic and p-value, so they
            match its speed at best. The Welch t-test is about half SciPy&apos;s speed at large n
            because EvalSuite also validates the inputs and computes the confidence interval and
            Cohen&apos;s d.
          </p>
          <p>
            <strong>Some rows are slower, and we show them.</strong> The diagnostic report (0.2–2.2×
            across sizes) validates labels and reports ten measures, where the reference computes
            seven intervals from counts it takes directly. Regression on a million values (0.5×)
            spends most of its ~20 ms checking every value for NaN, infinity, shape and dtype.
          </p>
        </Section>
        <Section title="Reproduce on your machine">
          <pre className="overflow-x-auto rounded-lg border border-border bg-surface-muted/50 p-4 text-sm">
            <code>{`pip install "evalsuite-python[llm]" scikit-learn statsmodels pycocotools sacrebleu rouge-score ranx krippendorff jsonschema choix pot pycocoevalcap radon
evalsuite benchmark                    # every case at 1,000 / 100,000 / 1,000,000 samples
evalsuite benchmark --suite clinical   # only the v0.2 clinical, calibration and statistics cases
evalsuite benchmark --suite vision     # only the v0.3 segmentation and detection cases
evalsuite benchmark --suite llm        # only the v0.4 LLM cases
evalsuite benchmark --suite metrics --sizes 10000 100000   # one row per metric (all ${METRIC_BENCHMARK_COUNT})
evalsuite benchmark --quick            # small sizes only`}</code>
          </pre>
          <p>
            The full table and notes are in <code>BENCHMARKS.md</code> in the package repository.
            Results on your hardware will differ in absolute time; the ratios are what to compare.
          </p>
        </Section>
      </div>
    </>
  );
}
