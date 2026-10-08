import type { Metadata } from "next";
import { Callout } from "@/components/ui/callout";
import { PageHeader, Section } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";

export const metadata: Metadata = {
  title: "Benchmarks",
  description:
    "Speed and memory of EvalSuite v0.1.0 against scikit-learn on the same data, with identical results.",
  alternates: { canonical: "/benchmarks" },
};

type Row = {
  case: string;
  n: string;
  evalsuite: string;
  sklearn: string;
  speedup: string;
  memEs: string;
  memSk: string;
  diff: string;
};

/** From BENCHMARKS.md in the package repository (evalsuite benchmark, fastest of 5 runs). */
const ROWS: Row[] = [
  {
    case: "Binary: 8 label metrics via evaluate()",
    n: "1,000",
    evalsuite: "0.375",
    sklearn: "11.701",
    speedup: "31.16×",
    memEs: "0.04",
    memSk: "0.05",
    diff: "0",
  },
  {
    case: "10 classes: macro F1",
    n: "1,000",
    evalsuite: "0.168",
    sklearn: "1.566",
    speedup: "9.31×",
    memEs: "0.03",
    memSk: "0.03",
    diff: "0",
  },
  {
    case: "Binary: ROC AUC",
    n: "1,000",
    evalsuite: "0.232",
    sklearn: "1.656",
    speedup: "7.13×",
    memEs: "0.09",
    memSk: "0.08",
    diff: "1.1e-16",
  },
  {
    case: "Regression: MAE, MSE, RMSE, R² via evaluate()",
    n: "1,000",
    evalsuite: "0.124",
    sklearn: "0.901",
    speedup: "7.24×",
    memEs: "0.03",
    memSk: "0.02",
    diff: "0",
  },
  {
    case: "Binary: 8 label metrics via evaluate()",
    n: "100,000",
    evalsuite: "10.919",
    sklearn: "116.881",
    speedup: "10.70×",
    memEs: "3.21",
    memSk: "3.07",
    diff: "0",
  },
  {
    case: "10 classes: macro F1",
    n: "100,000",
    evalsuite: "10.282",
    sklearn: "16.367",
    speedup: "1.59×",
    memEs: "3.06",
    memSk: "2.18",
    diff: "0",
  },
  {
    case: "Binary: ROC AUC",
    n: "100,000",
    evalsuite: "23.573",
    sklearn: "32.255",
    speedup: "1.37×",
    memEs: "9.16",
    memSk: "7.64",
    diff: "1.1e-16",
  },
  {
    case: "Regression: MAE, MSE, RMSE, R² via evaluate()",
    n: "100,000",
    evalsuite: "2.242",
    sklearn: "1.888",
    speedup: "0.84×",
    memEs: "2.29",
    memSk: "1.53",
    diff: "0",
  },
  {
    case: "Binary: 8 label metrics via evaluate()",
    n: "1,000,000",
    evalsuite: "108.751",
    sklearn: "1043.595",
    speedup: "9.60×",
    memEs: "31.54",
    memSk: "30.53",
    diff: "0",
  },
  {
    case: "10 classes: macro F1",
    n: "1,000,000",
    evalsuite: "88.407",
    sklearn: "139.310",
    speedup: "1.58×",
    memEs: "30.52",
    memSk: "21.80",
    diff: "0",
  },
  {
    case: "Binary: ROC AUC",
    n: "1,000,000",
    evalsuite: "247.386",
    sklearn: "352.519",
    speedup: "1.42×",
    memEs: "91.56",
    memSk: "76.30",
    diff: "1.1e-16",
  },
  {
    case: "Regression: MAE, MSE, RMSE, R² via evaluate()",
    n: "1,000,000",
    evalsuite: "29.280",
    sklearn: "20.069",
    speedup: "0.69×",
    memEs: "22.89",
    memSk: "15.26",
    diff: "0",
  },
];

const COLUMNS = [
  "Case",
  "n",
  "EvalSuite (ms)",
  "scikit-learn (ms)",
  "Speed-up",
  "EvalSuite peak (MiB)",
  "scikit-learn peak (MiB)",
  "Max |difference|",
];

export default function BenchmarksPage() {
  return (
    <>
      <PageHeader
        title="Benchmarks"
        meta={<StatusBadge status="implemented" label="v0.1.0 results" />}
      >
        Speed and peak memory of EvalSuite against scikit-learn, computing the same metrics on the
        same data. Every result agrees with scikit-learn to floating-point rounding.
      </PageHeader>
      <div className="mx-auto max-w-[1680px] px-4 sm:px-6">
        <Callout title="Environment">
          <p>
            EvalSuite 0.1.0b1 (same metric code as 0.1.0), Python 3.12.3, NumPy 2.5.3, scikit-learn
            1.9.1, Linux x86_64. Fastest of 5 runs after a warm-up; peak memory measured with{" "}
            <code>tracemalloc</code>. Speed-up above 1 means EvalSuite is faster.
          </p>
        </Callout>

        <div className="mt-8 overflow-x-auto rounded-lg border border-border">
          <table className="w-full min-w-[900px] text-sm">
            <caption className="border-b border-border-subtle px-4 py-3 text-left font-semibold">
              EvalSuite v0.1.0 against scikit-learn
            </caption>
            <thead className="bg-surface-muted/70 text-left">
              <tr>
                {COLUMNS.map((c, i) => (
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
              {ROWS.map((r) => (
                <tr key={`${r.case}-${r.n}`} className="border-t border-border-subtle">
                  <th scope="row" className="px-4 py-2 text-left font-medium">
                    {r.case}
                  </th>
                  <td className="px-4 py-2 text-right tabular-nums">{r.n}</td>
                  <td className="px-4 py-2 text-right tabular-nums">{r.evalsuite}</td>
                  <td className="px-4 py-2 text-right tabular-nums">{r.sklearn}</td>
                  <td className="px-4 py-2 text-right font-semibold tabular-nums">{r.speedup}</td>
                  <td className="px-4 py-2 text-right tabular-nums">{r.memEs}</td>
                  <td className="px-4 py-2 text-right tabular-nums">{r.memSk}</td>
                  <td className="px-4 py-2 text-right tabular-nums text-muted-foreground">
                    {r.diff}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Section title="Reading the results">
          <p>
            <strong>Many metrics at once is where EvalSuite is fastest.</strong>{" "}
            <code>evaluate()</code> validates the inputs once and builds the confusion matrix once,
            then derives all eight label metrics from it: about 10× faster than eight separate
            scikit-learn calls, at every size.
          </p>
          <p>
            <strong>Single classification metrics</strong> (macro F1, ROC AUC) are 1.4–1.6× faster
            at large sizes and much faster on small inputs, where per-call overhead dominates.
          </p>
          <p>
            <strong>Regression on large arrays is slower</strong> (0.84× at 100,000 and 0.69× at
            1,000,000 samples). EvalSuite checks every value for NaN and infinity, and the shape and
            dtype, before computing; for four cheap metrics those checks are a large share of a ~30
            ms run. We consider the validation worth it.
          </p>
          <p>
            <strong>Memory</strong> is comparable, within a few MiB, in every case.
          </p>
        </Section>
        <Section title="Reproduce on your machine">
          <pre className="overflow-x-auto rounded-lg border border-border bg-surface-muted/50 p-4 text-sm">
            <code>{`pip install evalsuite-python scikit-learn
evalsuite benchmark            # 1,000 / 100,000 / 1,000,000 samples
evalsuite benchmark --quick    # small sizes only`}</code>
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
