import { METRICS } from "@/data/metrics/definitions";
import {
  type MetricCategory,
  type MetricDefinition,
  MetricRegistrySchema,
  METRIC_CATEGORIES,
} from "./schema";
export { filterMetrics, metricIdFromSlug, metricSlug, type MetricFilter } from "./filter";

/** The validated registry. Validation runs once at module load (build time for static pages). */
export const registry: readonly MetricDefinition[] = MetricRegistrySchema.parse(METRICS);

const byId = new Map(registry.map((m) => [m.id, m]));
if (byId.size !== registry.length) {
  throw new Error("Metric registry contains duplicate ids.");
}

export function getMetric(id: string): MetricDefinition | undefined {
  return byId.get(id);
}

export function metricsByCategory(category: MetricCategory): MetricDefinition[] {
  return registry.filter((m) => m.category === category);
}

export function categoryCounts(): Record<MetricCategory, number> {
  const counts = Object.fromEntries(METRIC_CATEGORIES.map((c) => [c, 0])) as Record<
    MetricCategory,
    number
  >;
  for (const m of registry) counts[m.category] += 1;
  return counts;
}
