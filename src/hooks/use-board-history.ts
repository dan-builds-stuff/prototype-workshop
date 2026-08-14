// src/hooks/use-board-history.ts
//
// Polls /api/history for the last 10 genuinely-posted messages (newest
// first — see functions/api/history.ts for the "genuinely posted" filter).
// Same resilience principle as the weather/dad-joke hooks: a failed poll
// keeps whatever's already in state rather than clearing the board's
// rotation out from under it.

"use client";

import { useCallback, useEffect, useState } from "react";

export interface HistoryMessage {
  id: string;
  message: string;
  createdAt: string;
}

const POLL_INTERVAL_MS = 10_000;

export function useBoardHistory() {
  const [messages, setMessages] = useState<HistoryMessage[]>([]);
  const [loaded, setLoaded] = useState(false);

  const load = useCallback(async () => {
    try {
      const response = await fetch("/api/history", { cache: "no-store" });
      if (!response.ok) throw new Error("history request failed");
      const data = await response.json();
      if (Array.isArray(data.messages)) {
        setMessages(data.messages);
      }
    } catch {
      // Keep whatever's already in state — a failed poll shouldn't blank
      // or freeze the rotation.
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    load();
    const interval = window.setInterval(load, POLL_INTERVAL_MS);
    return () => window.clearInterval(interval);
  }, [load]);

  return { messages, loaded };
}
