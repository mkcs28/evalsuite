import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CodeBlock } from "@/components/code/code-block";
import { Callout } from "@/components/ui/callout";
import { StatusBadge } from "@/components/ui/status-badge";
import { getMetric, metricIdFromSlug, metricSlug, registry } from "@/lib/metrics/registry";
import { CATEGORY_LABEL } from "@/lib/metrics/schema";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return registry.map((m) => ({ slug: metricSlug(m.id) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const metric = getMetric(metricIdFromSlug((await params).slug));
  if (!metric) return {};
  return {
    title: `${metric.name} (${CATEGORY_LABEL[metric.category]})`,
    description: metric.description,
    alternates: { canonical: `/docs/metrics/${metricSlug(metric.id)}` },
  };
}

function exampleFor(apiPath: string, inputs: string[]): string {
  const args = inputs
    .map((i) => i.split(":")[0]!.trim())
    .filter((a) => /^[a-z_]+$/.test(a))
    .slice(0, 3);
  return `import evalsuite as es\n\nresult = ${apiPath}(${args.join(", ")})\nresult.value`;
}

export default async function MetricPage({ params }: Props) {
  const metric = getMetric(metricIdFromSlug((await params).slug));
  if (!metric) notFound();

  return (
    <div className="doc-prose">
      <p className="!mt-0 text-sm text-muted-foreground">{CATEGORY_LABEL[metric.category]}</p>
      <h1>{metric.name}</h1>
      <div className="flex flex-wrap items-center gap-2">
        <StatusBadge
          status={metric.status}
          label={metric.status === "planned" ? `Planned for ${metric.version}` : undefined}
        />
        <code>{metric.id}</code>
      </div>

      <h2 id="definition">Definition</h2>
      <p>{metric.description}</p>

      <h2 id="formula">Formula</h2>
      <div className="overflow-hidden rounded-lg border border-border bg-surface px-4 py-3 text-[14px]">
        {metric.formula}
      </div>
      {metric.range ? (
        <p>
          Range: <code>{metric.range}</code>
        </p>
      ) : null}

      <h2 id="inputs-and-outputs">Inputs and outputs</h2>
      <ul>
        {metric.inputs.map((i) => (
          <li key={i}>{i}</li>
        ))}
      </ul>
      <p>Returns: {metric.outputs}</p>

      <h2 id="assumptions">Assumptions</h2>
      {metric.assumptions.length ? (
        <ul>
          {metric.assumptions.map((a) => (
            <li key={a}>{a}</li>
          ))}
        </ul>
      ) : (
        <p>No assumptions beyond valid, aligned inputs of the documented types.</p>
      )}

      <h2 id="limitations">Limitations</h2>
      {metric.limitations.length ? (
        <ul>
          {metric.limitations.map((l) => (
            <li key={l}>{l}</li>
          ))}
        </ul>
      ) : (
        <p>
          No metric-specific limitations are documented yet. Interpret the value alongside the task,
          data, and other metrics.
        </p>
      )}

      <h2 id="python-api">Python API</h2>
      <CodeBlock
        code={exampleFor(metric.apiPath, metric.inputs)}
        lang="python"
        status="planned"
        statusLabel="Planned API"
      />

      <h2 id="references">References</h2>
      {metric.references.length ? (
        <ol>
          {metric.references.map((r) => (
            <li key={r.citation}>{r.citation}</li>
          ))}
        </ol>
      ) : (
        <p>Primary references for this entry have not been added yet.</p>
      )}

      <h2 id="implementation-status">Implementation status</h2>
      <Callout title={`Planned for ${metric.version}`}>
        <p>
          This metric is not implemented yet. The definition above is the planned specification and
          will be validated against reference implementations before release.
        </p>
      </Callout>
    </div>
  );
}
