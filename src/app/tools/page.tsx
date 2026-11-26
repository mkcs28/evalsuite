import type { Metadata } from "next";
import Link from "next/link";
import { LeaderboardTool } from "@/components/tools/leaderboard-tool";
import { MonitorTool } from "@/components/tools/monitor-tool";
import { StatusBadge } from "@/components/ui/status-badge";

export const metadata: Metadata = {
  title: "Tools",
  description:
    "Rank LLM runs with significance tests and watch a deployed model for drift, in your browser with the EvalSuite engine.",
  alternates: { canonical: "/tools" },
};

export default function ToolsPage() {
  return (
    <div className="mx-auto max-w-[1680px] px-4 pb-16 pt-12 sm:px-6">
      <h1 className="text-[clamp(2rem,4vw,3rem)] font-bold tracking-tight">Tools</h1>
      <p className="mt-3 max-w-2xl text-lg leading-relaxed text-muted-foreground">
        The EvalSuite engine running in your browser (WebAssembly): your files are read locally and
        never uploaded. The same computations are in the Python package, the Rust crate and npm.
      </p>

      <section className="mt-12" aria-labelledby="lb-heading">
        <div className="flex flex-wrap items-center gap-3">
          <h2 id="lb-heading" className="text-2xl font-bold tracking-tight">
            LLM leaderboard
          </h2>
          <StatusBadge status="implemented" label="Available in v1.1.0" />
        </div>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Drop one results file per model. Each model gets an accuracy with a Wilson interval, every
          pair is compared on the same items, and models share a rank unless a significant
          difference separates them. For scorers, per-category tables and contamination checks, use{" "}
          <Link href="/docs/leaderboard" className="underline underline-offset-4">
            es.leaderboard
          </Link>
          .
        </p>
        <div className="mt-6">
          <LeaderboardTool />
        </div>
      </section>

      <section className="mt-16" aria-labelledby="mon-heading">
        <div className="flex flex-wrap items-center gap-3">
          <h2 id="mon-heading" className="text-2xl font-bold tracking-tight">
            Monitoring dashboard
          </h2>
          <StatusBadge status="implemented" label="Available in v1.1.0" />
        </div>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Load a model&apos;s predictions in time order to see performance and score drift window by
          window, with alerts at your thresholds. For live traffic, use{" "}
          <Link href="/docs/monitoring" className="underline underline-offset-4">
            es.Monitor
          </Link>
          .
        </p>
        <div className="mt-6">
          <MonitorTool />
        </div>
      </section>
    </div>
  );
}
