import { SHIPPED, SHIPPED_IDS } from "@/data/metrics/definitions";
import { LLM_METRICS } from "@/data/metrics/llm.generated";
import { LLMSYS_METRICS } from "@/data/metrics/llmsys.generated";
import { CORE_EXTRA_METRICS } from "@/data/metrics/core.generated";
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
    const llm = new Set([...LLM_METRICS, ...LLMSYS_METRICS].map((m) => m.id));
    const extra = new Set(CORE_EXTRA_METRICS.map((m) => m.id));
    for (const m of registry) {
      const shipped = SHIPPED_IDS.has(m.id) || llm.has(m.id) || extra.has(m.id);
      expect(m.status).toBe(shipped ? "implemented" : "planned");
      if (llm.has(m.id)) {
        const spiceOrSystems =
          m.id === "text-generation.spice" || LLMSYS_METRICS.some((x) => x.id === m.id);
        expect(m.version).toBe(spiceOrSystems ? "v0.5.0" : "v0.4.0");
      } else if (m.status === "implemented" && !extra.has(m.id))
        expect(m.version).toBe(SHIPPED[m.id]!.since ?? "v0.1.0");
    }
    expect(LLM_METRICS).toHaveLength(70); // 69 from v0.4.0 + SPICE
    expect(LLMSYS_METRICS).toHaveLength(77);
    expect(getMetric("code.codebleu")?.apiPath).toBe("es.codebleu");
    expect(getMetric("text-generation.bleu")?.apiPath).toBe("es.bleu");
    expect(getMetric("llm-judge.bradley_terry")?.example).toContain("es.bradley_terry(");
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
    expect(filterMetrics(registry, { status: "implemented" })).toHaveLength(
      SHIPPED_IDS.size + CORE_EXTRA_METRICS.length + LLM_METRICS.length + LLMSYS_METRICS.length,
    );
    expect(filterMetrics(registry, { category: "rag" }).length).toBeGreaterThan(10);
    expect(filterMetrics(registry, { query: "es.hosmer_lemeshow" })).toHaveLength(1);
  });
});
