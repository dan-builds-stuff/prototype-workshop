# dan's sandbox

A companion site to the main Digital Workshop site — a working lab bench for
prototypes, protected webforms and experiments, built with Next.js 15,
TypeScript, Tailwind CSS, Framer Motion and a hand-built shadcn/ui-style
component set. Shares the main site's design language (palette, type,
motion) but is deliberately not linked to it yet.

## Stack

- **Next.js 15** (App Router, React 19), static export (`output: "export"`)
- **TypeScript** (strict mode)
- **Tailwind CSS** with the shared design-token palette, plus `warm` and
  `success` tokens for status/access badges
- **Framer Motion** for `prefers-reduced-motion`-aware micro-interactions
- **cmdk** for the ⌘K command palette
- **lucide-react** for icons

## Getting started

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

## Structure

```
src/
  app/
    layout.tsx              Root layout, fonts, header/footer, command palette
    page.tsx                 Homepage — hero, status panel, featured sections
    prototypes/               Prototypes index (table) + [slug] detail pages
    forms/                    Protected forms index + [slug] detail (FormShell)
    notes/                    Experiment notes (inline, no detail sub-pages)
    access/                   Access information page
    not-found.tsx             404 page
  components/
    site-header.tsx            "dan's sandbox" brand, nav, search trigger
    site-footer.tsx             No link to the main site — see CLAUDE.md
    hero-intro.tsx               Homepage hero
    status-panel.tsx             Stat tiles computed from data files
    prototype-card.tsx           Card used on the homepage grid
    prototype-table.tsx          Table used on the prototypes index
    status-badge.tsx / access-badge.tsx   Shared badge components
    protected-notice.tsx         Banner shown on non-public prototype pages
    form-shell.tsx                Renders a protected form's disabled fields
    command-palette.tsx           ⌘K / Ctrl+K navigation
    ui/                           Hand-built shadcn-style primitives
    motion/reveal.tsx             Shared fade-up wrapper (plain CSS, not JS scroll-trigger)
  data/
    prototypes.ts    All prototype content — edit this to add/change entries
    forms.ts          All protected form content
    notes.ts           All experiment notes
  hooks/use-command-palette.tsx   Shared open state + keyboard shortcut
```

## Editing content

Everything shown on the site (prototypes, forms, notes) lives in
`src/data/*.ts`. Update those files rather than the components — it keeps
content and layout separate, same convention as the main site.

To add a new prototype: add an entry to `src/data/prototypes.ts` with a
unique `slug` — the index table and detail page pick it up automatically via
`generateStaticParams`. Same pattern for forms.

## Design tokens

Defined in `tailwind.config.ts` (see `CLAUDE.md` for the full design system):

| Token | Value | Used for |
|---|---|---|
| Background | `#08090A` | Page background |
| Surface | `#111315` | Cards, panels |
| Elevated | `#171A1D` | Command palette, form fields |
| Foreground | `#F3F3F1` | Primary text |
| Muted | `#A2A7AE` | Secondary text |
| Accent | `#7DD3FC` | Links, interactive elements |
| Warm | `#FBBF24` | "Building" status, protected access, attention banners |
| Success | `#34D399` | "Live" status, public access |

## Protected forms — current state

Forms in this first version are **UI and routing only**. `FormShell` renders
every field disabled with a visible "not wired up yet" notice. No
submission endpoint, no auth, no stored data. When that's ready to build:

1. Decide an auth approach (e.g. a simple access-code gate, or a real
   provider) and document it before wiring anything up.
2. Add a submission endpoint and put its URL/keys in environment variables
   (`.env.local`, never committed) — see `.gitignore`.
3. Update the relevant `src/data/forms.ts` entry's `status` to reflect
   reality once it's actually connected.

## Deployment

Deployed to **Cloudflare Pages**, not Vercel — this avoids the apex-domain
ownership conflict the main site hit on Vercel with a shared free-domain
provider.

1. Push this repo to GitHub.
2. In Cloudflare dashboard → Workers & Pages → Create application → look
   for "Looking to deploy Pages? Get started" → Import an existing Git
   repository.
3. Build settings: Framework preset `None`, build command `npm run build`,
   build output directory `out`.
4. Once deployed to `<project>.pages.dev`, go to the project's **Custom
   domains** tab and add `danbuildsstuff.dpdns.org` — since the domain's
   DNS is already on this Cloudflare account, the CNAME record is added
   automatically.

`public/_headers` is already set up so the HTML document is never cached
stale relative to hashed JS chunk filenames (the cause of a real "blank
page after deploy" bug on the main site) — no extra Cloudflare config
needed for that.

## Accessibility

- Skip-to-content link, semantic landmarks.
- Full keyboard support for the command palette (⌘K / Ctrl+K, `/` fallback,
  `Esc` to close).
- Visible focus rings, contrast checked against the dark palette.
- All motion is skipped when `prefers-reduced-motion: reduce` is set.
