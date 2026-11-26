/** Small, dependency-free parsers for the in-browser tools. */

export interface RunRecord {
  id: string;
  correct: boolean;
}

/** Normalises an answer for exact-match scoring: trimmed, lower-cased, inner whitespace collapsed. */
export function normalise(s: unknown): string {
  return String(s ?? "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

/**
 * JSON lines (one object per line) or a JSON array of records with `id` and either `correct` / `score`
 * (0 / 1 or boolean) or `prediction` and `reference` (exact match after normalising).
 */
export function parseRun(text: string): RunRecord[] {
  const trimmed = text.trim();
  if (!trimmed) throw new Error("The file is empty.");
  let rows: unknown[];
  if (trimmed.startsWith("[")) {
    rows = JSON.parse(trimmed) as unknown[];
  } else {
    rows = trimmed
      .split(/\r?\n/)
      .filter((l) => l.trim())
      .map((l, i) => {
        try {
          return JSON.parse(l) as unknown;
        } catch {
          throw new Error(`Line ${i + 1} is not valid JSON.`);
        }
      });
  }
  return rows.map((r, i) => {
    if (typeof r !== "object" || r === null) throw new Error(`Record ${i + 1} is not an object.`);
    const o = r as Record<string, unknown>;
    const id = o.id ?? o.question_id ?? o.idx ?? i;
    let correct: boolean;
    const c = o.correct ?? o.score;
    if (typeof c === "boolean") correct = c;
    else if (c === 0 || c === 1) correct = c === 1;
    else if ("prediction" in o && "reference" in o) {
      const refs = Array.isArray(o.reference) ? o.reference : [o.reference];
      correct = refs.some((ref) => normalise(ref) === normalise(o.prediction));
    } else {
      throw new Error(`Record ${i + 1} needs "correct" (0 / 1) or "prediction" and "reference".`);
    }
    return { id: String(id), correct };
  });
}

/** Comma- or tab-separated text with a header row, as columns of strings. */
export function parseTable(text: string): Record<string, string[]> {
  const lines = text.split(/\r?\n/).filter((l) => l.trim());
  if (lines.length < 2) throw new Error("Expected a header row and at least one data row.");
  const sep = (lines[0] ?? "").includes("\t") ? "\t" : ",";
  const header = (lines[0] ?? "").split(sep).map((h) => h.trim());
  const cols: Record<string, string[]> = {};
  for (const h of header) cols[h] = [];
  for (const line of lines.slice(1)) {
    const cells = line.split(sep);
    header.forEach((h, j) => cols[h]?.push((cells[j] ?? "").trim()));
  }
  return cols;
}
