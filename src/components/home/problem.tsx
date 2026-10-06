import { Boxes, Calculator, FlaskConical, Layers, ScanSearch, Sigma } from "lucide-react";

const TOOLS = [
  { name: "scikit-learn", role: "Classification and regression metrics", icon: Calculator },
  { name: "SciPy", role: "Hypothesis tests and distributions", icon: Sigma },
  { name: "statsmodels", role: "Diagnostics and multiple-testing corrections", icon: FlaskConical },
  { name: "TorchMetrics", role: "Metrics inside training loops", icon: Layers },
  { name: "pycocotools", role: "COCO-style detection evaluation", icon: ScanSearch },
  { name: "Custom scripts", role: "Bootstrap, DCA, report tables", icon: Boxes },
];

export function Problem() {
  return (
    <section className="mx-auto max-w-[1680px] px-4 py-16 sm:px-6 sm:py-24 lg:py-32">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-3xl font-bold tracking-tight text-balance sm:text-5xl">
          One study. <span className="text-brand">Six toolchains.</span>
        </h2>
        <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
          Research evaluation is usually stitched together from excellent but separate libraries,
          each with its own conventions. EvalSuite is designed as one consistent layer on top, with
          those libraries used as references for numerical validation.
        </p>
      </div>
      <ul className="mt-10 grid gap-4 sm:mt-14 sm:grid-cols-2 lg:grid-cols-3">
        {TOOLS.map(({ name, role, icon: Icon }) => (
          <li key={name} className="card-hover rounded-2xl border border-border bg-surface p-6">
            <span className="icon-tile">
              <Icon className="size-5" aria-hidden />
            </span>
            <p className="mt-4 text-sm font-medium">{name}</p>
            <p className="mt-1 text-sm text-muted-foreground">{role}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
