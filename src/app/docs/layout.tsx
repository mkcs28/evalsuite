import type { ReactNode } from "react";
import { Breadcrumbs, PrevNext } from "@/components/docs/doc-chrome";
import { DocsSidebar, MobileDocsNav } from "@/components/docs/docs-sidebar";
import { TableOfContents } from "@/components/docs/table-of-contents";
import { StatusBadge } from "@/components/ui/status-badge";
import { siteConfig } from "@/lib/config/site";

export default function DocsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto grid max-w-[1680px] gap-10 px-4 pb-10 pt-10 sm:px-6 lg:grid-cols-[15rem_minmax(0,1fr)] xl:grid-cols-[15rem_minmax(0,1fr)_13rem]">
      <aside className="hidden lg:block">
        <div className="sticky top-24 max-h-[calc(100dvh-7rem)] overflow-y-auto pr-2">
          <div className="mb-6 flex flex-wrap items-center gap-2 px-3 text-xs text-muted-foreground">
            <span>Docs version</span>
            <StatusBadge status="implemented" label={siteConfig.package.latestRelease ?? "dev"} />
          </div>
          <DocsSidebar />
        </div>
      </aside>
      <div className="min-w-0">
        <MobileDocsNav />
        <Breadcrumbs />
        <article data-doc-article className="min-w-0">
          {children}
        </article>
        <PrevNext />
      </div>
      <aside className="hidden xl:block">
        <div className="sticky top-24">
          <TableOfContents />
        </div>
      </aside>
    </div>
  );
}
