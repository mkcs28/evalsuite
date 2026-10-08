import Link from "next/link";
import type { Metadata } from "next";
import { PageHeader, Section } from "@/components/ui/page-header";

export const metadata: Metadata = {
  title: "Research and methodology",
  description: "Motivation, architecture and methodological principles behind EvalSuite.",
  alternates: { canonical: "/research" },
};

export default function ResearchPage() {
  return (
    <>
      <PageHeader title="Research and methodology">
        Why EvalSuite is being built, how it is designed, and what it does and does not claim.
      </PageHeader>
      <div className="mx-auto max-w-[1680px] px-4 sm:px-6">
        <Section title="Motivation">
          <p>
            Model evaluation is where many research conclusions are decided, yet it is usually
            assembled from separate libraries and project-specific scripts. Differences in
            averaging, zero-division handling, empty-mask conventions or interval methods can change
            reported numbers without anyone noticing.
          </p>
        </Section>
        <Section title="Problem">
          <p>
            Each established library is sound within its scope. The difficulty is the seams between
            them: inputs validated several times in different ways, conventions that differ
            silently, and uncertainty estimates added by hand, if at all.
          </p>
        </Section>
        <Section title="Architecture">
          <p>
            EvalSuite is designed around a single path: input, validation, evaluation context,
            metrics, statistical analysis, uncertainty, visualization and reporting. Each layer has
            one responsibility and communicates through typed result objects.
          </p>
        </Section>
        <Section title="Unified evaluation">
          <p>
            The same parameter conventions and result types apply across classification, regression,
            clinical, statistical, segmentation and detection metrics, at both the function level
            and through <code className="text-sm">es.evaluate</code>.
          </p>
        </Section>
        <Section title="Shared computation">
          <p>
            Intermediates such as confusion matrices and class counts are computed once per
            evaluation and reused. In v0.1.0 this makes evaluate() about 10× faster than separate
            scikit-learn calls for the same metrics, with identical results (see the benchmarks
            page).
          </p>
        </Section>
        <Section title="Numerical validation">
          <p>
            Each metric is tested against analytically derived cases and, where conventions match,
            against scikit-learn, SciPy and statsmodels (1,300+ tests on Python 3.9 to 3.14, Linux,
            Windows and macOS). Intentional differences in convention are documented rather than
            hidden.
          </p>
        </Section>
        <Section title="Reproducibility">
          <p>
            Every stochastic procedure accepts a seed, results record the parameters that produced
            them, and exports carry the software version.
          </p>
        </Section>
        <Section title="Clinical and statistical evaluation">
          <p>
            Clinical metrics are applied only when their assumptions hold and are documented with
            their dependence on prevalence. Statistical tests report effect sizes and intervals
            alongside p-values, and are not presented as decision rules.
          </p>
        </Section>
        <Section title="Benchmarking">
          <p>
            Performance claims will be made only from reproducible runs that list hardware, software
            versions and workloads. See the{" "}
            <Link className="text-primary underline underline-offset-4" href="/benchmarks">
              benchmark methodology
            </Link>
            .
          </p>
        </Section>
        <Section title="Intended contributions">
          <p>
            A single, documented evaluation layer spanning several research domains; a metric
            registry that keeps documentation in sync with code; and publication-ready reporting
            with uncertainty included by default. Whether these goals are met will be judged by the
            released software and its tests.
          </p>
        </Section>
        <Section title="Limitations">
          <p>
            EvalSuite v0.1.0 covers classification, regression and model comparison; clinical,
            further statistical and vision modules are still to come. It does not replace domain
            expertise, clinical validation or study design. A unified interface cannot remove the
            need to choose metrics that fit the question being asked.
          </p>
        </Section>
      </div>
    </>
  );
}
