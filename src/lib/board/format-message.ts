// src/lib/board/format-message.ts
//
// Pure formatting/wrapping utility for the 32x8 board grid. Ported from
// the standalone frame-vestaboard prototype — same contract, no changes.
// Dependency-free and side-effect-free so it's trivially unit testable and
// safe to import from both client components and Cloudflare Pages
// Functions (functions/api/message.ts) for overflow validation.

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

  const normalised = normaliseMessage(input, uppercase);
  const wrappedLines = wrapMessage(normalised, columns);
  const visibleLines = wrappedLines.slice(0, rows);
  const overflow = wrappedLines.length > rows;

  const paddedLines = Array.from({ length: rows }, (_, index) => {
    const line = visibleLines[index] ?? "";
    const output = trimTrailingSpaces ? line.trimEnd() : line;
    return output.padEnd(columns, " ").slice(0, columns);
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
