import { describe, expect, it } from "vitest";
import { ROADMAP } from "@/data/roadmap";

describe("roadmap", () => {
  it("lists v0.1.0 to v0.3.0 as implemented and v0.4.0 / v0.5.0 as planned", () => {
    const status = Object.fromEntries(ROADMAP.map((r) => [r.version, r.status]));
    expect(status).toMatchObject({
      "v0.1.0": "implemented",
      "v0.2.0": "implemented",
      "v0.3.0": "implemented",
      "v0.4.0": "planned",
      "v0.5.0": "planned",
    });
  });

  it("carries the LLM evaluation plan: 15 areas, 156 metrics, all planned", () => {
    const planned = ROADMAP.filter((r) => r.status === "planned");
    const groups = planned.flatMap((r) => r.groups);
    expect(groups).toHaveLength(15);
    expect(groups.reduce((n, g) => n + g.items.length, 0)).toBe(156);
    expect(groups.every((g) => g.items.every((i) => i.status === "planned"))).toBe(true);
    const v4 = planned.find((r) => r.version === "v0.4.0");
    expect(v4?.groups.map((g) => g.title)).toContain("Retrieval-augmented generation (RAG)");
  });
});
