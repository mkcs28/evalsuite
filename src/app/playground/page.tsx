import type { Metadata } from "next";
import { Playground } from "@/components/playground/playground";
import { WasmPlayground } from "@/components/playground/wasm-playground";
import { StatusBadge } from "@/components/ui/status-badge";

export const metadata: Metadata = {
  title: "Playground",
  description: "Try the EvalSuite evaluation workflow in demo mode, entirely in your browser.",
  alternates: { canonical: "/playground" },
};

export default function PlaygroundPage() {
  return (
    <div className="mx-auto max-w-[1680px] px-4 pb-10 pt-12 sm:px-6">
      <h1 className="text-[clamp(2rem,4vw,3rem)] font-bold tracking-tight">
        Evaluation playground
      </h1>
      <p className="mt-3 max-w-2xl text-lg leading-relaxed text-muted-foreground">
        Provide predictions, choose metrics and an interval method, and inspect the results. Signed
        in, the playground runs on the EvalSuite API (the released package); otherwise a clearly
        labelled demo engine runs in your browser.
      </p>
      <div className="mt-10">
        <Playground />
      </div>
      <section className="mt-16" aria-labelledby="wasm-heading">
        <div className="flex flex-wrap items-center gap-3">
          <h2 id="wasm-heading" className="text-2xl font-bold tracking-tight">
            The Rust engine in your browser
          </h2>
          <StatusBadge status="implemented" label="Available in v1.0.0" />
        </div>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          The same engine as the Python package and the Rust crate, compiled to WebAssembly: your
          data never leaves this page. Pick a metric, edit the arguments and compute.
        </p>
        <div className="mt-6">
          <WasmPlayground />
        </div>
      </section>
    </div>
  );
}
