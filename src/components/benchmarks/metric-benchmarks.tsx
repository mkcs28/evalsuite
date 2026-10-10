import Link from "next/link";
import { METRIC_BENCHMARKS } from "@/data/benchmarks/metrics.generated";
import type { MetricBenchmarkRow } from "@/data/benchmarks/types";
import { metricSlug, registry } from "@/lib/metrics/registry";

/** Package function name (es.<fn>) → website metric page, for linking each benchmark row. */
const PAGE_BY_FUNCTION = new Map<string, string>();
for (const m of registry) {
  const fn = m.apiPath.replace(/^es\.(stats\.|text\.)?/, "");
  if (!PAGE_BY_FUNCTION.has(fn)) PAGE_BY_FUNCTION.set(fn, `/docs/metrics/${metricSlug(m.id)}`);
}

const fmtMs = (v: number | null) =>
  v === null ? "–" : v < 100 ? v.toFixed(3) : v.toLocaleString("en", { maximumFractionDigits: 1 });
const fmtX = (v: number | null) => (v === null ? "–" : `${v.toFixed(2)}×`);
const fmtN = (n: number) => n.toLocaleString("en");

const KIND_LABEL: Record<MetricBenchmarkRow["kind"], string> = {
  library: "library",
  formula: "formula check",
  none: "timed alone",
};

export const METRIC_BENCHMARK_COUNT = METRIC_BENCHMARKS.rows.length;

export function MetricBenchmarkSummaryTable() {
  const { summary, environment, sizes } = METRIC_BENCHMARKS;
  const cols = [
    "Suite",
    "Metrics",
    "vs library",
    "vs formula",
    "Timed alone",
    "Match",
    "Faster than library",
    "Geo-mean speed-up",
    "Range",
  ];
  return (
    <div className="mt-8 overflow-x-auto rounded-lg border border-border">
      <table className="w-full min-w-[900px] text-sm">
        <caption className="border-b border-border-subtle px-4 py-3 text-left">
          <span className="font-semibold">Every metric</span>
          <span className="ml-2 text-muted-foreground">
            {METRIC_BENCHMARK_COUNT} metrics and statistics functions at n ={" "}
            {sizes.map(fmtN).join(" / ")}; EvalSuite {String(environment.evalsuite)}; speed-ups over
            library comparisons
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
          {summary.map((s) => {
            const total = s.group === "All metrics";
            return (
              <tr
                key={s.group}
                className={`border-t border-border-subtle ${total ? "bg-surface-muted/40 font-semibold" : ""}`}
              >
                <th scope="row" className="px-4 py-2 text-left font-medium">
                  {s.group}
                </th>
                <td className="px-4 py-2 text-right tabular-nums">{s.metrics}</td>
                <td className="px-4 py-2 text-right tabular-nums">{s.library}</td>
                <td className="px-4 py-2 text-right tabular-nums">{s.formula}</td>
                <td className="px-4 py-2 text-right tabular-nums">{s.alone}</td>
                <td className="px-4 py-2 text-right tabular-nums">
                  {s.matching}/{s.compared}
                </td>
                <td className="px-4 py-2 text-right tabular-nums">
                  {s.faster}/{s.measured}
                </td>
                <td className="px-4 py-2 text-right font-semibold tabular-nums text-primary">
                  {fmtX(s.geomean)}
                </td>
                <td className="px-4 py-2 text-right tabular-nums">
                  {s.min === null ? "–" : `${fmtX(s.min)}–${fmtX(s.max)}`}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function MetricGroupTable({ group, rows }: { group: string; rows: MetricBenchmarkRow[] }) {
  const { sizes } = METRIC_BENCHMARKS;
  return (
    <div className="mt-8 overflow-x-auto rounded-lg border border-border">
      <table className="w-full min-w-[1100px] text-sm">
        <caption className="border-b border-border-subtle px-4 py-3 text-left">
          <span className="font-semibold">{group}</span>
          <span className="ml-2 text-muted-foreground">{rows.length} metrics, alphabetical</span>
        </caption>
        <thead className="bg-surface-muted/70 text-left">
          <tr>
            <th scope="col" className="px-4 py-2.5 font-semibold">
              Metric
            </th>
            <th scope="col" className="px-4 py-2.5 font-semibold">
              Compared with
            </th>
            {sizes.map((n) => (
              <th key={`es${n}`} scope="col" className="px-4 py-2.5 text-right font-semibold">
                EvalSuite ms, n = {fmtN(n)}
              </th>
            ))}
            {sizes.map((n) => (
              <th key={`ref${n}`} scope="col" className="px-4 py-2.5 text-right font-semibold">
                Reference ms, n = {fmtN(n)}
              </th>
            ))}
            {sizes.map((n) => (
              <th key={`x${n}`} scope="col" className="px-4 py-2.5 text-right font-semibold">
                Speed-up, n = {fmtN(n)}
              </th>
            ))}
            <th scope="col" className="px-4 py-2.5 text-right font-semibold">
              Max |difference|
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => {
            const fn = r.metric.split(".").slice(1).join(".");
            const href = PAGE_BY_FUNCTION.get(fn);
            return (
              <tr key={r.metric} className="border-t border-border-subtle">
                <th scope="row" className="px-4 py-2 text-left font-medium">
                  {href ? (
                    <Link href={href} className="font-mono text-primary hover:underline">
                      {r.metric}
                    </Link>
                  ) : (
                    <code>{r.metric}</code>
                  )}
                </th>
                <td className="px-4 py-2">
                  {r.reference || "–"}
                  <span className="ml-1 text-xs text-muted-foreground">({KIND_LABEL[r.kind]})</span>
                </td>
                {sizes.map((n) => (
                  <td key={`es${n}`} className="px-4 py-2 text-right tabular-nums">
                    {fmtMs(r.sizes[String(n)]?.es ?? null)}
                  </td>
                ))}
                {sizes.map((n) => (
                  <td key={`ref${n}`} className="px-4 py-2 text-right tabular-nums">
                    {fmtMs(r.sizes[String(n)]?.ref ?? null)}
                  </td>
                ))}
                {sizes.map((n) => {
                  const v = r.sizes[String(n)]?.speedup ?? null;
                  const strong = r.kind === "library" && v !== null && v >= 1;
                  return (
                    <td
                      key={`x${n}`}
                      className={`px-4 py-2 text-right tabular-nums ${strong ? "font-semibold text-primary" : "text-muted-foreground"}`}
                    >
                      {fmtX(v)}
                    </td>
                  );
                })}
                <td className="px-4 py-2 text-right tabular-nums text-muted-foreground">
                  {r.maxDiff === null ? "–" : r.maxDiff.toExponential(1)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export function MetricBenchmarkTables() {
  const groups = new Map<string, MetricBenchmarkRow[]>();
  for (const r of METRIC_BENCHMARKS.rows) {
    const list = groups.get(r.group) ?? [];
    list.push(r);
    groups.set(r.group, list);
  }
  return (
    <>
      {[...groups.keys()].sort().map((g) => (
        <MetricGroupTable
          key={g}
          group={g}
          rows={(groups.get(g) ?? []).sort((a, b) => a.metric.localeCompare(b.metric))}
        />
      ))}
    </>
  );
}
