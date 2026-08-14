export type PrototypeType =
  | "demo"
  | "form"
  | "tool"
  | "experiment"
  | "automation"
  | "workflow";

export type PrototypeStatus = "concept" | "building" | "testing" | "live" | "archived";

export type AccessLevel = "public" | "protected" | "invite-only" | "private";

export type Prototype = {
  slug: string;
  name: string;
  description: string;
  type: PrototypeType;
  status: PrototypeStatus;
  access: AccessLevel;
  lastUpdated: string;
  primaryAction: {
    label: string;
    href: string;
    /** True when the action isn't actually wired up yet — shows as disabled. */
    disabled?: boolean;
  };
  context: string;
  whatItTests: string;
  notes: string;
};

// Placeholder data. Swap slugs, copy and dates for real prototypes one at a
// time once the interface itself feels right — see README for the process.
export const prototypes: Prototype[] = [
  {
    slug: "split-flap-board",
    name: "Split-Flap Board",
    description:
      "A browser-based split-flap arrivals board — live weather up top, messages posted through a private control page — built to eventually run full-screen on a Samsung Frame TV.",
    type: "tool",
    status: "testing",
    access: "private",
    lastUpdated: "2026-08-13",
    primaryAction: {
      label: "Open control page",
      href: "https://danbuildsstuff.dpdns.org/board/control",
    },
    context:
      "I wanted something on the wall that felt like a physical object, not another dashboard. Split-flap boards have a specific texture: mechanical, slightly imperfect, satisfying to watch update. This is a test of getting that feeling right in a browser before it goes on real hardware.",
    whatItTests:
      "Whether the flap-style animation and layout genuinely read as a physical object rather than a digital dashboard, and whether a public-display / private-control-page split holds up in real use — before committing to the Samsung Frame TV install.",
    notes:
      "Live weather (Open-Meteo) and message posting both work, running on Cloudflare Pages Functions + KV rather than a normal Node backend — the static-export hosting environment forced that re-platform mid-build, a good reminder that where something runs is a design constraint, not a detail to sort out later. Access is locked down while the display and deploy pipeline get proven out.",
  },
  {
    slug: "obsidian-learning-system-demo",
    name: "Obsidian Learning System Demo",
    description:
      "A prototype flow for turning raw notes and documentation into structured learning material.",
    type: "demo",
    status: "testing",
    access: "public",
    lastUpdated: "2026-08-05",
    primaryAction: {
      label: "Open demo",
      href: "#",
      disabled: true,
    },
    context:
      "Built alongside the GitHub-to-Obsidian importer — the question was whether the same summarise-and-structure approach works on a messier input than a single repo: a folder of half-finished notes.",
    whatItTests:
      "Whether an automated pass can reliably turn raw capture (daily notes, half-finished docs) into a consistent learning structure — TLDR, key concepts, glossary — without losing the original voice or inventing detail that wasn't there.",
    notes:
      "Early runs are promising on well-organised source folders and noticeably worse on messy ones — which is itself a useful signal about what “good notes” needs to mean for this to work reliably.",
  },
  {
    slug: "prompt-library-explorer",
    name: "Prompt Library Explorer",
    description:
      "A small interface for browsing reusable prompts and build patterns.",
    type: "tool",
    status: "building",
    access: "public",
    lastUpdated: "2026-07-28",
    primaryAction: {
      label: "Open explorer",
      href: "#",
      disabled: true,
    },
    context:
      "I keep rewriting the same handful of prompts across projects. This is a test of whether a searchable, tagged library actually gets reused, versus becoming another folder nobody opens.",
    whatItTests:
      "Whether tagging prompts by pattern (not just project) makes them easier to find again months later than just grepping through old chat exports.",
    notes:
      "Structure is there; the browsing UI is the current bottleneck — a flat list doesn't scale past about twenty entries, so this needs a proper filter/search pass before it's worth using day to day.",
  },
];
