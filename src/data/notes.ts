export type ExperimentNote = {
  slug: string;
  title: string;
  date: string;
  readTime: string;
  body: string[];
};

// Placeholder data — short, honest notes on what's being tested here.
// Unlike the main site's workshop notes, these don't get their own detail
// page; they're short enough to read inline.
export const experimentNotes: ExperimentNote[] = [
  {
    slug: "why-this-site-is-separate",
    title: "Why this is a separate site, not a section of the main one",
    date: "2026-08-11",
    readTime: "2 min",
    body: [
      "The main Digital Workshop site is a public showcase — finished write-ups, settled content. This one is the opposite on purpose: prototypes that might break, forms that aren't wired up yet, demos labelled testing or concept.",
      "Mixing the two would mean either watering down the main site with half-finished things, or being overly cautious here because it's attached to the polished site. Neither is good. So for now they're deliberately not linked to each other — that might change once this space earns its own shape.",
    ],
  },
  {
    slug: "placeholder-first-real-content-second",
    title: "Placeholder data first, real prototypes one at a time",
    date: "2026-08-11",
    readTime: "1 min",
    body: [
      "This first version ships with typed placeholder content for every section — prototypes, forms, notes — so the layout and interaction patterns can be judged honestly before anything real goes in.",
      "The plan is to replace one card at a time, starting with whichever prototype is closest to actually working, rather than trying to backfill everything at once.",
    ],
  },
];
