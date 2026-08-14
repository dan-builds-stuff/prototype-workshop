// src/lib/board/flap-sound.ts
//
// Synthesized flap-click sound (Dan's call — no sound file supplied, a
// short Web Audio click stands in for the real mechanical clack). One
// shared AudioContext for the whole page rather than one per cell — 256
// cells all importing this get the same singleton via useFlapSound().
//
// Browser autoplay policy: an AudioContext can't produce sound until a
// user gesture unlocks it (a page that's just been opened, e.g. a TV
// left tuned to /board, gets no click sound until someone interacts with
// it once). unlockAudio() is called from a tap/click handler on /board
// itself; until then playFlapClick() is a safe no-op.

"use client";

import { useCallback, useEffect, useRef } from "react";

let sharedContext: AudioContext | null = null;
let unlocked = false;

function getContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const AudioCtor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioCtor) return null;
  if (!sharedContext) sharedContext = new AudioCtor();
  return sharedContext;
}

/** Call from a user-gesture handler (click/tap) to satisfy the browser's
 * autoplay policy. Safe to call more than once. */
export function unlockAudio() {
  const ctx = getContext();
  if (!ctx) return;
  if (ctx.state === "suspended") {
    ctx.resume().catch(() => {
      // Ignore — playFlapClick() below will just stay a no-op.
    });
  }
  unlocked = true;
}

export function isAudioUnlocked() {
  return unlocked;
}

/** Short percussive click: a fast-decaying square-wave burst, pitched down
 * slightly and mixed with a touch of noise-like second oscillator so it
 * reads as a mechanical clack rather than a pure digital beep. */
function synthesizeClick(ctx: AudioContext) {
  const now = ctx.currentTime;
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.22, now + 0.002);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.045);
  gain.connect(ctx.destination);

  const osc = ctx.createOscillator();
  osc.type = "square";
  osc.frequency.setValueAtTime(820, now);
  osc.frequency.exponentialRampToValueAtTime(180, now + 0.04);
  osc.connect(gain);
  osc.start(now);
  osc.stop(now + 0.05);

  const osc2 = ctx.createOscillator();
  osc2.type = "square";
  osc2.frequency.setValueAtTime(140, now);
  const gain2 = ctx.createGain();
  gain2.gain.setValueAtTime(0.0001, now);
  gain2.gain.exponentialRampToValueAtTime(0.09, now + 0.001);
  gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.03);
  osc2.connect(gain2);
  gain2.connect(ctx.destination);
  osc2.start(now);
  osc2.stop(now + 0.03);
}

export function playFlapClick() {
  if (!unlocked) return;
  const ctx = getContext();
  if (!ctx || ctx.state !== "running") return;
  try {
    synthesizeClick(ctx);
  } catch {
    // Never let a sound glitch affect the board display.
  }
}

/** Hook wrapper so DisplayCell doesn't need to import the module-level
 * function directly — keeps the door open for a future soundEnabled
 * context without touching every call site again. */
export function useFlapSound() {
  const ref = useRef(playFlapClick);
  useEffect(() => {
    ref.current = playFlapClick;
  }, []);
  return useCallback(() => ref.current(), []);
}
