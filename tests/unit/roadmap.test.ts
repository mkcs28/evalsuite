import { describe, expect, it } from "vitest";
import { ROADMAP } from "@/data/roadmap";

describe("roadmap", () => {
  it("lists v0.1.0 to v0.3.0 as implemented and v0.4.0 / v0.5.0 as planned", () => {
    const status = Object.fromEntries(ROADMAP.map((r) => [r.version, r.status]));
    expect(status).toMatchObject({
      "v0.1.0": "implemented",
      "v0.2.0": "implemented",
      "v0.3.0": "implemented",
      "v0.4.0": "implemented",
      "v0.5.0": "planned",
    });
  });

  it("carries the LLM plan: v0.4.0 shipped (SPICE still planned), v0.5.0 planned", () => {
    const v4 = ROADMAP.find((r) => r.version === "v0.4.0")!;
    const v5 = ROADMAP.find((r) => r.version === "v0.5.0")!;
    expect(v4.groups).toHaveLength(7);
    expect(v5.groups).toHaveLength(8);
    const v4items = v4.groups.flatMap((g) => g.items);
    expect(v4items.filter((i) => i.status === "planned").map((i) => i.label)).toEqual([
      "SPICE (needs a Java scene-graph parser)",
    ]);
    expect(v4items.length).toBe(72);
    expect(v5.groups.flatMap((g) => g.items).every((i) => i.status === "planned")).toBe(true);
    expect(v4.groups.map((g) => g.title)).toContain("Retrieval-augmented generation (RAG)");
  });
});
