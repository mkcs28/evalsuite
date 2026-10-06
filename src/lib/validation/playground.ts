import { z } from "zod";
import { LIMITS } from "@/lib/api/types";

/** Maximum characters accepted in a single pasted field (guards against huge pastes). */
export const MAX_FIELD_CHARS = 100_000;

const NUMBER_TOKEN = /^[-+]?(\d+\.?\d*|\.\d+)([eE][-+]?\d+)?$/;

/**
 * Parse a pasted list of numbers separated by commas, whitespace, or newlines.
 * Only plain numeric tokens are accepted; nothing is evaluated.
 */
export const NumberListSchema = z
  .string()
  .max(
    MAX_FIELD_CHARS,
    `Input is too long. Paste at most ${MAX_FIELD_CHARS.toLocaleString("en")} characters.`,
  )
  .transform((raw, ctx) => {
    const tokens = raw.split(/[\s,;]+/).filter(Boolean);
    if (tokens.length > LIMITS.maxObservations) {
      ctx.addIssue({
        code: "custom",
        message: `At most ${LIMITS.maxObservations} values are allowed in the demo.`,
      });
      return z.NEVER;
    }
    const values: number[] = [];
    for (const [i, token] of tokens.entries()) {
      if (!NUMBER_TOKEN.test(token)) {
        ctx.addIssue({
          code: "custom",
          message: `Value ${i + 1} ("${token.slice(0, 20)}") is not a number.`,
        });
        return z.NEVER;
      }
      values.push(Number(token));
    }
    return values;
  });

export function parseNumberList(
  raw: string,
): { ok: true; values: number[] } | { ok: false; error: string } {
  const result = NumberListSchema.safeParse(raw);
  if (result.success) return { ok: true, values: result.data };
  return { ok: false, error: result.error.issues[0]?.message ?? "Invalid input." };
}
