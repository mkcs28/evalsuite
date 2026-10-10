import { describe, expect, it } from "vitest";
import { METRIC_BENCHMARKS } from "@/data/benchmarks/metrics.generated";

describe("per-metric benchmarks", () => {
  it("has one row per metric, every comparison matching", () => {
    const rows = METRIC_BENCHMARKS.rows;
    expect(rows.length).toBe(225);
    expect(new Set(rows.map((r) => r.metric)).size).toBe(rows.length);
    for (const r of rows) {
      if (r.maxDiff !== null) expect(r.maxDiff).toBeLessThan(1e-9);
    }
    const total = METRIC_BENCHMARKS.summary.find((s) => s.group === "All metrics");
    expect(total?.matching).toBe(total?.compared);
  });
});
