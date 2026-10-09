import { siteConfig } from "@/lib/config/site";
import type { Metadata } from "next";
import { RoadmapTimeline } from "@/components/roadmap/roadmap-timeline";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { WEBSITE_MILESTONES } from "@/data/roadmap";

export const metadata: Metadata = {
  title: "Roadmap",
  description:
    "EvalSuite releases v0.1.0, v0.2.0 and v0.3.0 are released; v0.4.0 (LLM evaluation) and v0.5.0 (LLM systems) are planned.",
  alternates: { canonical: "/roadmap" },
};

export default function RoadmapPage() {
  return (
    <>
      <PageHeader title="Roadmap">
        EvalSuite ships in releases, each with tests, documentation and a PyPI build. v0.1.0 to
        v0.3.0 are released (current version {siteConfig.package.latestRelease}); v0.4.0 brings LLM
        evaluation and v0.5.0 LLM systems, safety and operations. Planned items move to implemented
        only when they ship.
      </PageHeader>
      <div className="mx-auto max-w-[1680px] px-4 pt-12 sm:px-6">
        <h2 className="sr-only">Package releases</h2>
        <RoadmapTimeline />
        <section className="mt-16 max-w-3xl">
          <h2 className="text-2xl font-bold tracking-tight">Website</h2>
          <p className="mt-2 text-muted-foreground">
            The website is tracked separately from the package.
          </p>
          <ul className="mt-6 divide-y divide-border-subtle border-y border-border-subtle">
            {WEBSITE_MILESTONES.map((m) => (
              <li key={m.label} className="flex items-center justify-between gap-4 py-3 text-sm">
                <span>{m.label}</span>
                <StatusBadge status={m.status} />
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  );
}
