export interface DocLink {
  title: string;
  href: string;
}

export interface DocSection {
  title: string;
  links: DocLink[];
}

/** Single source of truth for docs sidebar order, breadcrumbs, prev/next and search. */
export const DOCS_NAV: DocSection[] = [
  {
    title: "Start here",
    links: [
      { title: "Overview", href: "/docs" },
      { title: "Getting started", href: "/docs/getting-started" },
      { title: "Core concepts", href: "/docs/concepts" },
    ],
  },
  {
    title: "Reference",
    links: [
      { title: "Metric reference", href: "/docs/metrics" },
      { title: "API reference", href: "/docs/api" },
      { title: "CLI reference", href: "/docs/cli" },
    ],
  },
  {
    title: "Evaluation guides",
    links: [
      { title: "Classification", href: "/docs/classification" },
      { title: "Regression", href: "/docs/regression" },
      { title: "Clinical evaluation", href: "/docs/clinical" },
      { title: "Calibration", href: "/docs/calibration" },
      { title: "Statistical analysis", href: "/docs/statistics" },
      { title: "Bootstrap and confidence intervals", href: "/docs/bootstrap" },
      { title: "Model comparison", href: "/docs/model-comparison" },
      { title: "Segmentation", href: "/docs/segmentation" },
      { title: "Object detection", href: "/docs/detection" },
      { title: "Reporting", href: "/docs/reporting" },
    ],
  },
];

export const DOCS_FLAT: DocLink[] = DOCS_NAV.flatMap((s) => s.links);

export function docNeighbours(pathname: string): { prev: DocLink | null; next: DocLink | null } {
  const i = DOCS_FLAT.findIndex((l) => l.href === pathname);
  if (i === -1) return { prev: null, next: null };
  return { prev: DOCS_FLAT[i - 1] ?? null, next: DOCS_FLAT[i + 1] ?? null };
}

export function docTitle(pathname: string): string | null {
  return DOCS_FLAT.find((l) => l.href === pathname)?.title ?? null;
}
