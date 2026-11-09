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

/** From BENCHMARKS.md in the package repository (evalsuite benchmark, EvalSuite 0.5.5, fastest of 5 runs). */
const SUITE_SUMMARY: SuiteSummary[] = [
  {
    suite: "Classification and regression",
    cases: 4,
    rows: 12,
    match: "12/12",
    faster: "12/12",
    geomean: "10.66×",
    range: "1.44×–100.84×",
  },
  {
    suite: "Clinical, calibration and statistics",
    cases: 8,
    rows: 24,
    match: "24/24",
    faster: "24/24",
    geomean: "3.84×",
    range: "1.04×–18.07×",
  },
  {
    suite: "LLM evaluation",
    cases: 6,
    rows: 18,
    match: "18/18",
    faster: "18/18",
    geomean: "2.37×",
    range: "1.11×–9.03×",
  },
  {
    suite: "LLM systems",
    cases: 6,
    rows: 18,
    match: "18/18",
    faster: "18/18",
    geomean: "1.75×",
    range: "1.04×–6.04×",
  },
  {
    suite: "Segmentation and object detection",
    cases: 3,
    rows: 9,
    match: "9/9",
    faster: "9/9",
    geomean: "3.13×",
    range: "1.22×–15.97×",
  },
  {
    suite: "Overall",
    cases: 27,
    rows: 81,
    match: "81/81",
    faster: "81/81",
    geomean: "3.29×",
    range: "1.04×–100.84×",
  },
];

/** Rows in alphabetical order of case, then by size. */
const CORE: Row[] = [
  {
    case: "10 classes: macro F1",
    n: "1,000",
    reference: "scikit-learn",
    evalsuite: "0.061",
    ref: "0.994",
    speedup: "16.38×",
    memEs: "0.02",
    memRef: "0.03",
    diff: "0",
  },
  {
    case: "10 classes: macro F1",
    n: "100,000",
    reference: "scikit-learn",
    evalsuite: "0.732",
    ref: "11.483",
    speedup: "15.68×",
    memEs: "0.77",
    memRef: "2.18",
    diff: "0",
  },
  {
    case: "10 classes: macro F1",
    n: "1,000,000",
    reference: "scikit-learn",
    evalsuite: "7.139",
    ref: "113.744",
    speedup: "15.93×",
    memEs: "7.63",
    memRef: "21.79",
    diff: "0",
  },
  {
    case: "binary: 8 label metrics via evaluate()",
    n: "1,000",
    reference: "scikit-learn",
    evalsuite: "0.168",
    ref: "6.722",
    speedup: "39.90×",
    memEs: "0.03",
    memRef: "0.04",
    diff: "0",
  },
  {
    case: "binary: 8 label metrics via evaluate()",
    n: "100,000",
    reference: "scikit-learn",
    evalsuite: "0.873",
    ref: "88.059",
    speedup: "100.84×",
    memEs: "1.69",
    memRef: "3.06",
    diff: "0",
  },
  {
    case: "binary: 8 label metrics via evaluate()",
    n: "1,000,000",
    reference: "scikit-learn",
    evalsuite: "9.326",
    ref: "841.173",
    speedup: "90.19×",
    memEs: "16.28",
    memRef: "30.53",
    diff: "0",
  },
  {
    case: "binary: ROC AUC",
    n: "1,000",
    reference: "scikit-learn",
    evalsuite: "0.118",
    ref: "1.118",
    speedup: "9.46×",
    memEs: "0.09",
    memRef: "0.08",
    diff: "1.1e-16",
  },
  {
    case: "binary: ROC AUC",
    n: "100,000",
    reference: "scikit-learn",
    evalsuite: "10.818",
    ref: "24.057",
    speedup: "2.22×",
    memEs: "8.39",
    memRef: "7.63",
    diff: "1.1e-16",
  },
  {
    case: "binary: ROC AUC",
    n: "1,000,000",
    reference: "scikit-learn",
    evalsuite: "171.396",
    ref: "293.972",
    speedup: "1.72×",
    memEs: "83.93",
    memRef: "76.30",
    diff: "0",
  },
  {
    case: "regression: MAE, MSE, RMSE, R² via evaluate()",
    n: "1,000",
    reference: "scikit-learn",
    evalsuite: "0.071",
    ref: "0.468",
    speedup: "6.62×",
    memEs: "0.03",
    memRef: "0.02",
    diff: "0",
  },
  {
    case: "regression: MAE, MSE, RMSE, R² via evaluate()",
    n: "100,000",
    reference: "scikit-learn",
    evalsuite: "0.726",
    ref: "3.060",
    speedup: "4.21×",
    memEs: "3.05",
    memRef: "1.53",
    diff: "0",
  },
  {
    case: "regression: MAE, MSE, RMSE, R² via evaluate()",
    n: "1,000,000",
    reference: "scikit-learn",
    evalsuite: "9.373",
    ref: "13.468",
    speedup: "1.44×",
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
    evalsuite: "0.564",
    ref: "3.073",
    speedup: "5.44×",
    memEs: "0.10",
    memRef: "0.60",
    diff: "2.8e-16",
  },
  {
    case: "calibration: slope and intercept",
    n: "100,000",
    reference: "statsmodels",
    evalsuite: "16.191",
    ref: "94.164",
    speedup: "5.82×",
    memEs: "8.46",
    memRef: "58.00",
    diff: "1.1e-16",
  },
  {
    case: "calibration: slope and intercept",
    n: "1,000,000",
    reference: "statsmodels",
    evalsuite: "227.674",
    ref: "1188.164",
    speedup: "5.22×",
    memEs: "83.99",
    memRef: "579.85",
    diff: "5.6e-17",
  },
  {
    case: "clinical: diagnostic report (7 CIs)",
    n: "1,000",
    reference: "statsmodels",
    evalsuite: "0.130",
    ref: "0.536",
    speedup: "4.13×",
    memEs: "0.02",
    memRef: "0.01",
    diff: "1.1e-14",
  },
  {
    case: "clinical: diagnostic report (7 CIs)",
    n: "100,000",
    reference: "statsmodels",
    evalsuite: "0.552",
    ref: "1.320",
    speedup: "2.39×",
    memEs: "0.76",
    memRef: "0.29",
    diff: "2.5e-14",
  },
  {
    case: "clinical: diagnostic report (7 CIs)",
    n: "1,000,000",
    reference: "statsmodels",
    evalsuite: "4.973",
    ref: "5.386",
    speedup: "1.08×",
    memEs: "7.63",
    memRef: "1.91",
    diff: "1.4e-14",
  },
  {
    case: "clinical: sensitivity, specificity, LR+, LR−",
    n: "1,000",
    reference: "scikit-learn",
    evalsuite: "0.252",
    ref: "3.975",
    speedup: "15.75×",
    memEs: "0.02",
    memRef: "0.03",
    diff: "4.4e-16",
  },
  {
    case: "clinical: sensitivity, specificity, LR+, LR−",
    n: "100,000",
    reference: "scikit-learn",
    evalsuite: "2.643",
    ref: "36.457",
    speedup: "13.79×",
    memEs: "0.76",
    memRef: "2.24",
    diff: "0",
  },
  {
    case: "clinical: sensitivity, specificity, LR+, LR−",
    n: "1,000,000",
    reference: "scikit-learn",
    evalsuite: "19.484",
    ref: "351.991",
    speedup: "18.07×",
    memEs: "7.63",
    memRef: "22.32",
    diff: "1.8e-15",
  },
  {
    case: "decision curve: 99 thresholds",
    n: "1,000",
    reference: "NumPy loop",
    evalsuite: "0.156",
    ref: "1.010",
    speedup: "6.48×",
    memEs: "0.07",
    memRef: "0.01",
    diff: "5.6e-17",
  },
  {
    case: "decision curve: 99 thresholds",
    n: "100,000",
    reference: "NumPy loop",
    evalsuite: "10.187",
    ref: "14.669",
    speedup: "1.44×",
    memEs: "6.87",
    memRef: "0.29",
    diff: "5.6e-17",
  },
  {
    case: "decision curve: 99 thresholds",
    n: "1,000,000",
    reference: "NumPy loop",
    evalsuite: "149.151",
    ref: "200.911",
    speedup: "1.35×",
    memEs: "68.67",
    memRef: "1.97",
    diff: "5.6e-17",
  },
  {
    case: "multiple testing: Hochberg (n p-values)",
    n: "1,000",
    reference: "statsmodels",
    evalsuite: "0.053",
    ref: "0.059",
    speedup: "1.12×",
    memEs: "0.04",
    memRef: "0.05",
    diff: "0",
  },
  {
    case: "multiple testing: Hochberg (n p-values)",
    n: "100,000",
    reference: "statsmodels",
    evalsuite: "3.752",
    ref: "3.888",
    speedup: "1.04×",
    memEs: "3.82",
    memRef: "3.97",
    diff: "0",
  },
  {
    case: "multiple testing: Hochberg (n p-values)",
    n: "1,000,000",
    reference: "statsmodels",
    evalsuite: "78.803",
    ref: "84.907",
    speedup: "1.08×",
    memEs: "38.15",
    memRef: "39.17",
    diff: "0",
  },
  {
    case: "statistics: Cramér's V (5×5 table)",
    n: "1,000",
    reference: "SciPy",
    evalsuite: "0.024",
    ref: "0.257",
    speedup: "10.74×",
    memEs: "0.00",
    memRef: "0.00",
    diff: "0",
  },
  {
    case: "statistics: Cramér's V (5×5 table)",
    n: "100,000",
    reference: "SciPy",
    evalsuite: "0.016",
    ref: "0.186",
    speedup: "11.93×",
    memEs: "0.00",
    memRef: "0.00",
    diff: "0",
  },
  {
    case: "statistics: Cramér's V (5×5 table)",
    n: "1,000,000",
    reference: "SciPy",
    evalsuite: "0.015",
    ref: "0.170",
    speedup: "11.15×",
    memEs: "0.00",
    memRef: "0.00",
    diff: "0",
  },
  {
    case: "statistics: Mann–Whitney U",
    n: "1,000",
    reference: "SciPy",
    evalsuite: "0.120",
    ref: "0.604",
    speedup: "5.01×",
    memEs: "0.14",
    memRef: "0.14",
    diff: "0",
  },
  {
    case: "statistics: Mann–Whitney U",
    n: "100,000",
    reference: "SciPy",
    evalsuite: "7.499",
    ref: "23.549",
    speedup: "3.14×",
    memEs: "13.93",
    memRef: "13.93",
    diff: "0",
  },
  {
    case: "statistics: Mann–Whitney U",
    n: "1,000,000",
    reference: "SciPy",
    evalsuite: "148.000",
    ref: "317.069",
    speedup: "2.14×",
    memEs: "139.24",
    memRef: "139.24",
    diff: "0",
  },
  {
    case: "statistics: Welch t-test",
    n: "1,000",
    reference: "SciPy",
    evalsuite: "0.101",
    ref: "0.612",
    speedup: "6.08×",
    memEs: "0.02",
    memRef: "0.02",
    diff: "5.6e-17",
  },
  {
    case: "statistics: Welch t-test",
    n: "100,000",
    reference: "SciPy",
    evalsuite: "0.600",
    ref: "1.432",
    speedup: "2.39×",
    memEs: "1.53",
    memRef: "1.53",
    diff: "1.4e-42",
  },
  {
    case: "statistics: Welch t-test",
    n: "1,000,000",
    reference: "SciPy",
    evalsuite: "7.050",
    ref: "9.713",
    speedup: "1.38×",
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
    evalsuite: "13.165",
    ref: "16.095",
    speedup: "1.22×",
    memEs: "0.55",
    memRef: "1.36",
    diff: "0",
  },
  {
    case: "detection: COCO evaluation (100 images)",
    n: "100,000",
    reference: "pycocotools",
    evalsuite: "43.629",
    ref: "78.068",
    speedup: "1.79×",
    memEs: "1.27",
    memRef: "4.35",
    diff: "0",
  },
  {
    case: "detection: COCO evaluation (1000 images)",
    n: "1,000,000",
    reference: "pycocotools",
    evalsuite: "369.040",
    ref: "683.098",
    speedup: "1.85×",
    memEs: "8.00",
    memRef: "34.44",
    diff: "0",
  },
  {
    case: "segmentation: Dice and IoU per class (n = pixels)",
    n: "1,000",
    reference: "scikit-learn",
    evalsuite: "0.213",
    ref: "3.409",
    speedup: "15.97×",
    memEs: "0.16",
    memRef: "0.10",
    diff: "0",
  },
  {
    case: "segmentation: Dice and IoU per class (n = pixels)",
    n: "100,000",
    reference: "scikit-learn",
    evalsuite: "2.913",
    ref: "22.548",
    speedup: "7.74×",
    memEs: "0.17",
    memRef: "2.32",
    diff: "0",
  },
  {
    case: "segmentation: Dice and IoU per class (n = pixels)",
    n: "1,000,000",
    reference: "scikit-learn",
    evalsuite: "30.902",
    ref: "224.469",
    speedup: "7.26×",
    memEs: "0.25",
    memRef: "23.48",
    diff: "0",
  },
  {
    case: "segmentation: Hausdorff distance (1 image)",
    n: "1,000",
    reference: "SciPy",
    evalsuite: "0.237",
    ref: "0.463",
    speedup: "1.96×",
    memEs: "0.27",
    memRef: "0.03",
    diff: "0",
  },
  {
    case: "segmentation: Hausdorff distance (24 images)",
    n: "100,000",
    reference: "SciPy",
    evalsuite: "4.903",
    ref: "10.650",
    speedup: "2.17×",
    memEs: "0.29",
    memRef: "0.03",
    diff: "0",
  },
  {
    case: "segmentation: Hausdorff distance (50 images)",
    n: "1,000,000",
    reference: "SciPy",
    evalsuite: "7.054",
    ref: "13.314",
    speedup: "1.89×",
    memEs: "0.28",
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
    ref: "0.044",
    speedup: "1.11×",
    memEs: "0.01",
    memRef: "0.01",
    diff: "0",
  },
  {
    case: "agreement: Krippendorff's alpha, interval (4 raters × 1000 items)",
    n: "100,000",
    reference: "krippendorff",
    evalsuite: "0.147",
    ref: "0.301",
    speedup: "2.04×",
    memEs: "0.29",
    memRef: "0.69",
    diff: "3.8e-15",
  },
  {
    case: "agreement: Krippendorff's alpha, interval (4 raters × 10000 items)",
    n: "1,000,000",
    reference: "krippendorff",
    evalsuite: "1.360",
    ref: "2.783",
    speedup: "2.05×",
    memEs: "2.53",
    memRef: "6.32",
    diff: "1.7e-14",
  },
  {
    case: "retrieval: MRR, MAP@20, NDCG@10 (10 queries)",
    n: "1,000",
    reference: "ranx",
    evalsuite: "0.139",
    ref: "1.252",
    speedup: "9.03×",
    memEs: "0.01",
    memRef: "0.04",
    diff: "0",
  },
  {
    case: "retrieval: MRR, MAP@20, NDCG@10 (1000 queries)",
    n: "100,000",
    reference: "ranx",
    evalsuite: "11.713",
    ref: "61.059",
    speedup: "5.21×",
    memEs: "0.49",
    memRef: "3.11",
    diff: "3.5e-18",
  },
  {
    case: "retrieval: MRR, MAP@20, NDCG@10 (10000 queries)",
    n: "1,000,000",
    reference: "ranx",
    evalsuite: "120.490",
    ref: "589.855",
    speedup: "4.90×",
    memEs: "5.36",
    memRef: "31.01",
    diff: "6.9e-18",
  },
  {
    case: "structured: JSON Schema compliance (10 documents)",
    n: "1,000",
    reference: "jsonschema",
    evalsuite: "0.108",
    ref: "0.257",
    speedup: "2.38×",
    memEs: "0.00",
    memRef: "0.00",
    diff: "0",
  },
  {
    case: "structured: JSON Schema compliance (1000 documents)",
    n: "100,000",
    reference: "jsonschema",
    evalsuite: "9.624",
    ref: "23.215",
    speedup: "2.41×",
    memEs: "0.05",
    memRef: "0.02",
    diff: "0",
  },
  {
    case: "structured: JSON Schema compliance (10000 documents)",
    n: "1,000,000",
    reference: "jsonschema",
    evalsuite: "98.006",
    ref: "223.289",
    speedup: "2.28×",
    memEs: "0.50",
    memRef: "0.16",
    diff: "0",
  },
  {
    case: "text: corpus BLEU and chrF (10 sentences)",
    n: "1,000",
    reference: "sacreBLEU",
    evalsuite: "1.195",
    ref: "1.483",
    speedup: "1.24×",
    memEs: "0.11",
    memRef: "0.22",
    diff: "1.4e-14",
  },
  {
    case: "text: corpus BLEU and chrF (1000 sentences)",
    n: "100,000",
    reference: "sacreBLEU",
    evalsuite: "139.586",
    ref: "167.781",
    speedup: "1.20×",
    memEs: "0.26",
    memRef: "21.57",
    diff: "1.4e-14",
  },
  {
    case: "text: corpus BLEU and chrF (10000 sentences)",
    n: "1,000,000",
    reference: "sacreBLEU",
    evalsuite: "1435.788",
    ref: "2056.377",
    speedup: "1.43×",
    memEs: "2.52",
    memRef: "211.52",
    diff: "0",
  },
  {
    case: "text: METEOR, exact and stem matches (10 sentences)",
    n: "1,000",
    reference: "NLTK",
    evalsuite: "0.108",
    ref: "0.356",
    speedup: "3.31×",
    memEs: "0.01",
    memRef: "0.01",
    diff: "0",
  },
  {
    case: "text: METEOR, exact and stem matches (1000 sentences)",
    n: "100,000",
    reference: "NLTK",
    evalsuite: "12.057",
    ref: "38.551",
    speedup: "3.20×",
    memEs: "0.12",
    memRef: "0.04",
    diff: "0",
  },
  {
    case: "text: METEOR, exact and stem matches (10000 sentences)",
    n: "1,000,000",
    reference: "NLTK",
    evalsuite: "124.738",
    ref: "384.377",
    speedup: "3.08×",
    memEs: "1.15",
    memRef: "0.39",
    diff: "0",
  },
  {
    case: "text: ROUGE-1, ROUGE-2, ROUGE-L (10 sentences)",
    n: "1,000",
    reference: "rouge-score",
    evalsuite: "0.316",
    ref: "0.553",
    speedup: "1.75×",
    memEs: "0.01",
    memRef: "0.01",
    diff: "0",
  },
  {
    case: "text: ROUGE-1, ROUGE-2, ROUGE-L (1000 sentences)",
    n: "100,000",
    reference: "rouge-score",
    evalsuite: "33.337",
    ref: "59.790",
    speedup: "1.79×",
    memEs: "0.12",
    memRef: "0.64",
    diff: "0",
  },
  {
    case: "text: ROUGE-1, ROUGE-2, ROUGE-L (10000 sentences)",
    n: "1,000,000",
    reference: "rouge-score",
    evalsuite: "354.711",
    ref: "618.624",
    speedup: "1.74×",
    memEs: "1.16",
    memRef: "6.55",
    diff: "0",
  },
];

const LLMSYS: Row[] = [
  {
    case: "systems: CodeBLEU n-gram terms (100 programs)",
    n: "100,000",
    reference: "codebleu",
    evalsuite: "41.466",
    ref: "48.310",
    speedup: "1.17×",
    memEs: "0.36",
    memRef: "0.25",
    diff: "0",
  },
  {
    case: "systems: CodeBLEU n-gram terms (1000 programs)",
    n: "1,000,000",
    reference: "codebleu",
    evalsuite: "431.295",
    ref: "523.049",
    speedup: "1.21×",
    memEs: "1.76",
    memRef: "2.06",
    diff: "0",
  },
  {
    case: "systems: CodeBLEU n-gram terms (4 programs)",
    n: "1,000",
    reference: "codebleu",
    evalsuite: "1.751",
    ref: "1.827",
    speedup: "1.04×",
    memEs: "0.07",
    memRef: "0.07",
    diff: "0",
  },
  {
    case: "systems: confidence AUROC (n answers)",
    n: "1,000",
    reference: "scikit-learn",
    evalsuite: "0.232",
    ref: "1.128",
    speedup: "4.86×",
    memEs: "0.06",
    memRef: "0.08",
    diff: "0",
  },
  {
    case: "systems: confidence AUROC (n answers)",
    n: "100,000",
    reference: "scikit-learn",
    evalsuite: "11.779",
    ref: "22.937",
    speedup: "1.95×",
    memEs: "5.44",
    memRef: "7.64",
    diff: "0",
  },
  {
    case: "systems: confidence AUROC (n answers)",
    n: "1,000,000",
    reference: "scikit-learn",
    evalsuite: "160.506",
    ref: "272.958",
    speedup: "1.70×",
    memEs: "54.36",
    memRef: "76.30",
    diff: "0",
  },
  {
    case: "systems: distribution-shift drop, Welch CI (n scores)",
    n: "1,000",
    reference: "SciPy",
    evalsuite: "0.077",
    ref: "0.463",
    speedup: "6.04×",
    memEs: "0.01",
    memRef: "0.02",
    diff: "0",
  },
  {
    case: "systems: distribution-shift drop, Welch CI (n scores)",
    n: "100,000",
    reference: "SciPy",
    evalsuite: "0.548",
    ref: "1.434",
    speedup: "2.62×",
    memEs: "0.76",
    memRef: "1.53",
    diff: "0",
  },
  {
    case: "systems: distribution-shift drop, Welch CI (n scores)",
    n: "1,000,000",
    reference: "SciPy",
    evalsuite: "6.664",
    ref: "7.250",
    speedup: "1.09×",
    memEs: "7.63",
    memRef: "15.26",
    diff: "0",
  },
  {
    case: "systems: invalid tool calls vs JSON Schema (10 tasks)",
    n: "1,000",
    reference: "jsonschema",
    evalsuite: "0.078",
    ref: "0.221",
    speedup: "2.83×",
    memEs: "0.00",
    memRef: "0.00",
    diff: "0",
  },
  {
    case: "systems: invalid tool calls vs JSON Schema (1000 tasks)",
    n: "100,000",
    reference: "jsonschema",
    evalsuite: "7.892",
    ref: "22.828",
    speedup: "2.89×",
    memEs: "0.70",
    memRef: "0.05",
    diff: "0",
  },
  {
    case: "systems: invalid tool calls vs JSON Schema (10000 tasks)",
    n: "1,000,000",
    reference: "jsonschema",
    evalsuite: "105.037",
    ref: "225.640",
    speedup: "2.15×",
    memEs: "7.10",
    memRef: "0.33",
    diff: "0",
  },
  {
    case: "systems: latency p50 / p95 / p99 (n requests)",
    n: "1,000",
    reference: "NumPy",
    evalsuite: "0.031",
    ref: "0.034",
    speedup: "1.10×",
    memEs: "0.01",
    memRef: "0.01",
    diff: "0",
  },
  {
    case: "systems: latency p50 / p95 / p99 (n requests)",
    n: "100,000",
    reference: "NumPy",
    evalsuite: "0.807",
    ref: "1.612",
    speedup: "2.00×",
    memEs: "0.76",
    memRef: "0.77",
    diff: "0",
  },
  {
    case: "systems: latency p50 / p95 / p99 (n requests)",
    n: "1,000,000",
    reference: "NumPy",
    evalsuite: "10.752",
    ref: "12.188",
    speedup: "1.13×",
    memEs: "7.63",
    memRef: "7.63",
    diff: "0",
  },
  {
    case: "systems: maintainability index (100 programs)",
    n: "100,000",
    reference: "radon",
    evalsuite: "8.207",
    ref: "9.189",
    speedup: "1.12×",
    memEs: "0.18",
    memRef: "0.05",
    diff: "0",
  },
  {
    case: "systems: maintainability index (1000 programs)",
    n: "1,000,000",
    reference: "radon",
    evalsuite: "90.300",
    ref: "99.302",
    speedup: "1.10×",
    memEs: "0.65",
    memRef: "0.07",
    diff: "0",
  },
  {
    case: "systems: maintainability index (4 programs)",
    n: "1,000",
    reference: "radon",
    evalsuite: "0.332",
    ref: "0.352",
    speedup: "1.06×",
    memEs: "0.04",
    memRef: "0.04",
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
        meta={<StatusBadge status="implemented" label="v0.5.5 results" />}
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
            EvalSuite 0.5.5, Python 3.13, NumPy 2.5.4, SciPy 1.18.1, scikit-learn 1.9.1, statsmodels
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
