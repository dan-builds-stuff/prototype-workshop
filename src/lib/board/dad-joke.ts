// src/lib/board/dad-joke.ts
//
// Pure formatting for the dad-joke feed: splits a single joke string (all
// icanhazdadjoke.com gives you — no separate setup/punchline fields) into
// a setup/punchline pair, and lays it out as setup left-aligned, punchline
// right-aligned on the next line(s) — matching the board's fixed
// statement/response convention (see session4-plan.md item 3). Manually
// posted messages never go through this path; they always use
// formatMessageForGrid()'s default centred alignment instead.

import { normaliseMessage, padLine, wrapMessage } from "./format-message";

export interface SplitJoke {
  setup: string;
  /** Null when the joke has no natural question-mark split point — in
   * that case it's shown as a single centred block instead of forcing an
   * artificial left/right split where none exists. */
  punchline: string | null;
}

export function splitDadJoke(raw: string): SplitJoke {
  const trimmed = raw.trim();
  const questionIndex = trimmed.indexOf("?");

  if (questionIndex === -1) {
    return { setup: trimmed, punchline: null };
  }

  const setup = trimmed.slice(0, questionIndex + 1).trim();
  const punchline = trimmed.slice(questionIndex + 1).trim();

  // A "?" with nothing meaningful after it (e.g. it's the last character)
  // isn't a real statement/response split — fall back to a single block.
  if (punchline.length === 0) {
    return { setup: trimmed, punchline: null };
  }

  return { setup, punchline };
}

export function formatDadJokeLines(raw: string, columns: number, rows: number): string[] {
  const { setup, punchline } = splitDadJoke(raw);

  const parts: { text: string; align: "left" | "right" | "center" }[] = punchline
    ? [
        { text: setup, align: "left" },
        { text: punchline, align: "right" },
      ]
    : [{ text: setup, align: "center" }];

  const lines: string[] = [];
  for (const part of parts) {
    const normalised = normaliseMessage(part.text, true);
    const wrapped = wrapMessage(normalised, columns);
    for (const line of wrapped) {
      lines.push(padLine(line, columns, part.align));
    }
  }

  // If the joke is longer than the available rows, truncate rather than
  // overflow — this is auto-rotating display content, not something a
  // person is actively composing against a row-count warning.
  const visible = lines.slice(0, rows);
  while (visible.length < rows) {
    visible.push(" ".repeat(columns));
  }
  return visible;
}
