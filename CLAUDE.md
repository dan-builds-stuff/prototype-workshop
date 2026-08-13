# CLAUDE.md: dan's sandbox (prototype workshop site)

## Purpose
This site is a companion to the main Digital Workshop site (danbuildsstuff.qzz.io).
It hosts prototypes, protected webforms, small demos and experimental interfaces
connected to what Dan is building and learning.

It shares the same design language as the main site — same palette family,
typography and motion — but the content model is different.
The main site is the public workshop and learning space.
This site is the lab bench: rougher, more honest about what's unfinished,
and never shows Dan's surname (site identity is "dan's sandbox").

The two sites are **deliberately not linked to each other** at this stage.
That may change later, but don't add a link between them without being asked.

## Brand relationship
- Site name / header brand: `dan's sandbox` (lowercase, no surname anywhere —
  not in the header, footer, page titles or metadata).
- Underlying identity system (shared with the main site, not displayed
  verbatim here): Builder. Tinkerer. Explorer. Lifelong learner.
- Prototype site positioning: "A working space for prototypes, protected
  webforms and experiments connected to what I'm building and learning."
- Visual inspiration: Anthropic + Raycast + Vercel.
- Design character: calm, precise, useful, and honestly experimental —
  more "lab notebook" than "portfolio."

Do not position the site as a software company, a consultancy, a product
marketplace, a generic portfolio, or a dashboard template.

## Visual rules — design tokens (tailwind.config.ts)
- Background: `#08090A`
- Surface: `#111315`
- Elevated surface: `#171A1D`
- Primary text (`foreground`): `#F3F3F1`
- Secondary text (`muted`): `#A2A7AE`
- Border: `#212528`
- Accent (interactive/links): `#7DD3FC`
- Warm (`warm` — status/attention, e.g. "building", protected badges): `#FBBF24`
- Success (`success` — "live" status, public access): `#34D399`

Typography: Geist via `next/font/google`, same as the main site. Large
editorial headings, comfortable reading width (`max-w-prose`), clear hierarchy.

## Layout rules
Calm technical lab space: generous whitespace, subtle borders, soft
elevation, clear metadata (status + access badges on everything), compact
but readable cards, practical navigation.

Avoid: bright gradients, stock illustrations, overly playful animation,
startup landing-page language, or claiming a prototype is production ready
unless its status badge says `live`.

## Pages (all built)
1. `/` — Home (hero, status panel, featured prototypes, protected forms
   teaser, experiment notes, access-info callout)
2. `/prototypes` — Prototypes index (table view)
3. `/prototypes/[slug]` — Prototype detail
4. `/forms` — Protected forms index
5. `/forms/[slug]` — Protected form detail (uses `FormShell`)
6. `/notes` — Experiment notes (no detail sub-pages — notes are short
   enough to read inline)
7. `/access` — Access information

## Prototype card fields
Name, description, type (`demo` | `form` | `tool` | `experiment` |
`automation` | `workflow`), status (`concept` | `building` | `testing` |
`live` | `archived`), access (`public` | `protected` | `invite-only` |
`private`), last updated, primary action (label + href, or `disabled: true`
if not wired up yet).

## Protected form rules
- UI and routing only in this first version — no real authentication, no
  submission storage.
- Every form must state: purpose, what's collected, who can access
  submissions.
- `FormShell` renders all fields disabled with a visible "not wired up yet"
  notice — never let a placeholder form look like it actually submits.
- Do not collect real personal information via any form until an explicit,
  documented auth + storage plan is in place.
- Any future real endpoint, key or token goes in environment variables —
  never hardcoded in the repo.

## Engineering standards
- Next.js 15 (App Router), TypeScript, Tailwind CSS, Framer Motion,
  hand-built shadcn/ui-style primitives, lucide-react icons.
- `output: "export"` in `next.config.ts` from day one — static export,
  deployed straight to **Cloudflare Pages** (not Vercel). The main site hit
  a Vercel apex-domain ownership conflict on its shared free-domain
  provider; this site's domain (danbuildsstuff.dpdns.org) is already
  linked to Cloudflare, so Cloudflare Pages is the only deployment target,
  skipping that entire class of problem.
- `next` pinned to `15.5.23` from the start (the version the main site
  landed on after chasing three rounds of CVE patches) — don't let it drift
  back to an older version via any "helper" tool.
- `public/_headers` sets `Cache-Control: no-cache` on HTML and
  `immutable` on `/_next/static/*` from day one, plus a client-side
  `ChunkErrorReload` safety net — both ported directly from the fix for a
  real stale-cache "blank page" bug on the main site. Don't remove either
  without understanding why they're there.
- `Reveal` uses a plain CSS `animate-fade-up` keyframe, not framer-motion's
  `useInView`/`whileInView` — the scroll-triggered JS version was extra
  complexity that became the first (wrong) suspect when the real bug above
  showed up. Keep it simple.

## Workflow (matches the main site)
1. Files are edited directly in the project folder.
2. Run `npm run build` locally before every commit — the cloud sandbox this
   was originally drafted in has no npm registry access, so nothing gets
   verified until it builds locally.
3. Commit and push from the local machine.
4. Cloudflare Pages auto-deploys from the connected GitHub repo.

## Accessibility
Keyboard navigation, visible focus states, semantic headings, sufficient
colour contrast, screen-reader-friendly labels, mobile responsive layout —
same bar as the main site.

## Delivery expectation
Placeholder data throughout (2 prototypes, 2 protected forms, 2 experiment
notes) so the interface can be judged honestly before real content goes in.
Replace one card at a time — don't backfill everything at once.

## Board (exception to "forms are placeholders")
`/board` (full-bleed, no site chrome — see src/components/site-chrome.tsx)
and `/board/control` are a real, wired-up feature, not a UI placeholder
like the rest of src/data/forms.ts. It needed backend state for the first
time in this repo, which had to fit the static-export/Cloudflare Pages
deployment shape: Cloudflare Pages Functions (functions/) for the API,
Cloudflare KV for storage, and functions/board/control/_middleware.ts
(Cloudflare's own middleware convention, not Next's — Next middleware
does not run on a static export) for the access gate. Full detail and the
one-time setup steps are in BOARD.md — read that before touching
anything under functions/ or src/lib/board/.
