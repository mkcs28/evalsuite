import Link from "next/link";
import { packageStateLabel, siteConfig } from "@/lib/config/site";
import { ResourceLink } from "@/components/ui/resource-link";
import { StatusBadge } from "@/components/ui/status-badge";
import { FooterStatus } from "./footer-status";
import { Logo } from "./logo";

type FooterLink = { label: string; href: string | null; pending?: string; external?: boolean };

export function SiteFooter() {
  const { links } = siteConfig;
  const columns: Array<{ title: string; links: FooterLink[] }> = [
    {
      title: "Documentation",
      links: [
        { label: "Getting started", href: "/docs/getting-started" },
        { label: "Core concepts", href: "/docs/concepts" },
        { label: "Metric reference", href: "/docs/metrics" },
        { label: "API reference", href: "/docs/api" },
      ],
    },
    {
      title: "Resources",
      links: [
        { label: "Playground", href: "/playground" },
        { label: "Benchmarks", href: "/benchmarks" },
        { label: "Release notes", href: "/release-notes" },
      ],
    },
    {
      title: "Research",
      links: [
        { label: "Methodology", href: "/research" },
        { label: "Roadmap", href: "/roadmap" },
        { label: "About", href: "/about" },
      ],
    },
    {
      title: "Community",
      links: [
        {
          label: "GitHub",
          href: links.repository,
          pending: "Repository link not yet published",
          external: true,
        },
        {
          label: "Issues",
          href: links.issues,
          pending: "Available once the repository is public",
          external: true,
        },
        {
          label: "Discussions",
          href: links.discussions,
          pending: "Available once the repository is public",
          external: true,
        },
        { label: "PyPI", href: links.pypi, pending: "PyPI", external: true },
      ],
    },
  ];

  return (
    <footer className="mt-24 border-t border-border-subtle">
      <div className="mx-auto grid max-w-[1680px] gap-10 px-4 py-14 sm:px-6 grid-cols-2 sm:grid-cols-2 lg:grid-cols-[1.4fr_repeat(4,1fr)]">
        <div className="col-span-2 max-w-xs lg:col-span-1">
          <Logo />
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{siteConfig.tagline}</p>
          <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <StatusBadge status={siteConfig.package.status} />
            <span>{packageStateLabel()}</span>
          </div>
        </div>
        {columns.map((col) => (
          <nav key={col.title} aria-label={col.title}>
            <h2 className="text-sm font-semibold">{col.title}</h2>
            <ul className="mt-3 space-y-2 text-sm">
              {col.links.map((l) => (
                <li key={l.label}>
                  {l.external ? (
                    <ResourceLink
                      href={l.href}
                      pendingLabel={l.pending ?? "Not yet available"}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      {l.label}
                      {l.href ? null : (
                        <span className="ml-1.5 text-xs">
                          ({l.pending === "Coming with v0.1.0" ? "v0.1.0" : "pending"})
                        </span>
                      )}
                    </ResourceLink>
                  ) : (
                    <Link
                      href={l.href ?? "/"}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      {l.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="border-t border-border-subtle">
        <div className="mx-auto flex max-w-[1680px] flex-col gap-4 px-4 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
          <FooterStatus />
          <p className="text-xs text-muted-foreground lg:max-w-md lg:text-right">
            EvalSuite is planned as open-source research software under the MIT License. Package
            features described on this site are planned unless marked as implemented.
          </p>
        </div>
      </div>
    </footer>
  );
}
