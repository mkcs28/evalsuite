import Link from "next/link";
import { Benefits } from "@/components/home/benefits";
import { ContextDiagram } from "@/components/home/context-diagram";
import { CoverageMatrix } from "@/components/home/coverage-matrix";
import { Hero } from "@/components/home/hero";
import { Pipeline } from "@/components/home/pipeline";
import { Principles } from "@/components/home/principles";
import { Problem } from "@/components/home/problem";
import { RoadmapTimeline } from "@/components/roadmap/roadmap-timeline";
import { ButtonLink } from "@/components/ui/button-link";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Problem />
      <Benefits />
      <Pipeline />
      <ContextDiagram />
      <CoverageMatrix />
      <Principles />
      <section className="mx-auto max-w-[1680px] px-4 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-5xl">Release plan</h2>
            <p className="mt-3 max-w-xl text-lg text-muted-foreground">
              Three releases, each shipped with tests, documentation and a PyPI build.
            </p>
          </div>
          <ButtonLink href="/roadmap" variant="secondary">
            View full roadmap
          </ButtonLink>
        </div>
        <div className="mt-10">
          <RoadmapTimeline compact />
        </div>
      </section>
      <section className="mx-auto mt-24 max-w-[1680px] px-4 sm:px-6">
        <div
          className="brand-gradient-full relative overflow-hidden rounded-3xl px-8 py-14 text-on-brand sm:px-14"
          // Left to right here so the text sits on the blue end and the buttons on the mint end.
          style={{ backgroundImage: "linear-gradient(90deg, var(--grad-start), var(--grad-end))" }}
        >
          <div aria-hidden className="plot-grid absolute inset-0 opacity-40" />
          <div className="relative flex flex-wrap items-center justify-between gap-8">
            <div className="max-w-xl">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Try the evaluation workflow now.
              </h2>
              <p className="mt-3 text-on-brand/80">
                The playground runs a labelled demo engine in your browser. No data leaves the page.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/playground"
                className="inline-flex h-11 items-center rounded-xl bg-white px-5 text-sm font-semibold text-[#7f31ff] hover:bg-white/90"
              >
                Open playground
              </Link>
              <Link
                href="/docs"
                className="inline-flex h-11 items-center rounded-xl bg-[#0b0f3a] px-5 text-sm font-semibold text-white hover:bg-[#0b0f3a]/90"
              >
                Read the docs
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
