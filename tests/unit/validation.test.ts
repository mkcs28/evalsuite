import { MAX_FIELD_CHARS, parseNumberList } from "@/lib/validation/playground";
import { DEMO_DATASETS } from "@/lib/demo/datasets";
import { docNeighbours } from "@/lib/docs/nav";
import { searchSite } from "@/lib/search";

describe("playground input parsing", () => {
  it("parses separators and scientific notation", () => {
    expect(parseNumberList("1, 2 3\n4;5e-1 -.5")).toEqual({
      ok: true,
      values: [1, 2, 3, 4, 0.5, -0.5],
    });
  });

  it("rejects non-numeric tokens without evaluating them", () => {
    const r = parseNumberList("1, 2, alert(1)");
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toMatch(/Value 3/);
  });

  it("rejects oversized input", () => {
    expect(parseNumberList("1,".repeat(MAX_FIELD_CHARS)).ok).toBe(false);
  });
});

describe("demo datasets", () => {
  it("are deterministic and well-formed", () => {
    const [cls, reg] = DEMO_DATASETS;
    expect(cls!.yTrue).toHaveLength(80);
    expect(cls!.yProb!.every((p) => p >= 0 && p <= 1)).toBe(true);
    expect(new Set(cls!.yTrue)).toEqual(new Set([0, 1]));
    expect(reg!.yTrue).toHaveLength(reg!.yPred.length);
  });
});

describe("docs navigation and search", () => {
  it("links neighbours in sidebar order", () => {
    expect(docNeighbours("/docs").prev).toBeNull();
    expect(docNeighbours("/docs/getting-started").prev?.href).toBe("/docs");
    expect(docNeighbours("/docs/unknown")).toEqual({ prev: null, next: null });
  });

  it("finds metrics and pages", () => {
    expect(searchSite("dice")[0]?.href).toBe("/docs/metrics/segmentation--dice");
    expect(searchSite("roadmap").some((r) => r.href === "/roadmap")).toBe(true);
    expect(searchSite("zzzz-nothing")).toEqual([]);
  });
});
