// functions/api/history.ts
//
// GET /api/history — the last 10 genuinely-posted messages, newest first,
// for the board's rotation cycling. Reads the same board:history KV list
// functions/api/message.ts already writes to, but filters it: that raw log
// also contains "cleared"/"default" bookkeeping entries (every DELETE
// writes one), which aren't something anyone posted and shouldn't show up
// in a "recent messages" rotation. Confirmed with Dan — only
// status === "active" && source === "control-page" counts (this leaves
// room for a future "whatsapp" source to also count as a real post later,
// deliberately not included yet since that submission path doesn't exist).

import type { PagesFunction } from "@cloudflare/workers-types";

interface Env {
  BOARD_KV: KVNamespace;
}

interface StoredMessage {
  id: string;
  message: string;
  source: string;
  status: string;
  createdAt: string;
  expiresAt?: string;
}

const HISTORY_KEY = "board:history";
const RETURN_LIMIT = 10;

export const onRequestGet: PagesFunction<Env> = async ({ env }) => {
  const raw = await env.BOARD_KV.get(HISTORY_KEY);
  const history: StoredMessage[] = raw ? JSON.parse(raw) : [];

  const posted = history
    .filter((entry) => entry.status === "active" && entry.source === "control-page")
    .slice(0, RETURN_LIMIT)
    .map((entry) => ({ id: entry.id, message: entry.message, createdAt: entry.createdAt }));

  return Response.json({ messages: posted });
};
