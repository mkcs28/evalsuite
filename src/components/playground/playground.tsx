"use client";

import { Download, FlaskConical, Play } from "lucide-react";
import dynamic from "next/dynamic";
import { useId, useMemo, useState } from "react";
import { Callout } from "@/components/ui/callout";
import { StatusBadge } from "@/components/ui/status-badge";
import { apiBaseUrl } from "@/lib/api";
import { ApiEvaluationClient } from "@/lib/api/api-client";
import { MockEvaluationClient } from "@/lib/api/mock-client";
import Link from "next/link";
import { useAuth } from "@/components/auth/auth-provider";
import { demoMetricsFor } from "@/lib/api/mock-client";
import {
  EvaluationClientError,
  LIMITS,
  type CiMethod,
  type EvaluationResult,
  type EvaluationTask,
} from "@/lib/api/types";
import { DEMO_DATASETS } from "@/lib/demo/datasets";
import { parseNumberList } from "@/lib/validation/playground";
import { cn } from "@/lib/utils/cn";

const RocChart = dynamic(() => import("./roc-chart"), {
  ssr: false,
  loading: () => (
    <div
      className="h-[280px] animate-pulse rounded-md bg-surface-muted"
      aria-label="Loading chart"
    />
  ),
});

const TASK_LABEL: Record<EvaluationTask, string> = {
  "binary-classification": "Binary classification",
  regression: "Regression",
};

const fmt = (v: number | null | undefined) =>
  v === null || v === undefined ? "undefined" : v.toFixed(4);

function datasetFor(task: EvaluationTask) {
  return DEMO_DATASETS.find((d) => d.task === task)!;
}

function Field({
  label,
  hint,
  error,
  children,
  id,
}: {
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
  id: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium">
        {label}
      </label>
      <div className="mt-1.5">{children}</div>
      {hint ? (
        <p id={`${id}-hint`} className="mt-1 text-xs text-muted-foreground">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={`${id}-error`} role="alert" className="mt-1 text-xs text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function Playground() {
  const { status, token } = useAuth();
  const base = apiBaseUrl();
  const canUseApi = base !== null && status === "signed-in";
  const [engine, setEngine] = useState<"demo" | "api">("demo");
  const useApi = engine === "api" && canUseApi;
  const client = useMemo(
    () =>
      useApi && base
        ? new ApiEvaluationClient(base, undefined, () => token)
        : new MockEvaluationClient(),
    [useApi, base, token],
  );
  const uid = useId();
  const [task, setTask] = useState<EvaluationTask>("binary-classification");
  const initial = datasetFor("binary-classification");
  const [yTrue, setYTrue] = useState(initial.yTrue.join(", "));
  const [yPred, setYPred] = useState(initial.yPred.join(", "));
  const [yProb, setYProb] = useState(initial.yProb?.join(", ") ?? "");
  const [source, setSource] = useState<"demo" | "custom">("demo");
  const available = demoMetricsFor(task);
  const [selected, setSelected] = useState<string[]>(available.map((m) => m.id));
  const [ciMethod, setCiMethod] = useState<CiMethod>("wilson");
  const [level, setLevel] = useState(0.95);
  const [nBoot, setNBoot] = useState(1000);
  const [seed, setSeed] = useState(42);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [result, setResult] = useState<EvaluationResult | null>(null);
  const [running, setRunning] = useState(false);

  const loadDemo = (t: EvaluationTask) => {
    const d = datasetFor(t);
    setYTrue(d.yTrue.join(", "));
    setYPred(d.yPred.join(", "));
    setYProb(d.yProb?.join(", ") ?? "");
    setSource("demo");
    setErrors({});
  };

  const changeTask = (t: EvaluationTask) => {
    setTask(t);
    setSelected(demoMetricsFor(t).map((m) => m.id));
    if (t === "regression" && ciMethod === "wilson") setCiMethod("bootstrap-percentile");
    setResult(null);
    loadDemo(t);
  };

  const run = async () => {
    const nextErrors: Record<string, string> = {};
    const t = parseNumberList(yTrue);
    const p = parseNumberList(yPred);
    const pr = task === "binary-classification" && yProb.trim() ? parseNumberList(yProb) : null;
    if (!t.ok) nextErrors.yTrue = t.error;
    if (!p.ok) nextErrors.yPred = p.error;
    if (pr && !pr.ok) nextErrors.yProb = pr.error;
    if (selected.length === 0) nextErrors.metrics = "Select at least one metric.";
    // Resamples and seed only matter for the bootstrap; when it is not selected they are hidden,
    // so they must never block a run (send safe defaults instead).
    const bootstrap = ciMethod === "bootstrap-percentile";
    if (
      bootstrap &&
      (!Number.isInteger(nBoot) || nBoot < LIMITS.minBootstrap || nBoot > LIMITS.maxBootstrap)
    ) {
      nextErrors.nBoot = `Use between ${LIMITS.minBootstrap} and ${LIMITS.maxBootstrap} resamples.`;
    }
    if (bootstrap && (!Number.isInteger(seed) || seed < 0))
      nextErrors.seed = "Use a non-negative whole number.";
    if (Object.keys(nextErrors).length) {
      nextErrors.form = "The evaluation did not run: fix the highlighted field and try again.";
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length || !t.ok || !p.ok) return;
    const nBootstrap = bootstrap ? nBoot : 1000;
    const randomState = bootstrap ? seed : 42;

    setRunning(true);
    try {
      const res = await client.evaluate({
        task,
        yTrue: t.values,
        yPred: p.values,
        yProb: pr && pr.ok ? pr.values : undefined,
        metrics: selected,
        confidence: { method: ciMethod, level, nBootstrap, randomState },
      });
      setResult(res);
    } catch (error) {
      setResult(null);
      setErrors({
        form:
          error instanceof EvaluationClientError
            ? error.message
            : "The evaluation could not be completed.",
      });
    } finally {
      setRunning(false);
    }
  };

  const exportJson = () => {
    if (!result) return;
    const blob = new Blob([JSON.stringify({ demo: true, ...result }, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "evalsuite-demo-result.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const textarea =
    "h-24 w-full resize-y rounded-md border border-border bg-surface px-3 py-2 text-xs leading-5";
  const input = "h-9 w-full rounded-md border border-border bg-surface px-3 text-sm";

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-border bg-surface px-4 py-3 text-sm">
        <span className="font-semibold">Engine</span>
        <div
          role="radiogroup"
          aria-label="Evaluation engine"
          className="inline-flex rounded-lg border border-border p-0.5"
        >
          {(
            [
              ["demo", "Demo (in browser)"],
              ["api", "EvalSuite API"],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              role="radio"
              aria-checked={engine === value}
              disabled={value === "api" && !canUseApi}
              onClick={() => {
                setEngine(value);
                setResult(null);
              }}
              className={`rounded-md px-3 py-1.5 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-50 ${
                engine === value ? "bg-surface-muted text-foreground" : "text-muted-foreground"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        {useApi ? (
          <span className="text-muted-foreground">
            Runs on the EvalSuite API with your account. Data is processed in memory and not stored.
          </span>
        ) : (
          <span className="flex flex-wrap items-center gap-2 text-muted-foreground">
            <FlaskConical className="size-4 text-info" aria-hidden />
            <span>
              <span className="font-semibold text-foreground">Demo mode.</span> A TypeScript
              reference implementation runs in your browser; no data leaves this page.
            </span>
            {base === null ? (
              <StatusBadge status="planned" label="API not configured" />
            ) : status !== "signed-in" ? (
              <Link href="/login" className="font-medium text-primary hover:underline">
                Sign in to use the API
              </Link>
            ) : null}
          </span>
        )}
      </div>

      <Callout tone="privacy">
        <p>
          Do not paste identifiable patient information or other personal data, even in demo mode.
        </p>
      </Callout>

      <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
        <form
          noValidate
          className="space-y-8"
          onSubmit={(e) => {
            e.preventDefault();
            void run();
          }}
          aria-describedby={errors.form ? `${uid}-form-error` : undefined}
        >
          <fieldset className="space-y-4 rounded-2xl border border-border bg-surface p-5">
            <legend className="px-1 text-sm font-semibold">Input</legend>
            <div className="grid items-start gap-4 sm:grid-cols-2">
              <Field id={`${uid}-task`} label="Task">
                <select
                  id={`${uid}-task`}
                  value={task}
                  onChange={(e) => changeTask(e.target.value as EvaluationTask)}
                  className={input}
                >
                  {(Object.keys(TASK_LABEL) as EvaluationTask[]).map((t) => (
                    <option key={t} value={t}>
                      {TASK_LABEL[t]}
                    </option>
                  ))}
                </select>
              </Field>
              <Field id={`${uid}-dataset`} label="Dataset">
                <div className="flex h-9 items-center justify-between gap-2 rounded-md border border-border-subtle bg-surface-muted px-3 text-sm">
                  <span id={`${uid}-dataset`} className="truncate">
                    {source === "demo" ? datasetFor(task).label : "Custom values"}
                  </span>
                  {source === "custom" ? (
                    <button
                      type="button"
                      className="shrink-0 text-xs text-primary underline"
                      onClick={() => loadDemo(task)}
                    >
                      Reset to demo
                    </button>
                  ) : null}
                </div>
              </Field>
            </div>
            <Field
              id={`${uid}-ytrue`}
              label="Ground truth (y_true)"
              hint="Numbers separated by commas, spaces or new lines."
              error={errors.yTrue}
            >
              <textarea
                id={`${uid}-ytrue`}
                className={textarea}
                value={yTrue}
                spellCheck={false}
                aria-invalid={!!errors.yTrue}
                onChange={(e) => {
                  setYTrue(e.target.value);
                  setSource("custom");
                }}
              />
            </Field>
            <Field
              id={`${uid}-ypred`}
              label={task === "regression" ? "Predictions (y_pred)" : "Predicted labels (y_pred)"}
              error={errors.yPred}
            >
              <textarea
                id={`${uid}-ypred`}
                className={textarea}
                value={yPred}
                spellCheck={false}
                aria-invalid={!!errors.yPred}
                onChange={(e) => {
                  setYPred(e.target.value);
                  setSource("custom");
                }}
              />
            </Field>
            {task === "binary-classification" ? (
              <Field
                id={`${uid}-yprob`}
                label="Predicted probabilities (y_prob, optional)"
                hint="Needed for ROC AUC, Brier score and log loss."
                error={errors.yProb}
              >
                <textarea
                  id={`${uid}-yprob`}
                  className={textarea}
                  value={yProb}
                  spellCheck={false}
                  aria-invalid={!!errors.yProb}
                  onChange={(e) => {
                    setYProb(e.target.value);
                    setSource("custom");
                  }}
                />
              </Field>
            ) : null}
          </fieldset>

          <fieldset className="space-y-5 rounded-2xl border border-border bg-surface p-5">
            <legend className="px-1 text-sm font-semibold">Configuration</legend>
            <div>
              <p className="text-sm font-medium" id={`${uid}-metrics`}>
                Metrics
              </p>
              <div
                role="group"
                aria-labelledby={`${uid}-metrics`}
                className="mt-2 grid gap-x-4 gap-y-1.5 sm:grid-cols-2"
              >
                {available.map((m) => (
                  <label key={m.id} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"

                      checked={selected.includes(m.id)}
                      onChange={(e) =>
                        setSelected((s) =>
                          e.target.checked ? [...s, m.id] : s.filter((x) => x !== m.id),
                        )
                      }
                    />
                    {m.name}
                  </label>
                ))}
              </div>
              {errors.metrics ? (
                <p role="alert" className="mt-1 text-xs text-danger">
                  {errors.metrics}
                </p>
              ) : null}
            </div>
            <div className="grid items-start gap-4 sm:grid-cols-2">
              <Field id={`${uid}-ci`} label="Confidence interval">
                <select
                  id={`${uid}-ci`}
                  value={ciMethod}
                  onChange={(e) => {
                    setCiMethod(e.target.value as CiMethod);
                    setErrors({});
                  }}
                  className={input}
                >
                  <option value="none">None</option>
                  {task === "binary-classification" ? (
                    <option value="wilson">Wilson (proportions)</option>
                  ) : null}
                  <option value="bootstrap-percentile">Percentile bootstrap</option>
                </select>
              </Field>
              <Field id={`${uid}-level`} label="Confidence level">
                <select
                  id={`${uid}-level`}
                  value={level}
                  onChange={(e) => setLevel(Number(e.target.value))}
                  className={input}
                  disabled={ciMethod === "none"}
                >
                  <option value={0.9}>90%</option>
                  <option value={0.95}>95%</option>
                  <option value={0.99}>99%</option>
                </select>
              </Field>
              {ciMethod === "bootstrap-percentile" ? (
                <>
                  <Field
                    id={`${uid}-nboot`}
                    label="Bootstrap resamples"
                    hint={`Capped at ${LIMITS.maxBootstrap} in the demo.`}
                    error={errors.nBoot}
                  >
                    <input
                      id={`${uid}-nboot`}
                      type="number"
                      min={LIMITS.minBootstrap}
                      max={LIMITS.maxBootstrap}
                      step={1}
                      inputMode="numeric"
                      // Empty while the user is typing, instead of snapping to 0.
                      value={Number.isFinite(nBoot) && nBoot > 0 ? nBoot : ""}
                      onChange={(e) =>
                        setNBoot(e.target.value === "" ? Number.NaN : Number(e.target.value))
                      }
                      className={input}
                    />
                  </Field>
                  <Field
                    id={`${uid}-seed`}
                    label="Random state"
                    hint="Same seed, same interval."
                    error={errors.seed}
                  >
                    <input
                      id={`${uid}-seed`}
                      type="number"
                      min={0}
                      step={1}
                      value={seed}
                      onChange={(e) => setSeed(Number(e.target.value))}
                      className={input}
                    />
                  </Field>
                </>
              ) : null}
            </div>
          </fieldset>

          {errors.form ? (
            <p id={`${uid}-form-error`} role="alert" className="text-sm text-danger">
              {errors.form}
            </p>
          ) : null}
          <button
            type="submit"
            disabled={running}
            className="inline-flex h-10 items-center gap-2 rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
          >
            <Play className="size-4" aria-hidden />
            {running ? "Running evaluation" : "Run evaluation"}
          </button>
        </form>

        <section aria-labelledby={`${uid}-results`} aria-live="polite" className="min-w-0">
          <div className="rounded-2xl border border-border bg-surface shadow-panel">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border-subtle px-5 py-3">
              <h2 id={`${uid}-results`} className="font-semibold">
                Results
              </h2>
              {result ? (
                <div className="flex items-center gap-2">
                  <StatusBadge
                    status="demo"
                    label={result.engine.kind === "api" ? "API result" : "Demo data"}
                  />
                  <button
                    type="button"
                    onClick={exportJson}
                    className="inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1 text-xs hover:bg-surface-muted"
                  >
                    <Download className="size-3.5" aria-hidden /> Export JSON
                  </button>
                </div>
              ) : null}
            </div>
            {!result ? (
              <div className="px-5 py-16 text-center text-sm text-muted-foreground">
                Run an evaluation to see metric estimates, intervals and the ROC curve.
              </div>
            ) : (
              <div className="space-y-6 p-5">
                <p className="text-sm text-muted-foreground">
                  {TASK_LABEL[result.task]}, n = {result.nObservations}. Engine:{" "}
                  {result.engine.label}.
                </p>
                {result.warnings.length ? (
                  <ul className="space-y-1 text-sm text-warning">
                    {result.warnings.map((w) => (
                      <li key={w}>{w}</li>
                    ))}
                  </ul>
                ) : null}
                <div className="overflow-hidden">
                  <table className="w-full text-sm">
                    <caption className="sr-only">
                      Metric estimates with confidence intervals
                    </caption>
                    <thead>
                      <tr className="border-b border-border text-left text-xs text-muted-foreground">
                        <th scope="col" className="py-2 font-medium">
                          Metric
                        </th>
                        <th scope="col" className="py-2 text-right font-medium">
                          Estimate
                        </th>
                        <th scope="col" className="py-2 text-right font-medium">
                          Interval
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.metrics.map((m) => (
                        <tr
                          key={m.id}
                          className="border-b border-border-subtle align-top last:border-0"
                        >
                          <th scope="row" className="py-2 pr-4 text-left font-medium">
                            {m.name}
                            {m.note ? (
                              <span className="block text-xs font-normal text-muted-foreground">
                                {m.note}
                              </span>
                            ) : null}
                          </th>
                          <td
                            className={cn(
                              "py-2 text-right tabular-nums",
                              m.value === null && "text-muted-foreground",
                            )}
                          >
                            {fmt(m.value)}
                          </td>
                          <td className="py-2 pl-4 text-right text-xs tabular-nums text-muted-foreground">
                            {m.interval ? (
                              <span title={m.interval.method}>
                                [{m.interval.lower.toFixed(4)}, {m.interval.upper.toFixed(4)}]
                                <span className="block font-sans">
                                  {Math.round(m.interval.level * 100)}%{" "}
                                  {m.interval.method.split(" (")[0]}
                                </span>
                              </span>
                            ) : (
                              "–"
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {result.confusionMatrix ? (
                  <div>
                    <p className="text-sm font-semibold">Confusion matrix</p>
                    <table className="mt-2 text-sm">
                      <caption className="sr-only">
                        Confusion matrix: rows are actual classes, columns are predicted classes
                      </caption>
                      <thead>
                        <tr className="text-xs text-muted-foreground">
                          <td />
                          <th scope="col" className="px-4 py-1 font-medium">
                            Predicted 1
                          </th>
                          <th scope="col" className="px-4 py-1 font-medium">
                            Predicted 0
                          </th>
                        </tr>
                      </thead>
                      <tbody className="tabular-nums">
                        <tr>
                          <th
                            scope="row"
                            className="pr-3 text-left font-sans text-xs font-medium text-muted-foreground"
                          >
                            Actual 1
                          </th>
                          <td className="border border-border px-4 py-2 text-center">
                            TP {result.confusionMatrix.tp}
                          </td>
                          <td className="border border-border px-4 py-2 text-center">
                            FN {result.confusionMatrix.fn}
                          </td>
                        </tr>
                        <tr>
                          <th
                            scope="row"
                            className="pr-3 text-left font-sans text-xs font-medium text-muted-foreground"
                          >
                            Actual 0
                          </th>
                          <td className="border border-border px-4 py-2 text-center">
                            FP {result.confusionMatrix.fp}
                          </td>
                          <td className="border border-border px-4 py-2 text-center">
                            TN {result.confusionMatrix.tn}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                ) : null}
                {result.rocCurve && result.rocCurve.length > 1 ? (
                  <figure>
                    <figcaption className="text-sm font-semibold">ROC curve</figcaption>
                    <p className="sr-only">
                      ROC curve with {result.rocCurve.length} points. The area under the curve is
                      listed in the results table.
                    </p>
                    <div className="mt-2" aria-hidden>
                      <RocChart points={result.rocCurve} />
                    </div>
                  </figure>
                ) : null}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
