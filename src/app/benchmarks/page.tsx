import type { Metadata } from "next";
import { Callout } from "@/components/ui/callout";
import { PageHeader, Section } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";

export const metadata: Metadata = {
  title: "Benchmarks",
  description:
    "Benchmark methodology for EvalSuite. Results are published only after reproducible execution.",
  alternates: { canonical: "/benchmarks" },
};

const PLANNED_COLUMNS = [
  "Workload",
  "Configuration",
  "Runtime (median)",
  "Peak memory",
  "Relative to baseline",
];

export default function BenchmarksPage() {
  return (
    <>
      <PageHeader title="Benchmarks" meta={<StatusBadge status="planned" label="No results yet" />}>
        Benchmark results will be published after reproducible benchmark execution. This page
        defines how they will be produced.
      </PageHeader>
      <div className="mx-auto max-w-[1680px] px-4 sm:px-6">
        <Callout title="No numbers on this page are results">
          <p>
            EvalSuite has not been released, so nothing has been benchmarked. The table below shows
            the columns that will be reported, with no values.
          </p>
        </Callout>

        <Section title="Methodology">
          <p>
            The central comparison is <strong>naive repeated evaluation</strong>, where each metric
            is called independently and recomputes its intermediates, versus{" "}
            <strong>shared computation</strong> through the evaluation context.
          </p>
          <p>
            Each configuration is run with warm-up iterations, then timed over repeated runs; the
            median and interquartile range are reported. Numerical outputs of both paths are checked
            for equality before timing is recorded.
          </p>
        </Section>
        <Section title="Hardware and software">
          <p>
            Every result will list CPU model, core count, memory, operating system, Python version,
            and exact versions of NumPy, SciPy, scikit-learn and EvalSuite.
          </p>
        </Section>
        <Section title="Workloads">
          <p>
            Planned workloads cover binary and multiclass classification at increasing sample sizes,
            regression, bootstrap with a fixed number of resamples, decision curve analysis,
            segmentation masks of increasing resolution, and object detection with increasing
            numbers of boxes.
          </p>
        </Section>
        <Section title="Scaling and memory">
          <p>
            Runtime and peak memory will be reported against sample size so that scaling behaviour,
            not a single favourable point, is visible.
          </p>
        </Section>
        <Section title="Reproducibility">
          <p>
            Benchmark scripts will live in the package repository under{" "}
            <code className="text-sm">benchmarks/</code>, with fixed seeds and a single command to
            rerun them. Published figures will link to the commit they were produced from.
          </p>
        </Section>

        <div className="mt-12 overflow-hidden rounded-lg border border-border">
          <table className="w-full text-sm">
            <caption className="border-b border-border-subtle px-4 py-3 text-left font-semibold">
              Results table (structure only)
            </caption>
            <thead className="bg-surface-muted/70 text-left">
              <tr>
                {PLANNED_COLUMNS.map((c) => (
                  <th key={c} scope="col" className="px-4 py-2.5 font-semibold">
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td
                  colSpan={PLANNED_COLUMNS.length}
                  className="px-4 py-10 text-center text-muted-foreground"
                >
                  Benchmark results will be published after reproducible benchmark execution.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
