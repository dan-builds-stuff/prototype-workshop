// functions/api/message.ts
//
// Cloudflare Pages Function backing GET/POST/DELETE /api/message. This
// replaces the in-memory Next.js API route from the earlier Vercel-shaped
// prototype, which can't run at all here — this site is a static export,
// no Next server, no Next API routes. Pages Functions + KV is the
// deployment-compatible equivalent.
//
// Storage: Cloudflare KV, binding name BOARD_KV (create + bind per the
// deployment runbook in the board README). Falls back to a hardcoded idle
// message if KV has never been written to or the active entry expired —
// this endpoint should never 500 just because nothing's been posted yet.

import type { PagesFunction } from "@cloudflare/workers-types";
import { formatRichMessageForGrid } from "../../src/lib/board/rich-text";
import { CONTENT_ROWS } from "../../src/lib/board/message-types";

interface Env {
  BOARD_KV: KVNamespace;
}

type StoredStatus = "active" | "expired" | "cleared" | "rejected";

interface StoredMessage {
  id: string;
  message: string;
  source: string;
  status: StoredStatus;
  createdAt: string;
  expiresAt?: string;
}

const ACTIVE_KEY = "board:active";
const HISTORY_KEY = "board:history";
const MAX_HISTORY = 50;
const ALLOWED_SOURCES = ["control-page", "whatsapp", "system", "default"];
const DEFAULT_IDLE_MESSAGE =
  "BUILDER. TINKERER.\nLIFELONG LEARNER.\n\nEXPLORING WHAT AI\nMAKES POSSIBLE.";

function isExpired(entry: StoredMessage): boolean {
  if (!entry.expiresAt) return false;
  return new Date(entry.expiresAt).getTime() < Date.now();
}

async function appendHistory(env: Env, entry: StoredMessage) {
  const historyRaw = await env.BOARD_KV.get(HISTORY_KEY);
  const history: StoredMessage[] = historyRaw ? JSON.parse(historyRaw) : [];
  history.unshift(entry);
  if (history.length > MAX_HISTORY) history.length = MAX_HISTORY;
  await env.BOARD_KV.put(HISTORY_KEY, JSON.stringify(history));
}

export const onRequestGet: PagesFunction<Env> = async ({ env }) => {
  const raw = await env.BOARD_KV.get(ACTIVE_KEY);
  const active: StoredMessage | null = raw ? JSON.parse(raw) : null;

  if (!active || isExpired(active)) {
    return Response.json({
      message: DEFAULT_IDLE_MESSAGE,
      status: "expired",
      source: "default",
      updatedAt: new Date().toISOString(),
    });
  }

  return Response.json({
    message: active.message,
    status: active.status,
    source: active.source,
    updatedAt: active.createdAt,
  });
};

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const { message, source, expiresAt } = (body ?? {}) as {
    message?: unknown;
    source?: unknown;
    expiresAt?: unknown;
  };

  if (typeof message !== "string" || message.trim().length === 0) {
    return Response.json({ error: "message is required." }, { status: 400 });
  }

  // Only CONTENT_ROWS lines are available to messages — row 6 is always a
  // blank spacer and rows 7-8 are permanently weather (session 4: weather
  // moved from the top to the bottom of the board). Rich (colour/emoji
  // aware) formatter, so overflow validation matches what the board will
  // actually render, not a plain-text approximation.
  const preview = formatRichMessageForGrid(message, { rows: CONTENT_ROWS });
  if (preview.overflow) {
    return Response.json(
      {
        error: `Message exceeds the ${CONTENT_ROWS}-row content area (row 6 is a spacer, rows 7-8 are reserved for weather).`,
        preview,
      },
      { status: 400 }
    );
  }

  const resolvedSource =
    typeof source === "string" && ALLOWED_SOURCES.includes(source) ? source : "control-page";
  const resolvedExpiresAt = typeof expiresAt === "string" ? expiresAt : undefined;

  const entry: StoredMessage = {
    id: crypto.randomUUID(),
    message,
    source: resolvedSource,
    status: "active",
    createdAt: new Date().toISOString(),
    expiresAt: resolvedExpiresAt,
  };

  await env.BOARD_KV.put(ACTIVE_KEY, JSON.stringify(entry));
  await appendHistory(env, entry);

  return Response.json({ ok: true, message: entry.message, preview, updatedAt: entry.createdAt });
};

export const onRequestDelete: PagesFunction<Env> = async ({ env }) => {
  const entry: StoredMessage = {
    id: crypto.randomUUID(),
    message: DEFAULT_IDLE_MESSAGE,
    source: "default",
    status: "cleared",
    createdAt: new Date().toISOString(),
  };

  await env.BOARD_KV.put(ACTIVE_KEY, JSON.stringify(entry));
  await appendHistory(env, entry);

  return Response.json({ ok: true, message: entry.message, updatedAt: entry.createdAt });
};
