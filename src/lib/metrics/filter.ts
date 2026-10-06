import type { MetricCategory } from "./categories";
import type { MetricDefinition } from "./schema";
import type { Status } from "@/types/status";

export interface MetricFilter {
  query?: string;
  category?: MetricCategory | "all";
  status?: Status | "all";
}

/** Case-insensitive filter over name, id, description and API path. Pure; safe for client bundles. */
export function filterMetrics(
  metrics: readonly MetricDefinition[],
  filter: MetricFilter,
): MetricDefinition[] {
  const q = filter.query?.trim().toLowerCase() ?? "";
  return metrics.filter((m) => {
    if (filter.category && filter.category !== "all" && m.category !== filter.category)
      return false;
    if (filter.status && filter.status !== "all" && m.status !== filter.status) return false;
    if (!q) return true;
    return [m.name, m.id, m.description, m.apiPath].some((field) =>
      field.toLowerCase().includes(q),
    );
  });
}

export function metricSlug(id: string): string {
  return id.replace(".", "--");
}

export function metricIdFromSlug(slug: string): string {
  return slug.replace("--", ".");
}
