"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { docNeighbours, docTitle } from "@/lib/docs/nav";
import { METRICS } from "@/data/metrics/definitions";

function currentTitle(pathname: string): string | null {
  const title = docTitle(pathname);
  if (title) return title;
  const match = pathname.match(/^\/docs\/metrics\/([^/]+)$/);
  return match?.[1]
    ? (METRICS.find((m) => m.id === match[1]!.replace("--", "."))?.name ?? null)
    : null;
}

export function Breadcrumbs() {
  const pathname = usePathname() ?? "/docs";
  const isMetric = /^\/docs\/metrics\/[^/]+$/.test(pathname);
  const crumbs = [
    { label: "Docs", href: "/docs" },
    ...(isMetric ? [{ label: "Metric reference", href: "/docs/metrics" }] : []),
    ...(pathname !== "/docs" ? [{ label: currentTitle(pathname) ?? "Page", href: pathname }] : []),
  ];
  return (
    <nav aria-label="Breadcrumb" className="mb-6 text-sm text-muted-foreground">
      <ol className="flex flex-wrap items-center gap-1">
        {crumbs.map((c, i) => (
          <li key={c.href} className="flex items-center gap-1">
            {i > 0 ? <ChevronRight aria-hidden className="size-3.5" /> : null}
            {i === crumbs.length - 1 ? (
              <span aria-current="page" className="text-foreground">
                {c.label}
              </span>
            ) : (
              <Link href={c.href} className="hover:text-foreground">
                {c.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function PrevNext() {
  const pathname = usePathname() ?? "";
  const { prev, next } = docNeighbours(pathname);
  if (!prev && !next) return null;
  return (
    <nav
      aria-label="Previous and next pages"
      className="mt-16 grid gap-4 border-t border-border-subtle pt-6 sm:grid-cols-2"
    >
      {prev ? (
        <Link
          href={prev.href}
          className="group rounded-lg border border-border px-4 py-3 hover:border-foreground/30"
        >
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <ChevronLeft aria-hidden className="size-3.5" />
            Previous
          </span>
          <span className="mt-1 block font-medium">{prev.title}</span>
        </Link>
      ) : (
        <span />
      )}
      {next ? (
        <Link
          href={next.href}
          className="rounded-lg border border-border px-4 py-3 text-right hover:border-foreground/30"
        >
          <span className="flex items-center justify-end gap-1 text-xs text-muted-foreground">
            Next
            <ChevronRight aria-hidden className="size-3.5" />
          </span>
          <span className="mt-1 block font-medium">{next.title}</span>
        </Link>
      ) : null}
    </nav>
  );
}
