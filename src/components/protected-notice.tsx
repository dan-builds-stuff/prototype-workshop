import { ShieldAlert } from "lucide-react";
import type { AccessLevel } from "@/data/prototypes";

// Two variants per access level: most prototypes here are placeholders
// with a disabled primaryAction (nothing real to protect yet), but a
// prototype can also be genuinely wired up with real access control
// (e.g. the Split-Flap Board's control page, gated by an actual passcode
// in Cloudflare middleware) — the copy needs to say so accurately rather
// than defaulting to "nothing's real here" for every private/protected
// entry regardless of whether that's still true.
const messages: Partial<Record<AccessLevel, { wired: string; notWired: string }>> = {
  protected: {
    wired: "This is a protected prototype — the linked page checks real credentials before letting you in.",
    notWired: "This is a protected prototype. No real authentication is wired up yet in this build — treat anything here as a draft, not a finished tool.",
  },
  "invite-only": {
    wired: "This prototype is invite-only — access is genuinely gated, not just labelled that way.",
    notWired: "This prototype is invite only. It's visible here for context, but nothing is wired up for real access yet.",
  },
  private: {
    wired: "This prototype is private. The linked page is protected by a real passcode — you'll be asked to sign in before you can use it.",
    notWired: "This prototype is private and not meant to be shared. It's listed here only as a placeholder for structure.",
  },
};

export function ProtectedNotice({ access, wired = false }: { access: AccessLevel; wired?: boolean }) {
  const entry = messages[access];
  if (!entry) return null;
  const message = wired ? entry.wired : entry.notWired;

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
