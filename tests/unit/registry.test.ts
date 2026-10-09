import { SHIPPED, SHIPPED_IDS } from "@/data/metrics/definitions";
import { METRICS } from "@/data/metrics/definitions";
import {
  filterMetrics,
  getMetric,
  metricIdFromSlug,
  metricSlug,
  registry,
} from "@/lib/metrics/registry";
import { MetricDefinitionSchema, METRIC_CATEGORIES } from "@/lib/metrics/schema";

describe("metric registry", () => {
  it("validates every definition against the schema", () => {
    for (const m of METRICS) expect(() => MetricDefinitionSchema.parse(m)).not.toThrow();
  });

  it("has unique ids that match their category prefix", () => {
    const ids = registry.map((m) => m.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const m of registry) expect(m.id.startsWith(`${m.category}.`)).toBe(true);
  });

  it("covers every category", () => {
    for (const c of METRIC_CATEGORIES) expect(registry.some((m) => m.category === c)).toBe(true);
  });

  it("marks exactly the shipped metrics as implemented, with the version they shipped in", () => {
    for (const m of registry) {
      expect(m.status).toBe(SHIPPED_IDS.has(m.id) ? "implemented" : "planned");
      if (m.status === "implemented") expect(m.version).toBe(SHIPPED[m.id]!.since ?? "v0.1.0");
    }
    expect(getMetric("clinical.net_benefit")?.status).toBe("implemented");
    expect(getMetric("calibration.calibration_slope")?.version).toBe("v0.2.0");
    expect(getMetric("segmentation.dice")?.status).toBe("implemented");
    expect(getMetric("detection.map50_95")?.version).toBe("v0.3.0");
  });

  it("round-trips slugs", () => {
    for (const m of registry) expect(metricIdFromSlug(metricSlug(m.id))).toBe(m.id);
    expect(getMetric("classification.mcc")?.name).toBe("Matthews correlation coefficient");
  });

  it("filters by query, category and status", () => {
    expect(filterMetrics(registry, { query: "matthews" }).map((m) => m.id)).toEqual([
      "classification.mcc",
    ]);
    expect(
      filterMetrics(registry, { category: "detection" }).every((m) => m.category === "detection"),
    ).toBe(true);
    expect(filterMetrics(registry, { status: "implemented" })).toHaveLength(SHIPPED_IDS.size);
    expect(filterMetrics(registry, { query: "es.hosmer_lemeshow" })).toHaveLength(1);
  });
});
