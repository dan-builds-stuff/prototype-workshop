# Board — deployment runbook

`/board` is a live split-flap style message display (32 columns x 8 rows — rows 1-2 are
permanently live weather, rows 3-8 are a posted message). `/board/control` is the private
page to compose and publish a message to it. Unlike the rest of this site's forms, `/board/control`
is a real, wired-up form — it actually posts to a backend, not a UI placeholder.

This is genuinely different infrastructure from the rest of the site, because it's the first
thing here that needs state (an active message) and a protected route. Both had to fit this
site's actual deployment shape: **static export, Cloudflare Pages, no Node server, no Next
API routes, no Next middleware.** So:

- **Storage**: Cloudflare KV (not a database — simple key/value, fine for "one active
  message + a short history list").
- **API**: Cloudflare Pages Functions (`functions/api/message.ts`, `functions/api/auth.ts`)
  — these deploy alongside the static site and run at Cloudflare's edge, not in Next.js at
  all.
- **Access gate**: `functions/board/control/_middleware.ts` — Cloudflare Pages' own
  middleware convention (a `_middleware.ts` file scopes to everything under its directory
  automatically), not Next.js middleware, which doesn't run on a static export.

## One-time setup

### 1. Create the KV namespace

Run this from the repo root, on a machine with `wrangler` installed and logged into the
right Cloudflare account (`npx wrangler login` first if needed):

```bash
npx wrangler kv namespace create BOARD_KV
npx wrangler kv namespace create BOARD_KV --preview
```

Each command prints an `id`. Put the first one in `wrangler.toml`'s `id` field and the
second in `preview_id` — this only matters for local `npm run pages:dev`, not for the real
deployment (see step 3).

### 2. Push this repo and connect it to Cloudflare Pages

If not already connected (it should be, based on the existing deployment):

```bash
git add .
git commit -m "Add live board: weather, message posting, Pages Functions API"
git push
```

Cloudflare Pages auto-deploys from the connected GitHub repo — no separate deploy step
needed once it's pushed, assuming the project is already wired up the way `README.md`
describes for the rest of this site.

### 3. Bind the KV namespace in the Cloudflare dashboard

`wrangler.toml`'s KV binding is for local dev only — the deployed Pages project needs its
own binding, set in the dashboard:

1. Cloudflare dashboard → Workers & Pages → this Pages project → **Settings** →
   **Functions** → **KV namespace bindings** → Add binding.
2. Variable name: `BOARD_KV`. Value: the namespace you created in step 1 (the non-preview
   one, or add both a Production and Preview binding pointing at the respective
   namespaces).

### 4. Set the CONTROL_PASSWORD secret

Same Settings page → **Environment variables** → add `CONTROL_PASSWORD` as a **secret**
(not a plain variable) with whatever password you want to gate `/board/control` with.
**Do this before anyone else can reach the domain** — without it, `functions/board/control/_middleware.ts`
fails open (no login prompt at all, by design, so local/preview deploys aren't locked out
accidentally).

### 5. (Optional) Weather location

Also as environment variables if you want somewhere other than Melbourne:
`NEXT_PUBLIC_BOARD_LOCATION_NAME`, `NEXT_PUBLIC_BOARD_LATITUDE`, `NEXT_PUBLIC_BOARD_LONGITUDE`,
`NEXT_PUBLIC_BOARD_TIMEZONE`, `NEXT_PUBLIC_WEATHER_REFRESH_MINUTES`. These are baked into
the static build at build time (they're `NEXT_PUBLIC_*`), so set them before the next
deploy, not after.

## Local testing

```bash
npm install
npm run build          # static export to out/
npm run pages:dev       # wrangler pages dev — runs the real Functions locally
```

`npm run dev` (plain `next dev`) will render `/board` and `/board/control` fine for layout
work, but `/api/message` and `/api/auth` won't respond — those only exist as Cloudflare
Pages Functions, which `next dev` knows nothing about. Use `npm run pages:dev` to test the
actual posting flow end to end.

## What's NOT built yet

- `/board/history` and `/board/settings` — the standalone frame-vestaboard prototype this
  was ported from had these; they weren't ported into this integration. Small addition
  later if wanted (the KV history array is already being written to on every publish/clear,
  just nothing reads it yet).
- Real authentication (accounts, roles) — still a single shared password, same limitation
  noted in this site's own `/access` page philosophy for "Protected."
- Samsung Frame testing — the TV isn't connected yet (per the session that decided this).
- Message expiry — `expiresAt` is threaded through the types and storage, but nothing sets
  it from the UI yet.

## Build verification status

This was written and logic-tested in a cloud sandbox with no npm registry access — same
constraint as the rest of this project's history. `lib/board/format-message.ts` and
`lib/board/weather.ts` were verified with 19 dependency-free assertions (see the inline
verification script used to check them; the real test suite is `tests/board-format-message.test.ts`,
run via `npm test` once dependencies are installed). Every changed/new file passed an
esbuild syntax check. **Nothing here has been through a real `npm install && npm run build`
yet** — do that before treating this as done, same as every previous round of this project.
The Cloudflare Pages Functions in particular are new territory (first time this repo has
had any backend code at all) and are the most likely place for a real build or type error
to surface.
