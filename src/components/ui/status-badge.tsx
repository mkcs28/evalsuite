import {
  CheckCircle2,
  CircleDashed,
  Clock3,
  FlaskConical,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { STATUS_LABEL, type Status } from "@/types/status";
import { cn } from "@/lib/utils/cn";

const STYLE: Record<Status, { icon: LucideIcon; className: string }> = {
  implemented: { icon: CheckCircle2, className: "text-success border-success/35 bg-success/8" },
  demo: { icon: FlaskConical, className: "text-info border-info/35 bg-info/8" },
  "in-development": { icon: Wrench, className: "text-warning border-warning/35 bg-warning/8" },
  planned: {
    icon: CircleDashed,
    className: "text-muted-foreground border-border bg-surface-muted",
  },
  "coming-soon": {
    icon: Clock3,
    className: "text-muted-foreground border-border bg-surface-muted",
  },
};

/** Status is conveyed by icon shape and text as well as colour. */
export function StatusBadge({
  status,
  label,
  className,
}: {
  status: Status;
  label?: string;
  className?: string;
}) {
  const { icon: Icon, className: tone } = STYLE[status];
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium whitespace-nowrap",
        tone,
        className,
      )}
    >
      <Icon aria-hidden className="size-3.5" strokeWidth={2} />
      {label ?? STATUS_LABEL[status]}
    </span>
  );
}
