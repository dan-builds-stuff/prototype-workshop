// src/app/board/page.tsx
//
// Full-screen board display — public by design (meant to be opened on a
// TV or shared link with no login). Rows 1-2 are live weather, rows 3-8
// poll functions/api/message.ts every 5 seconds for the active message.
//
// Resilience: a failed message poll keeps the last known-good message
// rather than blanking the board; a failed weather fetch falls back to a
// cached-then-demo reading (see use-board-weather.ts). Neither failure
// mode should ever blank the board.

"use client";

import { useEffect, useRef, useState } from "react";
import { DEFAULT_IDLE_MESSAGE } from "@/data/board-sample-messages";
import { FrameShell } from "@/components/board/frame-shell";
import { DisplayGrid } from "@/components/board/display-grid";
import { IdleMessage } from "@/components/board/idle-message";
import { useBoardWeather } from "@/hooks/use-board-weather";
import { formatMessageForGrid } from "@/lib/board/format-message";
import { CONTENT_ROWS, GRID_COLUMNS, GRID_ROWS } from "@/lib/board/message-types";

const POLL_INTERVAL_MS = 5000;

export default function BoardDisplayPage() {
  const [message, setMessage] = useState(DEFAULT_IDLE_MESSAGE);
  const [isIdle, setIsIdle] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);
  const lastMessageRef = useRef(message);
  const { lines: weatherLines, status: weatherStatus } = useBoardWeather();

  useEffect(() => {
    let cancelled = false;

    async function loadMessage() {
      try {
        const response = await fetch("/api/message", { cache: "no-store" });
        if (!response.ok) throw new Error("Message request failed");
        const data = await response.json();
        if (cancelled) return;

        const nextMessage = data.message ?? DEFAULT_IDLE_MESSAGE;
        if (nextMessage !== lastMessageRef.current) {
          lastMessageRef.current = nextMessage;
          setMessage(nextMessage);
          setAnimationKey((v) => v + 1);
        }
        setIsIdle(data.status === "expired" || data.source === "default");
      } catch {
        // Keep showing the last known-good message. Do not blank the board.
      }
    }

    loadMessage();
    const interval = window.setInterval(loadMessage, POLL_INTERVAL_MS);
    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, []);

  const contentLines = formatMessageForGrid(message, { rows: CONTENT_ROWS }).lines;
  const boardLines = [...weatherLines, ...contentLines];

  return (
    <FrameShell>
      <DisplayGrid lines={boardLines} columns={GRID_COLUMNS} rows={GRID_ROWS} animationKey={animationKey} />
      <IdleMessage visible={isIdle} />
      {weatherStatus === "demo" && (
        <p className="mt-1 text-center text-[9px] font-medium uppercase tracking-[.3em] text-warm/60">
          Weather unavailable · showing demo data
        </p>
      )}
    </FrameShell>
  );
}
