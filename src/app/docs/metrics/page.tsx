import type { Metadata } from "next";
import { Suspense } from "react";
import { MetricExplorer } from "@/components/metrics/metric-explorer";
import { registry } from "@/lib/metrics/registry";

export const metadata: Metadata = {
  title: "Metric reference",
  description:
    "Searchable reference of every EvalSuite metric, implemented and planned, with formulas, assumptions and references.",
  alternates: { canonical: "/docs/metrics" },
};

export default function MetricsPage() {
  return (
    <div>
      <h1 className="text-[clamp(2rem,3vw,2.5rem)] font-bold tracking-tight">Metric reference</h1>
      <p className="mt-3 max-w-2xl leading-relaxed text-muted-foreground">
        Every metric in EvalSuite, with its formula, assumptions and references. Metrics marked
        implemented are in the released package and show a call you can run; the rest show the
        release they are planned for.
      </p>
      <div className="mt-8">
        <Suspense
          fallback={<p className="text-sm text-muted-foreground">Loading metric explorer</p>}
        >
          <MetricExplorer metrics={[...registry]} />
        </Suspense>
      </div>
    </div>
  );
}
