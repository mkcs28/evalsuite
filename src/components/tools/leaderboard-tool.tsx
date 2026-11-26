"use client";

import { useId, useState } from "react";
import { loadEngine } from "@/lib/wasm-engine";
import { parseRun, type RunRecord } from "./parse";

interface Row {
  model: string;
  accuracy: number;
  ci_low: number;
  ci_high: number;
  rank: number;
  n: number;
}
interface Pair {
  a: string;
  b: string;
  difference: number;
  p_value: number;
  p_adjusted: number;
  significant: boolean;
}
interface Board {
  models: Row[];
  pairs: Pair[];
  level: number;
}

const SAMPLE: Record<string, string> = {
  "model-a": Array.from({ length: 120 }, (_, i) =>
    JSON.stringify({ id: i, correct: i % 10 < 8 ? 1 : 0 }),
  ).join("\n"),
  "model-b": Array.from({ length: 120 }, (_, i) =>
    JSON.stringify({ id: i, correct: i % 10 < 6 ? 1 : 0 }),
  ).join("\n"),
  "model-c": Array.from({ length: 120 }, (_, i) =>
    JSON.stringify({ id: i, correct: i % 10 < 8 && i % 30 !== 0 ? 1 : 0 }),
  ).join("\n"),
};

const pct = (v: number) => `${(v * 100).toFixed(1)}%`;

/** Aligns runs on shared item ids (only items every model answered). */
function align(runs: Record<string, RunRecord[]>): {
  models: Record<string, number[]>;
  dropped: number;
} {
  const names = Object.keys(runs);
  const maps = names.map((n) => new Map((runs[n] ?? []).map((r) => [r.id, r.correct])));
  const all = new Set(maps.flatMap((m) => [...m.keys()]));
  const shared = [...all].filter((id) => maps.every((m) => m.has(id)));
  const models: Record<string, number[]> = {};
  names.forEach((n, i) => {
    models[n] = shared.map((id) => (maps[i]?.get(id) ? 1 : 0));
  });
  return { models, dropped: all.size - shared.length };
}

export function LeaderboardTool() {
  const uid = useId();
  const [runs, setRuns] = useState<Record<string, RunRecord[]>>({});
  const [board, setBoard] = useState<Board | null>(null);
  const [note, setNote] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const addFiles = async (files: FileList | null) => {
    setError(null);
    if (!files) return;
    const next = { ...runs };
    for (const f of Array.from(files)) {
      try {
        next[f.name.replace(/\.(jsonl?|ndjson)$/i, "")] = parseRun(await f.text());
      } catch (e) {
        setError(`${f.name}: ${e instanceof Error ? e.message : String(e)}`);
        return;
      }
    }
    setRuns(next);
    setBoard(null);
  };

  const useSample = () => {
    const next: Record<string, RunRecord[]> = {};
    for (const [k, v] of Object.entries(SAMPLE)) next[k] = parseRun(v);
    setRuns(next);
    setBoard(null);
    setError(null);
  };

  const rank = async () => {
    setError(null);
    setBusy(true);
    try {
      const { models, dropped } = align(runs);
      if (Object.keys(models).length < 2) throw new Error("Add at least two runs.");
      const n = Object.values(models)[0]?.length ?? 0;
      if (n === 0) throw new Error("The runs share no item ids.");
      const engine = await loadEngine();
      const r = engine.evaluate("leaderboard", { models });
      setBoard(r.value as Board);
      setNote(
        `${n} shared items${dropped ? `; ${dropped} items not answered by every model were left out` : ""}.`,
      );
    } catch (e) {
      setError(
        e instanceof Error && e.message.includes("fetch")
          ? "The engine could not be loaded; check your connection."
          : e instanceof Error
            ? e.message
            : String(e),
      );
    } finally {
      setBusy(false);
    }
  };

  const markdown = board
    ? [
        "| Rank | Model | Accuracy | 95% CI | n |",
        "| ---: | --- | ---: | --- | ---: |",
        ...board.models.map(
          (m) =>
            `| ${m.rank} | ${m.model} | ${pct(m.accuracy)} | ${pct(m.ci_low)}–${pct(m.ci_high)} | ${m.n} |`,
        ),
      ].join("\n")
    : "";

  return (
    <div className="space-y-5 rounded-xl border border-border bg-surface p-5">
      <div className="flex flex-wrap items-center gap-3">
        <label
          htmlFor={`${uid}-files`}
          className="inline-flex h-10 cursor-pointer items-center rounded-md border border-border px-4 text-sm font-medium hover:bg-surface-muted"
        >
          Add run files (.jsonl)
        </label>
        <input
          id={`${uid}-files`}
          type="file"
          accept=".jsonl,.json,.ndjson,application/json"
          multiple
          className="sr-only"
          onChange={(e) => void addFiles(e.target.files)}
        />
        <button
          type="button"
          onClick={useSample}
          className="h-10 rounded-md px-3 text-sm text-muted-foreground underline-offset-4 hover:underline"
        >
          Use sample runs
        </button>
        {Object.keys(runs).length ? (
          <button
            type="button"
            onClick={() => {
              setRuns({});
              setBoard(null);
            }}
            className="h-10 rounded-md px-3 text-sm text-muted-foreground underline-offset-4 hover:underline"
          >
            Clear
          </button>
        ) : null}
      </div>
      {Object.keys(runs).length ? (
        <ul className="flex flex-wrap gap-2 text-xs">
          {Object.entries(runs).map(([k, v]) => (
            <li key={k} className="rounded-full border border-border px-3 py-1">
              {k} · {v.length} items
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-muted-foreground">
          One file per model: JSON lines with <code>id</code> and <code>correct</code> (0 / 1), or{" "}
          <code>prediction</code> and <code>reference</code> (exact match). Files never leave your
          browser.
        </p>
      )}
      <button
        type="button"
        onClick={() => void rank()}
        disabled={busy || Object.keys(runs).length < 2}
        className="inline-flex h-10 items-center rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
      >
        {busy ? "Ranking…" : "Rank models"}
      </button>
      {error ? (
        <p role="alert" className="text-sm text-danger">
          {error}
        </p>
      ) : null}
      {board ? (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            {note} Models share a rank when no significant difference separates them (McNemar,
            Holm-adjusted, α = 0.05).
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="py-2 pr-4">Rank</th>
                  <th className="py-2 pr-4">Model</th>
                  <th className="py-2 pr-4 text-right">Accuracy</th>
                  <th className="py-2 pr-4">95% CI</th>
                  <th className="py-2 w-1/3" aria-label="Interval" />
                </tr>
              </thead>
              <tbody>
                {board.models.map((m) => (
                  <tr key={m.model} className="border-b border-border-subtle">
                    <td className="py-2 pr-4 font-semibold">{m.rank}</td>
                    <td className="py-2 pr-4">{m.model}</td>
                    <td className="py-2 pr-4 text-right tabular-nums">{pct(m.accuracy)}</td>
                    <td className="py-2 pr-4 tabular-nums">
                      {pct(m.ci_low)}–{pct(m.ci_high)}
                    </td>
                    <td className="py-2">
                      <div className="relative h-2 rounded bg-surface-muted">
                        <div
                          className="absolute top-0 h-2 rounded bg-primary/40"
                          style={{
                            left: `${m.ci_low * 100}%`,
                            width: `${(m.ci_high - m.ci_low) * 100}%`,
                          }}
                        />
                        <div
                          className="absolute -top-1 h-4 w-0.5 bg-primary"
                          style={{ left: `${m.accuracy * 100}%` }}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <details className="text-sm">
            <summary className="cursor-pointer font-medium">Pairwise tests</summary>
            <ul className="mt-2 space-y-1 tabular-nums">
              {board.pairs.map((p) => (
                <li key={`${p.a}-${p.b}`}>
                  {p.a} vs {p.b}: {p.difference >= 0 ? "+" : ""}
                  {(p.difference * 100).toFixed(1)} points, p = {p.p_value.toPrecision(3)} (adjusted{" "}
                  {p.p_adjusted.toPrecision(3)}){p.significant ? " — significant" : ""}
                </li>
              ))}
            </ul>
          </details>
          <button
            type="button"
            onClick={() => void navigator.clipboard?.writeText(markdown)}
            className="h-9 rounded-md border border-border px-3 text-sm hover:bg-surface-muted"
          >
            Copy as Markdown
          </button>
        </div>
      ) : null}
    </div>
  );
}
