import { Terminal } from "lucide-react";
import { CopyAction } from "@/components/ui/copy-action";
import { StatusBadge } from "@/components/ui/status-badge";
import { siteConfig } from "@/lib/config/site";
import { PIP_INSTALL } from "@/lib/downloads/manifest";
import { cn } from "@/lib/utils/cn";

/** `pip install evalsuite-python` with a copy button and honest PyPI status. */
export function InstallCommand({ className }: { className?: string }) {
  const pypi = siteConfig.links.pypi;
  return (
    <div className={cn("max-w-xl", className)}>
      <div className="flex items-center gap-2 rounded-xl border border-border bg-surface/90 p-1.5 pl-4 shadow-panel backdrop-blur">
        <Terminal className="size-4 shrink-0 text-muted-foreground" aria-hidden />
        <code className="min-w-0 flex-1 truncate text-sm" aria-label="Install command">
          <span className="select-none text-muted-foreground">$ </span>
          {PIP_INSTALL}
        </code>
        <CopyAction text={PIP_INSTALL} label="Copy" variant="primary" />
      </div>
      <p className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        {pypi ? (
          <a
            href={pypi}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-primary hover:underline"
          >
            View on PyPI
          </a>
        ) : (
          <StatusBadge status="implemented" label="On PyPI" />
        )}
        <span>Python 3.9 or newer. Optional extras: [plot], [all].</span>
      </p>
    </div>
  );
}
