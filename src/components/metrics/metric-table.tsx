import Link from "next/link";
import { metricsByCategory, metricSlug, registry } from "@/lib/metrics/registry";
import { CATEGORY_LABEL, type MetricCategory } from "@/lib/metrics/schema";
import { StatusBadge } from "@/components/ui/status-badge";

/**
 * Registry-driven metric listing used inside documentation pages.
 * A full-width table on tablets and desktops; stacked cards on phones.
 * Nothing scrolls sideways.
 */
export function MetricTable({
  category,
  caption,
}: {
  category?: MetricCategory;
  caption?: string;
}) {
  const metrics = category ? metricsByCategory(category) : [...registry];
  const label = caption ?? (category ? `${CATEGORY_LABEL[category]} metrics` : "All metrics");
  const badge = (m: (typeof metrics)[number]) => (
    <StatusBadge
      status={m.status}
      label={m.status === "planned" ? `Planned ${m.version}` : undefined}
    />
  );

  return (
    <div className="not-prose my-6">
      <div className="hidden overflow-hidden rounded-xl border border-border bg-surface md:block">
        <table className="w-full table-fixed border-collapse text-sm">
          <caption className="sr-only">{label}</caption>
          <thead className="bg-surface-muted/70 text-left">
            <tr>
              <th scope="col" className="w-[24%] px-4 py-3 font-semibold">
                Metric
              </th>
              {category ? null : (
                <th scope="col" className="w-[14%] px-4 py-3 font-semibold">
                  Category
                </th>
              )}
              <th scope="col" className="px-4 py-3 font-semibold">
                Description
              </th>
              <th scope="col" className="w-[9.5rem] px-4 py-3 font-semibold">
                Status
              </th>
              <th scope="col" className="w-[22%] px-4 py-3 font-semibold max-xl:hidden">
                API
              </th>
            </tr>
          </thead>
          <tbody>
            {metrics.map((m) => (
              <tr key={m.id} className="border-t border-border-subtle align-top">
                <th scope="row" className="px-4 py-3 text-left font-medium">
                  <Link
                    href={`/docs/metrics/${metricSlug(m.id)}`}
                    className="font-semibold text-foreground no-underline transition-colors hover:text-primary"
                  >
                    {m.name}
                  </Link>
                </th>
                {category ? null : (
                  <td className="px-4 py-3 text-muted-foreground">{CATEGORY_LABEL[m.category]}</td>
                )}
                <td className="px-4 py-3 leading-relaxed text-muted-foreground">{m.description}</td>
                <td className="px-4 py-3">{badge(m)}</td>
                <td className="px-4 py-3 text-xs break-all text-muted-foreground max-xl:hidden">
                  {m.apiPath}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ul className="space-y-3 md:hidden" aria-label={label}>
        {metrics.map((m) => (
          <li key={m.id} className="rounded-xl border border-border bg-surface p-4">
            <div className="flex items-start justify-between gap-3">
              <Link
                href={`/docs/metrics/${metricSlug(m.id)}`}
                className="font-semibold text-foreground no-underline hover:text-primary"
              >
                {m.name}
              </Link>
              {badge(m)}
            </div>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{m.description}</p>
            <p className="mt-2 text-xs break-all text-muted-foreground">{m.apiPath}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
