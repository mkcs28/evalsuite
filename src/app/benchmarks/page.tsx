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
    geomean: "5.84×",
    range: "0.71×–55.53×",
  },
  {
    suite: "Clinical, calibration and statistics",
    cases: 8,
    rows: 24,
    match: "24/24",
    faster: "14/24",
    geomean: "1.59×",
    range: "0.29×–11.21×",
  },
  {
    suite: "LLM evaluation",
    cases: 6,
    rows: 18,
    match: "18/18",
    faster: "12/18",
    geomean: "1.47×",
    range: "0.78×–7.49×",
  },
  {
    suite: "LLM systems",
    cases: 6,
    rows: 18,
    match: "18/18",
    faster: "14/18",
    geomean: "1.40×",
    range: "0.33×–5.77×",
  },
  {
    suite: "Segmentation and object detection",
    cases: 3,
    rows: 9,
    match: "9/9",
    faster: "6/9",
    geomean: "1.95×",
    range: "0.72×–13.51×",
  },
  {
    suite: "Overall",
    cases: 27,
    rows: 81,
    match: "81/81",
    faster: "56/81",
    geomean: "1.89×",
    range: "0.29×–55.53×",
  },
];

/** Rows in alphabetical order of case, then by size. */
const CORE: Row[] = [
  {
    case: "10 classes: macro F1",
    n: "1,000",
    reference: "scikit-learn",
    evalsuite: "0.135",
    ref: "2.049",
    speedup: "15.15×",
    memEs: "0.05",
    memRef: "0.03",
    diff: "0",
  },
  {
    case: "10 classes: macro F1",
    n: "100,000",
    reference: "scikit-learn",
    evalsuite: "2.830",
    ref: "17.233",
    speedup: "6.09×",
    memEs: "4.58",
    memRef: "2.18",
    diff: "0",
  },
  {
    case: "10 classes: macro F1",
    n: "1,000,000",
    reference: "scikit-learn",
    evalsuite: "41.480",
    ref: "137.611",
    speedup: "3.32×",
    memEs: "45.78",
    memRef: "21.79",
    diff: "0",
  },
  {
    case: "binary: 8 label metrics via evaluate()",
    n: "1,000",
    reference: "scikit-learn",
    evalsuite: "0.356",
    ref: "19.784",
    speedup: "55.53×",
    memEs: "0.05",
    memRef: "0.05",
    diff: "0",
  },
  {
    case: "binary: 8 label metrics via evaluate()",
    n: "100,000",
    reference: "scikit-learn",
    evalsuite: "3.002",
    ref: "124.020",
    speedup: "41.31×",
    memEs: "4.58",
    memRef: "3.06",
    diff: "0",
  },
  {
    case: "binary: 8 label metrics via evaluate()",
    n: "1,000,000",
    reference: "scikit-learn",
    evalsuite: "49.432",
    ref: "1056.751",
    speedup: "21.38×",
    memEs: "45.78",
    memRef: "30.53",
    diff: "0",
  },
  {
    case: "binary: ROC AUC",
    n: "1,000",
    reference: "scikit-learn",
    evalsuite: "0.199",
    ref: "1.802",
    speedup: "9.08×",
    memEs: "0.09",
    memRef: "0.08",
    diff: "1.1e-16",
  },
  {
    case: "binary: ROC AUC",
    n: "100,000",
    reference: "scikit-learn",
    evalsuite: "18.883",
    ref: "34.770",
    speedup: "1.84×",
    memEs: "9.16",
    memRef: "7.64",
    diff: "1.1e-16",
  },
  {
    case: "binary: ROC AUC",
    n: "1,000,000",
    reference: "scikit-learn",
    evalsuite: "200.276",
    ref: "338.540",
    speedup: "1.69×",
    memEs: "91.56",
    memRef: "76.30",
    diff: "0",
  },
  {
    case: "regression: MAE, MSE, RMSE, R² via evaluate()",
    n: "1,000",
    reference: "scikit-learn",
    evalsuite: "0.133",
    ref: "0.831",
    speedup: "6.23×",
    memEs: "0.03",
    memRef: "0.02",
    diff: "0",
  },
  {
    case: "regression: MAE, MSE, RMSE, R² via evaluate()",
    n: "100,000",
    reference: "scikit-learn",
    evalsuite: "2.645",
    ref: "2.239",
    speedup: "0.85×",
    memEs: "3.05",
    memRef: "1.53",
    diff: "0",
  },
  {
    case: "regression: MAE, MSE, RMSE, R² via evaluate()",
    n: "1,000,000",
    reference: "scikit-learn",
    evalsuite: "32.001",
    ref: "22.648",
    speedup: "0.71×",
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
    evalsuite: "0.862",
    ref: "4.383",
    speedup: "5.08×",
    memEs: "0.10",
    memRef: "0.60",
    diff: "2.8e-16",
  },
  {
    case: "calibration: slope and intercept",
    n: "100,000",
    reference: "statsmodels",
    evalsuite: "25.106",
    ref: "141.277",
    speedup: "5.63×",
    memEs: "8.46",
    memRef: "58.06",
    diff: "5.6e-17",
  },
  {
    case: "calibration: slope and intercept",
    n: "1,000,000",
    reference: "statsmodels",
    evalsuite: "344.319",
    ref: "1541.663",
    speedup: "4.48×",
    memEs: "83.99",
    memRef: "579.91",
    diff: "5.6e-17",
  },
  {
    case: "clinical: diagnostic report (7 CIs)",
    n: "1,000",
    reference: "statsmodels",
    evalsuite: "0.178",
    ref: "0.701",
    speedup: "3.94×",
    memEs: "0.05",
    memRef: "0.01",
    diff: "1.1e-14",
  },
  {
    case: "clinical: diagnostic report (7 CIs)",
    n: "100,000",
    reference: "statsmodels",
    evalsuite: "2.238",
    ref: "1.286",
    speedup: "0.57×",
    memEs: "4.58",
    memRef: "0.29",
    diff: "2.5e-14",
  },
  {
    case: "clinical: diagnostic report (7 CIs)",
    n: "1,000,000",
    reference: "statsmodels",
    evalsuite: "33.462",
    ref: "9.604",
    speedup: "0.29×",
    memEs: "45.78",
    memRef: "2.86",
    diff: "1.4e-14",
  },
  {
    case: "clinical: sensitivity, specificity, LR+, LR−",
    n: "1,000",
    reference: "scikit-learn",
    evalsuite: "0.432",
    ref: "4.844",
    speedup: "11.21×",
    memEs: "0.05",
    memRef: "0.03",
    diff: "4.4e-16",
  },
  {
    case: "clinical: sensitivity, specificity, LR+, LR−",
    n: "100,000",
    reference: "scikit-learn",
    evalsuite: "10.032",
    ref: "47.526",
    speedup: "4.74×",
    memEs: "4.58",
    memRef: "2.24",
    diff: "0",
  },
  {
    case: "clinical: sensitivity, specificity, LR+, LR−",
    n: "1,000,000",
    reference: "scikit-learn",
    evalsuite: "137.871",
    ref: "438.134",
    speedup: "3.18×",
    memEs: "45.78",
    memRef: "22.32",
    diff: "1.8e-15",
  },
  {
    case: "decision curve: 99 thresholds",
    n: "1,000",
    reference: "NumPy loop",
    evalsuite: "0.182",
    ref: "1.192",
    speedup: "6.56×",
    memEs: "0.07",
    memRef: "0.01",
    diff: "5.6e-17",
  },
  {
    case: "decision curve: 99 thresholds",
    n: "100,000",
    reference: "NumPy loop",
    evalsuite: "12.646",
    ref: "19.108",
    speedup: "1.51×",
    memEs: "6.87",
    memRef: "0.29",
    diff: "5.6e-17",
  },
  {
    case: "decision curve: 99 thresholds",
    n: "1,000,000",
    reference: "NumPy loop",
    evalsuite: "172.085",
    ref: "236.221",
    speedup: "1.37×",
    memEs: "68.67",
    memRef: "2.86",
    diff: "5.6e-17",
  },
  {
    case: "multiple testing: Hochberg (n p-values)",
    n: "1,000",
    reference: "statsmodels",
    evalsuite: "0.053",
    ref: "0.098",
    speedup: "1.84×",
    memEs: "0.05",
    memRef: "0.05",
    diff: "0",
  },
  {
    case: "multiple testing: Hochberg (n p-values)",
    n: "100,000",
    reference: "statsmodels",
    evalsuite: "5.519",
    ref: "5.879",
    speedup: "1.07×",
    memEs: "4.58",
    memRef: "3.97",
    diff: "0",
  },
  {
    case: "multiple testing: Hochberg (n p-values)",
    n: "1,000,000",
    reference: "statsmodels",
    evalsuite: "91.858",
    ref: "98.422",
    speedup: "1.07×",
    memEs: "45.78",
    memRef: "39.17",
    diff: "0",
  },
  {
    case: "statistics: Cramér's V (5×5 table)",
    n: "1,000",
    reference: "SciPy",
    evalsuite: "0.314",
    ref: "0.289",
    speedup: "0.92×",
    memEs: "0.00",
    memRef: "0.00",
    diff: "0",
  },
  {
    case: "statistics: Cramér's V (5×5 table)",
    n: "100,000",
    reference: "SciPy",
    evalsuite: "0.305",
    ref: "0.281",
    speedup: "0.92×",
    memEs: "0.00",
    memRef: "0.00",
    diff: "0",
  },
  {
    case: "statistics: Cramér's V (5×5 table)",
    n: "1,000,000",
    reference: "SciPy",
    evalsuite: "0.300",
    ref: "0.284",
    speedup: "0.95×",
    memEs: "0.00",
    memRef: "0.00",
    diff: "0",
  },
  {
    case: "statistics: Mann–Whitney U",
    n: "1,000",
    reference: "SciPy",
    evalsuite: "0.738",
    ref: "0.712",
    speedup: "0.96×",
    memEs: "0.16",
    memRef: "0.14",
    diff: "0",
  },
  {
    case: "statistics: Mann–Whitney U",
    n: "100,000",
    reference: "SciPy",
    evalsuite: "33.733",
    ref: "32.472",
    speedup: "0.96×",
    memEs: "15.45",
    memRef: "13.93",
    diff: "0",
  },
  {
    case: "statistics: Mann–Whitney U",
    n: "1,000,000",
    reference: "SciPy",
    evalsuite: "390.304",
    ref: "425.774",
    speedup: "1.09×",
    memEs: "154.50",
    memRef: "139.24",
    diff: "0",
  },
  {
    case: "statistics: Welch t-test",
    n: "1,000",
    reference: "SciPy",
    evalsuite: "1.013",
    ref: "0.858",
    speedup: "0.85×",
    memEs: "0.04",
    memRef: "0.02",
    diff: "0",
  },
  {
    case: "statistics: Welch t-test",
    n: "100,000",
    reference: "SciPy",
    evalsuite: "2.705",
    ref: "1.593",
    speedup: "0.59×",
    memEs: "3.06",
    memRef: "1.53",
    diff: "0",
  },
  {
    case: "statistics: Welch t-test",
    n: "1,000,000",
    reference: "SciPy",
    evalsuite: "37.652",
    ref: "16.272",
    speedup: "0.43×",
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
    evalsuite: "19.337",
    ref: "30.575",
    speedup: "1.58×",
    memEs: "0.98",
    memRef: "1.74",
    diff: "0",
  },
  {
    case: "detection: COCO evaluation (100 images)",
    n: "100,000",
    reference: "pycocotools",
    evalsuite: "131.793",
    ref: "139.670",
    speedup: "1.06×",
    memEs: "1.49",
    memRef: "4.71",
    diff: "0",
  },
  {
    case: "detection: COCO evaluation (1000 images)",
    n: "1,000,000",
    reference: "pycocotools",
    evalsuite: "1147.898",
    ref: "1351.027",
    speedup: "1.18×",
    memEs: "7.00",
    memRef: "34.44",
    diff: "0",
  },
  {
    case: "segmentation: Dice and IoU per class (n = pixels)",
    n: "1,000",
    reference: "scikit-learn",
    evalsuite: "0.297",
    ref: "4.018",
    speedup: "13.51×",
    memEs: "0.16",
    memRef: "0.10",
    diff: "0",
  },
  {
    case: "segmentation: Dice and IoU per class (n = pixels)",
    n: "100,000",
    reference: "scikit-learn",
    evalsuite: "4.509",
    ref: "30.276",
    speedup: "6.71×",
    memEs: "0.17",
    memRef: "2.32",
    diff: "0",
  },
  {
    case: "segmentation: Dice and IoU per class (n = pixels)",
    n: "1,000,000",
    reference: "scikit-learn",
    evalsuite: "51.648",
    ref: "289.514",
    speedup: "5.61×",
    memEs: "0.25",
    memRef: "23.48",
    diff: "0",
  },
  {
    case: "segmentation: Hausdorff distance (1 image)",
    n: "1,000",
    reference: "SciPy",
    evalsuite: "0.633",
    ref: "0.454",
    speedup: "0.72×",
    memEs: "0.15",
    memRef: "0.03",
    diff: "0",
  },
  {
    case: "segmentation: Hausdorff distance (24 images)",
    n: "100,000",
    reference: "SciPy",
    evalsuite: "16.117",
    ref: "12.375",
    speedup: "0.77×",
    memEs: "0.15",
    memRef: "0.03",
    diff: "0",
  },
  {
    case: "segmentation: Hausdorff distance (50 images)",
    n: "1,000,000",
    reference: "SciPy",
    evalsuite: "31.882",
    ref: "23.820",
    speedup: "0.75×",
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
    evalsuite: "0.075",
    ref: "0.071",
    speedup: "0.96×",
    memEs: "0.01",
    memRef: "0.01",
    diff: "0",
  },
  {
    case: "agreement: Krippendorff's alpha, interval (4 raters × 1000 items)",
    n: "100,000",
    reference: "krippendorff",
    evalsuite: "0.469",
    ref: "0.425",
    speedup: "0.91×",
    memEs: "0.26",
    memRef: "0.69",
    diff: "3.8e-15",
  },
  {
    case: "agreement: Krippendorff's alpha, interval (4 raters × 10000 items)",
    n: "1,000,000",
    reference: "krippendorff",
    evalsuite: "4.455",
    ref: "4.475",
    speedup: "1.00×",
    memEs: "2.26",
    memRef: "6.32",
    diff: "1.7e-14",
  },
  {
    case: "retrieval: MRR, MAP@20, NDCG@10 (10 queries)",
    n: "1,000",
    reference: "ranx",
    evalsuite: "0.244",
    ref: "1.830",
    speedup: "7.49×",
    memEs: "0.01",
    memRef: "0.04",
    diff: "0",
  },
  {
    case: "retrieval: MRR, MAP@20, NDCG@10 (1000 queries)",
    n: "100,000",
    reference: "ranx",
    evalsuite: "21.350",
    ref: "91.433",
    speedup: "4.28×",
    memEs: "0.49",
    memRef: "3.13",
    diff: "3.5e-18",
  },
  {
    case: "retrieval: MRR, MAP@20, NDCG@10 (10000 queries)",
    n: "1,000,000",
    reference: "ranx",
    evalsuite: "248.612",
    ref: "897.025",
    speedup: "3.61×",
    memEs: "5.36",
    memRef: "31.01",
    diff: "6.9e-18",
  },
  {
    case: "structured: JSON Schema compliance (10 documents)",
    n: "1,000",
    reference: "jsonschema",
    evalsuite: "0.210",
    ref: "0.412",
    speedup: "1.97×",
    memEs: "0.00",
    memRef: "0.00",
    diff: "0",
  },
  {
    case: "structured: JSON Schema compliance (1000 documents)",
    n: "100,000",
    reference: "jsonschema",
    evalsuite: "16.044",
    ref: "37.886",
    speedup: "2.36×",
    memEs: "0.05",
    memRef: "0.02",
    diff: "0",
  },
  {
    case: "structured: JSON Schema compliance (10000 documents)",
    n: "1,000,000",
    reference: "jsonschema",
    evalsuite: "159.359",
    ref: "371.723",
    speedup: "2.33×",
    memEs: "0.50",
    memRef: "0.16",
    diff: "0",
  },
  {
    case: "text: corpus BLEU and chrF (10 sentences)",
    n: "1,000",
    reference: "sacreBLEU",
    evalsuite: "2.306",
    ref: "2.007",
    speedup: "0.87×",
    memEs: "0.10",
    memRef: "0.22",
    diff: "1.4e-14",
  },
  {
    case: "text: corpus BLEU and chrF (1000 sentences)",
    n: "100,000",
    reference: "sacreBLEU",
    evalsuite: "257.790",
    ref: "258.032",
    speedup: "1.00×",
    memEs: "0.73",
    memRef: "21.57",
    diff: "1.4e-14",
  },
  {
    case: "text: corpus BLEU and chrF (10000 sentences)",
    n: "1,000,000",
    reference: "sacreBLEU",
    evalsuite: "2726.175",
    ref: "3120.972",
    speedup: "1.14×",
    memEs: "7.28",
    memRef: "211.08",
    diff: "0",
  },
  {
    case: "text: METEOR, exact and stem matches (10 sentences)",
    n: "1,000",
    reference: "NLTK",
    evalsuite: "0.491",
    ref: "0.553",
    speedup: "1.13×",
    memEs: "0.01",
    memRef: "0.01",
    diff: "0",
  },
  {
    case: "text: METEOR, exact and stem matches (1000 sentences)",
    n: "100,000",
    reference: "NLTK",
    evalsuite: "50.158",
    ref: "57.141",
    speedup: "1.14×",
    memEs: "0.12",
    memRef: "0.04",
    diff: "0",
  },
  {
    case: "text: METEOR, exact and stem matches (10000 sentences)",
    n: "1,000,000",
    reference: "NLTK",
    evalsuite: "507.427",
    ref: "590.285",
    speedup: "1.16×",
    memEs: "1.15",
    memRef: "0.39",
    diff: "0",
  },
  {
    case: "text: ROUGE-1, ROUGE-2, ROUGE-L (10 sentences)",
    n: "1,000",
    reference: "rouge-score",
    evalsuite: "1.086",
    ref: "0.851",
    speedup: "0.78×",
    memEs: "0.01",
    memRef: "0.01",
    diff: "0",
  },
  {
    case: "text: ROUGE-1, ROUGE-2, ROUGE-L (1000 sentences)",
    n: "100,000",
    reference: "rouge-score",
    evalsuite: "110.226",
    ref: "97.261",
    speedup: "0.88×",
    memEs: "0.12",
    memRef: "0.64",
    diff: "0",
  },
  {
    case: "text: ROUGE-1, ROUGE-2, ROUGE-L (10000 sentences)",
    n: "1,000,000",
    reference: "rouge-score",
    evalsuite: "1147.257",
    ref: "1010.657",
    speedup: "0.88×",
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
    evalsuite: "67.412",
    ref: "74.305",
    speedup: "1.10×",
    memEs: "0.37",
    memRef: "0.25",
    diff: "0",
  },
  {
    case: "systems: CodeBLEU n-gram terms (1000 programs)",
    n: "1,000,000",
    reference: "codebleu",
    evalsuite: "740.336",
    ref: "791.899",
    speedup: "1.07×",
    memEs: "1.73",
    memRef: "2.06",
    diff: "0",
  },
  {
    case: "systems: CodeBLEU n-gram terms (4 programs)",
    n: "1,000",
    reference: "codebleu",
    evalsuite: "2.932",
    ref: "2.743",
    speedup: "0.94×",
    memEs: "0.07",
    memRef: "0.07",
    diff: "0",
  },
  {
    case: "systems: confidence AUROC (n answers)",
    n: "1,000",
    reference: "scikit-learn",
    evalsuite: "0.336",
    ref: "1.860",
    speedup: "5.54×",
    memEs: "0.06",
    memRef: "0.08",
    diff: "0",
  },
  {
    case: "systems: confidence AUROC (n answers)",
    n: "100,000",
    reference: "scikit-learn",
    evalsuite: "16.460",
    ref: "29.417",
    speedup: "1.79×",
    memEs: "6.20",
    memRef: "7.64",
    diff: "0",
  },
  {
    case: "systems: confidence AUROC (n answers)",
    n: "1,000,000",
    reference: "scikit-learn",
    evalsuite: "194.432",
    ref: "327.696",
    speedup: "1.69×",
    memEs: "61.99",
    memRef: "76.30",
    diff: "0",
  },
  {
    case: "systems: distribution-shift drop, Welch CI (n scores)",
    n: "1,000",
    reference: "SciPy",
    evalsuite: "0.133",
    ref: "0.768",
    speedup: "5.77×",
    memEs: "0.01",
    memRef: "0.02",
    diff: "0",
  },
  {
    case: "systems: distribution-shift drop, Welch CI (n scores)",
    n: "100,000",
    reference: "SciPy",
    evalsuite: "0.739",
    ref: "1.671",
    speedup: "2.26×",
    memEs: "0.76",
    memRef: "1.53",
    diff: "0",
  },
  {
    case: "systems: distribution-shift drop, Welch CI (n scores)",
    n: "1,000,000",
    reference: "SciPy",
    evalsuite: "13.292",
    ref: "16.853",
    speedup: "1.27×",
    memEs: "7.63",
    memRef: "15.26",
    diff: "0",
  },
  {
    case: "systems: invalid tool calls vs JSON Schema (10 tasks)",
    n: "1,000",
    reference: "jsonschema",
    evalsuite: "0.133",
    ref: "0.309",
    speedup: "2.32×",
    memEs: "0.00",
    memRef: "0.00",
    diff: "0",
  },
  {
    case: "systems: invalid tool calls vs JSON Schema (1000 tasks)",
    n: "100,000",
    reference: "jsonschema",
    evalsuite: "14.180",
    ref: "33.665",
    speedup: "2.37×",
    memEs: "0.70",
    memRef: "0.05",
    diff: "0",
  },
  {
    case: "systems: invalid tool calls vs JSON Schema (10000 tasks)",
    n: "1,000,000",
    reference: "jsonschema",
    evalsuite: "145.032",
    ref: "333.157",
    speedup: "2.30×",
    memEs: "7.10",
    memRef: "0.33",
    diff: "0",
  },
  {
    case: "systems: latency p50 / p95 / p99 (n requests)",
    n: "1,000",
    reference: "NumPy",
    evalsuite: "0.158",
    ref: "0.052",
    speedup: "0.33×",
    memEs: "0.01",
    memRef: "0.01",
    diff: "0",
  },
  {
    case: "systems: latency p50 / p95 / p99 (n requests)",
    n: "100,000",
    reference: "NumPy",
    evalsuite: "3.728",
    ref: "1.998",
    speedup: "0.54×",
    memEs: "0.77",
    memRef: "0.77",
    diff: "0",
  },
  {
    case: "systems: latency p50 / p95 / p99 (n requests)",
    n: "1,000,000",
    reference: "NumPy",
    evalsuite: "41.023",
    ref: "19.664",
    speedup: "0.48×",
    memEs: "7.63",
    memRef: "7.63",
    diff: "0",
  },
  {
    case: "systems: maintainability index (100 programs)",
    n: "100,000",
    reference: "radon",
    evalsuite: "13.903",
    ref: "14.967",
    speedup: "1.08×",
    memEs: "0.18",
    memRef: "0.04",
    diff: "0",
  },
  {
    case: "systems: maintainability index (1000 programs)",
    n: "1,000,000",
    reference: "radon",
    evalsuite: "138.344",
    ref: "168.738",
    speedup: "1.22×",
    memEs: "0.65",
    memRef: "0.07",
    diff: "0",
  },
  {
    case: "systems: maintainability index (4 programs)",
    n: "1,000",
    reference: "radon",
    evalsuite: "0.497",
    ref: "0.514",
    speedup: "1.03×",
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
            EvalSuite 0.5.1 (0.5.0 metrics plus the LLM-systems benchmark suite), Python 3.13, NumPy
            2.5.3, SciPy 1.18.1, scikit-learn 1.9.1, statsmodels 0.15.0, pycocotools 2.0.11, Linux
            x86_64. Fastest of 5 runs after a warm-up; peak memory measured with{" "}
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
            <strong>81 of 81 measurements agree with their reference</strong> across all five
            releases, and EvalSuite is faster in 56 of them (geometric-mean speed-up 1.89×).
          </p>
          <p>
            <strong>Many metrics at once is where EvalSuite is fastest.</strong>{" "}
            <code>evaluate()</code> validates the inputs once and builds the confusion matrix once,
            then derives all eight label metrics from it: 21–56× faster than eight separate
            scikit-learn calls. Sensitivity, specificity and both likelihood ratios together are
            3.2–11.2× faster.
          </p>
          <p>
            <strong>Calibration slope and intercept</strong> are 4.5–5.6× faster than
            statsmodels&apos; GLM and use far less memory, because EvalSuite fits the two small
            logistic models with a dedicated Newton–Raphson solver.
          </p>
          <p>
            <strong>Object detection matches pycocotools exactly</strong> on all twelve COCO numbers
            and is 1.1–1.6× as fast. Per-class Dice and IoU are 5.6–13.5× faster than building
            scikit-learn&apos;s confusion matrix. Hausdorff distance (0.7–0.8×) extracts surfaces
            and computes HD95 and ASSD alongside the maximum that SciPy returns.
          </p>
          <p>
            <strong>LLM metrics give the reference libraries&apos; numbers</strong> and run at about
            their speed: corpus BLEU and chrF 0.87–1.14× sacreBLEU, ROUGE 0.78–0.88× rouge-score,
            METEOR 1.13–1.16× NLTK, ranking metrics 3.6–7.5× ranx, JSON Schema compliance 2.0–2.4×
            jsonschema and Krippendorff&apos;s alpha 0.91–1.00× the krippendorff package.
          </p>
          <p>
            <strong>LLM systems (v0.5)</strong> match radon&apos;s maintainability index exactly
            (1.0–1.2× its speed), the codebleu package&apos;s n-gram terms (0.9–1.1×) and
            scikit-learn&apos;s AUROC for confidence (1.7–5.5×). Tool calls are checked against
            their JSON Schemas 2.3× faster than jsonschema, and the distribution-shift interval is
            1.3–5.8× faster than SciPy. Latency percentiles are 0.3–0.5× NumPy&apos;s speed because
            EvalSuite validates the input and also reports the mean, spread and p90.
          </p>
          <p>
            <strong>Hypothesis tests call SciPy</strong> for the statistic and p-value, so they
            match its speed at best. The Welch t-test is 0.4–0.9× SciPy&apos;s speed because
            EvalSuite also validates the inputs and computes the confidence interval and
            Cohen&apos;s d.
          </p>
          <p>
            <strong>Some rows are slower, and we show them.</strong> The diagnostic report
            (0.29–3.9× across sizes) validates labels and reports ten measures, where the reference
            computes seven intervals from counts it takes directly. Regression at 100,000 and
            1,000,000 values (0.71–0.85×) spends most of its time checking every value for NaN,
            infinity, shape and dtype.
          </p>
        </Section>
        <Section title="Reproduce on your machine">
          <pre className="overflow-x-auto rounded-lg border border-border bg-surface-muted/50 p-4 text-sm">
            <code>{`pip install "evalsuite-python[llm]" scikit-learn statsmodels pycocotools sacrebleu rouge-score ranx krippendorff jsonschema choix pot pycocoevalcap radon codebleu
evalsuite benchmark                    # every case at 1,000 / 100,000 / 1,000,000 samples
evalsuite benchmark --suite clinical   # only the v0.2 clinical, calibration and statistics cases
evalsuite benchmark --suite vision     # only the v0.3 segmentation and detection cases
evalsuite benchmark --suite llm        # only the v0.4 LLM cases
evalsuite benchmark --suite llmsys     # only the v0.5 LLM-systems cases (0.5.1)
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
