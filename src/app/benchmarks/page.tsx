import type { Metadata } from "next";
import { Callout } from "@/components/ui/callout";
import { PageHeader, Section } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";

export const metadata: Metadata = {
  title: "Benchmarks",
  description:
    "Speed and memory of EvalSuite against scikit-learn, statsmodels and SciPy on the same data, with identical results.",
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

/** From BENCHMARKS.md in the package repository (evalsuite benchmark, EvalSuite 0.2.1, fastest of 5 runs). */
const CORE: Row[] = [
  {
    case: "Binary: 8 label metrics via evaluate()",
    n: "1,000",
    reference: "scikit-learn",
    evalsuite: "0.276",
    ref: "8.409",
    speedup: "30.47×",
    memEs: "0.05",
    memRef: "0.05",
    diff: "0",
  },
  {
    case: "10 classes: macro F1",
    n: "1,000",
    reference: "scikit-learn",
    evalsuite: "0.103",
    ref: "1.166",
    speedup: "11.32×",
    memEs: "0.05",
    memRef: "0.03",
    diff: "0",
  },
  {
    case: "Binary: ROC AUC",
    n: "1,000",
    reference: "scikit-learn",
    evalsuite: "0.161",
    ref: "1.425",
    speedup: "8.86×",
    memEs: "0.09",
    memRef: "0.08",
    diff: "1.1e-16",
  },
  {
    case: "Regression: MAE, MSE, RMSE, R² via evaluate()",
    n: "1,000",
    reference: "scikit-learn",
    evalsuite: "0.093",
    ref: "0.606",
    speedup: "6.53×",
    memEs: "0.03",
    memRef: "0.02",
    diff: "0",
  },
  {
    case: "Binary: 8 label metrics via evaluate()",
    n: "100,000",
    reference: "scikit-learn",
    evalsuite: "4.028",
    ref: "104.399",
    speedup: "25.92×",
    memEs: "3.21",
    memRef: "3.07",
    diff: "0",
  },
  {
    case: "10 classes: macro F1",
    n: "100,000",
    reference: "scikit-learn",
    evalsuite: "4.511",
    ref: "16.272",
    speedup: "3.61×",
    memEs: "3.05",
    memRef: "2.18",
    diff: "0",
  },
  {
    case: "Binary: ROC AUC",
    n: "100,000",
    reference: "scikit-learn",
    evalsuite: "15.178",
    ref: "28.997",
    speedup: "1.91×",
    memEs: "9.16",
    memRef: "7.64",
    diff: "1.1e-16",
  },
  {
    case: "Regression: MAE, MSE, RMSE, R² via evaluate()",
    n: "100,000",
    reference: "scikit-learn",
    evalsuite: "1.960",
    ref: "1.708",
    speedup: "0.87×",
    memEs: "2.29",
    memRef: "1.53",
    diff: "0",
  },
  {
    case: "Binary: 8 label metrics via evaluate()",
    n: "1,000,000",
    reference: "scikit-learn",
    evalsuite: "30.225",
    ref: "1020.196",
    speedup: "33.75×",
    memEs: "31.54",
    memRef: "30.53",
    diff: "0",
  },
  {
    case: "10 classes: macro F1",
    n: "1,000,000",
    reference: "scikit-learn",
    evalsuite: "22.373",
    ref: "128.679",
    speedup: "5.75×",
    memEs: "30.52",
    memRef: "21.79",
    diff: "0",
  },
  {
    case: "Binary: ROC AUC",
    n: "1,000,000",
    reference: "scikit-learn",
    evalsuite: "173.236",
    ref: "300.584",
    speedup: "1.74×",
    memEs: "91.56",
    memRef: "76.30",
    diff: "1.1e-16",
  },
  {
    case: "Regression: MAE, MSE, RMSE, R² via evaluate()",
    n: "1,000,000",
    reference: "scikit-learn",
    evalsuite: "19.067",
    ref: "9.739",
    speedup: "0.51×",
    memEs: "22.89",
    memRef: "15.26",
    diff: "0",
  },
];

/** v0.2.0 clinical, calibration and statistics functions against their reference implementations. */
const CLINICAL: Row[] = [
  {
    case: "Clinical: sensitivity, specificity, LR+, LR−",
    n: "1,000",
    reference: "scikit-learn",
    evalsuite: "0.343",
    ref: "3.682",
    speedup: "10.72×",
    memEs: "0.05",
    memRef: "0.03",
    diff: "4.4e-16",
  },
  {
    case: "Clinical: diagnostic report (7 CIs)",
    n: "1,000",
    reference: "statsmodels",
    evalsuite: "0.147",
    ref: "0.508",
    speedup: "3.45×",
    memEs: "0.05",
    memRef: "0.01",
    diff: "1.1e-14",
  },
  {
    case: "Calibration: slope and intercept",
    n: "1,000",
    reference: "statsmodels",
    evalsuite: "0.459",
    ref: "2.339",
    speedup: "5.10×",
    memEs: "0.10",
    memRef: "0.61",
    diff: "2.8e-16",
  },
  {
    case: "Decision curve: 99 thresholds",
    n: "1,000",
    reference: "NumPy loop",
    evalsuite: "0.152",
    ref: "0.842",
    speedup: "5.53×",
    memEs: "0.07",
    memRef: "0.01",
    diff: "5.6e-17",
  },
  {
    case: "Statistics: Welch t-test",
    n: "1,000",
    reference: "SciPy",
    evalsuite: "0.687",
    ref: "0.542",
    speedup: "0.79×",
    memEs: "0.04",
    memRef: "0.02",
    diff: "0",
  },
  {
    case: "Statistics: Mann–Whitney U",
    n: "1,000",
    reference: "SciPy",
    evalsuite: "0.630",
    ref: "0.575",
    speedup: "0.91×",
    memEs: "0.16",
    memRef: "0.14",
    diff: "0",
  },
  {
    case: "Statistics: Cramér's V (5×5 table)",
    n: "1,000",
    reference: "SciPy",
    evalsuite: "0.253",
    ref: "0.273",
    speedup: "1.08×",
    memEs: "0.00",
    memRef: "0.00",
    diff: "0",
  },
  {
    case: "Multiple testing: Hochberg (n p-values)",
    n: "1,000",
    reference: "statsmodels",
    evalsuite: "0.044",
    ref: "0.050",
    speedup: "1.16×",
    memEs: "0.05",
    memRef: "0.05",
    diff: "0",
  },
  {
    case: "Clinical: sensitivity, specificity, LR+, LR−",
    n: "100,000",
    reference: "scikit-learn",
    evalsuite: "10.355",
    ref: "43.505",
    speedup: "4.20×",
    memEs: "3.05",
    memRef: "2.24",
    diff: "8.9e-16",
  },
  {
    case: "Clinical: diagnostic report (7 CIs)",
    n: "100,000",
    reference: "statsmodels",
    evalsuite: "2.537",
    ref: "0.870",
    speedup: "0.34×",
    memEs: "3.05",
    memRef: "0.29",
    diff: "0",
  },
  {
    case: "Calibration: slope and intercept",
    n: "100,000",
    reference: "statsmodels",
    evalsuite: "17.503",
    ref: "95.133",
    speedup: "5.44×",
    memEs: "8.46",
    memRef: "58.00",
    diff: "2.2e-16",
  },
  {
    case: "Decision curve: 99 thresholds",
    n: "100,000",
    reference: "NumPy loop",
    evalsuite: "12.774",
    ref: "13.534",
    speedup: "1.06×",
    memEs: "6.87",
    memRef: "0.29",
    diff: "5.6e-17",
  },
  {
    case: "Statistics: Welch t-test",
    n: "100,000",
    reference: "SciPy",
    evalsuite: "1.966",
    ref: "1.140",
    speedup: "0.58×",
    memEs: "3.06",
    memRef: "1.53",
    diff: "0",
  },
  {
    case: "Statistics: Mann–Whitney U",
    n: "100,000",
    reference: "SciPy",
    evalsuite: "28.748",
    ref: "30.390",
    speedup: "1.06×",
    memEs: "15.45",
    memRef: "13.93",
    diff: "0",
  },
  {
    case: "Statistics: Cramér's V (5×5 table)",
    n: "100,000",
    reference: "SciPy",
    evalsuite: "0.225",
    ref: "0.217",
    speedup: "0.97×",
    memEs: "0.00",
    memRef: "0.00",
    diff: "0",
  },
  {
    case: "Multiple testing: Hochberg (n p-values)",
    n: "100,000",
    reference: "statsmodels",
    evalsuite: "3.689",
    ref: "3.951",
    speedup: "1.07×",
    memEs: "4.58",
    memRef: "3.97",
    diff: "0",
  },
  {
    case: "Clinical: sensitivity, specificity, LR+, LR−",
    n: "1,000,000",
    reference: "scikit-learn",
    evalsuite: "66.196",
    ref: "392.770",
    speedup: "5.93×",
    memEs: "30.52",
    memRef: "22.33",
    diff: "5.6e-17",
  },
  {
    case: "Clinical: diagnostic report (7 CIs)",
    n: "1,000,000",
    reference: "statsmodels",
    evalsuite: "16.607",
    ref: "4.568",
    speedup: "0.28×",
    memEs: "30.52",
    memRef: "1.91",
    diff: "1.4e-14",
  },
  {
    case: "Calibration: slope and intercept",
    n: "1,000,000",
    reference: "statsmodels",
    evalsuite: "177.987",
    ref: "1014.801",
    speedup: "5.70×",
    memEs: "83.99",
    memRef: "579.85",
    diff: "1.3e-15",
  },
  {
    case: "Decision curve: 99 thresholds",
    n: "1,000,000",
    reference: "NumPy loop",
    evalsuite: "155.238",
    ref: "174.335",
    speedup: "1.12×",
    memEs: "68.67",
    memRef: "1.97",
    diff: "5.6e-17",
  },
  {
    case: "Statistics: Welch t-test",
    n: "1,000,000",
    reference: "SciPy",
    evalsuite: "14.458",
    ref: "7.323",
    speedup: "0.51×",
    memEs: "30.52",
    memRef: "15.26",
    diff: "0",
  },
  {
    case: "Statistics: Mann–Whitney U",
    n: "1,000,000",
    reference: "SciPy",
    evalsuite: "365.904",
    ref: "364.548",
    speedup: "1.00×",
    memEs: "154.50",
    memRef: "139.24",
    diff: "0",
  },
  {
    case: "Statistics: Cramér's V (5×5 table)",
    n: "1,000,000",
    reference: "SciPy",
    evalsuite: "0.493",
    ref: "0.421",
    speedup: "0.85×",
    memEs: "0.00",
    memRef: "0.00",
    diff: "0",
  },
  {
    case: "Multiple testing: Hochberg (n p-values)",
    n: "1,000,000",
    reference: "statsmodels",
    evalsuite: "75.358",
    ref: "81.921",
    speedup: "1.09×",
    memEs: "45.78",
    memRef: "39.17",
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
          {rows.map((r) => (
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
        meta={<StatusBadge status="implemented" label="v0.2.1 results" />}
      >
        Speed and peak memory of EvalSuite against reference implementations (scikit-learn,
        statsmodels, SciPy), computing the same quantities on the same data. Every result agrees
        with the reference to floating-point rounding.
      </PageHeader>
      <div className="mx-auto max-w-[1680px] px-4 sm:px-6">
        <Callout title="Environment">
          <p>
            EvalSuite 0.2.1, Python 3.12.3, NumPy 2.5.3, SciPy 1.18.1, scikit-learn 1.9.1,
            statsmodels 0.15.0, Linux x86_64. Fastest of 5 runs after a warm-up; peak memory
            measured with <code>tracemalloc</code>. Speed-up above 1 means EvalSuite is faster. Each
            row names the reference implementation it is compared with.
          </p>
        </Callout>

        <ResultsTable
          caption="Classification and regression (v0.1) against scikit-learn"
          rows={CORE}
        />
        <ResultsTable
          caption="Clinical, calibration and statistics (v0.2) against scikit-learn, statsmodels, SciPy"
          rows={CLINICAL}
        />

        <Section title="Reading the results">
          <p>
            <strong>Many metrics at once is where EvalSuite is fastest.</strong>{" "}
            <code>evaluate()</code> validates the inputs once and builds the confusion matrix once,
            then derives all eight label metrics from it: 26–34× faster than eight separate
            scikit-learn calls. Sensitivity, specificity and both likelihood ratios together are
            4–11× faster.
          </p>
          <p>
            <strong>Calibration slope and intercept</strong> are 5–6× faster than statsmodels&apos;
            GLM and use far less memory (84 MiB against 580 MiB at a million samples), because
            EvalSuite fits the two small logistic models with a dedicated Newton–Raphson solver.
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
            <code>{`pip install evalsuite-python scikit-learn statsmodels
evalsuite benchmark                    # every case at 1,000 / 100,000 / 1,000,000 samples
evalsuite benchmark --suite clinical   # only the v0.2 clinical, calibration and statistics cases
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
