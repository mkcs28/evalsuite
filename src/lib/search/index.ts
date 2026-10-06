import { DOCS_FLAT } from "@/lib/docs/nav";
import { metricSlug, registry } from "@/lib/metrics/registry";
import { CATEGORY_LABEL } from "@/lib/metrics/schema";

export interface SearchEntry {
  title: string;
  href: string;
  kind: "Page" | "Metric";
  detail: string;
}

const PAGES: SearchEntry[] = [
  ...DOCS_FLAT.map((l) => ({
    title: l.title,
    href: l.href,
    kind: "Page" as const,
    detail: "Documentation",
  })),
  { title: "Playground", href: "/playground", kind: "Page", detail: "Interactive demo" },
  { title: "Download", href: "/download", kind: "Page", detail: "Install and download" },
  { title: "Benchmarks", href: "/benchmarks", kind: "Page", detail: "Methodology" },
  { title: "Research and methodology", href: "/research", kind: "Page", detail: "Research" },
  { title: "Roadmap", href: "/roadmap", kind: "Page", detail: "Project" },
  { title: "Release notes", href: "/release-notes", kind: "Page", detail: "Project" },
  { title: "About EvalSuite", href: "/about", kind: "Page", detail: "Project" },
];

export const SEARCH_INDEX: SearchEntry[] = [
  ...PAGES,
  ...registry.map((m) => ({
    title: m.name,
    href: `/docs/metrics/${metricSlug(m.id)}`,
    kind: "Metric" as const,
    detail: `${CATEGORY_LABEL[m.category]}, ${m.apiPath}`,
  })),
];

export function searchSite(query: string, limit = 12): SearchEntry[] {
  const q = query.trim().toLowerCase();
  if (!q) return SEARCH_INDEX.filter((e) => e.kind === "Page").slice(0, limit);
  const scored = SEARCH_INDEX.map((e) => {
    const t = e.title.toLowerCase();
    const score = t.startsWith(q)
      ? 3
      : t.includes(q)
        ? 2
        : e.detail.toLowerCase().includes(q)
          ? 1
          : 0;
    return { e, score };
  }).filter((s) => s.score > 0);
  scored.sort((a, b) => b.score - a.score || a.e.title.localeCompare(b.e.title));
  return scored.slice(0, limit).map((s) => s.e);
}
