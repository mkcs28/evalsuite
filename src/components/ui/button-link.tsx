import Link from "next/link";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils/cn";

type Variant = "primary" | "secondary" | "ghost";

const VARIANT: Record<Variant, string> = {
  primary:
    "brand-gradient text-on-brand shadow-[0_8px_24px_-10px_var(--accent-2)] hover:brightness-110 border border-white/15",
  secondary:
    "bg-surface/80 text-foreground border border-border hover:border-primary/50 hover:bg-surface backdrop-blur",
  ghost: "text-foreground hover:bg-surface-muted border border-transparent",
};

export const buttonClass = (variant: Variant = "primary", className?: string) =>
  cn(
    "inline-flex h-11 items-center justify-center gap-2 rounded-xl px-5 text-sm font-semibold transition-all",
    VARIANT[variant],
    className,
  );

export function ButtonLink({
  variant = "primary",
  className,
  ...props
}: ComponentProps<typeof Link> & { variant?: Variant }) {
  return <Link className={buttonClass(variant, className)} {...props} />;
}
