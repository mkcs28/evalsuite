import { Activity, BarChart3, Brain, FileOutput, ScanLine, type LucideIcon } from "lucide-react";
import { StatusBadge } from "@/components/ui/status-badge";
import type { ReleaseTarget, Status } from "@/types/status";

type Row = { feature: string; status: Status; release: ReleaseTarget };
const row = (feature: string, release: ReleaseTarget): Row => ({
  feature,
  status: "planned",
  release,
});

export const COVERAGE: Array<{ domain: string; rows: Row[] }> = [
  {
    domain: "Machine learning",
    rows: [
      row("Classification", "v0.1.0"),
      row("Regression", "v0.1.0"),
      row("Model comparison", "v0.1.0"),
    ],
  },
  {
    domain: "Clinical",
    rows: [
      row("Diagnostic metrics", "v0.2.0"),
      row("Calibration", "v0.2.0"),
      row("Hosmer–Lemeshow", "v0.2.0"),
      row("Decision curve analysis", "v0.2.0"),
    ],
  },
  {
    domain: "Statistics",
    rows: [
      row("Hypothesis testing", "v0.2.0"),
      row("Effect sizes", "v0.2.0"),
      row("Confidence intervals", "v0.2.0"),
      row("Bootstrap", "v0.2.0"),
      row("Multiple testing", "v0.2.0"),
    ],
  },
  {
    domain: "Computer vision",
    rows: [
      row("Semantic segmentation", "v0.3.0"),
      row("Boundary metrics", "v0.3.0"),
      row("Surface metrics", "v0.3.0"),
      row("Object detection", "v0.3.0"),
      row("mAP", "v0.3.0"),
    ],
  },
  {
    domain: "Research output",
    rows: [
      row("Visualization", "v0.1.0"),
      row("Reports (HTML, Markdown)", "v0.1.0"),
      row("LaTeX tables", "v0.1.0"),
      row("JSON and CSV export", "v0.1.0"),
      row("Reproducibility controls", "v0.1.0"),
    ],
  },
];

const ICONS: Record<string, LucideIcon> = {
  "Machine learning": Brain,
  Clinical: Activity,
  Statistics: BarChart3,
  "Computer vision": ScanLine,
  "Research output": FileOutput,
};

export function CoverageMatrix() {
  return (
    <section className="border-y border-border-subtle bg-surface">
      <div className="mx-auto max-w-[1680px] px-4 py-16 sm:px-6 sm:py-24 lg:py-28">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold tracking-tight sm:text-5xl">
              Five domains, one framework.
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
              What each release is planned to cover. Statuses move to implemented only when a
              version is published.
            </p>
          </div>
        </div>
        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {COVERAGE.map((group) => (
            <div
              key={group.domain}
              className="card-hover rounded-2xl border border-border bg-background p-6"
            >
              <h3 className="flex items-center gap-3 font-semibold">
                {(() => {
                  const Icon = ICONS[group.domain]!;
                  return (
                    <span className="icon-tile">
                      <Icon className="size-5" aria-hidden />
                    </span>
                  );
                })()}
                {group.domain}
              </h3>
              <ul className="mt-4">
                {group.rows.map((r) => (
                  <li
                    key={r.feature}
                    className="flex items-center justify-between gap-3 border-t border-border-subtle py-2.5 text-sm"
                  >
                    <span>{r.feature}</span>
                    <StatusBadge status={r.status} label={`Planned ${r.release}`} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
