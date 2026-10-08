export const PIPELINE = [
  { name: "Input", detail: "Arrays, DataFrames, masks or boxes, converted to NumPy once." },
  {
    name: "Validation",
    detail: "Shapes, labels, probability ranges, NaN and Inf checked with explicit errors.",
  },
  {
    name: "Evaluation context",
    detail: "Validated data plus shared intermediates such as the confusion matrix.",
  },
  { name: "Metrics", detail: "Task-appropriate metrics computed from the shared context." },
  {
    name: "Statistical analysis",
    detail: "Hypothesis tests, effect sizes and multiple-testing correction.",
  },
  { name: "Uncertainty", detail: "Analytical intervals and seeded bootstrap estimates." },
  {
    name: "Visualization",
    detail: "ROC, PR, calibration and decision curves as Matplotlib figures.",
  },
  {
    name: "Reporting",
    detail: "One structured result exported to JSON, CSV, Markdown, HTML or LaTeX.",
  },
];

export function Pipeline() {
  return (
    <section className="relative overflow-hidden border-y border-border-subtle bg-surface">
      <div aria-hidden className="hero-glow absolute inset-0 opacity-60" />
      <div className="relative mx-auto max-w-[1680px] px-4 py-16 sm:px-6 sm:py-24 lg:py-28">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight sm:text-5xl">
            From predictions to paper.
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            Every evaluation follows the same path. Each layer has one job, so new metrics and
            exporters plug in without touching the rest.
          </p>
        </div>
        <ol className="mt-10 grid gap-4 sm:mt-14 sm:grid-cols-2 lg:grid-cols-4">
          {PIPELINE.map((step, i) => (
            <li
              key={step.name}
              className="card-hover relative rounded-2xl border border-border bg-background/70 p-5 backdrop-blur"
            >
              <span className="brand-gradient inline-flex size-7 items-center justify-center rounded-lg text-xs font-semibold text-on-brand">
                {i + 1}
              </span>
              <p className="mt-4 font-semibold">{step.name}</p>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{step.detail}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
