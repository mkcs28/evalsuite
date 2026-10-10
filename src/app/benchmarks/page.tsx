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

/** From BENCHMARKS.md in the package repository (evalsuite benchmark, EvalSuite 0.5.0, fastest of 5 runs). */
const SUITE_SUMMARY: SuiteSummary[] = [
  {
    suite: "Classification and regression",
    cases: 4,
    rows: 12,
    match: "12/12",
    faster: "10/12",
    geomean: "5.47×",
    range: "0.73×–34.25×",
  },
  {
    suite: "Clinical, calibration and statistics",
    cases: 8,
    rows: 24,
    match: "24/24",
    faster: "12/24",
    geomean: "1.48×",
    range: "0.22×–10.70×",
  },
  {
    suite: "LLM evaluation",
    cases: 6,
    rows: 18,
    match: "18/18",
    faster: "12/18",
    geomean: "1.49×",
    range: "0.76×–7.12×",
  },
  {
    suite: "Segmentation and object detection",
    cases: 3,
    rows: 9,
    match: "9/9",
    faster: "5/9",
    geomean: "1.80×",
    range: "0.52×–16.30×",
  },
  {
    suite: "Overall",
    cases: 21,
    rows: 63,
    match: "63/63",
    faster: "39/63",
    geomean: "1.96×",
    range: "0.22×–34.25×",
  },
];

/** Rows in alphabetical order of case, then by size. */
const CORE: Row[] = [
  {
    case: "10 classes: macro F1",
    n: "1,000",
    reference: "scikit-learn",
    evalsuite: "0.165",
    ref: "2.986",
    speedup: "18.11×",
    memEs: "0.05",
    memRef: "0.03",
    diff: "0",
  },
  {
    case: "10 classes: macro F1",
    n: "100,000",
    reference: "scikit-learn",
    evalsuite: "2.758",
    ref: "16.377",
    speedup: "5.94×",
    memEs: "4.58",
    memRef: "2.18",
    diff: "0",
  },
  {
    case: "10 classes: macro F1",
    n: "1,000,000",
    reference: "scikit-learn",
    evalsuite: "51.102",
    ref: "143.342",
    speedup: "2.81×",
    memEs: "45.78",
    memRef: "21.79",
    diff: "0",
  },
  {
    case: "binary: 8 label metrics via evaluate()",
    n: "1,000",
    reference: "scikit-learn",
    evalsuite: "0.425",
    ref: "12.093",
    speedup: "28.46×",
    memEs: "0.05",
    memRef: "0.05",
    diff: "0",
  },
  {
    case: "binary: 8 label metrics via evaluate()",
    n: "100,000",
    reference: "scikit-learn",
    evalsuite: "3.486",
    ref: "119.405",
    speedup: "34.25×",
    memEs: "4.58",
    memRef: "3.07",
    diff: "0",
  },
  {
    case: "binary: 8 label metrics via evaluate()",
    n: "1,000,000",
    reference: "scikit-learn",
    evalsuite: "50.533",
    ref: "1064.186",
    speedup: "21.06×",
    memEs: "45.78",
    memRef: "30.53",
    diff: "0",
  },
  {
    case: "binary: ROC AUC",
    n: "1,000",
    reference: "scikit-learn",
    evalsuite: "0.205",
    ref: "1.840",
    speedup: "8.99×",
    memEs: "0.09",
    memRef: "0.08",
    diff: "1.1e-16",
  },
  {
    case: "binary: ROC AUC",
    n: "100,000",
    reference: "scikit-learn",
    evalsuite: "18.177",
    ref: "35.541",
    speedup: "1.96×",
    memEs: "9.16",
    memRef: "7.64",
    diff: "0",
  },
  {
    case: "binary: ROC AUC",
    n: "1,000,000",
    reference: "scikit-learn",
    evalsuite: "230.026",
    ref: "358.746",
    speedup: "1.56×",
    memEs: "91.56",
    memRef: "76.30",
    diff: "0",
  },
  {
    case: "regression: MAE, MSE, RMSE, R² via evaluate()",
    n: "1,000",
    reference: "scikit-learn",
    evalsuite: "0.130",
    ref: "0.861",
    speedup: "6.61×",
    memEs: "0.03",
    memRef: "0.02",
    diff: "0",
  },
  {
    case: "regression: MAE, MSE, RMSE, R² via evaluate()",
    n: "100,000",
    reference: "scikit-learn",
    evalsuite: "2.342",
    ref: "2.050",
    speedup: "0.88×",
    memEs: "3.05",
    memRef: "1.53",
    diff: "0",
  },
  {
    case: "regression: MAE, MSE, RMSE, R² via evaluate()",
    n: "1,000,000",
    reference: "scikit-learn",
    evalsuite: "34.612",
    ref: "25.286",
    speedup: "0.73×",
    memEs: "30.52",
    memRef: "15.26",
    diff: "0",
  },
];

const CLINICAL: Row[] = [
  {
    case: "calibration: slope and intercept",
    n: "1,000",
    reference: "statsmodels",
    evalsuite: "0.895",
    ref: "4.116",
    speedup: "4.60×",
    memEs: "0.10",
    memRef: "0.60",
    diff: "2.8e-16",
  },
  {
    case: "calibration: slope and intercept",
    n: "100,000",
    reference: "statsmodels",
    evalsuite: "27.871",
    ref: "142.556",
    speedup: "5.11×",
    memEs: "8.46",
    memRef: "58.06",
    diff: "5.6e-17",
  },
  {
    case: "calibration: slope and intercept",
    n: "1,000,000",
    reference: "statsmodels",
    evalsuite: "368.332",
    ref: "1542.430",
    speedup: "4.19×",
    memEs: "83.99",
    memRef: "579.91",
    diff: "3.9e-16",
  },
  {
    case: "clinical: diagnostic report (7 CIs)",
    n: "1,000",
    reference: "statsmodels",
    evalsuite: "0.183",
    ref: "0.750",
    speedup: "4.11×",
    memEs: "0.05",
    memRef: "0.01",
    diff: "1.1e-14",
  },
  {
    case: "clinical: diagnostic report (7 CIs)",
    n: "100,000",
    reference: "statsmodels",
    evalsuite: "2.701",
    ref: "1.309",
    speedup: "0.48×",
    memEs: "4.58",
    memRef: "0.29",
    diff: "7.1e-15",
  },
  {
    case: "clinical: diagnostic report (7 CIs)",
    n: "1,000,000",
    reference: "statsmodels",
    evalsuite: "39.512",
    ref: "8.589",
    speedup: "0.22×",
    memEs: "45.78",
    memRef: "2.86",
    diff: "7.1e-15",
  },
  {
    case: "clinical: sensitivity, specificity, LR+, LR−",
    n: "1,000",
    reference: "scikit-learn",
    evalsuite: "0.482",
    ref: "5.161",
    speedup: "10.70×",
    memEs: "0.05",
    memRef: "0.03",
    diff: "4.4e-16",
  },
  {
    case: "clinical: sensitivity, specificity, LR+, LR−",
    n: "100,000",
    reference: "scikit-learn",
    evalsuite: "9.009",
    ref: "48.479",
    speedup: "5.38×",
    memEs: "4.58",
    memRef: "2.24",
    diff: "5.6e-17",
  },
  {
    case: "clinical: sensitivity, specificity, LR+, LR−",
    n: "1,000,000",
    reference: "scikit-learn",
    evalsuite: "165.890",
    ref: "429.832",
    speedup: "2.59×",
    memEs: "45.78",
    memRef: "22.32",
    diff: "4.4e-16",
  },
  {
    case: "decision curve: 99 thresholds",
    n: "1,000",
    reference: "NumPy loop",
    evalsuite: "0.180",
    ref: "1.304",
    speedup: "7.26×",
    memEs: "0.07",
    memRef: "0.01",
    diff: "5.6e-17",
  },
  {
    case: "decision curve: 99 thresholds",
    n: "100,000",
    reference: "NumPy loop",
    evalsuite: "13.612",
    ref: "21.027",
    speedup: "1.54×",
    memEs: "6.87",
    memRef: "0.29",
    diff: "5.6e-17",
  },
  {
    case: "decision curve: 99 thresholds",
    n: "1,000,000",
    reference: "NumPy loop",
    evalsuite: "185.581",
    ref: "320.035",
    speedup: "1.72×",
    memEs: "68.67",
    memRef: "2.86",
    diff: "5.6e-17",
  },
  {
    case: "multiple testing: Hochberg (n p-values)",
    n: "1,000",
    reference: "statsmodels",
    evalsuite: "0.054",
    ref: "0.066",
    speedup: "1.23×",
    memEs: "0.05",
    memRef: "0.05",
    diff: "0",
  },
  {
    case: "multiple testing: Hochberg (n p-values)",
    n: "100,000",
    reference: "statsmodels",
    evalsuite: "7.221",
    ref: "7.032",
    speedup: "0.97×",
    memEs: "4.58",
    memRef: "3.97",
    diff: "0",
  },
  {
    case: "multiple testing: Hochberg (n p-values)",
    n: "1,000,000",
    reference: "statsmodels",
    evalsuite: "86.589",
    ref: "101.488",
    speedup: "1.17×",
    memEs: "45.78",
    memRef: "39.17",
    diff: "0",
  },
  {
    case: "statistics: Cramér's V (5×5 table)",
    n: "1,000",
    reference: "SciPy",
    evalsuite: "0.486",
    ref: "0.351",
    speedup: "0.72×",
    memEs: "0.00",
    memRef: "0.00",
    diff: "0",
  },
  {
    case: "statistics: Cramér's V (5×5 table)",
    n: "100,000",
    reference: "SciPy",
    evalsuite: "0.446",
    ref: "0.292",
    speedup: "0.65×",
    memEs: "0.00",
    memRef: "0.00",
    diff: "0",
  },
  {
    case: "statistics: Cramér's V (5×5 table)",
    n: "1,000,000",
    reference: "SciPy",
    evalsuite: "0.347",
    ref: "0.281",
    speedup: "0.81×",
    memEs: "0.00",
    memRef: "0.00",
    diff: "0",
  },
  {
    case: "statistics: Mann–Whitney U",
    n: "1,000",
    reference: "SciPy",
    evalsuite: "0.780",
    ref: "0.728",
    speedup: "0.93×",
    memEs: "0.16",
    memRef: "0.14",
    diff: "0",
  },
  {
    case: "statistics: Mann–Whitney U",
    n: "100,000",
    reference: "SciPy",
    evalsuite: "34.689",
    ref: "33.525",
    speedup: "0.97×",
    memEs: "15.45",
    memRef: "13.93",
    diff: "0",
  },
  {
    case: "statistics: Mann–Whitney U",
    n: "1,000,000",
    reference: "SciPy",
    evalsuite: "432.602",
    ref: "411.227",
    speedup: "0.95×",
    memEs: "154.50",
    memRef: "139.24",
    diff: "0",
  },
  {
    case: "statistics: Welch t-test",
    n: "1,000",
    reference: "SciPy",
    evalsuite: "1.009",
    ref: "0.730",
    speedup: "0.72×",
    memEs: "0.04",
    memRef: "0.02",
    diff: "0",
  },
  {
    case: "statistics: Welch t-test",
    n: "100,000",
    reference: "SciPy",
    evalsuite: "2.661",
    ref: "1.624",
    speedup: "0.61×",
    memEs: "3.06",
    memRef: "1.53",
    diff: "0",
  },
  {
    case: "statistics: Welch t-test",
    n: "1,000,000",
    reference: "SciPy",
    evalsuite: "33.054",
    ref: "16.897",
    speedup: "0.51×",
    memEs: "30.52",
    memRef: "15.26",
    diff: "0",
  },
];

const VISION: Row[] = [
  {
    case: "detection: COCO evaluation (10 images)",
    n: "1,000",
    reference: "pycocotools",
    evalsuite: "35.234",
    ref: "31.895",
    speedup: "0.91×",
    memEs: "0.98",
    memRef: "1.74",
    diff: "0",
  },
  {
    case: "detection: COCO evaluation (100 images)",
    n: "100,000",
    reference: "pycocotools",
    evalsuite: "124.397",
    ref: "141.062",
    speedup: "1.13×",
    memEs: "1.48",
    memRef: "4.65",
    diff: "0",
  },
  {
    case: "detection: COCO evaluation (1000 images)",
    n: "1,000,000",
    reference: "pycocotools",
    evalsuite: "1149.007",
    ref: "1281.548",
    speedup: "1.12×",
    memEs: "6.93",
    memRef: "34.01",
    diff: "0",
  },
  {
    case: "segmentation: Dice and IoU per class (n = pixels)",
    n: "1,000",
    reference: "scikit-learn",
    evalsuite: "0.283",
    ref: "4.621",
    speedup: "16.30×",
    memEs: "0.16",
    memRef: "0.10",
    diff: "0",
  },
  {
    case: "segmentation: Dice and IoU per class (n = pixels)",
    n: "100,000",
    reference: "scikit-learn",
    evalsuite: "4.601",
    ref: "30.161",
    speedup: "6.56×",
    memEs: "0.17",
    memRef: "2.32",
    diff: "0",
  },
  {
    case: "segmentation: Dice and IoU per class (n = pixels)",
    n: "1,000,000",
    reference: "scikit-learn",
    evalsuite: "50.387",
    ref: "277.000",
    speedup: "5.50×",
    memEs: "0.25",
    memRef: "23.48",
    diff: "0",
  },
  {
    case: "segmentation: Hausdorff distance (1 image)",
    n: "1,000",
    reference: "SciPy",
    evalsuite: "0.904",
    ref: "0.469",
    speedup: "0.52×",
    memEs: "0.15",
    memRef: "0.03",
    diff: "0",
  },
  {
    case: "segmentation: Hausdorff distance (24 images)",
    n: "100,000",
    reference: "SciPy",
    evalsuite: "14.746",
    ref: "11.032",
    speedup: "0.75×",
    memEs: "0.15",
    memRef: "0.03",
    diff: "0",
  },
  {
    case: "segmentation: Hausdorff distance (50 images)",
    n: "1,000,000",
    reference: "SciPy",
    evalsuite: "31.349",
    ref: "23.751",
    speedup: "0.76×",
    memEs: "0.15",
    memRef: "0.03",
    diff: "0",
  },
];

const LLM: Row[] = [
  {
    case: "agreement: Krippendorff's alpha, interval (4 raters × 10 items)",
    n: "1,000",
    reference: "krippendorff",
    evalsuite: "0.073",
    ref: "0.071",
    speedup: "0.97×",
    memEs: "0.01",
    memRef: "0.01",
    diff: "0",
  },
  {
    case: "agreement: Krippendorff's alpha, interval (4 raters × 1000 items)",
    n: "100,000",
    reference: "krippendorff",
    evalsuite: "0.483",
    ref: "0.429",
    speedup: "0.89×",
    memEs: "0.26",
    memRef: "0.69",
    diff: "3.3e-15",
  },
  {
    case: "agreement: Krippendorff's alpha, interval (4 raters × 10000 items)",
    n: "1,000,000",
    reference: "krippendorff",
    evalsuite: "4.239",
    ref: "4.635",
    speedup: "1.09×",
    memEs: "2.26",
    memRef: "6.32",
    diff: "1.8e-14",
  },
  {
    case: "retrieval: MRR, MAP@20, NDCG@10 (10 queries)",
    n: "1,000",
    reference: "ranx",
    evalsuite: "0.267",
    ref: "1.905",
    speedup: "7.12×",
    memEs: "0.01",
    memRef: "0.04",
    diff: "0",
  },
  {
    case: "retrieval: MRR, MAP@20, NDCG@10 (1000 queries)",
    n: "100,000",
    reference: "ranx",
    evalsuite: "21.131",
    ref: "88.780",
    speedup: "4.20×",
    memEs: "0.49",
    memRef: "3.12",
    diff: "0",
  },
  {
    case: "retrieval: MRR, MAP@20, NDCG@10 (10000 queries)",
    n: "1,000,000",
    reference: "ranx",
    evalsuite: "238.795",
    ref: "887.114",
    speedup: "3.71×",
    memEs: "5.36",
    memRef: "31.01",
    diff: "6.9e-18",
  },
  {
    case: "structured: JSON Schema compliance (10 documents)",
    n: "1,000",
    reference: "jsonschema",
    evalsuite: "0.175",
    ref: "0.430",
    speedup: "2.46×",
    memEs: "0.00",
    memRef: "0.00",
    diff: "0",
  },
  {
    case: "structured: JSON Schema compliance (1000 documents)",
    n: "100,000",
    reference: "jsonschema",
    evalsuite: "15.722",
    ref: "38.814",
    speedup: "2.47×",
    memEs: "0.05",
    memRef: "0.02",
    diff: "0",
  },
  {
    case: "structured: JSON Schema compliance (10000 documents)",
    n: "1,000,000",
    reference: "jsonschema",
    evalsuite: "155.785",
    ref: "407.423",
    speedup: "2.62×",
    memEs: "0.50",
    memRef: "0.16",
    diff: "0",
  },
  {
    case: "text: corpus BLEU and chrF (10 sentences)",
    n: "1,000",
    reference: "sacreBLEU",
    evalsuite: "2.385",
    ref: "2.092",
    speedup: "0.88×",
    memEs: "0.10",
    memRef: "0.22",
    diff: "1.4e-14",
  },
  {
    case: "text: corpus BLEU and chrF (1000 sentences)",
    n: "100,000",
    reference: "sacreBLEU",
    evalsuite: "255.851",
    ref: "258.174",
    speedup: "1.01×",
    memEs: "0.74",
    memRef: "21.91",
    diff: "1.4e-14",
  },
  {
    case: "text: corpus BLEU and chrF (10000 sentences)",
    n: "1,000,000",
    reference: "sacreBLEU",
    evalsuite: "2648.800",
    ref: "2883.940",
    speedup: "1.09×",
    memEs: "7.26",
    memRef: "209.73",
    diff: "0",
  },
  {
    case: "text: METEOR, exact and stem matches (10 sentences)",
    n: "1,000",
    reference: "NLTK",
    evalsuite: "0.527",
    ref: "0.630",
    speedup: "1.19×",
    memEs: "0.01",
    memRef: "0.01",
    diff: "0",
  },
  {
    case: "text: METEOR, exact and stem matches (1000 sentences)",
    n: "100,000",
    reference: "NLTK",
    evalsuite: "51.951",
    ref: "59.396",
    speedup: "1.14×",
    memEs: "0.12",
    memRef: "0.04",
    diff: "0",
  },
  {
    case: "text: METEOR, exact and stem matches (10000 sentences)",
    n: "1,000,000",
    reference: "NLTK",
    evalsuite: "518.276",
    ref: "588.233",
    speedup: "1.13×",
    memEs: "1.15",
    memRef: "0.39",
    diff: "0",
  },
  {
    case: "text: ROUGE-1, ROUGE-2, ROUGE-L (10 sentences)",
    n: "1,000",
    reference: "rouge-score",
    evalsuite: "1.139",
    ref: "0.861",
    speedup: "0.76×",
    memEs: "0.01",
    memRef: "0.01",
    diff: "0",
  },
  {
    case: "text: ROUGE-1, ROUGE-2, ROUGE-L (1000 sentences)",
    n: "100,000",
    reference: "rouge-score",
    evalsuite: "110.958",
    ref: "95.039",
    speedup: "0.86×",
    memEs: "0.12",
    memRef: "0.64",
    diff: "0",
  },
  {
    case: "text: ROUGE-1, ROUGE-2, ROUGE-L (10000 sentences)",
    n: "1,000,000",
    reference: "rouge-score",
    evalsuite: "1158.195",
    ref: "996.263",
    speedup: "0.86×",
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

/** True when ``value`` is strictly lower (better: less time or memory) than ``other``. */
function better(value: string, other: string): boolean {
  const a = Number(value.replace(/,/g, ""));
  const b = Number(other.replace(/,/g, ""));
  return Number.isFinite(a) && Number.isFinite(b) && a < b;
}

function cellClass(highlight: boolean): string {
  return `px-4 py-2 text-right tabular-nums ${highlight ? "font-semibold text-primary" : ""}`;
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
              <td className={cellClass(better(r.evalsuite, r.ref))}>{r.evalsuite}</td>
              <td className={cellClass(better(r.ref, r.evalsuite))}>{r.ref}</td>
              <td
                className={`px-4 py-2 text-right font-semibold tabular-nums ${
                  Number(r.speedup.replace("×", "")) >= 1 ? "text-primary" : ""
                }`}
              >
                {r.speedup}
              </td>
              <td className={cellClass(better(r.memEs, r.memRef))}>{r.memEs}</td>
              <td className={cellClass(better(r.memRef, r.memEs))}>{r.memRef}</td>
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
            EvalSuite 0.5.0, Python 3.13, NumPy 2.5.3, SciPy 1.18.1, scikit-learn 1.9.1, statsmodels
            0.15.0, pycocotools 2.0.11, Linux x86_64. Fastest of 5 runs after a warm-up; peak memory
            measured with <code>tracemalloc</code>. Speed-up above 1 means EvalSuite is faster. In
            every table the better value of each pair (less time, less memory, speed-up of at least
            1×) is shown in <span className="font-semibold text-primary">purple</span>.
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
            then derives all eight label metrics from it: 21–34× faster than eight separate
            scikit-learn calls. Sensitivity, specificity and both likelihood ratios together are
            2.6–10.7× faster.
          </p>
          <p>
            <strong>Calibration slope and intercept</strong> are 4.2–5.1× faster than
            statsmodels&apos; GLM and use far less memory, because EvalSuite fits the two small
            logistic models with a dedicated Newton–Raphson solver.
          </p>
          <p>
            <strong>Object detection matches pycocotools exactly</strong> on all twelve COCO numbers
            and runs at 0.9–1.1× its speed. Per-class Dice and IoU are 5.5–16× faster than building
            scikit-learn&apos;s confusion matrix. Hausdorff distance (0.5–0.8×) extracts surfaces
            and computes HD95 and ASSD alongside the maximum that SciPy returns.
          </p>
          <p>
            <strong>LLM metrics give the reference libraries&apos; numbers</strong> and run at about
            their speed: corpus BLEU and chrF 0.88–1.09× sacreBLEU, ROUGE 0.76–0.86× rouge-score,
            METEOR 1.13–1.19× NLTK, ranking metrics 3.7–7.1× ranx, JSON Schema compliance 2.5–2.6×
            jsonschema and Krippendorff&apos;s alpha 0.89–1.09× the krippendorff package.
          </p>
          <p>
            <strong>Hypothesis tests call SciPy</strong> for the statistic and p-value, so they
            match its speed at best. The Welch t-test is 0.5–0.7× SciPy&apos;s speed because
            EvalSuite also validates the inputs and computes the confidence interval and
            Cohen&apos;s d.
          </p>
          <p>
            <strong>Some rows are slower, and we show them.</strong> The diagnostic report
            (0.22–4.1× across sizes) validates labels and reports ten measures, where the reference
            computes seven intervals from counts it takes directly. Regression at 100,000 and
            1,000,000 values (0.73–0.88×) spends most of its time checking every value for NaN,
            infinity, shape and dtype.
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
