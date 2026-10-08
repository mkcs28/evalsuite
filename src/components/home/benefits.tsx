import {
  Activity,
  BookOpenCheck,
  FileCheck2,
  GraduationCap,
  Microscope,
  Repeat2,
  ScanLine,
  ShieldCheck,
  Sigma,
  Timer,
  type LucideIcon,
} from "lucide-react";
import { StatusBadge } from "@/components/ui/status-badge";

/**
 * Benefits of the design. The speed claim is backed by the published benchmarks
 * (see /benchmarks); the rest describe behaviour of the released package.
 */
const OUTCOMES: Array<{ icon: LucideIcon; title: string; text: string }> = [
  {
    icon: ShieldCheck,
    title: "Fewer silent errors",
    text: "Explicit averaging, zero-division and empty-mask rules replace defaults that differ between libraries.",
  },
  {
    icon: Sigma,
    title: "Uncertainty by default",
    text: "Confidence intervals, effect sizes and paired tests sit next to every estimate, as reviewers expect.",
  },
  {
    icon: Timer,
    title: "Less glue code",
    text: "One validated input, one result object and one report, instead of scripts stitching five libraries together.",
  },
  {
    icon: Repeat2,
    title: "Reproducible numbers",
    text: "Seeded resampling, recorded parameters and versioned exports make results easy to rerun and check.",
  },
];

const AUDIENCES: Array<{ icon: LucideIcon; who: string; gets: string[] }> = [
  {
    icon: Microscope,
    who: "ML researchers",
    gets: [
      "Classification and regression metrics with stated conventions",
      "Paired model comparison with effect sizes",
      "LaTeX tables straight into the manuscript",
    ],
  },
  {
    icon: Activity,
    who: "Clinical AI teams",
    gets: [
      "Sensitivity, specificity, PPV, NPV and likelihood ratios",
      "Calibration, Hosmer–Lemeshow and decision curve analysis",
      "Metrics applied only when their assumptions hold",
    ],
  },
  {
    icon: ScanLine,
    who: "Computer vision",
    gets: [
      "Dice, IoU, boundary and surface metrics",
      "AP and mAP with a documented matching convention",
      "Per-class results with explicit empty-mask handling",
    ],
  },
  {
    icon: FileCheck2,
    who: "Reviewers and statisticians",
    gets: [
      "Every metric documented with formula, assumptions and references",
      "Test results that report statistics, not just p-values",
      "Methodology recorded alongside the numbers",
    ],
  },
  {
    icon: GraduationCap,
    who: "Students and educators",
    gets: [
      "A reference that explains when each metric is appropriate",
      "An interactive playground to explore metrics on sample data",
      "Limitations stated, not hidden",
    ],
  },
  {
    icon: BookOpenCheck,
    who: "Research software teams",
    gets: [
      "A typed HTTP API with personal keys",
      "A metric registry that keeps code and docs in sync",
      "Open source under the MIT License",
    ],
  },
];

export function Benefits() {
  return (
    <section
      id="benefits"
      aria-labelledby="benefits-title"
      className="relative overflow-hidden border-y border-border-subtle"
    >
      <div aria-hidden className="hero-glow absolute inset-0 opacity-70" />
      <div className="relative mx-auto max-w-[1680px] px-4 py-16 sm:px-6 sm:py-24 lg:py-32">
        <div className="mx-auto max-w-3xl text-center">
          <StatusBadge status="implemented" label="Delivered in v0.1.0, extended through v0.3.0" />
          <h2
            id="benefits-title"
            className="mt-5 text-3xl font-bold tracking-tight text-balance sm:text-5xl"
          >
            What you <span className="text-brand">gain</span> with EvalSuite
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
            Evaluation that is easier to get right, easier to report and easier for others to check.
          </p>
        </div>

        <ul className="mt-10 grid gap-4 sm:mt-14 sm:grid-cols-2 lg:grid-cols-4">
          {OUTCOMES.map(({ icon: Icon, title, text }) => (
            <li
              key={title}
              className="gradient-ring card-hover rounded-2xl border border-border bg-surface/90 p-6 backdrop-blur"
            >
              <span className="brand-gradient inline-flex size-11 items-center justify-center rounded-xl text-on-brand">
                <Icon className="size-5" aria-hidden />
              </span>
              <h3 className="mt-5 text-lg font-semibold">{title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{text}</p>
            </li>
          ))}
        </ul>

        <h3 className="mt-20 text-center text-2xl font-bold tracking-tight sm:text-3xl">
          Who benefits
        </h3>
        <ul className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {AUDIENCES.map(({ icon: Icon, who, gets }) => (
            <li key={who} className="card-hover rounded-2xl border border-border bg-surface p-6">
              <div className="flex items-center gap-3">
                <span className="icon-tile">
                  <Icon className="size-5" aria-hidden />
                </span>
                <h4 className="text-lg font-semibold">{who}</h4>
              </div>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                {gets.map((g) => (
                  <li key={g} className="flex gap-2.5">
                    <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
                    {g}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>

        <p className="mx-auto mt-10 max-w-2xl text-center text-xs text-muted-foreground">
          These are the goals the package is designed around. Performance and correctness claims
          will be backed by published tests and benchmarks as each release ships.
        </p>
      </div>
    </section>
  );
}
