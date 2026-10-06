import {
  BookOpenText,
  Cpu,
  FileText,
  FlaskConical,
  Microscope,
  Puzzle,
  Repeat,
  ScanLine,
  ShieldCheck,
  Sigma,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

const PRINCIPLES: Array<{ name: string; text: string; icon: LucideIcon; wide?: boolean }> = [
  {
    name: "Unified API",
    text: "Low-level functions such as es.classification.f1 and a high-level es.evaluate share one parameter convention and one result type.",
    icon: Puzzle,
    wide: true,
  },
  {
    name: "Shared computation",
    text: "Inputs validated once; intermediates cached in an evaluation context.",
    icon: Cpu,
  },
  {
    name: "Numerical reliability",
    text: "Zero denominators and empty masks raise explicit warnings, never silent zeros.",
    icon: ShieldCheck,
  },
  {
    name: "Reproducibility",
    text: "Every stochastic step takes random_state and never touches global RNG state.",
    icon: Repeat,
  },
  {
    name: "Statistical rigour",
    text: "Tests return statistics, degrees of freedom, effect sizes and intervals, not just p-values.",
    icon: Sigma,
    wide: true,
  },
  {
    name: "Clinical evaluation",
    text: "Diagnostic metrics, calibration and decision curves, used only when assumptions hold.",
    icon: FlaskConical,
  },
  {
    name: "Computer vision",
    text: "Segmentation and detection with documented empty-mask and matching rules.",
    icon: ScanLine,
  },
  {
    name: "Publication-ready output",
    text: "LaTeX tables, HTML, Markdown, JSON and CSV from one structured result.",
    icon: FileText,
  },
  {
    name: "Extensible registry",
    text: "Every metric is described in a registry that powers code and docs alike.",
    icon: Microscope,
  },
  {
    name: "Research documentation",
    text: "Each metric documents its formula, assumptions, edge cases, limitations and primary references.",
    icon: BookOpenText,
    wide: true,
  },
];

export function Principles() {
  return (
    <section className="mx-auto max-w-[1680px] px-4 py-16 sm:px-6 sm:py-24 lg:py-32">
      <div className="max-w-2xl">
        <h2 className="text-3xl font-bold tracking-tight sm:text-5xl">
          Built for results you can defend.
        </h2>
        <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
          The design commitments behind the package. Each one is verified by tests as its release
          lands.
        </p>
      </div>
      <ul className="mt-10 grid gap-4 sm:mt-14 md:grid-cols-2 lg:grid-cols-4">
        {PRINCIPLES.map(({ name, text, icon: Icon, wide }) => (
          <li
            key={name}
            className={cn(
              "card-hover rounded-2xl border border-border bg-surface p-6",
              wide && "lg:col-span-2",
            )}
          >
            <span className="icon-tile">
              <Icon className="size-5" aria-hidden />
            </span>
            <p className="mt-5 text-lg font-semibold">{name}</p>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{text}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
