import type { ReactNode } from "react";
import { Logo } from "@/components/layout/logo";

export function AuthCard({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="relative -mt-[4.25rem] overflow-hidden pt-[4.25rem]">
      <div aria-hidden className="hero-glow absolute inset-0" />
      <div
        aria-hidden
        className="plot-grid absolute inset-0 [mask-image:radial-gradient(60%_60%_at_50%_30%,black,transparent)]"
      />
      <div className="relative mx-auto flex min-h-[78vh] max-w-xl flex-col justify-center px-4 py-16">
        <div className="gradient-ring rounded-3xl border border-border bg-surface/90 p-8 shadow-panel backdrop-blur">
          <Logo />
          <h1 className="mt-6 text-2xl font-bold tracking-tight">{title}</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">{subtitle}</p>
          <div className="mt-7">{children}</div>
        </div>
        {footer ? (
          <div className="mt-6 text-center text-sm text-muted-foreground">{footer}</div>
        ) : null}
      </div>
    </div>
  );
}

export function ApiUnconfigured() {
  return (
    <div
      role="status"
      className="rounded-xl border border-warning/35 bg-warning/6 p-4 text-sm leading-relaxed"
    >
      <p className="font-semibold">Accounts are not available on this deployment</p>
      <p className="mt-1 text-muted-foreground">
        Sign-in needs the EvalSuite API, which has not been deployed yet. Site operators enable it
        by setting <code className="text-[0.85em]">NEXT_PUBLIC_API_BASE_URL</code>.
      </p>
    </div>
  );
}

export const inputClass =
  "h-11 w-full rounded-xl border border-border bg-surface px-3.5 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/15";
