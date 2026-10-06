import { AlertTriangle, Info, ShieldAlert, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

type Tone = "info" | "warning" | "privacy";

const TONE: Record<Tone, { icon: LucideIcon; className: string; label: string }> = {
  info: { icon: Info, className: "border-info/30 bg-info/6", label: "Note" },
  warning: { icon: AlertTriangle, className: "border-warning/35 bg-warning/6", label: "Caution" },
  privacy: { icon: ShieldAlert, className: "border-danger/30 bg-danger/5", label: "Data privacy" },
};

export function Callout({
  tone = "info",
  title,
  children,
}: {
  tone?: Tone;
  title?: string;
  children: ReactNode;
}) {
  const { icon: Icon, className, label } = TONE[tone];
  return (
    <aside
      className={cn(
        "my-6 flex gap-3 rounded-xl border px-4 py-3.5 text-sm leading-relaxed",
        className,
      )}
      role="note"
    >
      <Icon aria-hidden className="mt-0.5 size-4 shrink-0" />
      <div>
        <p className="!my-0 font-semibold">{title ?? label}</p>
        <div className="[&>p]:!my-1">{children}</div>
      </div>
    </aside>
  );
}
