// src/data/board-sample-messages.ts

export interface SampleMessage {
  id: string;
  label: string;
  message: string;
}

export const BOARD_SAMPLE_MESSAGES: SampleMessage[] = [
  {
    id: "brand",
    label: "Brand identity",
    message: "BUILDER. TINKERER.\nLIFELONG LEARNER.\n\nEXPLORING WHAT AI\nMAKES POSSIBLE.",
  },
  {
    id: "good-morning",
    label: "Good morning",
    message: "GOOD MORNING.\nTODAY'S BUILD:\nPROTOTYPE WORKSHOP\n\nSTATUS: LEARNING",
  },
  {
    id: "workshop-open",
    label: "The workshop is open",
    message: "THE WORKSHOP IS OPEN.\n\nIDEAS IN.\nEXPERIMENTS OUT.",
  },
];

// Indexed access under this repo's strict `noUncheckedIndexedAccess` setting is
// typed as possibly-undefined even for a literal array like this one, so we
// fall back to a hardcoded copy of the same string rather than asserting it away.
export const DEFAULT_IDLE_MESSAGE =
  BOARD_SAMPLE_MESSAGES[0]?.message ??
  "BUILDER. TINKERER.\nLIFELONG LEARNER.\n\nEXPLORING WHAT AI\nMAKES POSSIBLE.";
