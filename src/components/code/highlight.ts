import { createHighlighter, type Highlighter } from "shiki";

export const CODE_LANGS = ["python", "bash", "json", "typescript", "text"] as const;
export type CodeLang = (typeof CODE_LANGS)[number];

let highlighter: Promise<Highlighter> | null = null;

function getHighlighter(): Promise<Highlighter> {
  highlighter ??= createHighlighter({
    themes: ["github-light", "github-dark-dimmed"],
    langs: CODE_LANGS.filter((l) => l !== "text"),
  });
  return highlighter;
}

/**
 * Highlight trusted, repository-authored code at build/render time on the server.
 * Shiki escapes the source text, so the returned HTML contains no user input.
 */
export async function highlight(code: string, lang: CodeLang): Promise<string> {
  const h = await getHighlighter();
  return h.codeToHtml(code, {
    lang: lang === "text" ? "plaintext" : lang,
    themes: { light: "github-light", dark: "github-dark-dimmed" },
    defaultColor: false,
  });
}
