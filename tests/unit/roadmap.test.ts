import { describe, expect, it } from "vitest";
import { ROADMAP } from "@/data/roadmap";

describe("roadmap", () => {
  it("lists every release from v0.1.0 to v0.5.0 as implemented", () => {
    const status = Object.fromEntries(ROADMAP.map((r) => [r.version, r.status]));
    expect(status).toMatchObject({
      "v0.1.0": "implemented",
      "v0.2.0": "implemented",
      "v0.3.0": "implemented",
      "v0.4.0": "implemented",
      "v0.5.0": "implemented",
    });
  });

  it("carries the LLM plan: v0.4.0 (with SPICE) and all 85 v0.5.0 items shipped", () => {
    const v4 = ROADMAP.find((r) => r.version === "v0.4.0")!;
    const v5 = ROADMAP.find((r) => r.version === "v0.5.0")!;
    expect(v4.groups).toHaveLength(7);
    expect(v5.groups).toHaveLength(8);
    const v4items = v4.groups.flatMap((g) => g.items);
    expect(v4items.every((i) => i.status === "implemented")).toBe(true);
    expect(v4items.some((i) => i.label.startsWith("SPICE"))).toBe(true);
    expect(v4items.length).toBe(72);
    const v5items = v5.groups.flatMap((g) => g.items);
    expect(v5items).toHaveLength(85);
    expect(v5items.every((i) => i.status === "implemented" && i.label.includes("("))).toBe(true);
    expect(v4.groups.map((g) => g.title)).toContain("Retrieval-augmented generation (RAG)");
  });
});
