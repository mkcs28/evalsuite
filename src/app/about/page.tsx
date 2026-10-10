import { siteConfig } from "@/lib/config/site";
import Link from "next/link";
import type { Metadata } from "next";
import { PageHeader, Section } from "@/components/ui/page-header";

export const metadata: Metadata = {
  title: "About",
  description: "What EvalSuite is, who it is for, and how it is developed.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <PageHeader title="About EvalSuite">
        An open-source Python package for consistent, well-documented model evaluation across
        research domains. Current version: {siteConfig.package.latestRelease}.
      </PageHeader>
      <div className="mx-auto max-w-[1680px] px-4 sm:px-6">
        <Section title="What it is">
          <p>
            EvalSuite brings machine learning, clinical, statistical, segmentation and
            object-detection evaluation into one framework with a shared API, structured results and
            publication-ready reporting.
          </p>
        </Section>
        <Section title="Why it exists">
          <p>
            To make evaluation easier to do correctly: fewer silent convention mismatches,
            uncertainty reported by default, and every metric documented with its assumptions and
            limitations.
          </p>
        </Section>
        <Section title="Who it is for">
          <p>
            Machine learning and computer vision researchers, clinical AI researchers,
            statisticians, data scientists, students, educators and reviewers who need to check how
            numbers were produced.
          </p>
        </Section>
        <Section title="Philosophy">
          <p>
            Scientific correctness comes before speed. Numerical edge cases are surfaced, not
            hidden. Claims about performance or validity are made only with evidence.
          </p>
        </Section>
        <Section title="Open source">
          <p>
            The package is released under the MIT License, with public issue tracking and a
            changelog. Source code:{" "}
            <a
              className="text-primary underline underline-offset-4"
              href="https://github.com/mkcs28/evalsuite-python"
            >
              github.com/mkcs28/evalsuite-python
            </a>
            .
          </p>
        </Section>
        <Section title="Credits">
          <p>
            Authors and maintainers: <strong>Manoj Kumar C S</strong> and{" "}
            <strong>Nikhil D Bharadwaj</strong>.
          </p>
        </Section>
        <Section title="Roadmap">
          <p>
            Core metrics and infrastructure shipped in v0.1.0, clinical and statistical evaluation
            in v0.2.0, computer vision in v0.3.0, LLM evaluation in v0.4.0 and LLM systems (safety,
            agents, code, multilingual, long context and serving cost) in v0.5.0. See the{" "}
            <Link className="text-primary underline underline-offset-4" href="/roadmap">
              roadmap
            </Link>
            .
          </p>
        </Section>
      </div>
    </>
  );
}
