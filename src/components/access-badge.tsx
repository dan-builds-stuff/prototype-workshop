import { Globe, ShieldCheck, UserCheck, Lock } from "lucide-react";
import type { AccessLevel } from "@/data/prototypes";
import { cn } from "@/lib/utils";

const accessStyles: Record<AccessLevel, string> = {
  public: "bg-success/15 text-success",
  protected: "bg-warm/15 text-warm",
  "invite-only": "bg-accent/15 text-accent",
  private: "bg-foreground/10 text-foreground",
};

const accessLabels: Record<AccessLevel, string> = {
  public: "Public",
  protected: "Protected",
  "invite-only": "Invite only",
  private: "Private",
};

const accessIcons: Record<AccessLevel, typeof Globe> = {
  public: Globe,
  protected: ShieldCheck,
  "invite-only": UserCheck,
  private: Lock,
};

export function AccessBadge({
  access,
  className,
}: {
  access: AccessLevel;
  className?: string;
}) {
  const Icon = accessIcons[access];
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
        accessStyles[access],
        className
      )}
    >
      <Icon className="h-3 w-3" aria-hidden="true" />
      {accessLabels[access]}
    </span>
  );
}
