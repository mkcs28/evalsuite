import type { Status } from "@/types/status";

/** Read an optional public URL from the environment; empty or invalid values become null. */
export function optionalUrl(value: string | undefined): string | null {
  if (!value) return null;
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" && url.protocol !== "http:") return null;
    return url.toString().replace(/\/$/, "");
  } catch {
    return null;
  }
}

export interface NavItem {
  label: string;
  href: string;
}

export interface SiteConfig {
  name: string;
  title: string;
  tagline: string;
  description: string;
  url: string;
  /** Package release state. No version has been published yet. */
  package: {
    latestRelease: string | null;
    nextRelease: string;
    status: Status;
  };
  links: {
    repository: string | null;
    issues: string | null;
    discussions: string | null;
    pypi: string | null;
  };
  nav: NavItem[];
}

const repository = optionalUrl(process.env.NEXT_PUBLIC_REPOSITORY_URL);

export const siteConfig: SiteConfig = {
  name: "EvalSuite",
  title: "EvalSuite: Unified evaluation for machine learning and research",
  tagline: "Unified evaluation for modern machine learning and research.",
  description:
    "EvalSuite brings machine learning, clinical, statistical, segmentation, and object-detection evaluation into one consistent evaluation framework.",
  url: optionalUrl(process.env.NEXT_PUBLIC_SITE_URL) ?? "http://localhost:3000",
  package: {
    latestRelease: null,
    nextRelease: "v0.1.0",
    status: "planned",
  },
  links: {
    repository,
    issues: repository ? `${repository}/issues` : null,
    discussions: repository ? `${repository}/discussions` : null,
    pypi: optionalUrl(process.env.NEXT_PUBLIC_PYPI_URL),
  },
  nav: [
    { label: "Docs", href: "/docs" },
    { label: "Metrics", href: "/docs/metrics" },
    { label: "Playground", href: "/playground" },
    { label: "Benchmarks", href: "/benchmarks" },
    { label: "Research", href: "/research" },
    { label: "Roadmap", href: "/roadmap" },
    { label: "Download", href: "/download" },
  ],
};

/** Human-readable package state used in banners and the footer. */
export function packageStateLabel(config: SiteConfig = siteConfig): string {
  return config.package.latestRelease
    ? `Latest release ${config.package.latestRelease}`
    : `Pre-release: ${config.package.nextRelease} is planned`;
}
