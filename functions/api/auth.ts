// functions/api/auth.ts
//
// POST { password } -> if it matches the CONTROL_PASSWORD secret, sets the
// board_auth cookie (checked by functions/board/control/_middleware.ts)
// and returns ok: true. This is a lightweight shared-password gate, not
// real authentication — one secret, no accounts, no rate limiting. Closes
// the "public form could be abused" risk now that this is on a real
// public domain; real auth is still future work.

import type { PagesFunction } from "@cloudflare/workers-types";

interface Env {
  CONTROL_PASSWORD?: string;
}

const AUTH_COOKIE = "board_auth";
const THIRTY_DAYS_SECONDS = 60 * 60 * 24 * 30;

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const { password } = (body ?? {}) as { password?: unknown };
  const expected = env.CONTROL_PASSWORD;

  if (!expected) {
    // Nothing configured — matches the middleware's fail-open behaviour
    // for local/preview deploys, but says so explicitly.
    return Response.json({ ok: true, warning: "CONTROL_PASSWORD is not set." });
  }

  if (typeof password !== "string" || password !== expected) {
    return Response.json({ error: "Incorrect password." }, { status: 401 });
  }

  const headers = new Headers({ "Content-Type": "application/json" });
  headers.append(
    "Set-Cookie",
    `${AUTH_COOKIE}=${encodeURIComponent(expected)}; HttpOnly; Secure; SameSite=Lax; Max-Age=${THIRTY_DAYS_SECONDS}; Path=/`
  );

  return new Response(JSON.stringify({ ok: true }), { headers });
};
