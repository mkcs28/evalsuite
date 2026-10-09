import type { Metadata } from "next";
import { Callout } from "@/components/ui/callout";
import { PageHeader, Section } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";

export const metadata: Metadata = {
  title: "Benchmarks",
  description:
    "Speed and memory of EvalSuite against scikit-learn, statsmodels, SciPy and pycocotools on the same data, with identical results.",
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

/** From BENCHMARKS.md in the package repository (evalsuite benchmark, EvalSuite 0.3.1, fastest of 5 runs). */
const SUITE_SUMMARY: SuiteSummary[] = [
  {
    suite: "Classification and regression",
    cases: 4,
    rows: 12,
    match: "12/12",
    faster: "10/12",
    geomean: "4.98×",
    range: "0.47×–33.31×",
  },
  {
    suite: "Clinical, calibration and statistics",
    cases: 8,
    rows: 24,
    match: "24/24",
    faster: "16/24",
    geomean: "1.54×",
    range: "0.20×–10.89×",
  },
  {
    suite: "Segmentation and object detection",
    cases: 3,
    rows: 9,
    match: "9/9",
    faster: "6/9",
    geomean: "2.04×",
    range: "0.73×–16.64×",
  },
  {
    suite: "Overall",
    cases: 15,
    rows: 45,
    match: "45/45",
    faster: "32/45",
    geomean: "2.22×",
    range: "0.20×–33.31×",
  },
];

/** Rows in alphabetical order of case, then by size. */
const CORE: Row[] = [
  {
    case: "10 classes: macro F1",
    n: "1,000",
    reference: "scikit-learn",
    evalsuite: "0.187",
    ref: "2.203",
    speedup: "11.77×",
    memEs: "0.05",
    memRef: "0.03",
    diff: "0",
  },
  {
    case: "10 classes: macro F1",
    n: "100,000",
    reference: "scikit-learn",
    evalsuite: "3.805",
    ref: "15.511",
    speedup: "4.08×",
    memEs: "3.05",
    memRef: "2.18",
    diff: "0",
  },
  {
    case: "10 classes: macro F1",
    n: "1,000,000",
    reference: "scikit-learn",
    evalsuite: "29.263",
    ref: "130.816",
    speedup: "4.47×",
    memEs: "30.52",
    memRef: "21.79",
    diff: "0",
  },
  {
    case: "Binary: 8 label metrics via evaluate()",
    n: "1,000",
    reference: "scikit-learn",
    evalsuite: "0.301",
    ref: "10.020",
    speedup: "33.31×",
    memEs: "0.05",
    memRef: "0.04",
    diff: "0",
  },
  {
    case: "Binary: 8 label metrics via evaluate()",
    n: "100,000",
    reference: "scikit-learn",
    evalsuite: "4.874",
    ref: "104.589",
    speedup: "21.46×",
    memEs: "3.21",
    memRef: "3.06",
    diff: "0",
  },
  {
    case: "Binary: 8 label metrics via evaluate()",
    n: "1,000,000",
    reference: "scikit-learn",
    evalsuite: "39.501",
    ref: "1084.077",
    speedup: "27.44×",
    memEs: "31.54",
    memRef: "30.53",
    diff: "0",
  },
  {
    case: "Binary: ROC AUC",
    n: "1,000",
    reference: "scikit-learn",
    evalsuite: "0.305",
    ref: "1.936",
    speedup: "6.35×",
    memEs: "0.09",
    memRef: "0.08",
    diff: "1.1e-16",
  },
  {
    case: "Binary: ROC AUC",
    n: "100,000",
    reference: "scikit-learn",
    evalsuite: "17.567",
    ref: "30.822",
    speedup: "1.75×",
    memEs: "9.16",
    memRef: "7.64",
    diff: "1.1e-16",
  },
  {
    case: "Binary: ROC AUC",
    n: "1,000,000",
    reference: "scikit-learn",
    evalsuite: "194.983",
    ref: "348.267",
    speedup: "1.79×",
    memEs: "91.56",
    memRef: "76.30",
    diff: "0",
  },
  {
    case: "Regression: MAE, MSE, RMSE, R² via evaluate()",
    n: "1,000",
    reference: "scikit-learn",
    evalsuite: "0.151",
    ref: "1.057",
    speedup: "6.99×",
    memEs: "0.03",
    memRef: "0.02",
    diff: "0",
  },
  {
    case: "Regression: MAE, MSE, RMSE, R² via evaluate()",
    n: "100,000",
    reference: "scikit-learn",
    evalsuite: "1.887",
    ref: "1.622",
    speedup: "0.86×",
    memEs: "2.29",
    memRef: "1.53",
    diff: "0",
  },
  {
    case: "Regression: MAE, MSE, RMSE, R² via evaluate()",
    n: "1,000,000",
    reference: "scikit-learn",
    evalsuite: "23.082",
    ref: "10.751",
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
    evalsuite: "0.493",
    ref: "2.678",
    speedup: "5.43×",
    memEs: "0.10",
    memRef: "0.60",
    diff: "2.8e-16",
  },
  {
    case: "Calibration: slope and intercept",
    n: "100,000",
    reference: "statsmodels",
    evalsuite: "18.060",
    ref: "98.404",
    speedup: "5.45×",
    memEs: "8.46",
    memRef: "58.00",
    diff: "5.6e-17",
  },
  {
    case: "Calibration: slope and intercept",
    n: "1,000,000",
    reference: "statsmodels",
    evalsuite: "192.967",
    ref: "1068.024",
    speedup: "5.53×",
    memEs: "83.99",
    memRef: "579.85",
    diff: "3.3e-16",
  },
  {
    case: "Clinical: diagnostic report (7 CIs)",
    n: "1,000",
    reference: "statsmodels",
    evalsuite: "0.143",
    ref: "0.483",
    speedup: "3.37×",
    memEs: "0.05",
    memRef: "0.01",
    diff: "1.1e-14",
  },
  {
    case: "Clinical: diagnostic report (7 CIs)",
    n: "100,000",
    reference: "statsmodels",
    evalsuite: "2.713",
    ref: "1.150",
    speedup: "0.42×",
    memEs: "3.05",
    memRef: "0.29",
    diff: "2.8e-14",
  },
  {
    case: "Clinical: diagnostic report (7 CIs)",
    n: "1,000,000",
    reference: "statsmodels",
    evalsuite: "23.480",
    ref: "4.741",
    speedup: "0.20×",
    memEs: "30.52",
    memRef: "1.91",
    diff: "2.5e-14",
  },
  {
    case: "Clinical: sensitivity, specificity, LR+, LR−",
    n: "1,000",
    reference: "scikit-learn",
    evalsuite: "0.325",
    ref: "3.543",
    speedup: "10.89×",
    memEs: "0.05",
    memRef: "0.03",
    diff: "4.4e-16",
  },
  {
    case: "Clinical: sensitivity, specificity, LR+, LR−",
    n: "100,000",
    reference: "scikit-learn",
    evalsuite: "10.088",
    ref: "45.050",
    speedup: "4.47×",
    memEs: "3.05",
    memRef: "2.24",
    diff: "8.9e-16",
  },
  {
    case: "Clinical: sensitivity, specificity, LR+, LR−",
    n: "1,000,000",
    reference: "scikit-learn",
    evalsuite: "69.122",
    ref: "414.038",
    speedup: "5.99×",
    memEs: "30.52",
    memRef: "22.33",
    diff: "2.8e-17",
  },
  {
    case: "Decision curve: 99 thresholds",
    n: "1,000",
    reference: "NumPy loop",
    evalsuite: "0.160",
    ref: "0.802",
    speedup: "5.01×",
    memEs: "0.07",
    memRef: "0.01",
    diff: "5.6e-17",
  },
  {
    case: "Decision curve: 99 thresholds",
    n: "100,000",
    reference: "NumPy loop",
    evalsuite: "10.888",
    ref: "14.087",
    speedup: "1.29×",
    memEs: "6.87",
    memRef: "0.29",
    diff: "5.6e-17",
  },
  {
    case: "Decision curve: 99 thresholds",
    n: "1,000,000",
    reference: "NumPy loop",
    evalsuite: "156.333",
    ref: "181.613",
    speedup: "1.16×",
    memEs: "68.67",
    memRef: "1.97",
    diff: "5.6e-17",
  },
  {
    case: "Multiple testing: Hochberg (n p-values)",
    n: "1,000",
    reference: "statsmodels",
    evalsuite: "0.043",
    ref: "0.049",
    speedup: "1.15×",
    memEs: "0.05",
    memRef: "0.05",
    diff: "0",
  },
  {
    case: "Multiple testing: Hochberg (n p-values)",
    n: "100,000",
    reference: "statsmodels",
    evalsuite: "4.047",
    ref: "4.659",
    speedup: "1.15×",
    memEs: "4.58",
    memRef: "3.97",
    diff: "0",
  },
  {
    case: "Multiple testing: Hochberg (n p-values)",
    n: "1,000,000",
    reference: "statsmodels",
    evalsuite: "81.990",
    ref: "108.041",
    speedup: "1.32×",
    memEs: "45.78",
    memRef: "39.17",
    diff: "0",
  },
  {
    case: "Statistics: Cramér's V (5×5 table)",
    n: "1,000",
    reference: "SciPy",
    evalsuite: "0.225",
    ref: "0.241",
    speedup: "1.07×",
    memEs: "0.00",
    memRef: "0.00",
    diff: "0",
  },
  {
    case: "Statistics: Cramér's V (5×5 table)",
    n: "100,000",
    reference: "SciPy",
    evalsuite: "0.292",
    ref: "0.241",
    speedup: "0.83×",
    memEs: "0.00",
    memRef: "0.00",
    diff: "0",
  },
  {
    case: "Statistics: Cramér's V (5×5 table)",
    n: "1,000,000",
    reference: "SciPy",
    evalsuite: "0.480",
    ref: "0.422",
    speedup: "0.88×",
    memEs: "0.00",
    memRef: "0.00",
    diff: "0",
  },
  {
    case: "Statistics: Mann–Whitney U",
    n: "1,000",
    reference: "SciPy",
    evalsuite: "0.676",
    ref: "0.547",
    speedup: "0.81×",
    memEs: "0.16",
    memRef: "0.14",
    diff: "0",
  },
  {
    case: "Statistics: Mann–Whitney U",
    n: "100,000",
    reference: "SciPy",
    evalsuite: "30.010",
    ref: "31.381",
    speedup: "1.05×",
    memEs: "15.45",
    memRef: "13.93",
    diff: "0",
  },
  {
    case: "Statistics: Mann–Whitney U",
    n: "1,000,000",
    reference: "SciPy",
    evalsuite: "349.746",
    ref: "350.183",
    speedup: "1.00×",
    memEs: "154.50",
    memRef: "139.24",
    diff: "0",
  },
  {
    case: "Statistics: Welch t-test",
    n: "1,000",
    reference: "SciPy",
    evalsuite: "0.725",
    ref: "0.622",
    speedup: "0.86×",
    memEs: "0.04",
    memRef: "0.02",
    diff: "0",
  },
  {
    case: "Statistics: Welch t-test",
    n: "100,000",
    reference: "SciPy",
    evalsuite: "2.103",
    ref: "1.240",
    speedup: "0.59×",
    memEs: "3.06",
    memRef: "1.53",
    diff: "0",
  },
  {
    case: "Statistics: Welch t-test",
    n: "1,000,000",
    reference: "SciPy",
    evalsuite: "14.524",
    ref: "7.161",
    speedup: "0.49×",
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
    evalsuite: "12.039",
    ref: "22.435",
    speedup: "1.86×",
    memEs: "0.54",
    memRef: "1.33",
    diff: "0",
  },
  {
    case: "Detection: COCO evaluation (100 images)",
    n: "100,000",
    reference: "pycocotools",
    evalsuite: "89.151",
    ref: "98.418",
    speedup: "1.10×",
    memEs: "1.15",
    memRef: "4.32",
    diff: "0",
  },
  {
    case: "Detection: COCO evaluation (1000 images)",
    n: "1,000,000",
    reference: "pycocotools",
    evalsuite: "817.295",
    ref: "983.691",
    speedup: "1.20×",
    memEs: "7.03",
    memRef: "34.75",
    diff: "0",
  },
  {
    case: "Segmentation: Dice and IoU per class (n = pixels)",
    n: "1,000",
    reference: "scikit-learn",
    evalsuite: "0.200",
    ref: "3.326",
    speedup: "16.64×",
    memEs: "0.16",
    memRef: "0.10",
    diff: "0",
  },
  {
    case: "Segmentation: Dice and IoU per class (n = pixels)",
    n: "100,000",
    reference: "scikit-learn",
    evalsuite: "4.867",
    ref: "26.617",
    speedup: "5.47×",
    memEs: "0.17",
    memRef: "2.32",
    diff: "0",
  },
  {
    case: "Segmentation: Dice and IoU per class (n = pixels)",
    n: "1,000,000",
    reference: "scikit-learn",
    evalsuite: "42.958",
    ref: "290.018",
    speedup: "6.75×",
    memEs: "0.25",
    memRef: "23.48",
    diff: "0",
  },
  {
    case: "Segmentation: Hausdorff distance (1 image)",
    n: "1,000",
    reference: "SciPy",
    evalsuite: "0.561",
    ref: "0.412",
    speedup: "0.73×",
    memEs: "0.15",
    memRef: "0.03",
    diff: "0",
  },
  {
    case: "Segmentation: Hausdorff distance (24 images)",
    n: "100,000",
    reference: "SciPy",
    evalsuite: "11.991",
    ref: "8.698",
    speedup: "0.73×",
    memEs: "0.15",
    memRef: "0.03",
    diff: "0",
  },
  {
    case: "Segmentation: Hausdorff distance (50 images)",
    n: "1,000,000",
    reference: "SciPy",
    evalsuite: "27.050",
    ref: "20.239",
    speedup: "0.75×",
    memEs: "0.15",
    memRef: "0.03",
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
        meta={<StatusBadge status="implemented" label="v0.3.1 results" />}
      >
        Speed and peak memory of EvalSuite against reference implementations (scikit-learn,
        statsmodels, SciPy, pycocotools), computing the same quantities on the same data. Every
        result agrees with the reference to floating-point rounding.
      </PageHeader>
      <div className="mx-auto max-w-[1680px] px-4 sm:px-6">
        <Callout title="Environment">
          <p>
            EvalSuite 0.3.1, Python 3.12.3, NumPy 2.5.3, SciPy 1.18.1, scikit-learn 1.9.1,
            statsmodels 0.15.0, pycocotools 2.0.11, Linux x86_64. Fastest of 5 runs after a warm-up;
            peak memory measured with <code>tracemalloc</code>. Speed-up above 1 means EvalSuite is
            faster. Each row names the reference implementation it is compared with. The same
            results (every answer matching the reference) were reproduced on Windows with Python
            3.14.
          </p>
        </Callout>

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

        <Section title="Reading the results">
          <p>
            <strong>Many metrics at once is where EvalSuite is fastest.</strong>{" "}
            <code>evaluate()</code> validates the inputs once and builds the confusion matrix once,
            then derives all eight label metrics from it: 21–33× faster than eight separate
            scikit-learn calls. Sensitivity, specificity and both likelihood ratios together are
            4–11× faster.
          </p>
          <p>
            <strong>Calibration slope and intercept</strong> are 5–6× faster than statsmodels&apos;
            GLM and use far less memory (84 MiB against 580 MiB at a million samples), because
            EvalSuite fits the two small logistic models with a dedicated Newton–Raphson solver.
          </p>
          <p>
            <strong>Object detection matches pycocotools exactly</strong> on all twelve COCO numbers
            and is 1.1–1.9× faster, using a fifth of its memory. Per-class Dice and IoU are 5–17×
            faster than building scikit-learn&apos;s confusion matrix. Hausdorff distance (0.7–0.8×)
            extracts surfaces and computes HD95 and ASSD alongside the maximum that SciPy returns.
          </p>
          <p>
            <strong>Hypothesis tests call SciPy</strong> for the statistic and p-value, so they
            match its speed at best. The Welch t-test is about half SciPy&apos;s speed at large n
            because EvalSuite also validates the inputs and computes the confidence interval and
            Cohen&apos;s d.
          </p>
          <p>
            <strong>Some rows are slower, and we show them.</strong> The diagnostic report (0.2–0.4×
            at large n) validates labels and reports ten measures, where the reference computes
            seven intervals from counts it takes directly. Regression on a million values (0.5×)
            spends most of its ~20 ms checking every value for NaN, infinity, shape and dtype.
          </p>
        </Section>
        <Section title="Reproduce on your machine">
          <pre className="overflow-x-auto rounded-lg border border-border bg-surface-muted/50 p-4 text-sm">
            <code>{`pip install evalsuite-python scikit-learn statsmodels pycocotools
evalsuite benchmark                    # every case at 1,000 / 100,000 / 1,000,000 samples
evalsuite benchmark --suite clinical   # only the v0.2 clinical, calibration and statistics cases
evalsuite benchmark --suite vision     # only the v0.3 segmentation and detection cases
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
