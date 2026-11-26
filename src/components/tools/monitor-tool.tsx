"use client";

import { useId, useState } from "react";
import { loadEngine, type Engine } from "@/lib/wasm-engine";
import { parseTable } from "./parse";

interface Point {
  window: number;
  start: number;
  end: number;
  roc_auc: number | null;
  accuracy: number | null;
  psi: number;
  ks_p: number;
}

/** Deterministic sample: a well-calibrated model whose scores and accuracy drift after row 1,200. */
function sample(): string {
  let x = 12345;
  const rnd = () => {
    x = (x * 1103515245 + 12345) % 2147483648;
    return x / 2147483648;
  };
  const rows = ["y_true,y_prob"];
  for (let i = 0; i < 2000; i++) {
    const drift = i > 1200 ? (i - 1200) / 800 : 0;
    const y = rnd() < 0.4 ? 1 : 0;
    const signal = y === 1 ? 0.68 - 0.25 * drift : 0.32 + 0.15 * drift;
    const p = Math.min(0.99, Math.max(0.01, signal + (rnd() - 0.5) * 0.5));
    rows.push(`${y},${p.toFixed(4)}`);
  }
  return rows.join("\n");
}

function scalar(engine: Engine, metric: string, args: unknown): number | null {
  try {
    const v = engine.evaluate(metric, args).value;
    return typeof v === "number" && Number.isFinite(v) ? v : null;
  } catch {
    return null;
  }
}

function Chart({
  points,
  pick,
  threshold,
  label,
  higherIsWorse,
}: {
  points: Point[];
  pick: (p: Point) => number | null;
  threshold: number;
  label: string;
  higherIsWorse: boolean;
}) {
  const vals = points.map(pick);
  const finite = vals.filter((v): v is number => v !== null);
  const max = Math.max(threshold * 1.2, ...finite, 0.01);
  const min = higherIsWorse ? 0 : Math.min(threshold * 0.9, ...finite);
  const w = 600;
  const h = 140;
  const x = (i: number) => (points.length < 2 ? w / 2 : (i / (points.length - 1)) * (w - 20) + 10);
  const y = (v: number) => h - 10 - ((v - min) / (max - min || 1)) * (h - 20);
  const path = vals
    .map((v, i) => (v === null ? null : `${x(i)},${y(v)}`))
    .filter(Boolean)
    .join(" ");
  return (
    <figure>
      <figcaption className="mb-1 text-sm font-medium">{label}</figcaption>
      <svg viewBox={`0 0 ${w} ${h}`} className="h-36 w-full" role="img" aria-label={label}>
        <line
          x1={0}
          x2={w}
          y1={y(threshold)}
          y2={y(threshold)}
          className="stroke-danger"
          strokeDasharray="4 4"
        />
        <polyline points={path} fill="none" className="stroke-primary" strokeWidth={2} />
        {vals.map((v, i) =>
          v === null ? null : (
            <circle
              key={i}
              cx={x(i)}
              cy={y(v)}
              r={3}
              className={
                (higherIsWorse ? v > threshold : v < threshold) ? "fill-danger" : "fill-primary"
              }
            />
          ),
        )}
      </svg>
    </figure>
  );
}

export function MonitorTool() {
  const uid = useId();
  const [text, setText] = useState<string>("");
  const [window, setWindow] = useState(200);
  const [refShare, setRefShare] = useState(25);
  const [aucMin, setAucMin] = useState(0.75);
  const [psiMax, setPsiMax] = useState(0.25);
  const [points, setPoints] = useState<Point[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const run = async () => {
    setError(null);
    setBusy(true);
    try {
      const cols = parseTable(text);
      const yt = (cols.y_true ?? cols.label ?? []).map(Number);
      const yp = (cols.y_prob ?? cols.score ?? cols.prob ?? []).map(Number);
      if (!yt.length || yt.length !== yp.length)
        throw new Error('Expected columns "y_true" and "y_prob".');
      if (yt.some((v) => v !== 0 && v !== 1) || yp.some((v) => !Number.isFinite(v)))
        throw new Error("y_true must be 0 / 1 and y_prob numeric.");
      const nRef = Math.max(2, Math.floor((yt.length * refShare) / 100));
      const reference = yp.slice(0, nRef);
      const engine = await loadEngine();
      const out: Point[] = [];
      for (let s = nRef, k = 1; s < yt.length; s += window, k++) {
        const e = Math.min(yt.length, s + window);
        const t = yt.slice(s, e);
        const p = yp.slice(s, e);
        const pred = p.map((v) => (v >= 0.5 ? 1 : 0));
        let ksP = 1;
        try {
          const r = engine.evaluate("ks", { reference, current: p }).value as { p_value: number };
          ksP = r.p_value;
        } catch {
          /* too few values */
        }
        out.push({
          window: k,
          start: s + 1,
          end: e,
          roc_auc: scalar(engine, "roc_auc", { y_true: t, y_prob: p }),
          accuracy: scalar(engine, "accuracy", { y_true: t, y_pred: pred }),
          psi: scalar(engine, "psi", { reference, current: p }) ?? 0,
          ks_p: ksP,
        });
      }
      if (!out.length) throw new Error("No rows left after the reference period.");
      setPoints(out);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  };

  const alerts =
    points?.flatMap((p) => [
      ...(p.roc_auc !== null && p.roc_auc < aucMin
        ? [
            `Window ${p.window} (rows ${p.start}–${p.end}): ROC AUC ${p.roc_auc.toFixed(3)} < ${aucMin}`,
          ]
        : []),
      ...(p.psi > psiMax
        ? [`Window ${p.window} (rows ${p.start}–${p.end}): PSI ${p.psi.toFixed(3)} > ${psiMax}`]
        : []),
    ]) ?? [];

  const num = "h-9 w-24 rounded-md border border-border bg-surface px-2 text-sm";
  return (
    <div className="space-y-5 rounded-xl border border-border bg-surface p-5">
      <div className="flex flex-wrap items-center gap-3">
        <label
          htmlFor={`${uid}-file`}
          className="inline-flex h-10 cursor-pointer items-center rounded-md border border-border px-4 text-sm font-medium hover:bg-surface-muted"
        >
          Load predictions (.csv)
        </label>
        <input
          id={`${uid}-file`}
          type="file"
          accept=".csv,.tsv,text/csv"
          className="sr-only"
          onChange={async (e) => {
            const f = e.target.files?.[0];
            if (f) setText(await f.text());
            setPoints(null);
          }}
        />
        <button
          type="button"
          onClick={() => {
            setText(sample());
            setPoints(null);
          }}
          className="h-10 rounded-md px-3 text-sm text-muted-foreground underline-offset-4 hover:underline"
        >
          Use sample data (drift after row 1,200)
        </button>
        {text ? (
          <span className="text-xs text-muted-foreground">
            {text.split(/\r?\n/).filter((l) => l.trim()).length - 1} rows loaded
          </span>
        ) : null}
      </div>
      <p className="text-sm text-muted-foreground">
        Rows in time order with columns <code>y_true</code> (0 / 1) and <code>y_prob</code>. The
        first part is the reference period; the rest is cut into windows and compared with it. Data
        stays in your browser.
      </p>
      <div className="flex flex-wrap gap-4 text-sm">
        <label className="flex items-center gap-2">
          Window
          <input
            type="number"
            min={20}
            step={10}
            value={window}
            onChange={(e) => setWindow(Math.max(20, Number(e.target.value)))}
            className={num}
          />
        </label>
        <label className="flex items-center gap-2">
          Reference %
          <input
            type="number"
            min={5}
            max={80}
            value={refShare}
            onChange={(e) => setRefShare(Math.min(80, Math.max(5, Number(e.target.value))))}
            className={num}
          />
        </label>
        <label className="flex items-center gap-2">
          Alert if ROC AUC &lt;
          <input
            type="number"
            step={0.01}
            value={aucMin}
            onChange={(e) => setAucMin(Number(e.target.value))}
            className={num}
          />
        </label>
        <label className="flex items-center gap-2">
          Alert if PSI &gt;
          <input
            type="number"
            step={0.05}
            value={psiMax}
            onChange={(e) => setPsiMax(Number(e.target.value))}
            className={num}
          />
        </label>
      </div>
      <button
        type="button"
        onClick={() => void run()}
        disabled={busy || !text}
        className="inline-flex h-10 items-center rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
      >
        {busy ? "Analysing…" : "Analyse"}
      </button>
      {error ? (
        <p role="alert" className="text-sm text-danger">
          {error}
        </p>
      ) : null}
      {points ? (
        <div className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Chart
              points={points}
              pick={(p) => p.roc_auc}
              threshold={aucMin}
              label="ROC AUC per window"
              higherIsWorse={false}
            />
            <Chart
              points={points}
              pick={(p) => p.psi}
              threshold={psiMax}
              label="Score drift (PSI) against the reference"
              higherIsWorse
            />
          </div>
          <div>
            <h3 className="text-sm font-semibold">
              {alerts.length
                ? `${alerts.length} alert${alerts.length > 1 ? "s" : ""}`
                : "No alerts"}
            </h3>
            {alerts.length ? (
              <ul className="mt-2 space-y-1 text-sm text-danger">
                {alerts.map((a) => (
                  <li key={a}>{a}</li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
