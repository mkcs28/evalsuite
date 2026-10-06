import type { ReactNode } from "react";

export function PageHeader({
  title,
  children,
  meta,
}: {
  title: string;
  children?: ReactNode;
  meta?: ReactNode;
}) {
  return (
    <header className="relative -mt-[4.25rem] overflow-hidden border-b border-border-subtle pt-[4.25rem]">
      <div aria-hidden className="hero-glow absolute inset-0" />
      <div
        aria-hidden
        className="plot-grid absolute inset-0 [mask-image:radial-gradient(60%_80%_at_30%_0%,black,transparent)]"
      />
      <div className="relative mx-auto max-w-[1680px] px-4 pb-14 pt-16 sm:px-6">
        {meta ? (
          <div className="mb-5 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            {meta}
          </div>
        ) : null}
        <h1 className="text-gradient max-w-3xl text-[clamp(2.4rem,5vw,4rem)] leading-[1.02] font-black tracking-[-0.04em] text-balance">
          {title}
        </h1>
        {children ? (
          <div className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            {children}
          </div>
        ) : null}
      </div>
    </header>
  );
}

export function Section({
  title,
  children,
  id,
}: {
  title: string;
  children: ReactNode;
  id?: string;
}) {
  return (
    <section
      id={id}
      className="grid gap-4 border-b border-border-subtle py-10 md:grid-cols-[16rem_minmax(0,1fr)] md:gap-10"
    >
      <h2 className="text-xl font-bold tracking-tight">{title}</h2>
      <div className="space-y-3 leading-relaxed text-muted-foreground [&_strong]:font-semibold [&_strong]:text-foreground">
        {children}
      </div>
    </section>
  );
}
