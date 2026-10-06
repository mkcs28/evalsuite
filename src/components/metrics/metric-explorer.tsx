"use client";

import { Search } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { StatusBadge } from "@/components/ui/status-badge";
import { filterMetrics, metricSlug } from "@/lib/metrics/filter";
import { CATEGORY_LABEL, METRIC_CATEGORIES, type MetricCategory } from "@/lib/metrics/categories";
import type { MetricDefinition } from "@/lib/metrics/schema";
import { cn } from "@/lib/utils/cn";
import { STATUSES, STATUS_LABEL, type Status } from "@/types/status";

const isCategory = (v: string | null): v is MetricCategory =>
  !!v && (METRIC_CATEGORIES as readonly string[]).includes(v);
const isStatus = (v: string | null): v is Status =>
  !!v && (STATUSES as readonly string[]).includes(v);

export function MetricExplorer({ metrics }: { metrics: MetricDefinition[] }) {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [query, setQuery] = useState(params.get("q") ?? "");
  const [category, setCategory] = useState<MetricCategory | "all">(
    isCategory(params.get("category")) ? (params.get("category") as MetricCategory) : "all",
  );
  const [status, setStatus] = useState<Status | "all">(
    isStatus(params.get("status")) ? (params.get("status") as Status) : "all",
  );
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const results = useMemo(
    () => filterMetrics(metrics, { query, category, status }),
    [metrics, query, category, status],
  );
  const selected = results.find((m) => m.id === selectedId) ?? results[0] ?? null;

  const syncUrl = (next: { q?: string; category?: string; status?: string }) => {
    const sp = new URLSearchParams(params.toString());
    for (const [k, v] of Object.entries(next)) {
      if (!v || v === "all") sp.delete(k);
      else sp.set(k, v);
    }
    const qs = sp.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  const presentStatuses = STATUSES.filter((s) => metrics.some((m) => m.status === s));

  return (
    <div>
      <div className="flex flex-col gap-3 md:flex-row md:items-end">
        <label className="flex-1">
          <span className="mb-1.5 block text-sm font-medium">Search metrics</span>
          <span className="flex h-10 items-center gap-2 rounded-md border border-border bg-surface px-3 focus-within:outline-2 focus-within:outline-primary">
            <Search className="size-4 text-muted-foreground" aria-hidden />
            <input
              type="search"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                syncUrl({ q: e.target.value });
              }}
              placeholder="Name, API path or description"
              className="h-full w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </span>
        </label>
        <label>
          <span className="mb-1.5 block text-sm font-medium">Category</span>
          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value as MetricCategory | "all");
              syncUrl({ category: e.target.value });
            }}
            className="h-10 w-full rounded-md border border-border bg-surface px-3 text-sm md:w-52"
          >
            <option value="all">All categories</option>
            {METRIC_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {CATEGORY_LABEL[c]}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span className="mb-1.5 block text-sm font-medium">Status</span>
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value as Status | "all");
              syncUrl({ status: e.target.value });
            }}
            className="h-10 w-full rounded-md border border-border bg-surface px-3 text-sm md:w-40"
          >
            <option value="all">All statuses</option>
            {presentStatuses.map((s) => (
              <option key={s} value={s}>
                {STATUS_LABEL[s]}
              </option>
            ))}
          </select>
        </label>
      </div>

      <p className="mt-4 text-sm text-muted-foreground" aria-live="polite">
        {results.length} of {metrics.length} metrics
      </p>

      {results.length === 0 ? (
        <div className="mt-4 rounded-lg border border-dashed border-border px-6 py-12 text-center">
          <p className="font-medium">No metrics match these filters.</p>
          <button
            type="button"
            className="mt-3 text-sm text-primary underline underline-offset-4"
            onClick={() => {
              setQuery("");
              setCategory("all");
              setStatus("all");
              syncUrl({ q: "", category: "all", status: "all" });
            }}
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="mt-4 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
          <ul
            className="max-h-[70vh] divide-y divide-border-subtle overflow-y-auto rounded-2xl border border-border bg-surface"
            aria-label="Metrics"
          >
            {results.map((m) => {
              const isSel = selected?.id === m.id;
              return (
                <li key={m.id}>
                  <button
                    type="button"
                    onClick={() => setSelectedId(m.id)}
                    aria-pressed={isSel}
                    className={cn(
                      "flex w-full items-start justify-between gap-3 px-4 py-3 text-left",
                      isSel ? "bg-surface-muted" : "hover:bg-surface-muted/60",
                    )}
                  >
                    <span className="min-w-0">
                      <span className="block font-medium">{m.name}</span>
                      <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                        {m.apiPath}
                      </span>
                    </span>
                    <span className="shrink-0 text-xs text-muted-foreground">
                      {CATEGORY_LABEL[m.category]}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
          {selected ? <MetricPreview metric={selected} /> : null}
        </div>
      )}
    </div>
  );
}

function MetricPreview({ metric }: { metric: MetricDefinition }) {
  return (
    <section
      aria-label={`${metric.name} details`}
      className="h-fit rounded-2xl border border-border bg-surface p-5 lg:sticky lg:top-24"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs text-muted-foreground">{CATEGORY_LABEL[metric.category]}</p>
          <h2 className="mt-1 text-xl font-bold">{metric.name}</h2>
        </div>
        <StatusBadge
          status={metric.status}
          label={metric.status === "planned" ? `Planned ${metric.version}` : undefined}
        />
      </div>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{metric.description}</p>
      <dl className="mt-4 space-y-3 text-sm">
        <div>
          <dt className="font-medium">Formula</dt>
          <dd className="mt-1 overflow-hidden rounded-md bg-surface-muted px-3 py-2 text-[13px]">
            {metric.formula}
          </dd>
        </div>
        {metric.range ? (
          <div className="flex gap-2">
            <dt className="font-medium">Range</dt>
            <dd className="text-[13px]">{metric.range}</dd>
          </div>
        ) : null}
        <div className="flex gap-2">
          <dt className="font-medium">API</dt>
          <dd className="text-[13px]">{metric.apiPath}</dd>
        </div>
        {metric.limitations[0] ? (
          <div>
            <dt className="font-medium">Key limitation</dt>
            <dd className="mt-1 text-muted-foreground">{metric.limitations[0]}</dd>
          </div>
        ) : null}
      </dl>
      <Link
        href={`/docs/metrics/${metricSlug(metric.id)}`}
        className="mt-5 inline-block text-sm font-medium text-primary underline underline-offset-4"
      >
        Full reference for {metric.name}
      </Link>
    </section>
  );
}
