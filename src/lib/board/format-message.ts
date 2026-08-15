// src/lib/board/format-message.ts
//
// Pure formatting/wrapping utility for the 32x8 board grid. Ported from
// the standalone frame-vestaboard prototype — same contract, no changes.
// Dependency-free and side-effect-free so it's trivially unit testable and
// safe to import from both client components and Cloudflare Pages
// Functions (functions/api/message.ts) for overflow validation.
//
// Session 4: content is centred by default (previously left-aligned) —
// a deliberate change so manually posted messages read the same way the
// weather rows always have. The dad-joke feed needs its own fixed
// left/right layout instead — that's built separately in dad-joke.ts
// using padLine() directly with an explicit alignment per part, rather
// than teaching this generic wrap/pad path about statement/response
// pairs. See session4-plan.md for why that's scoped this narrowly.
//
// Session 6: content now packs toward the BOTTOM of the row block instead
// of the top. With CONTENT_ROWS = 5 (rows 1-5), that means anything up to
// 4 lines sits in rows 2-5 with row 1 left blank, and only a 5-line
// message spills up into row 1 too. Confirmed with Dan: rows 2-5 are the
// "normal" content area, row 1 is overflow spillover, not a row that's
// used every time. Applies uniformly to plain messages, rich (colour/
// emoji) messages, and the dad-joke feed — see the matching change in
// rich-text.ts and dad-joke.ts.

import type { FormatOptions, FormattedGrid } from "./message-types";

const DEFAULT_COLUMNS = 32;
const DEFAULT_ROWS = 8;

export function formatMessageForGrid(
  input: string,
  options: FormatOptions = {}
): FormattedGrid {
  const columns = options.columns ?? DEFAULT_COLUMNS;
  const rows = options.rows ?? DEFAULT_ROWS;
  const uppercase = options.uppercase ?? true;
  const trimTrailingSpaces = options.trimTrailingSpaces ?? true;
  const align = options.align ?? "center";

  const normalised = normaliseMessage(input, uppercase);
  const wrappedLines = wrapMessage(normalised, columns);
  const visibleLines = wrappedLines.slice(0, rows);
  const overflow = wrappedLines.length > rows;

  // Bottom-pack: blank rows go at the top, content ends on the last row.
  // A 4-line message in a 5-row block occupies rows 2-5, leaving row 1
  // blank; only a full 5-line message uses row 1 too.
  const topOffset = rows - visibleLines.length;
  const paddedLines = Array.from({ length: rows }, (_, index) => {
    const sourceIndex = index - topOffset;
    const line = sourceIndex >= 0 ? (visibleLines[sourceIndex] ?? "") : "";
    const trimmed = trimTrailingSpaces ? line.trimEnd() : line;
    return alignLine(trimmed, columns, align);
  });

  const cells = paddedLines.map((line) => line.split(""));
  const characterCount = normalised.length;
  const remainingSlots = Math.max(
    0,
    columns * rows - paddedLines.join("").trimEnd().length
  );

  return {
    columns,
    rows,
    lines: paddedLines,
    cells,
    characterCount,
    wrappedLineCount: wrappedLines.length,
    overflow,
    remainingSlots,
  };
}

export function normaliseMessage(input: string, uppercase = true): string {
  const cleaned = input
    .replace(/\r\n/g, "\n")
    .replace(/\t/g, " ")
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .trim();

  return uppercase ? cleaned.toUpperCase() : cleaned;
}

// Single-line pad/align helper for content that is never wrapped — used by
// the weather rows, which are always exactly one line each and should be
// centred rather than left-justified like wrapped message text.
export function padLine(
  value: string,
  columns: number,
  align: "left" | "right" | "center" = "left"
): string {
  const clean = normaliseMessage(value).slice(0, columns);

  if (align === "left") return clean.padEnd(columns, " ");
  if (align === "right") return clean.padStart(columns, " ");

  const left = Math.floor((columns - clean.length) / 2);
  return " ".repeat(Math.max(0, left)) + clean + " ".repeat(Math.max(0, columns - clean.length - left));
}

// Same padding behaviour as padLine(), minus its re-normalise/re-uppercase
// pass — used internally once a line has already been normalised with the
// caller's own `uppercase` choice, so it doesn't get silently forced back
// to uppercase for callers that asked for uppercase: false.
function alignLine(value: string, columns: number, align: "left" | "right" | "center"): string {
  const clean = value.slice(0, columns);
  if (align === "left") return clean.padEnd(columns, " ");
  if (align === "right") return clean.padStart(columns, " ");
  const left = Math.floor((columns - clean.length) / 2);
  return " ".repeat(Math.max(0, left)) + clean + " ".repeat(Math.max(0, columns - clean.length - left));
}

export function wrapMessage(message: string, columns: number): string[] {
  const paragraphs = message.split("\n");
  const output: string[] = [];

  for (const paragraph of paragraphs) {
    if (paragraph.trim() === "") {
      output.push("");
      continue;
    }

    const words = paragraph.split(/\s+/);
    let currentLine = "";

    for (const word of words) {
      if (word.length > columns) {
        if (currentLine.length > 0) {
          output.push(currentLine);
          currentLine = "";
        }
        for (let i = 0; i < word.length; i += columns) {
          output.push(word.slice(i, i + columns));
        }
        continue;
      }

      const candidate = currentLine.length === 0 ? word : `${currentLine} ${word}`;

      if (candidate.length <= columns) {
        currentLine = candidate;
      } else {
        output.push(currentLine);
        currentLine = word;
      }
    }

    if (currentLine.length > 0) {
      output.push(currentLine);
    }
  }

  return output;
}
