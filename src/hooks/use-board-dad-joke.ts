// src/hooks/use-board-dad-joke.ts
//
// Client-side dad-joke state for the board's idle-state rotation: fetches
// via the Function proxy at /api/dad-joke on mount and every 90 seconds
// (see session4-plan.md item 4). No localStorage caching like weather has
// — a stuck/failed fetch just keeps showing the last joke already in
// state (or the built-in fallback on first load), which is enough
// resilience for low-stakes rotating content.

"use client";

import { useCallback, useEffect, useState } from "react";

const REFRESH_MS = 90_000;
const FALLBACK_JOKE =
  "WHY DID THE DEVELOPER GO BROKE? BECAUSE THEY USED UP ALL THEIR CACHE.";

export type DadJokeStatus = "loading" | "live" | "demo";

export function useBoardDadJoke() {
  const [joke, setJoke] = useState(FALLBACK_JOKE);
  const [status, setStatus] = useState<DadJokeStatus>("loading");

  const load = useCallback(async () => {
    try {
      const response = await fetch("/api/dad-joke", { cache: "no-store" });
      if (!response.ok) throw new Error("dad joke request failed");
      const data = await response.json();
      if (typeof data.joke !== "string" || data.joke.trim().length === 0) {
        throw new Error("bad dad joke response");
      }
      setJoke(data.joke);
      setStatus("live");
    } catch {
      // Keep showing whatever joke is already in state — never blank the
      // board over a failed fetch, same principle as the weather hook.
      setStatus((prev) => (prev === "live" ? "live" : "demo"));
    }
  }, []);

  useEffect(() => {
    load();
    const interval = window.setInterval(load, REFRESH_MS);
    return () => window.clearInterval(interval);
  }, [load]);

  return { joke, status };
}
