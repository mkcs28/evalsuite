"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { DOCS_NAV } from "@/lib/docs/nav";
import { cn } from "@/lib/utils/cn";

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
                      "-ml-px block border-l-2 px-3 py-1.5 transition-colors",
                      active
                        ? "border-primary font-medium text-foreground"
                        : "border-transparent text-muted-foreground hover:text-foreground",
                    )}
                  >
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
