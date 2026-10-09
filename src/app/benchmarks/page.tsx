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

/** From BENCHMARKS.md in the package repository (evalsuite benchmark, EvalSuite 0.3.0, fastest of 5 runs). */
const CORE: Row[] = [
  {
    case: "Binary: 8 label metrics via evaluate()",
    n: "1,000",
    reference: "scikit-learn",
    evalsuite: "0.255",
    ref: "9.554",
    speedup: "37.42×",
    memEs: "0.05",
    memRef: "0.05",
    diff: "0",
  },
  {
    case: "10 classes: macro F1",
    n: "1,000",
    reference: "scikit-learn",
    evalsuite: "0.102",
    ref: "1.319",
    speedup: "12.95×",
    memEs: "0.05",
    memRef: "0.03",
    diff: "0",
  },
  {
    case: "Binary: ROC AUC",
    n: "1,000",
    reference: "scikit-learn",
    evalsuite: "0.176",
    ref: "1.471",
    speedup: "8.35×",
    memEs: "0.09",
    memRef: "0.08",
    diff: "1.1e-16",
  },
  {
    case: "Regression: MAE, MSE, RMSE, R² via evaluate()",
    n: "1,000",
    reference: "scikit-learn",
    evalsuite: "0.091",
    ref: "0.648",
    speedup: "7.11×",
    memEs: "0.03",
    memRef: "0.02",
    diff: "0",
  },
  {
    case: "Binary: 8 label metrics via evaluate()",
    n: "100,000",
    reference: "scikit-learn",
    evalsuite: "4.382",
    ref: "112.468",
    speedup: "25.67×",
    memEs: "3.21",
    memRef: "3.07",
    diff: "0",
  },
  {
    case: "10 classes: macro F1",
    n: "100,000",
    reference: "scikit-learn",
    evalsuite: "4.098",
    ref: "13.204",
    speedup: "3.22×",
    memEs: "3.05",
    memRef: "2.18",
    diff: "0",
  },
  {
    case: "Binary: ROC AUC",
    n: "100,000",
    reference: "scikit-learn",
    evalsuite: "16.161",
    ref: "31.224",
    speedup: "1.93×",
    memEs: "9.16",
    memRef: "7.64",
    diff: "1.1e-16",
  },
  {
    case: "Regression: MAE, MSE, RMSE, R² via evaluate()",
    n: "100,000",
    reference: "scikit-learn",
    evalsuite: "1.905",
    ref: "1.587",
    speedup: "0.83×",
    memEs: "2.29",
    memRef: "1.53",
    diff: "0",
  },
  {
    case: "Binary: 8 label metrics via evaluate()",
    n: "1,000,000",
    reference: "scikit-learn",
    evalsuite: "34.020",
    ref: "1045.806",
    speedup: "30.74×",
    memEs: "31.54",
    memRef: "30.53",
    diff: "0",
  },
  {
    case: "10 classes: macro F1",
    n: "1,000,000",
    reference: "scikit-learn",
    evalsuite: "31.727",
    ref: "129.069",
    speedup: "4.07×",
    memEs: "30.52",
    memRef: "21.79",
    diff: "0",
  },
  {
    case: "Binary: ROC AUC",
    n: "1,000,000",
    reference: "scikit-learn",
    evalsuite: "203.583",
    ref: "348.552",
    speedup: "1.71×",
    memEs: "91.56",
    memRef: "76.30",
    diff: "0",
  },
  {
    case: "Regression: MAE, MSE, RMSE, R² via evaluate()",
    n: "1,000,000",
    reference: "scikit-learn",
    evalsuite: "21.052",
    ref: "10.722",
    speedup: "0.51×",
    memEs: "22.89",
    memRef: "15.26",
    diff: "0",
  },
];

const CLINICAL: Row[] = [
  {
    case: "Clinical: sensitivity, specificity, LR+, LR−",
    n: "1,000",
    reference: "scikit-learn",
    evalsuite: "0.310",
    ref: "3.449",
    speedup: "11.12×",
    memEs: "0.05",
    memRef: "0.03",
    diff: "4.4e-16",
  },
  {
    case: "Clinical: diagnostic report (7 CIs)",
    n: "1,000",
    reference: "statsmodels",
    evalsuite: "0.151",
    ref: "0.531",
    speedup: "3.52×",
    memEs: "0.05",
    memRef: "0.01",
    diff: "1.1e-14",
  },
  {
    case: "Calibration: slope and intercept",
    n: "1,000",
    reference: "statsmodels",
    evalsuite: "0.487",
    ref: "2.513",
    speedup: "5.16×",
    memEs: "0.10",
    memRef: "0.61",
    diff: "2.8e-16",
  },
  {
    case: "Decision curve: 99 thresholds",
    n: "1,000",
    reference: "NumPy loop",
    evalsuite: "0.156",
    ref: "0.897",
    speedup: "5.76×",
    memEs: "0.07",
    memRef: "0.01",
    diff: "5.6e-17",
  },
  {
    case: "Statistics: Welch t-test",
    n: "1,000",
    reference: "SciPy",
    evalsuite: "0.819",
    ref: "0.623",
    speedup: "0.76×",
    memEs: "0.04",
    memRef: "0.02",
    diff: "0",
  },
  {
    case: "Statistics: Mann–Whitney U",
    n: "1,000",
    reference: "SciPy",
    evalsuite: "0.649",
    ref: "0.602",
    speedup: "0.93×",
    memEs: "0.16",
    memRef: "0.14",
    diff: "0",
  },
  {
    case: "Statistics: Cramér's V (5×5 table)",
    n: "1,000",
    reference: "SciPy",
    evalsuite: "0.260",
    ref: "0.234",
    speedup: "0.90×",
    memEs: "0.00",
    memRef: "0.00",
    diff: "0",
  },
  {
    case: "Multiple testing: Hochberg (n p-values)",
    n: "1,000",
    reference: "statsmodels",
    evalsuite: "0.046",
    ref: "0.053",
    speedup: "1.16×",
    memEs: "0.05",
    memRef: "0.05",
    diff: "0",
  },
  {
    case: "Clinical: sensitivity, specificity, LR+, LR−",
    n: "100,000",
    reference: "scikit-learn",
    evalsuite: "11.091",
    ref: "42.599",
    speedup: "3.84×",
    memEs: "3.05",
    memRef: "2.24",
    diff: "8.9e-16",
  },
  {
    case: "Clinical: diagnostic report (7 CIs)",
    n: "100,000",
    reference: "statsmodels",
    evalsuite: "2.895",
    ref: "0.976",
    speedup: "0.34×",
    memEs: "3.05",
    memRef: "0.29",
    diff: "2.8e-14",
  },
  {
    case: "Calibration: slope and intercept",
    n: "100,000",
    reference: "statsmodels",
    evalsuite: "18.032",
    ref: "100.467",
    speedup: "5.57×",
    memEs: "8.46",
    memRef: "58.00",
    diff: "5.6e-17",
  },
  {
    case: "Decision curve: 99 thresholds",
    n: "100,000",
    reference: "NumPy loop",
    evalsuite: "12.551",
    ref: "15.825",
    speedup: "1.26×",
    memEs: "6.87",
    memRef: "0.29",
    diff: "5.6e-17",
  },
  {
    case: "Statistics: Welch t-test",
    n: "100,000",
    reference: "SciPy",
    evalsuite: "2.086",
    ref: "1.306",
    speedup: "0.63×",
    memEs: "3.06",
    memRef: "1.53",
    diff: "0",
  },
  {
    case: "Statistics: Mann–Whitney U",
    n: "100,000",
    reference: "SciPy",
    evalsuite: "31.660",
    ref: "30.400",
    speedup: "0.96×",
    memEs: "15.45",
    memRef: "13.93",
    diff: "0",
  },
  {
    case: "Statistics: Cramér's V (5×5 table)",
    n: "100,000",
    reference: "SciPy",
    evalsuite: "0.259",
    ref: "0.262",
    speedup: "1.01×",
    memEs: "0.00",
    memRef: "0.00",
    diff: "0",
  },
  {
    case: "Multiple testing: Hochberg (n p-values)",
    n: "100,000",
    reference: "statsmodels",
    evalsuite: "4.123",
    ref: "4.428",
    speedup: "1.07×",
    memEs: "4.58",
    memRef: "3.97",
    diff: "0",
  },
  {
    case: "Clinical: sensitivity, specificity, LR+, LR−",
    n: "1,000,000",
    reference: "scikit-learn",
    evalsuite: "75.990",
    ref: "426.237",
    speedup: "5.61×",
    memEs: "30.52",
    memRef: "22.33",
    diff: "2.8e-17",
  },
  {
    case: "Clinical: diagnostic report (7 CIs)",
    n: "1,000,000",
    reference: "statsmodels",
    evalsuite: "18.828",
    ref: "5.073",
    speedup: "0.27×",
    memEs: "30.52",
    memRef: "1.91",
    diff: "2.5e-14",
  },
  {
    case: "Calibration: slope and intercept",
    n: "1,000,000",
    reference: "statsmodels",
    evalsuite: "192.705",
    ref: "1096.539",
    speedup: "5.69×",
    memEs: "83.99",
    memRef: "579.85",
    diff: "3.3e-16",
  },
  {
    case: "Decision curve: 99 thresholds",
    n: "1,000,000",
    reference: "NumPy loop",
    evalsuite: "171.516",
    ref: "198.074",
    speedup: "1.15×",
    memEs: "68.67",
    memRef: "1.97",
    diff: "5.6e-17",
  },
  {
    case: "Statistics: Welch t-test",
    n: "1,000,000",
    reference: "SciPy",
    evalsuite: "16.322",
    ref: "7.974",
    speedup: "0.49×",
    memEs: "30.52",
    memRef: "15.26",
    diff: "0",
  },
  {
    case: "Statistics: Mann–Whitney U",
    n: "1,000,000",
    reference: "SciPy",
    evalsuite: "395.086",
    ref: "378.419",
    speedup: "0.96×",
    memEs: "154.50",
    memRef: "139.24",
    diff: "0",
  },
  {
    case: "Statistics: Cramér's V (5×5 table)",
    n: "1,000,000",
    reference: "SciPy",
    evalsuite: "0.290",
    ref: "0.283",
    speedup: "0.97×",
    memEs: "0.00",
    memRef: "0.00",
    diff: "0",
  },
  {
    case: "Multiple testing: Hochberg (n p-values)",
    n: "1,000,000",
    reference: "statsmodels",
    evalsuite: "85.440",
    ref: "88.325",
    speedup: "1.03×",
    memEs: "45.78",
    memRef: "39.17",
    diff: "0",
  },
];

const VISION: Row[] = [
  {
    case: "Segmentation: Dice and IoU per class (n = pixels)",
    n: "1,000",
    reference: "scikit-learn",
    evalsuite: "0.232",
    ref: "3.282",
    speedup: "14.15×",
    memEs: "0.16",
    memRef: "0.10",
    diff: "0",
  },
  {
    case: "Segmentation: Hausdorff distance (1 image)",
    n: "1,000",
    reference: "SciPy",
    evalsuite: "0.548",
    ref: "0.399",
    speedup: "0.73×",
    memEs: "0.15",
    memRef: "0.03",
    diff: "0",
  },
  {
    case: "Detection: COCO evaluation (10 images)",
    n: "1,000",
    reference: "pycocotools",
    evalsuite: "12.599",
    ref: "22.011",
    speedup: "1.75×",
    memEs: "0.54",
    memRef: "1.33",
    diff: "0",
  },
  {
    case: "Segmentation: Dice and IoU per class (n = pixels)",
    n: "100,000",
    reference: "scikit-learn",
    evalsuite: "3.719",
    ref: "26.436",
    speedup: "7.11×",
    memEs: "0.17",
    memRef: "2.32",
    diff: "0",
  },
  {
    case: "Segmentation: Hausdorff distance (24 images)",
    n: "100,000",
    reference: "SciPy",
    evalsuite: "11.498",
    ref: "9.098",
    speedup: "0.79×",
    memEs: "0.15",
    memRef: "0.03",
    diff: "0",
  },
  {
    case: "Detection: COCO evaluation (100 images)",
    n: "100,000",
    reference: "pycocotools",
    evalsuite: "81.104",
    ref: "91.893",
    speedup: "1.13×",
    memEs: "1.15",
    memRef: "4.32",
    diff: "0",
  },
  {
    case: "Segmentation: Dice and IoU per class (n = pixels)",
    n: "1,000,000",
    reference: "scikit-learn",
    evalsuite: "40.178",
    ref: "281.966",
    speedup: "7.02×",
    memEs: "0.25",
    memRef: "23.48",
    diff: "0",
  },
  {
    case: "Segmentation: Hausdorff distance (50 images)",
    n: "1,000,000",
    reference: "SciPy",
    evalsuite: "26.171",
    ref: "20.775",
    speedup: "0.79×",
    memEs: "0.15",
    memRef: "0.03",
    diff: "0",
  },
  {
    case: "Detection: COCO evaluation (1000 images)",
    n: "1,000,000",
    reference: "pycocotools",
    evalsuite: "967.372",
    ref: "980.558",
    speedup: "1.01×",
    memEs: "7.03",
    memRef: "34.75",
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
        meta={<StatusBadge status="implemented" label="v0.3.0 results" />}
      >
        Speed and peak memory of EvalSuite against reference implementations (scikit-learn,
        statsmodels, SciPy, pycocotools), computing the same quantities on the same data. Every
        result agrees with the reference to floating-point rounding.
      </PageHeader>
      <div className="mx-auto max-w-[1680px] px-4 sm:px-6">
        <Callout title="Environment">
          <p>
            EvalSuite 0.3.0, Python 3.12.3, NumPy 2.5.3, SciPy 1.18.1, scikit-learn 1.9.1,
            statsmodels 0.15.0, pycocotools 2.0.11, Linux x86_64. Fastest of 5 runs after a warm-up;
            peak memory measured with <code>tracemalloc</code>. Speed-up above 1 means EvalSuite is
            faster. Each row names the reference implementation it is compared with. The same
            results (every answer matching the reference) were reproduced on Windows with Python
            3.14.
          </p>
        </Callout>

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
            then derives all eight label metrics from it: 26–37× faster than eight separate
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
            and is 1.0–1.8× faster, using a fifth of its memory. Per-class Dice and IoU are 7–14×
            faster than building scikit-learn&apos;s confusion matrix. Hausdorff distance (0.8×)
            extracts surfaces and computes HD95 and ASSD alongside the maximum that SciPy returns.
          </p>
          <p>
            <strong>Hypothesis tests call SciPy</strong> for the statistic and p-value, so they
            match its speed at best. The Welch t-test is about half SciPy&apos;s speed at large n
            because EvalSuite also validates the inputs and computes the confidence interval and
            Cohen&apos;s d.
          </p>
          <p>
            <strong>Some rows are slower, and we show them.</strong> The diagnostic report (0.3× at
            large n) validates labels and reports ten measures, where the reference computes seven
            intervals from counts it takes directly. Regression on a million values (0.5×) spends
            most of its ~20 ms checking every value for NaN, infinity, shape and dtype.
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
