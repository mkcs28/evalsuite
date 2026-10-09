import Link from "next/link";
import { packageStateLabel, siteConfig } from "@/lib/config/site";
import { ResourceLink } from "@/components/ui/resource-link";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  Api,
  BarChart3,
  BugReport,
  Code,
  FlaskConical,
  Forum,
  History,
  Info,
  Lightbulb,
  Map,
  Package2,
  PlayCircle,
  RocketLaunch,
  Sigma,
  type MaterialIcon,
} from "@/components/ui/icons";
import { FooterStatus } from "./footer-status";
import { Logo } from "./logo";

type FooterLink = {
  label: string;
  href: string | null;
  icon: MaterialIcon;
  pending?: string;
  external?: boolean;
};

export function SiteFooter() {
  const { links } = siteConfig;
  const columns: Array<{ title: string; links: FooterLink[] }> = [
    {
      title: "Documentation",
      links: [
        { label: "Getting started", icon: RocketLaunch, href: "/docs/getting-started" },
        { label: "Core concepts", icon: Lightbulb, href: "/docs/concepts" },
        { label: "Metric reference", icon: Sigma, href: "/docs/metrics" },
        { label: "API reference", icon: Api, href: "/docs/api" },
      ],
    },
    {
      title: "Resources",
      links: [
        { label: "Playground", icon: PlayCircle, href: "/playground" },
        { label: "Benchmarks", icon: BarChart3, href: "/benchmarks" },
        { label: "Release notes", icon: History, href: "/release-notes" },
      ],
    },
    {
      title: "Research",
      links: [
        { label: "Methodology", icon: FlaskConical, href: "/research" },
        { label: "Roadmap", icon: Map, href: "/roadmap" },
        { label: "About", icon: Info, href: "/about" },
      ],
    },
    {
      title: "Community",
      links: [
        {
          label: "GitHub",
          icon: Code,
          href: links.repository,
          pending: "Repository link not yet published",
          external: true,
        },
        {
          label: "Issues",
          icon: BugReport,
          href: links.issues,
          pending: "Available once the repository is public",
          external: true,
        },
        {
          label: "Discussions",
          icon: Forum,
          href: links.discussions,
          pending: "Available once the repository is public",
          external: true,
        },
        { label: "PyPI", icon: Package2, href: links.pypi, pending: "PyPI", external: true },
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
                      className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground"
                    >
                      <l.icon aria-hidden className="size-4 shrink-0" />
                      {l.label}
                      {l.href ? null : <span className="ml-1.5 text-xs">(pending)</span>}
                    </ResourceLink>
                  ) : (
                    <Link
                      href={l.href ?? "/"}
                      className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground"
                    >
                      <l.icon aria-hidden className="size-4 shrink-0" />
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
            EvalSuite is open-source research software under the MIT License. Features are marked
            implemented only when they ship in a released version; the rest are planned.
          </p>
        </div>
      </div>
    </footer>
  );
}
