// functions/api/dad-joke.ts
//
// Cloudflare Pages Function proxying icanhazdadjoke.com — a small server
// hop rather than a client-side fetch, for two reasons found while
// researching this (see session4-plan.md item 4): browser JavaScript
// can't set a custom User-Agent header at all (icanhazdadjoke.com asks,
// politely, for one), and this sandbox's own network restrictions meant
// their CORS behaviour couldn't be confirmed ahead of time either. Routing
// through a Function sidesteps both — a real User-Agent gets sent, and
// there's no dependency on the upstream API allowing browser requests.

import type { PagesFunction } from "@cloudflare/workers-types";

const UPSTREAM_URL = "https://icanhazdadjoke.com/";
const REQUEST_TIMEOUT_MS = 5000;

export const onRequestGet: PagesFunction = async () => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const upstream = await fetch(UPSTREAM_URL, {
      headers: {
        Accept: "application/json",
        "User-Agent": "danbuildsstuff-split-flap-board (https://danbuildsstuff.dpdns.org)",
      },
      signal: controller.signal,
    });

    if (!upstream.ok) {
      return Response.json({ error: "Upstream dad-joke request failed." }, { status: 502 });
    }

    const data = (await upstream.json()) as { joke?: unknown };
    if (typeof data.joke !== "string" || data.joke.trim().length === 0) {
      return Response.json({ error: "Upstream response had no joke." }, { status: 502 });
    }

    return Response.json({ joke: data.joke });
  } catch {
    return Response.json({ error: "Could not reach the dad-joke API." }, { status: 502 });
  } finally {
    clearTimeout(timeout);
  }
};
