const DERIVED = [
  { name: "Precision", f: "TP / (TP+FP)" },
  { name: "Recall", f: "TP / (TP+FN)" },
  { name: "Specificity", f: "TN / (TN+FP)" },
  { name: "F1", f: "2TP / (2TP+FP+FN)" },
  { name: "PPV", f: "TP / (TP+FP)" },
  { name: "NPV", f: "TN / (TN+FN)" },
];

/** Shared-computation diagram: one confusion matrix feeding six metrics. */
export function ContextDiagram() {
  const rowH = 52;
  const top = 30;
  const height = top * 2 + rowH * (DERIVED.length - 1);
  const cy = height / 2;
  return (
    <section className="mx-auto grid max-w-[1680px] items-center gap-10 px-4 py-16 sm:gap-12 sm:px-6 sm:py-24 lg:grid-cols-[0.9fr_1.1fr] lg:py-32">
      <div>
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-balance">
          Compute the confusion matrix once. Reuse it everywhere.
        </h2>
        <p className="mt-5 max-w-lg text-lg leading-relaxed text-muted-foreground">
          The planned <code className="text-[0.9em]">EvaluationContext</code> holds validated inputs
          and expensive intermediates. Precision, recall, specificity, F1, PPV and NPV all read the
          same four counts instead of each recounting the data.
        </p>
        <p className="mt-4 max-w-lg leading-relaxed text-muted-foreground">
          Designed to reduce redundant computation. Speed-ups will be reported only after
          reproducible benchmarks.
        </p>
      </div>
      <figure className="gradient-ring plot-grid rounded-2xl border border-border bg-surface p-4 shadow-panel sm:p-6">
        <svg
          viewBox={`0 0 560 ${height}`}
          className="h-auto w-full"
          role="img"
          aria-labelledby="ctx-title ctx-desc"
        >
          <title id="ctx-title">Shared confusion matrix</title>
          <defs>
            <linearGradient id="flow" x1="0" x2="1">
              <stop offset="0" stopColor="var(--primary)" />
              <stop offset="1" stopColor="var(--accent)" />
            </linearGradient>
          </defs>
          <desc id="ctx-desc">
            A two by two confusion matrix with cells TP, FP, FN and TN connects to six derived
            metrics: precision, recall, specificity, F1, PPV and NPV.
          </desc>
          {DERIVED.map((d, i) => {
            const y = top + i * rowH;
            return (
              <path
                key={d.name}
                d={`M 196 ${cy} C 270 ${cy}, 270 ${y}, 330 ${y}`}
                fill="none"
                stroke="var(--primary)"
                strokeOpacity="0.55"
                strokeWidth="1.4"
              />
            );
          })}
          <g transform={`translate(36 ${cy - 80})`}>
            {[
              ["TP", 0, 0],
              ["FP", 80, 0],
              ["FN", 0, 80],
              ["TN", 80, 80],
            ].map(([label, x, y]) => (
              <g key={label as string} transform={`translate(${x} ${y})`}>
                <rect
                  width="76"
                  height="76"
                  rx="4"
                  fill="var(--surface-muted)"
                  stroke="var(--border)"
                />
                <text
                  x="38"
                  y="44"
                  textAnchor="middle"

                  fontSize="16"
                  fontWeight="500"
                  fill="var(--foreground)"
                >
                  {label}
                </text>
              </g>
            ))}
            <text x="78" y="178" textAnchor="middle" fontSize="12" fill="var(--muted-foreground)">
              computed once
            </text>
          </g>
          {DERIVED.map((d, i) => {
            const y = top + i * rowH;
            return (
              <g key={d.name} transform={`translate(330 ${y - 17})`}>
                <rect
                  width="214"
                  height="34"
                  rx="9"
                  fill="var(--surface-elevated)"
                  stroke="var(--border)"
                />
                <text x="12" y="22" fontSize="13" fontWeight="600" fill="var(--foreground)">
                  {d.name}
                </text>
                <text
                  x="202"
                  y="22"
                  textAnchor="end"

                  fontSize="11"
                  fill="var(--muted-foreground)"
                >
                  {d.f}
                </text>
              </g>
            );
          })}
        </svg>
      </figure>
    </section>
  );
}
