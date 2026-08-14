// src/hooks/use-board-rotation.ts
//
// Drives what /board actually shows: cycles through the last 10 posted
// messages (25s each), and inserts a dad joke as its own slot roughly
// every 90 seconds — WITHOUT shortening or skipping any message's turn.
// Confirmed design (session: colour/emoji + animation + history request):
//
//   - Jokes are pure insertions between message turns, never a
//     replacement — every message still gets one full, uninterrupted
//     SLOT_MS turn. A joke slot doesn't advance the message index.
//   - SLOTS_PER_JOKE = round(90s / 25s) = 4, so the actual cadence is
//     every 5th slot (4 messages + 1 joke) = 100s between jokes, the
//     closest whole-slot approximation to "every 90 seconds" — flagged
//     here rather than silently drifting from the brief.
//   - When nothing's been posted yet, the default idle message stands in
//     as the sole "message" in the rotation (still on the same cadence),
//     so idle boards still get the joke feed rather than sitting static.
//   - The instant a new message is posted (newest id changes), the
//     rotation jumps straight to it rather than waiting out whatever slot
//     was already in progress.

"use client";

import { useEffect, useRef, useState } from "react";
import type { HistoryMessage } from "./use-board-history";
import { DEFAULT_IDLE_MESSAGE } from "@/data/board-sample-messages";

export const SLOT_MS = 25_000;
const JOKE_TARGET_MS = 90_000;
export const SLOTS_PER_JOKE = Math.max(1, Math.round(JOKE_TARGET_MS / SLOT_MS));
const CYCLE_LENGTH = SLOTS_PER_JOKE + 1;

export type RotationSlot =
  | { kind: "message"; message: string; id: string }
  | { kind: "joke" };

export function useBoardRotation(history: HistoryMessage[], joke: string) {
  const [slotCount, setSlotCount] = useState(0);
  const [animationKey, setAnimationKey] = useState(0);
  const lastNewestIdRef = useRef<string | null>(null);

  const effectiveMessages: HistoryMessage[] =
    history.length > 0 ? history : [{ id: "idle", message: DEFAULT_IDLE_MESSAGE, createdAt: "" }];

  // Jump straight to the newest message the moment it shows up, instead of
  // waiting out whatever slot was already playing.
  useEffect(() => {
    const newestId = history[0]?.id ?? null;
    if (newestId && newestId !== lastNewestIdRef.current) {
      lastNewestIdRef.current = newestId;
      setSlotCount(0);
      setAnimationKey((v) => v + 1);
    }
  }, [history]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setSlotCount((c) => c + 1);
      setAnimationKey((v) => v + 1);
    }, SLOT_MS);
    return () => window.clearInterval(interval);
  }, []);

  const posInCycle = slotCount % CYCLE_LENGTH;
  const isJokeSlot = posInCycle === SLOTS_PER_JOKE;
  const completedCycles = Math.floor(slotCount / CYCLE_LENGTH);
  const messageSlotIndex = completedCycles * SLOTS_PER_JOKE + Math.min(posInCycle, SLOTS_PER_JOKE - 1);
  const current = effectiveMessages[messageSlotIndex % effectiveMessages.length] ?? effectiveMessages[0];

  const slot: RotationSlot = isJokeSlot
    ? { kind: "joke" }
    : { kind: "message", message: current?.message ?? DEFAULT_IDLE_MESSAGE, id: current?.id ?? "idle" };

  return { slot, animationKey, joke };
}
