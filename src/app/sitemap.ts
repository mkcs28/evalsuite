import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/config/site";
import { DOCS_FLAT } from "@/lib/docs/nav";
import { metricSlug, registry } from "@/lib/metrics/registry";

export const STATIC_ROUTES = [
  "/",
  "/playground",
  "/benchmarks",
  "/research",
  "/roadmap",
  "/about",
  "/release-notes",
  "/download",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    ...STATIC_ROUTES,
    ...DOCS_FLAT.map((l) => l.href),
    ...registry.map((m) => `/docs/metrics/${metricSlug(m.id)}`),
  ];
  return [...new Set(paths)].map((path) => ({
    url: `${siteConfig.url}${path === "/" ? "" : path}`,
  }));
}
