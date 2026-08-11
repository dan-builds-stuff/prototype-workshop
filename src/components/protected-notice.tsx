import { ShieldAlert } from "lucide-react";
import type { AccessLevel } from "@/data/prototypes";

const messages: Partial<Record<AccessLevel, string>> = {
  protected: "This is a protected prototype. No real authentication is wired up yet in this build — treat anything here as a draft, not a finished tool.",
  "invite-only": "This prototype is invite only. It's visible here for context, but nothing is wired up for real access yet.",
  private: "This prototype is private and not meant to be shared. It's listed here only as a placeholder for structure.",
};

export function ProtectedNotice({ access }: { access: AccessLevel }) {
  const message = messages[access];
  if (!message) return null;

  return (
    <div
      role="note"
      className="flex items-start gap-3 rounded-lg border border-warm/30 bg-warm/10 p-4 text-sm leading-relaxed text-foreground/90"
    >
      <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-warm" aria-hidden="true" />
      <p>{message}</p>
    </div>
  );
}
