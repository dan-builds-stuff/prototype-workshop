// src/app/board/page.tsx
//
// Full-screen board display — public by design (meant to be opened on a
// TV or shared link with no login). Rows 1-5 show content, row 6 is
// always blank (a spacer above the weather strip), rows 7-8 are live
// weather.
//
// Rewritten for the history-cycling request: this page no longer polls
// /api/message for a single "active message" — it drives off
// useBoardRotation(), which cycles through the last 10 genuinely-posted
// messages (see functions/api/history.ts) at 25s per message, with a dad
// joke inserted as its own slot roughly every 90s without ever shortening
// a message's turn. See use-board-rotation.ts for the full design notes.
//
// Known, deliberate consequence of this change (not separately confirmed
// with Dan — flagging rather than assuming): "Clear" on /board/control no
// longer has any visible effect here, since there's no delete-from-history
// capability and the board now cycles through the history log rather than
// pointing at a single active-message record. Worth raising if that
// matters in practice.
//
// Resilience: a failed history/joke/weather poll keeps the last known-good
// data rather than blanking the board (see the respective hooks).

"use client";

import { useEffect, useState } from "react";
import { FrameShell } from "@/components/board/frame-shell";
import { DisplayGrid } from "@/components/board/display-grid";
import { IdleMessage } from "@/components/board/idle-message";
import { useBoardWeather } from "@/hooks/use-board-weather";
import { useBoardDadJoke } from "@/hooks/use-board-dad-joke";
import { useBoardHistory } from "@/hooks/use-board-history";
import { useBoardRotation } from "@/hooks/use-board-rotation";
import { formatRichMessageForGrid, toRichLine } from "@/lib/board/rich-text";
import { formatDadJokeLines } from "@/lib/board/dad-joke";
import { CONTENT_ROWS, GRID_COLUMNS, GRID_ROWS, SPACER_ROWS } from "@/lib/board/message-types";
import { unlockAudio, isAudioUnlocked } from "@/lib/board/flap-sound";

export default function BoardDisplayPage() {
  const { lines: weatherLines, status: weatherStatus } = useBoardWeather();
  const { joke } = useBoardDadJoke();
  const { messages: history } = useBoardHistory();
  const { slot, animationKey } = useBoardRotation(history, joke);
  const [soundUnlocked, setSoundUnlocked] = useState(false);

  useEffect(() => {
    setSoundUnlocked(isAudioUnlocked());
  }, []);

  function handleEnableSound() {
    unlockAudio();
    setSoundUnlocked(true);
  }

  const contentRichLines =
    slot.kind === "joke"
      ? formatDadJokeLines(joke, GRID_COLUMNS, CONTENT_ROWS).map((line) => toRichLine(line, GRID_COLUMNS))
      : (formatRichMessageForGrid(slot.message, { rows: CONTENT_ROWS }).richCells ?? []);

  const spacerRichLines = Array.from({ length: SPACER_ROWS }, () => toRichLine("", GRID_COLUMNS));
  const weatherRichLines = weatherLines.map((line) => toRichLine(line, GRID_COLUMNS));
  const boardRichLines = [...contentRichLines, ...spacerRichLines, ...weatherRichLines];

  return (
    <FrameShell>
      <DisplayGrid richLines={boardRichLines} columns={GRID_COLUMNS} rows={GRID_ROWS} animationKey={animationKey} />
      <IdleMessage visible={slot.kind === "joke"} mode="dad-joke" />
      {weatherStatus === "demo" && (
        <p className="mt-1 text-center text-[9px] font-medium uppercase tracking-[.3em] text-warm/60">
          Weather unavailable · showing demo data
        </p>
      )}
      {!soundUnlocked && (
        <button
          type="button"
          onClick={handleEnableSound}
          className="mt-3 block w-full text-center text-[9px] font-medium uppercase tracking-[.3em] text-muted/50 hover:text-muted"
        >
          Tap to enable flap sound
        </button>
      )}
    </FrameShell>
  );
}
