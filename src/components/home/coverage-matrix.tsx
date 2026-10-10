import {
  Activity,
  BarChart3,
  Brain,
  FileOutput,
  ScanLine,
  SmartToy,
  Sparkles,
  type MaterialIcon,
} from "@/components/ui/icons";
import { StatusBadge } from "@/components/ui/status-badge";
import type { ReleaseTarget, Status } from "@/types/status";

type Row = { feature: string; status: Status; release: ReleaseTarget };
const row = (feature: string, release: ReleaseTarget, status: Status = "planned"): Row => ({
  feature,
  status,
  release,
});
const shipped = (feature: string): Row => row(feature, "v0.1.0", "implemented");
const shipped2 = (feature: string): Row => row(feature, "v0.2.0", "implemented");
const shipped3 = (feature: string): Row => row(feature, "v0.3.0", "implemented");
const shipped4 = (feature: string): Row => row(feature, "v0.4.0", "implemented");
const shipped5 = (feature: string): Row => row(feature, "v0.5.0", "implemented");

export const COVERAGE: Array<{ domain: string; rows: Row[] }> = [
  {
    domain: "Machine learning",
    rows: [shipped("Classification"), shipped("Regression"), shipped("Model comparison")],
  },
  {
    domain: "Clinical",
    rows: [
      shipped2("Diagnostic metrics"),
      shipped("Calibration curve and ECE"),
      shipped2("Hosmer–Lemeshow"),
      shipped2("Decision curve analysis"),
    ],
  },
  {
    domain: "Statistics",
    rows: [
      shipped("Paired tests (McNemar, DeLong, bootstrap)"),
      shipped2("Further hypothesis tests"),
      shipped("Effect sizes"),
      shipped("Confidence intervals"),
      shipped("Bootstrap"),
      shipped("Multiple testing"),
    ],
  },
  {
    domain: "Computer vision",
    rows: [
      shipped3("Semantic segmentation"),
      shipped3("Boundary metrics"),
      shipped3("Surface metrics"),
      shipped3("Object detection"),
      shipped3("mAP"),
    ],
  },
  {
    domain: "LLM evaluation",
    rows: [
      shipped4("Text generation (BLEU, ROUGE, METEOR, chrF, TER, CIDEr)"),
      shipped5("SPICE"),
      shipped4("Semantic (BERTScore, MoverScore, MAUVE)"),
      shipped4("Factuality and citations"),
      shipped4("LLM-as-a-judge and preferences"),
      shipped4("Reasoning (pass@k, GSM8K, MATH)"),
      shipped4("Retrieval and RAG"),
      shipped4("Structured output and tool calls"),
    ],
  },
  {
    domain: "LLM systems",
    rows: [
      shipped5("Safety and responsible AI"),
      shipped5("Robustness and reliability"),
      shipped5("Calibration and uncertainty"),
      shipped5("Agents and tool use"),
      shipped5("Multilingual"),
      shipped5("Code generation (CodeBLEU, complexity, SWE-bench)"),
      shipped5("Long context and summarization"),
      shipped5("Inference efficiency and cost"),
    ],
  },
  {
    domain: "Research output",
    rows: [
      shipped("Visualization"),
      shipped("Reports (HTML, Markdown)"),
      shipped("LaTeX tables"),
      shipped("JSON and CSV export"),
      shipped("Reproducibility controls"),
    ],
  },
];

const ICONS: Record<string, MaterialIcon> = {
  "Machine learning": Brain,
  Clinical: Activity,
  Statistics: BarChart3,
  "Computer vision": ScanLine,
  "LLM evaluation": SmartToy,
  "LLM systems": Sparkles,
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
              What each release covers. Statuses move to implemented only when a version is
              published.
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
                    <StatusBadge
                      status={r.status}
                      label={
                        r.status === "implemented" ? `Since ${r.release}` : `Planned ${r.release}`
                      }
                    />
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
