import type { AccessLevel, PrototypeStatus } from "./prototypes";

export type ProtectedForm = {
  slug: string;
  name: string;
  description: string;
  status: PrototypeStatus;
  access: AccessLevel;
  lastUpdated: string;
  /** Plain-English statement of why this form exists. Required — see README. */
  purpose: string;
  /** What data the form collects, stated plainly. */
  dataCollected: string;
  /** Who can see submissions once the form is actually wired up. */
  whoCanAccess: string;
  /** Placeholder field list, rendered disabled by FormShell. */
  fields: { label: string; type: "text" | "textarea" | "select"; options?: string[] }[];
};

// Placeholder data. Per the build rules: UI and routing only for v1 — no
// real submission endpoint, no stored data, until auth and storage are
// deliberately added and documented.
export const forms: ProtectedForm[] = [
  {
    slug: "ai-project-intake-form",
    name: "AI Project Intake Form",
    description:
      "A structured form for capturing project ideas, constraints, risks and expected outcomes.",
    status: "building",
    access: "protected",
    lastUpdated: "2026-08-04",
    purpose:
      "To capture a new project idea in a consistent shape — problem, constraints, risks, expected outcome — before any building starts, the same discipline the constitution pattern used on Alfred.",
    dataCollected:
      "Project name, problem statement, constraints, risk notes and expected outcome. No personal or financial information.",
    whoCanAccess: "Only me, once submission storage is connected — not yet wired up.",
    fields: [
      { label: "Project name", type: "text" },
      { label: "Problem statement", type: "textarea" },
      { label: "Constraints", type: "textarea" },
      { label: "Risks", type: "textarea" },
      { label: "Expected outcome", type: "textarea" },
    ],
  },
  {
    slug: "delivery-health-check-form",
    name: "Delivery Health Check Form",
    description: "A lightweight form for surfacing assumptions, blockers and delivery risks.",
    status: "concept",
    access: "invite-only",
    lastUpdated: "2026-07-20",
    purpose:
      "A short check-in form to surface what's actually blocking a project versus what looks fine on paper — same idea as the EWOS lesson: no screen, no running thing, no queryable result means it's stalled.",
    dataCollected:
      "Project name, current blockers, assumptions being made, and a rough confidence rating. No personal or financial information.",
    whoCanAccess: "Only me, once submission storage is connected — not yet wired up.",
    fields: [
      { label: "Project name", type: "text" },
      { label: "Current blockers", type: "textarea" },
      { label: "Assumptions being made", type: "textarea" },
      {
        label: "Confidence this ships this month",
        type: "select",
        options: ["High", "Medium", "Low"],
      },
    ],
  },
];
