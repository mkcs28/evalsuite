import { cn } from "@/lib/utils/cn";

/** Wordmark with a reliability-diagram mark: the identity diagonal and an observed curve. */
export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5 font-bold tracking-tight", className)}>
      <span className="brand-gradient inline-flex size-7 items-center justify-center rounded-lg shadow-[0_6px_16px_-6px_var(--primary)]">
        <svg viewBox="0 0 24 24" className="size-4.5" aria-hidden fill="none">
          <path
            d="M4 20 20 4"
            stroke="white"
            strokeOpacity="0.45"
            strokeWidth="1.6"
            strokeDasharray="1.5 2.2"
          />
          <path
            d="M4 20C8 19 9.5 13 12.5 11.5S17 7 20 4"
            stroke="white"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
        </svg>
      </span>
      <span className="text-[1.05rem]">EvalSuite</span>
    </span>
  );
}
