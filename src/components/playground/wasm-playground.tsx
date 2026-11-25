"use client";

import { useId, useRef, useState } from "react";
import { Play } from "@/components/ui/icons";

/** The EvalSuite engine compiled to WebAssembly, published to npm as `evalsuite` (web build under /web). */
export const WASM_URL = "https://cdn.jsdelivr.net/npm/evalsuite@1/web/evalsuite.js";

interface WasmModule {
  default: () => Promise<unknown>;
  evaluate: (
    metric: string,
    args: unknown,
  ) => { metric: string; value?: unknown; values?: unknown };
  metrics: () => string[];
  version: () => string;
}

const EXAMPLES: Record<string, string> = {
  f1: '{ "y_true": [0, 1, 1, 0, 1, 1], "y_pred": [0, 1, 0, 0, 1, 1] }',
  roc_auc: '{ "y_true": [0, 0, 1, 1, 0, 1], "y_prob": [0.1, 0.4, 0.35, 0.8, 0.2, 0.9] }',
  rmse: '{ "y_true": [3, -0.5, 2, 7], "y_pred": [2.5, 0.0, 2, 8] }',
  bleu: '{ "references": ["the cat sat on the mat"], "predictions": ["the cat sat on a mat"] }',
  chrf: '{ "references": [["the cat sat on the mat", "a cat was on the mat"]], "predictions": ["the cat sat on a mat"] }',
  psi: '{ "reference": [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8], "current": [0.5, 0.6, 0.7, 0.8, 0.9, 0.9, 0.95, 0.99] }',
};

export function WasmPlayground() {
  const uid = useId();
  const mod = useRef<WasmModule | null>(null);
  const [metric, setMetric] = useState("f1");
  const [args, setArgs] = useState<string>(EXAMPLES.f1 ?? "{}");
  const [state, setState] = useState<"idle" | "loading" | "ready" | "unavailable">("idle");
  const [version, setVersion] = useState<string | null>(null);
  const [output, setOutput] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = async (): Promise<WasmModule | null> => {
    if (mod.current) return mod.current;
    setState("loading");
    try {
      const m = (await import(
        /* webpackIgnore: true */ /* turbopackIgnore: true */ WASM_URL
      )) as WasmModule;
      await m.default();
      mod.current = m;
      setVersion(m.version());
      setState("ready");
      return m;
    } catch {
      setState("unavailable");
      return null;
    }
  };

  const run = async () => {
    setError(null);
    setOutput(null);
    let parsed: unknown;
    try {
      parsed = JSON.parse(args);
    } catch {
      setError("The arguments are not valid JSON.");
      return;
    }
    const m = await load();
    if (!m) return;
    try {
      const t0 = performance.now();
      const r = m.evaluate(metric, parsed);
      const ms = performance.now() - t0;
      setOutput(
        `${JSON.stringify(r, null, 2)}\n\n// computed in your browser in ${ms.toFixed(2)} ms`,
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  };

  const field = "h-9 w-full rounded-md border border-border bg-surface px-3 text-sm";
  return (
    <div className="space-y-4 rounded-xl border border-border bg-surface p-5">
      <div className="grid gap-4 sm:grid-cols-[14rem_1fr]">
        <div>
          <label htmlFor={`${uid}-metric`} className="block text-sm font-medium">
            Metric
          </label>
          <select
            id={`${uid}-metric`}
            className={`${field} mt-1.5`}
            value={metric}
            onChange={(e) => {
              setMetric(e.target.value);
              const example = EXAMPLES[e.target.value];
              if (example) setArgs(example);
            }}
          >
            {[
              "accuracy",
              "balanced_accuracy",
              "precision",
              "recall",
              "f1",
              "specificity",
              "mcc",
              "roc_auc",
              "average_precision",
              "log_loss",
              "brier_score",
              "mae",
              "mse",
              "rmse",
              "r2",
              "mape",
              "median_absolute_error",
              "max_error",
              "bleu",
              "chrf",
              "ter",
              "rouge_1",
              "rouge_2",
              "rouge_l",
              "psi",
              "ks",
            ].map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor={`${uid}-args`} className="block text-sm font-medium">
            Arguments (JSON)
          </label>
          <textarea
            id={`${uid}-args`}
            className="mt-1.5 h-24 w-full resize-y rounded-md border border-border bg-surface px-3 py-2 font-mono text-xs leading-5"
            value={args}
            spellCheck={false}
            onChange={(e) => setArgs(e.target.value)}
          />
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={run}
          disabled={state === "loading"}
          className="inline-flex h-10 items-center gap-2 rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
        >
          <Play className="size-4" aria-hidden />
          {state === "loading" ? "Loading engine…" : "Compute"}
        </button>
        <span className="text-xs text-muted-foreground">
          {version
            ? `EvalSuite engine ${version} (WebAssembly)`
            : "The engine (about 1 MB) loads on first use."}
        </span>
      </div>
      {state === "unavailable" ? (
        <p role="alert" className="text-sm text-danger">
          The WebAssembly engine could not be loaded. It is published with EvalSuite 1.0.0 on npm;
          until then (or offline), use the playground above.
        </p>
      ) : null}
      {error ? (
        <p role="alert" className="text-sm text-danger">
          {error}
        </p>
      ) : null}
      {output ? (
        <pre className="overflow-x-auto rounded-md bg-surface-muted p-3 text-xs leading-5">
          {output}
        </pre>
      ) : null}
    </div>
  );
}
