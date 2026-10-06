import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

/**
 * Renders a real external link when the URL is configured, otherwise a
 * non-interactive label explaining why it is unavailable. Never invents URLs.
 */
export function ResourceLink({
  href,
  children,
  pendingLabel,
  className,
}: {
  href: string | null;
  children: ReactNode;
  pendingLabel: string;
  className?: string;
}) {
  if (!href) {
    return (
      <span className={cn("cursor-default text-muted-foreground", className)} title={pendingLabel}>
        {children}
        <span className="sr-only">: {pendingLabel}</span>
      </span>
    );
  }
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
      {children}
    </a>
  );
}
