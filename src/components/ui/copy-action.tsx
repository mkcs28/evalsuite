"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { copyText } from "@/lib/utils/clipboard";
import { cn } from "@/lib/utils/cn";

/** Labelled copy button with success and failure feedback. */
export function CopyAction({
  text,
  label = "Copy",
  variant = "secondary",
  className,
}: {
  text: string;
  label?: string;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
}) {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");
  const styles = {
    primary: "brand-gradient text-on-brand border border-white/15 hover:brightness-110",
    secondary: "border border-border bg-surface hover:border-primary/50",
    ghost: "text-muted-foreground hover:bg-surface-muted hover:text-foreground",
  }[variant];
  return (
    <button
      type="button"
      data-copy-text={text}
      onClick={async () => {
        const ok = await copyText(text);
        setState(ok ? "copied" : "failed");
        setTimeout(() => setState("idle"), 1800);
      }}
      className={cn(
        "inline-flex h-9 shrink-0 items-center justify-center gap-1.5 rounded-lg px-3 text-sm font-semibold transition",
        styles,
        className,
      )}
    >
      {state === "copied" ? (
        <Check className="size-4" aria-hidden />
      ) : (
        <Copy className="size-4" aria-hidden />
      )}
      <span aria-live="polite">
        {state === "copied" ? "Copied" : state === "failed" ? "Select and copy manually" : label}
      </span>
    </button>
  );
}
