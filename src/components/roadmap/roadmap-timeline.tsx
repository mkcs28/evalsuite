import { ROADMAP } from "@/data/roadmap";
import { StatusBadge } from "@/components/ui/status-badge";
import { cn } from "@/lib/utils/cn";

export function RoadmapTimeline({ compact = false }: { compact?: boolean }) {
  return (
    <ol className="relative grid gap-6 lg:grid-cols-3">
      {ROADMAP.map((release) => (
        <li
          key={release.version}
          className="relative rounded-xl border border-border bg-surface p-6"
        >
          <div className="flex items-center justify-between gap-3">
            <p className="text-brand text-sm font-semibold">{release.version}</p>
            <StatusBadge status={release.status} />
          </div>
          <h3 className="mt-3 text-xl font-bold">{release.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{release.summary}</p>
          <div className={cn("mt-5 space-y-4", compact && "hidden")}>
            {release.groups.map((g) => (
              <div key={g.title}>
                <p className="text-sm font-semibold">{g.title}</p>
                <ul className="mt-1.5 space-y-1">
                  {g.items.map((item) => (
                    <li
                      key={item.label}
                      className="flex items-center justify-between gap-2 text-sm text-muted-foreground"
                    >
                      <span>{item.label}</span>
                      <span className="sr-only">Status: {item.status}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </li>
      ))}
    </ol>
  );
}
