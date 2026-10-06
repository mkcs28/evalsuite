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
        A planned open-source Python package for consistent, well-documented model evaluation across
        research domains.
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
            The package is planned for release under the MIT License, with public issue tracking, a
            changelog, a security policy and citation metadata. Repository links will appear here
            once the repository is public.
          </p>
        </Section>
        <Section title="Roadmap">
          <p>
            Development is planned in three releases: core metrics and infrastructure (v0.1.0),
            clinical and statistical evaluation (v0.2.0), and computer vision (v0.3.0). See the{" "}
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
