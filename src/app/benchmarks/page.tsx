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

/** From BENCHMARKS.md in the package repository (evalsuite benchmark, EvalSuite 1.2.0, fastest of 5 runs). */
const SUITE_SUMMARY: SuiteSummary[] = [
  {
    suite: "Classification and regression",
    cases: 4,
    rows: 12,
    match: "12/12",
    faster: "12/12",
    geomean: "6.13×",
    range: "1.18×–28.36×",
  },
  {
    suite: "Clinical, calibration and statistics",
    cases: 8,
    rows: 24,
    match: "24/24",
    faster: "23/24",
    geomean: "3.72×",
    range: "0.98×–16.87×",
  },
  {
    suite: "LLM evaluation",
    cases: 6,
    rows: 18,
    match: "18/18",
    faster: "18/18",
    geomean: "4.23×",
    range: "1.15×–11.54×",
  },
  {
    suite: "LLM systems",
    cases: 6,
    rows: 18,
    match: "15/15",
    faster: "15/15",
    geomean: "2.00×",
    range: "1.11×–6.12×",
  },
  {
    suite: "Segmentation and object detection",
    cases: 3,
    rows: 9,
    match: "9/9",
    faster: "9/9",
    geomean: "5.69×",
    range: "2.07×–20.71×",
  },
  {
    suite: "Overall",
    cases: 27,
    rows: 81,
    match: "78/78",
    faster: "77/78",
    geomean: "3.86×",
    range: "0.98×–28.36×",
  },
];

/** Rows in alphabetical order of case, then by size. */
const CORE: Row[] = [
  {
    case: "10 classes: macro F1",
    n: "1,000",
    reference: "scikit-learn",
    evalsuite: "0.118",
    ref: "1.824",
    speedup: "15.45×",
    memEs: "0.02",
    memRef: "0.03",
    diff: "0",
  },
  {
    case: "10 classes: macro F1",
    n: "100,000",
    reference: "scikit-learn",
    evalsuite: "0.809",
    ref: "4.154",
    speedup: "5.13×",
    memEs: "0.77",
    memRef: "2.18",
    diff: "0",
  },
  {
    case: "10 classes: macro F1",
    n: "1,000,000",
    reference: "scikit-learn",
    evalsuite: "8.571",
    ref: "35.614",
    speedup: "4.16×",
    memEs: "7.63",
    memRef: "21.80",
    diff: "0",
  },
  {
    case: "binary: 8 label metrics via evaluate()",
    n: "1,000",
    reference: "scikit-learn",
    evalsuite: "0.300",
    ref: "8.502",
    speedup: "28.36×",
    memEs: "0.03",
    memRef: "0.05",
    diff: "0",
  },
  {
    case: "binary: 8 label metrics via evaluate()",
    n: "100,000",
    reference: "scikit-learn",
    evalsuite: "1.335",
    ref: "22.534",
    speedup: "16.88×",
    memEs: "1.69",
    memRef: "3.44",
    diff: "0",
  },
  {
    case: "binary: 8 label metrics via evaluate()",
    n: "1,000,000",
    reference: "scikit-learn",
    evalsuite: "9.198",
    ref: "171.991",
    speedup: "18.70×",
    memEs: "16.28",
    memRef: "34.34",
    diff: "0",
  },
  {
    case: "binary: ROC AUC",
    n: "1,000",
    reference: "scikit-learn",
    evalsuite: "0.113",
    ref: "2.068",
    speedup: "18.23×",
    memEs: "0.02",
    memRef: "0.08",
    diff: "1.1e-16",
  },
  {
    case: "binary: ROC AUC",
    n: "100,000",
    reference: "scikit-learn",
    evalsuite: "5.220",
    ref: "16.654",
    speedup: "3.19×",
    memEs: "1.53",
    memRef: "7.64",
    diff: "1.1e-16",
  },
  {
    case: "binary: ROC AUC",
    n: "1,000,000",
    reference: "scikit-learn",
    evalsuite: "84.029",
    ref: "211.633",
    speedup: "2.52×",
    memEs: "15.26",
    memRef: "76.30",
    diff: "1.1e-16",
  },
  {
    case: "regression: MAE, MSE, RMSE, R² via evaluate()",
    n: "1,000",
    reference: "scikit-learn",
    evalsuite: "0.298",
    ref: "0.985",
    speedup: "3.30×",
    memEs: "0.03",
    memRef: "0.02",
    diff: "0",
  },
  {
    case: "regression: MAE, MSE, RMSE, R² via evaluate()",
    n: "100,000",
    reference: "scikit-learn",
    evalsuite: "1.039",
    ref: "1.741",
    speedup: "1.68×",
    memEs: "3.05",
    memRef: "1.53",
    diff: "0",
  },
  {
    case: "regression: MAE, MSE, RMSE, R² via evaluate()",
    n: "1,000,000",
    reference: "scikit-learn",
    evalsuite: "9.671",
    ref: "11.401",
    speedup: "1.18×",
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
    evalsuite: "0.458",
    ref: "2.572",
    speedup: "5.61×",
    memEs: "0.10",
    memRef: "0.60",
    diff: "2.8e-16",
  },
  {
    case: "calibration: slope and intercept",
    n: "100,000",
    reference: "statsmodels",
    evalsuite: "18.539",
    ref: "105.561",
    speedup: "5.69×",
    memEs: "8.46",
    memRef: "58.00",
    diff: "1.1e-16",
  },
  {
    case: "calibration: slope and intercept",
    n: "1,000,000",
    reference: "statsmodels",
    evalsuite: "218.230",
    ref: "1216.973",
    speedup: "5.58×",
    memEs: "83.99",
    memRef: "579.85",
    diff: "5.6e-17",
  },
  {
    case: "clinical: diagnostic report (7 CIs)",
    n: "1,000",
    reference: "statsmodels",
    evalsuite: "0.120",
    ref: "0.527",
    speedup: "4.38×",
    memEs: "0.02",
    memRef: "0.01",
    diff: "1.1e-14",
  },
  {
    case: "clinical: diagnostic report (7 CIs)",
    n: "100,000",
    reference: "statsmodels",
    evalsuite: "0.689",
    ref: "1.522",
    speedup: "2.21×",
    memEs: "0.76",
    memRef: "0.29",
    diff: "2.5e-14",
  },
  {
    case: "clinical: diagnostic report (7 CIs)",
    n: "1,000,000",
    reference: "statsmodels",
    evalsuite: "5.533",
    ref: "6.486",
    speedup: "1.17×",
    memEs: "7.63",
    memRef: "1.91",
    diff: "1.4e-14",
  },
  {
    case: "clinical: sensitivity, specificity, LR+, LR−",
    n: "1,000",
    reference: "scikit-learn",
    evalsuite: "0.223",
    ref: "3.761",
    speedup: "16.87×",
    memEs: "0.02",
    memRef: "0.03",
    diff: "4.4e-16",
  },
  {
    case: "clinical: sensitivity, specificity, LR+, LR−",
    n: "100,000",
    reference: "scikit-learn",
    evalsuite: "2.777",
    ref: "14.151",
    speedup: "5.10×",
    memEs: "0.76",
    memRef: "2.24",
    diff: "0",
  },
  {
    case: "clinical: sensitivity, specificity, LR+, LR−",
    n: "1,000,000",
    reference: "scikit-learn",
    evalsuite: "19.540",
    ref: "76.356",
    speedup: "3.91×",
    memEs: "7.63",
    memRef: "22.32",
    diff: "1.8e-15",
  },
  {
    case: "decision curve: 99 thresholds",
    n: "1,000",
    reference: "NumPy loop",
    evalsuite: "0.129",
    ref: "0.820",
    speedup: "6.36×",
    memEs: "0.07",
    memRef: "0.01",
    diff: "5.6e-17",
  },
  {
    case: "decision curve: 99 thresholds",
    n: "100,000",
    reference: "NumPy loop",
    evalsuite: "11.806",
    ref: "16.349",
    speedup: "1.38×",
    memEs: "6.87",
    memRef: "0.29",
    diff: "5.6e-17",
  },
  {
    case: "decision curve: 99 thresholds",
    n: "1,000,000",
    reference: "NumPy loop",
    evalsuite: "169.534",
    ref: "196.838",
    speedup: "1.16×",
    memEs: "68.67",
    memRef: "1.97",
    diff: "5.6e-17",
  },
  {
    case: "multiple testing: Hochberg (n p-values)",
    n: "1,000",
    reference: "statsmodels",
    evalsuite: "0.044",
    ref: "0.053",
    speedup: "1.20×",
    memEs: "0.04",
    memRef: "0.05",
    diff: "0",
  },
  {
    case: "multiple testing: Hochberg (n p-values)",
    n: "100,000",
    reference: "statsmodels",
    evalsuite: "4.970",
    ref: "4.848",
    speedup: "0.98×",
    memEs: "3.82",
    memRef: "3.97",
    diff: "0",
  },
  {
    case: "multiple testing: Hochberg (n p-values)",
    n: "1,000,000",
    reference: "statsmodels",
    evalsuite: "77.409",
    ref: "95.951",
    speedup: "1.24×",
    memEs: "38.15",
    memRef: "39.17",
    diff: "0",
  },
  {
    case: "statistics: Cramér's V (5×5 table)",
    n: "1,000",
    reference: "SciPy",
    evalsuite: "0.018",
    ref: "0.254",
    speedup: "14.35×",
    memEs: "0.00",
    memRef: "0.00",
    diff: "0",
  },
  {
    case: "statistics: Cramér's V (5×5 table)",
    n: "100,000",
    reference: "SciPy",
    evalsuite: "0.017",
    ref: "0.238",
    speedup: "13.63×",
    memEs: "0.00",
    memRef: "0.00",
    diff: "0",
  },
  {
    case: "statistics: Cramér's V (5×5 table)",
    n: "1,000,000",
    reference: "SciPy",
    evalsuite: "0.016",
    ref: "0.254",
    speedup: "15.93×",
    memEs: "0.00",
    memRef: "0.00",
    diff: "0",
  },
  {
    case: "statistics: Mann–Whitney U",
    n: "1,000",
    reference: "SciPy",
    evalsuite: "0.092",
    ref: "0.568",
    speedup: "6.15×",
    memEs: "0.14",
    memRef: "0.14",
    diff: "0",
  },
  {
    case: "statistics: Mann–Whitney U",
    n: "100,000",
    reference: "SciPy",
    evalsuite: "7.427",
    ref: "28.622",
    speedup: "3.85×",
    memEs: "13.93",
    memRef: "13.93",
    diff: "0",
  },
  {
    case: "statistics: Mann–Whitney U",
    n: "1,000,000",
    reference: "SciPy",
    evalsuite: "127.457",
    ref: "385.463",
    speedup: "3.02×",
    memEs: "139.24",
    memRef: "139.24",
    diff: "0",
  },
  {
    case: "statistics: Welch t-test",
    n: "1,000",
    reference: "SciPy",
    evalsuite: "0.091",
    ref: "0.575",
    speedup: "6.30×",
    memEs: "0.02",
    memRef: "0.02",
    diff: "5.6e-17",
  },
  {
    case: "statistics: Welch t-test",
    n: "100,000",
    reference: "SciPy",
    evalsuite: "0.592",
    ref: "1.409",
    speedup: "2.38×",
    memEs: "1.53",
    memRef: "1.53",
    diff: "1.4e-42",
  },
  {
    case: "statistics: Welch t-test",
    n: "1,000,000",
    reference: "SciPy",
    evalsuite: "5.378",
    ref: "8.093",
    speedup: "1.50×",
    memEs: "15.26",
    memRef: "15.26",
    diff: "9.4e-243",
  },
];

const VISION: Row[] = [
  {
    case: "detection: COCO evaluation (10 images)",
    n: "1,000",
    reference: "pycocotools",
    evalsuite: "1.209",
    ref: "19.525",
    speedup: "16.15×",
    memEs: "0.95",
    memRef: "1.33",
    diff: "0",
  },
  {
    case: "detection: COCO evaluation (100 images)",
    n: "100,000",
    reference: "pycocotools",
    evalsuite: "4.664",
    ref: "90.798",
    speedup: "19.47×",
    memEs: "1.13",
    memRef: "4.35",
    diff: "0",
  },
  {
    case: "detection: COCO evaluation (1000 images)",
    n: "1,000,000",
    reference: "pycocotools",
    evalsuite: "40.157",
    ref: "831.811",
    speedup: "20.71×",
    memEs: "2.83",
    memRef: "34.43",
    diff: "0",
  },
  {
    case: "segmentation: Dice and IoU per class (n = pixels)",
    n: "1,000",
    reference: "scikit-learn",
    evalsuite: "0.199",
    ref: "2.548",
    speedup: "12.83×",
    memEs: "0.16",
    memRef: "0.10",
    diff: "0",
  },
  {
    case: "segmentation: Dice and IoU per class (n = pixels)",
    n: "100,000",
    reference: "scikit-learn",
    evalsuite: "3.224",
    ref: "8.123",
    speedup: "2.52×",
    memEs: "0.17",
    memRef: "2.32",
    diff: "0",
  },
  {
    case: "segmentation: Dice and IoU per class (n = pixels)",
    n: "1,000,000",
    reference: "scikit-learn",
    evalsuite: "34.928",
    ref: "72.239",
    speedup: "2.07×",
    memEs: "0.25",
    memRef: "23.48",
    diff: "0",
  },
  {
    case: "segmentation: Hausdorff distance (1 image)",
    n: "1,000",
    reference: "SciPy",
    evalsuite: "0.157",
    ref: "0.385",
    speedup: "2.46×",
    memEs: "0.01",
    memRef: "0.03",
    diff: "0",
  },
  {
    case: "segmentation: Hausdorff distance (24 images)",
    n: "100,000",
    reference: "SciPy",
    evalsuite: "3.512",
    ref: "8.452",
    speedup: "2.41×",
    memEs: "0.01",
    memRef: "0.03",
    diff: "0",
  },
  {
    case: "segmentation: Hausdorff distance (50 images)",
    n: "1,000,000",
    reference: "SciPy",
    evalsuite: "7.621",
    ref: "18.543",
    speedup: "2.43×",
    memEs: "0.01",
    memRef: "0.03",
    diff: "0",
  },
];

const LLM: Row[] = [
  {
    case: "agreement: Krippendorff's alpha, interval (4 raters × 10 items)",
    n: "1,000",
    reference: "krippendorff",
    evalsuite: "0.039",
    ref: "0.045",
    speedup: "1.15×",
    memEs: "0.01",
    memRef: "0.01",
    diff: "0",
  },
  {
    case: "agreement: Krippendorff's alpha, interval (4 raters × 1000 items)",
    n: "100,000",
    reference: "krippendorff",
    evalsuite: "0.157",
    ref: "0.369",
    speedup: "2.35×",
    memEs: "0.29",
    memRef: "0.69",
    diff: "3.8e-15",
  },
  {
    case: "agreement: Krippendorff's alpha, interval (4 raters × 10000 items)",
    n: "1,000,000",
    reference: "krippendorff",
    evalsuite: "1.590",
    ref: "3.190",
    speedup: "2.01×",
    memEs: "2.53",
    memRef: "6.32",
    diff: "1.7e-14",
  },
  {
    case: "retrieval: MRR, MAP@20, NDCG@10 (10 queries)",
    n: "1,000",
    reference: "ranx",
    evalsuite: "0.227",
    ref: "1.654",
    speedup: "7.29×",
    memEs: "0.01",
    memRef: "0.04",
    diff: "0",
  },
  {
    case: "retrieval: MRR, MAP@20, NDCG@10 (1000 queries)",
    n: "100,000",
    reference: "ranx",
    evalsuite: "10.476",
    ref: "78.902",
    speedup: "7.53×",
    memEs: "0.31",
    memRef: "3.11",
    diff: "3.5e-18",
  },
  {
    case: "retrieval: MRR, MAP@20, NDCG@10 (10000 queries)",
    n: "1,000,000",
    reference: "ranx",
    evalsuite: "106.735",
    ref: "777.157",
    speedup: "7.28×",
    memEs: "2.99",
    memRef: "31.01",
    diff: "6.9e-18",
  },
  {
    case: "structured: JSON Schema compliance (10 documents)",
    n: "1,000",
    reference: "jsonschema",
    evalsuite: "0.138",
    ref: "0.330",
    speedup: "2.38×",
    memEs: "0.00",
    memRef: "0.00",
    diff: "0",
  },
  {
    case: "structured: JSON Schema compliance (1000 documents)",
    n: "100,000",
    reference: "jsonschema",
    evalsuite: "13.256",
    ref: "30.912",
    speedup: "2.33×",
    memEs: "0.05",
    memRef: "0.02",
    diff: "0",
  },
  {
    case: "structured: JSON Schema compliance (10000 documents)",
    n: "1,000,000",
    reference: "jsonschema",
    evalsuite: "133.204",
    ref: "295.472",
    speedup: "2.22×",
    memEs: "0.50",
    memRef: "0.16",
    diff: "0",
  },
  {
    case: "text: METEOR, exact and stem matches (10 sentences)",
    n: "1,000",
    reference: "NLTK",
    evalsuite: "0.156",
    ref: "0.854",
    speedup: "5.49×",
    memEs: "0.01",
    memRef: "0.01",
    diff: "0",
  },
  {
    case: "text: METEOR, exact and stem matches (1000 sentences)",
    n: "100,000",
    reference: "NLTK",
    evalsuite: "13.020",
    ref: "51.458",
    speedup: "3.95×",
    memEs: "0.58",
    memRef: "0.04",
    diff: "0",
  },
  {
    case: "text: METEOR, exact and stem matches (10000 sentences)",
    n: "1,000,000",
    reference: "NLTK",
    evalsuite: "92.439",
    ref: "493.795",
    speedup: "5.34×",
    memEs: "5.82",
    memRef: "0.39",
    diff: "0",
  },
  {
    case: "text: ROUGE-1, ROUGE-2, ROUGE-L (10 sentences)",
    n: "1,000",
    reference: "rouge-score",
    evalsuite: "0.193",
    ref: "0.746",
    speedup: "3.86×",
    memEs: "0.01",
    memRef: "0.01",
    diff: "0",
  },
  {
    case: "text: ROUGE-1, ROUGE-2, ROUGE-L (1000 sentences)",
    n: "100,000",
    reference: "rouge-score",
    evalsuite: "15.901",
    ref: "86.208",
    speedup: "5.42×",
    memEs: "0.63",
    memRef: "0.64",
    diff: "0",
  },
  {
    case: "text: ROUGE-1, ROUGE-2, ROUGE-L (10000 sentences)",
    n: "1,000,000",
    reference: "rouge-score",
    evalsuite: "219.540",
    ref: "888.978",
    speedup: "4.05×",
    memEs: "6.95",
    memRef: "6.55",
    diff: "0",
  },
  {
    case: "text: corpus BLEU and chrF (10 sentences)",
    n: "1,000",
    reference: "sacreBLEU",
    evalsuite: "0.268",
    ref: "1.872",
    speedup: "6.98×",
    memEs: "0.01",
    memRef: "0.22",
    diff: "1.4e-14",
  },
  {
    case: "text: corpus BLEU and chrF (1000 sentences)",
    n: "100,000",
    reference: "sacreBLEU",
    evalsuite: "19.938",
    ref: "230.161",
    speedup: "11.54×",
    memEs: "1.13",
    memRef: "21.57",
    diff: "1.4e-14",
  },
  {
    case: "text: corpus BLEU and chrF (10000 sentences)",
    n: "1,000,000",
    reference: "sacreBLEU",
    evalsuite: "266.679",
    ref: "2399.786",
    speedup: "9.00×",
    memEs: "11.44",
    memRef: "211.51",
    diff: "0",
  },
];

const LLMSYS: Row[] = [
  {
    case: "systems: CodeBLEU n-gram terms (4 programs)",
    n: "1,000",
    reference: "–",
    evalsuite: "1.837",
    ref: "–",
    speedup: "–",
    memEs: "0.07",
    memRef: "–",
    diff: "–",
  },
  {
    case: "systems: CodeBLEU n-gram terms (100 programs)",
    n: "100,000",
    reference: "–",
    evalsuite: "50.968",
    ref: "–",
    speedup: "–",
    memEs: "0.35",
    memRef: "–",
    diff: "–",
  },
  {
    case: "systems: CodeBLEU n-gram terms (1000 programs)",
    n: "1,000,000",
    reference: "–",
    evalsuite: "435.386",
    ref: "–",
    speedup: "–",
    memEs: "1.98",
    memRef: "–",
    diff: "–",
  },
  {
    case: "systems: confidence AUROC (n answers)",
    n: "1,000",
    reference: "scikit-learn",
    evalsuite: "0.280",
    ref: "1.506",
    speedup: "5.37×",
    memEs: "0.06",
    memRef: "0.08",
    diff: "0",
  },
  {
    case: "systems: confidence AUROC (n answers)",
    n: "100,000",
    reference: "scikit-learn",
    evalsuite: "12.981",
    ref: "28.028",
    speedup: "2.16×",
    memEs: "5.44",
    memRef: "7.64",
    diff: "0",
  },
  {
    case: "systems: confidence AUROC (n answers)",
    n: "1,000,000",
    reference: "scikit-learn",
    evalsuite: "181.774",
    ref: "242.589",
    speedup: "1.33×",
    memEs: "54.36",
    memRef: "76.30",
    diff: "0",
  },
  {
    case: "systems: distribution-shift drop, Welch CI (n scores)",
    n: "1,000",
    reference: "SciPy",
    evalsuite: "0.098",
    ref: "0.599",
    speedup: "6.12×",
    memEs: "0.01",
    memRef: "0.02",
    diff: "0",
  },
  {
    case: "systems: distribution-shift drop, Welch CI (n scores)",
    n: "100,000",
    reference: "SciPy",
    evalsuite: "0.598",
    ref: "1.446",
    speedup: "2.42×",
    memEs: "0.76",
    memRef: "1.53",
    diff: "0",
  },
  {
    case: "systems: distribution-shift drop, Welch CI (n scores)",
    n: "1,000,000",
    reference: "SciPy",
    evalsuite: "6.279",
    ref: "7.546",
    speedup: "1.20×",
    memEs: "7.63",
    memRef: "15.26",
    diff: "0",
  },
  {
    case: "systems: invalid tool calls vs JSON Schema (10 tasks)",
    n: "1,000",
    reference: "jsonschema",
    evalsuite: "0.111",
    ref: "0.281",
    speedup: "2.53×",
    memEs: "0.00",
    memRef: "0.00",
    diff: "0",
  },
  {
    case: "systems: invalid tool calls vs JSON Schema (1000 tasks)",
    n: "100,000",
    reference: "jsonschema",
    evalsuite: "13.248",
    ref: "28.419",
    speedup: "2.15×",
    memEs: "0.70",
    memRef: "0.05",
    diff: "0",
  },
  {
    case: "systems: invalid tool calls vs JSON Schema (10000 tasks)",
    n: "1,000,000",
    reference: "jsonschema",
    evalsuite: "127.595",
    ref: "284.958",
    speedup: "2.23×",
    memEs: "7.10",
    memRef: "0.33",
    diff: "0",
  },
  {
    case: "systems: latency p50 / p95 / p99 (n requests)",
    n: "1,000",
    reference: "NumPy",
    evalsuite: "0.034",
    ref: "0.041",
    speedup: "1.21×",
    memEs: "0.01",
    memRef: "0.01",
    diff: "0",
  },
  {
    case: "systems: latency p50 / p95 / p99 (n requests)",
    n: "100,000",
    reference: "NumPy",
    evalsuite: "0.605",
    ref: "2.008",
    speedup: "3.32×",
    memEs: "0.76",
    memRef: "0.77",
    diff: "0",
  },
  {
    case: "systems: latency p50 / p95 / p99 (n requests)",
    n: "1,000,000",
    reference: "NumPy",
    evalsuite: "8.978",
    ref: "15.334",
    speedup: "1.71×",
    memEs: "7.63",
    memRef: "7.63",
    diff: "0",
  },
  {
    case: "systems: maintainability index (4 programs)",
    n: "1,000",
    reference: "radon",
    evalsuite: "0.429",
    ref: "0.478",
    speedup: "1.11×",
    memEs: "0.04",
    memRef: "0.04",
    diff: "0",
  },
  {
    case: "systems: maintainability index (100 programs)",
    n: "100,000",
    reference: "radon",
    evalsuite: "19.506",
    ref: "21.954",
    speedup: "1.13×",
    memEs: "0.20",
    memRef: "0.05",
    diff: "0",
  },
  {
    case: "systems: maintainability index (1000 programs)",
    n: "1,000,000",
    reference: "radon",
    evalsuite: "118.315",
    ref: "131.866",
    speedup: "1.11×",
    memEs: "0.65",
    memRef: "0.07",
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
    ["v0.5", LLMSYS],
  ];
  const byCase = new Map<string, OverallRow>();
  for (const [release, rows] of groups) {
    for (const r of rows) {
      const key = r.case.replace(/\s*\([^)]*\d[^)]*\)$/, "");
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
  const all = [...CORE, ...CLINICAL, ...VISION, ...LLM, ...LLMSYS];
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
        meta={<StatusBadge status="implemented" label="v1.2.0 results" />}
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
            EvalSuite 1.2.0, Python 3.13, NumPy 2.5.3, SciPy 1.18.1, scikit-learn 1.9.1, statsmodels
            0.15.0, pycocotools 2.0.11, Linux x86_64 (2 cores). evaluate() rows include its default
            confidence intervals. Fastest of 5 runs after a warm-up; peak memory measured with{" "}
            <code>tracemalloc</code>. Speed-up above 1 means EvalSuite is faster. In every table the
            better value of each pair (less time, less memory, speed-up of at least 1×) is shown in{" "}
            <span className="font-semibold text-primary">purple</span>.
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
        <ResultsTable
          caption="LLM systems (v0.5) against radon, codebleu, scikit-learn, jsonschema, SciPy, NumPy"
          rows={LLMSYS}
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
            <strong>
              All 81 measurements agree with their reference, and EvalSuite is faster in every one
            </strong>{" "}
            across all five releases (geometric-mean speed-up 3.29×). In the per-metric run, all 172
            library comparisons are faster too (4.97×).
          </p>
          <p>
            <strong>Many metrics at once is where EvalSuite is fastest.</strong>{" "}
            <code>evaluate()</code> validates the inputs once, encodes integer labels without
            sorting and builds the confusion matrix once, then derives all eight label metrics from
            it: 40–101× faster than eight separate scikit-learn calls. Macro F1 over ten classes is
            about 16× faster, and sensitivity, specificity and both likelihood ratios together are
            14–18× faster.
          </p>
          <p>
            <strong>Statistical tests compute their statistics directly</strong> and are tested to
            give SciPy&apos;s numbers: the Welch t-test is 1.4–6.1× SciPy, Mann–Whitney 2.1–5.0×
            (one ranking pass), Cramér&apos;s V about 11×, Hochberg correction 1.0–1.1× statsmodels.
            Calibration slope and intercept are 5.2–5.8× faster than statsmodels&apos; GLM thanks to
            a dedicated Newton–Raphson solver, and the clinical diagnostic report is 1.1–4.1×.
          </p>
          <p>
            <strong>Object detection matches pycocotools exactly</strong> on all twelve COCO numbers
            and is 1.2–1.9× as fast: the greedy matching runs across every image of a class at once.
            Per-class Dice and IoU are 7–16× faster than scikit-learn, and Hausdorff distance is
            1.9–2.2× SciPy because it works on boundary points only.
          </p>
          <p>
            <strong>LLM metrics give the reference libraries&apos; numbers, faster</strong>: corpus
            BLEU and chrF 1.2–1.4× sacreBLEU, ROUGE about 1.8× rouge-score, METEOR 3.1–3.3× NLTK,
            ranking metrics 4.9–9.0× ranx, JSON Schema compliance 2.3–2.4× jsonschema and
            Krippendorff&apos;s alpha 1.1–2.1× the krippendorff package.
          </p>
          <p>
            <strong>LLM systems (v0.5)</strong> match radon&apos;s maintainability index exactly
            (1.1× its speed), the codebleu package&apos;s n-gram terms (1.0–1.2×) and
            scikit-learn&apos;s AUROC for confidence (1.7–4.9×). Tool calls are checked against
            their JSON Schemas 2.2–2.9× faster than jsonschema, and the distribution-shift interval
            is 1.1–6.0× faster than SciPy. Latency percentiles are 1.1–2.0× NumPy while also
            reporting the mean, spread, min, max and p90: each percentile is selected exactly from a
            small bracketed window instead of partitioning the whole array.
          </p>
        </Section>
        <Section title="Reproduce on your machine">
          <pre className="overflow-x-auto rounded-lg border border-border bg-surface-muted/50 p-4 text-sm">
            <code>{`pip install "evalsuite-python[llm]" scikit-learn statsmodels pycocotools sacrebleu rouge-score ranx krippendorff jsonschema choix pot pycocoevalcap radon codebleu
evalsuite benchmark                    # every case at 1,000 / 100,000 / 1,000,000 samples
evalsuite benchmark --suite clinical   # only the v0.2 clinical, calibration and statistics cases
evalsuite benchmark --suite vision     # only the v0.3 segmentation and detection cases
evalsuite benchmark --suite llm        # only the v0.4 LLM cases
evalsuite benchmark --suite llmsys     # only the v0.5 LLM-systems cases
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
