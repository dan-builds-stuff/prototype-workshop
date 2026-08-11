import type { PrototypeStatus } from "@/data/prototypes";
import { cn } from "@/lib/utils";

const statusStyles: Record<PrototypeStatus, string> = {
  concept: "bg-muted/15 text-muted",
  building: "bg-warm/15 text-warm",
  testing: "bg-accent/15 text-accent",
  live: "bg-success/15 text-success",
  archived: "bg-border text-muted",
};

const statusLabels: Record<PrototypeStatus, string> = {
  concept: "Concept",
  building: "Building",
  testing: "Testing",
  live: "Live",
  archived: "Archived",
};

export function StatusBadge({
  status,
  className,
}: {
  status: PrototypeStatus;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center rounded-full px-2.5 py-1 text-xs font-medium",
        statusStyles[status],
        className
      )}
    >
      {statusLabels[status]}
    </span>
  );
}
