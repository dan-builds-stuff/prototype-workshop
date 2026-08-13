// functions/board/control/_middleware.ts
//
// Cloudflare Pages Functions middleware convention: a _middleware.ts file
// under a directory applies to every request under that path — so this
// automatically scopes to /board/control and everything below it, no
// manual path matching needed (unlike the Next.js middleware.ts approach
// from the earlier Vercel-shaped prototype, which doesn't run at all on a
// static export).
//
// Checks the board_auth cookie set by functions/api/auth.ts. If it's
// missing or wrong, redirects to /board/login with a `next` param to
// return to after signing in. Fails OPEN if CONTROL_PASSWORD isn't set at
// all (local/preview convenience) — always set it before the real domain
// points here.

import type { PagesFunction } from "@cloudflare/workers-types";

interface Env {
  CONTROL_PASSWORD?: string;
}

const AUTH_COOKIE = "board_auth";

export const onRequest: PagesFunction<Env> = async ({ request, env, next }) => {
  const expected = env.CONTROL_PASSWORD;
  if (!expected) return next();

  const cookieHeader = request.headers.get("Cookie") || "";
  const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${AUTH_COOKIE}=([^;]+)`));
  const value = match ? decodeURIComponent(match[1] ?? "") : null;

  if (value === expected) return next();

  const url = new URL(request.url);
  const loginUrl = new URL("/board/login", url.origin);
  loginUrl.searchParams.set("next", url.pathname);
  return Response.redirect(loginUrl.toString(), 302);
};
