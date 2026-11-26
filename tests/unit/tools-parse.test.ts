import { describe, expect, it } from "vitest";
import { normalise, parseRun, parseTable } from "@/components/tools/parse";

describe("tool parsers", () => {
  it("reads JSON lines with correct flags or prediction / reference pairs", () => {
    const run = parseRun(
      [
        '{"id": 1, "correct": 1}',
        '{"id": 2, "correct": false}',
        '{"id": 3, "prediction": " Paris ", "reference": "paris"}',
        '{"id": 4, "prediction": "4", "reference": ["four", "4"]}',
      ].join("\n"),
    );
    expect(run.map((r) => r.correct)).toEqual([true, false, true, true]);
    expect(run[0]?.id).toBe("1");
  });

  it("reads a JSON array and rejects records without a result", () => {
    expect(parseRun('[{"id": "a", "score": 0}]')[0]?.correct).toBe(false);
    expect(() => parseRun('{"id": 1}')).toThrow(/correct/);
    expect(() => parseRun("not json")).toThrow(/Line 1/);
  });

  it("normalises answers and parses CSV / TSV tables", () => {
    expect(normalise("  A   b ")).toBe("a b");
    expect(parseTable("y_true,y_prob\n1,0.9\n0,0.2")).toEqual({
      y_true: ["1", "0"],
      y_prob: ["0.9", "0.2"],
    });
    expect(parseTable("a\tb\n1\t2").b).toEqual(["2"]);
    expect(() => parseTable("only_header")).toThrow();
  });
});
