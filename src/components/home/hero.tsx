import { Sparkles } from "@/components/ui/icons";
import { CodeBlock } from "@/components/code/code-block";
import { DownloadButton } from "@/components/download/download-button";
import { InstallCommand } from "@/components/download/install-command";
import { VisitorCounter } from "./visitor-counter";
import { ButtonLink } from "@/components/ui/button-link";
import { ResourceLink } from "@/components/ui/resource-link";
import { siteConfig } from "@/lib/config/site";

const EXAMPLE = `
import evalsuite as es

result = es.evaluate(y_true, y_pred, y_prob=y_prob)
print(result.summary())

for m in ["accuracy", "precision", "recall", "f1", "mcc"]:
    print(es.bootstrap_ci(m, y_true, y_pred, random_state=0))
print(es.bootstrap_ci("roc_auc", y_true, y_prob=y_prob, random_state=0))

result.save("results.tex")
`;

/** Real output of the example above on a seeded 200-sample test set (BCa bootstrap, 2000 resamples). */
const ROWS: Array<[string, string, string]> = [
  ["Accuracy", "0.845", "0.790–0.890"],
  ["Precision", "0.885", "0.817–0.935"],
  ["Recall", "0.810", "0.724–0.876"],
  ["F1 score", "0.846", "0.786–0.891"],
  ["MCC", "0.693", "0.583–0.783"],
  ["ROC AUC", "0.926", "0.886–0.953"],
];
const DOMAINS = [
  "Classification",
  "Regression",
  "Clinical",
  "Statistics",
  "Segmentation",
  "Detection",
];

export function Hero() {
  return (
    <section className="relative -mt-[4.25rem] overflow-hidden pt-[4.25rem]">
      <div aria-hidden className="hero-glow absolute inset-0" />
      <div
        aria-hidden
        className="plot-grid absolute inset-0 [mask-image:radial-gradient(70%_60%_at_50%_20%,black,transparent)]"
      />
      <div className="relative mx-auto grid max-w-[1680px] gap-14 px-4 pb-16 pt-10 sm:px-6 sm:pb-24 sm:pt-16 lg:grid-cols-[1.05fr_1fr] lg:gap-12 lg:pb-32 lg:pt-24">
        <div className="animate-rise">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/8 py-1 pl-1.5 pr-3 text-sm">
            <span className="brand-gradient inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold text-on-brand">
              <Sparkles className="size-3" aria-hidden />
              {siteConfig.package.latestRelease} released
            </span>
            <span className="text-muted-foreground">
              Stable on PyPI · LLM evaluation and LLM systems · v0.5.0
            </span>
          </span>
          <h1 className="text-gradient mt-7 text-[clamp(2.75rem,6.4vw,5rem)] leading-[1.0] font-black tracking-[-0.045em] text-balance">
            Unified evaluation for modern machine learning and research.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
            {siteConfig.description}
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <ButtonLink href="/docs/getting-started">Get started</ButtonLink>
            <DownloadButton />
            <ButtonLink href="/docs/metrics" variant="secondary">
              Explore metrics
            </ButtonLink>
            <ResourceLink
              href={siteConfig.links.repository}
              pendingLabel="Repository link not yet published"
              className="px-2 text-sm font-medium text-muted-foreground underline-offset-4 hover:underline"
            >
              {siteConfig.links.repository ? "View on GitHub" : "GitHub (link pending)"}
            </ResourceLink>
          </div>
          <InstallCommand className="mt-8" />
          <div className="mt-6">
            <VisitorCounter />
          </div>
          <ul className="mt-8 flex flex-wrap gap-2" aria-label="Evaluation domains">
            {DOMAINS.map((d) => (
              <li
                key={d}
                className="rounded-full border border-border bg-surface/70 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur"
              >
                {d}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative animate-rise [animation-delay:120ms]">
          <div className="gradient-ring rounded-2xl border border-border bg-surface-elevated/90 shadow-panel backdrop-blur">
            <div className="flex items-center gap-1.5 border-b border-border-subtle px-4 py-3">
              <span className="size-3 rounded-full bg-[#ff5f57]" aria-hidden />
              <span className="size-3 rounded-full bg-[#febc2e]" aria-hidden />
              <span className="size-3 rounded-full bg-[#28c840]" aria-hidden />
              <span className="ml-3 text-xs text-muted-foreground">evaluate.py</span>
            </div>
            <CodeBlock
              code={EXAMPLE}
              lang="python"
              status="implemented"
              statusLabel="v0.1.0"
              className="my-0 rounded-none border-0"
            />
          </div>
          <div className="relative z-10 mx-auto -mt-10 w-[92%] rounded-2xl border border-border bg-surface/95 p-5 shadow-panel backdrop-blur sm:w-[85%] lg:ml-auto lg:mr-[-1.5rem] lg:w-[78%]">
            <div className="flex items-baseline justify-between">
              <p className="font-semibold">result.summary()</p>
              <p className="text-xs text-muted-foreground">example, n = 200</p>
            </div>
            <table className="mt-3 w-full text-sm">
              <caption className="sr-only">
                Example output: estimates with 95% bootstrap confidence intervals on a 200-sample
                test set.
              </caption>
              <thead className="text-left text-xs text-muted-foreground">
                <tr className="border-b border-border-subtle">
                  <th scope="col" className="py-1.5 font-medium">
                    Metric
                  </th>
                  <th scope="col" className="py-1.5 text-right font-medium">
                    Estimate
                  </th>
                  <th scope="col" className="py-1.5 text-right font-medium">
                    95% CI
                  </th>
                </tr>
              </thead>
              <tbody className="text-[13px]">
                {ROWS.map(([name, value, ci]) => (
                  <tr key={name} className="border-b border-border-subtle last:border-0">
                    <th scope="row" className="py-1.5 text-left font-sans font-medium">
                      {name}
                    </th>
                    <td className="py-1.5 text-right tabular-nums">{value}</td>
                    <td className="py-1.5 text-right tabular-nums text-muted-foreground">{ci}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
