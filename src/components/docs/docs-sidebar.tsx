"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { DOCS_NAV } from "@/lib/docs/nav";
import { cn } from "@/lib/utils/cn";
import {
  Api,
  Category,
  CompareArrows,
  DataObject,
  FactCheck,
  Gavel,
  ManageSearch,
  SmartToy,
  Sparkles,
  TextFields,
  HealthAndSafety,
  Home,
  Lightbulb,
  QueryStats,
  RocketLaunch,
  ScanLine,
  Sigma,
  SsidChart,
  Summarize,
  Terminal,
  Texture,
  TrendingUp,
  Tune,
  type MaterialIcon,
} from "@/components/ui/icons";

/** Material Symbols icon for each documentation page. */
export const DOC_ICONS: Record<string, MaterialIcon> = {
  "/docs": Home,
  "/docs/getting-started": RocketLaunch,
  "/docs/concepts": Lightbulb,
  "/docs/metrics": Sigma,
  "/docs/api": Api,
  "/docs/cli": Terminal,
  "/docs/classification": Category,
  "/docs/regression": TrendingUp,
  "/docs/clinical": HealthAndSafety,
  "/docs/calibration": Tune,
  "/docs/statistics": QueryStats,
  "/docs/bootstrap": SsidChart,
  "/docs/model-comparison": CompareArrows,
  "/docs/segmentation": Texture,
  "/docs/detection": ScanLine,
  "/docs/reporting": Summarize,
  "/docs/llm": SmartToy,
  "/docs/text-generation": TextFields,
  "/docs/factuality": FactCheck,
  "/docs/llm-judge": Gavel,
  "/docs/rag": ManageSearch,
  "/docs/structured-output": DataObject,
  "/docs/llm-systems": Sparkles,
};

function DocIcon({ href }: { href: string }) {
  const Icon = DOC_ICONS[href];
  return Icon ? <Icon aria-hidden className="size-4 shrink-0" /> : null;
}

export function DocsSidebar() {
  const pathname = usePathname() ?? "";
  const isActive = (href: string) =>
    href === "/docs/metrics" ? pathname.startsWith(href) : pathname === href;
  return (
    <nav aria-label="Documentation" className="text-sm">
      {DOCS_NAV.map((section) => (
        <div key={section.title} className="mb-6">
          <p className="mb-2 px-3 font-semibold">{section.title}</p>
          <ul className="border-l border-border-subtle">
            {section.links.map((link) => {
              const active = isActive(link.href);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "-ml-px flex items-center gap-2 border-l-2 px-3 py-1.5 transition-colors",
                      active
                        ? "border-primary font-medium text-foreground"
                        : "border-transparent text-muted-foreground hover:text-foreground",
                    )}
                  >
                    <DocIcon href={link.href} />
                    {link.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}

export function MobileDocsNav() {
  return (
    <details className="mb-6 rounded-lg border border-border bg-surface lg:hidden">
      <summary className="cursor-pointer px-4 py-2.5 text-sm font-medium">
        Documentation menu
      </summary>
      <div className="border-t border-border-subtle px-1 pt-4">
        <DocsSidebar />
      </div>
    </details>
  );
}
