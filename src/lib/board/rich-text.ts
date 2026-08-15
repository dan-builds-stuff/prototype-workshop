// src/lib/board/rich-text.ts
//
// Colour + emoji support for posted messages. Typed markup rather than a
// rich-text editor — keyboard-only, works in a plain <textarea>:
//
//   [amber]LATE[/amber] departures today
//   [blue]weather[/blue] holding steady [green]all clear[/green]
//
// Recognised tag names: amber (or warm), blue (or accent), green (or
// success), white — matching the site's existing colour tokens 1:1 (see
// tailwind.config.ts) so posted messages never introduce a colour outside
// the site's own palette. Unrecognised tags (typos, anything else in
// brackets) are left as literal text rather than silently eaten — a
// mistyped tag should look like a mistake, not vanish.
//
// Emoji/symbols render at single-cell width (Dan's call) — this module
// still segments by grapheme (Intl.Segmenter) rather than JS string index
// so a compound emoji (ZWJ sequences, flags, skin-tone modifiers) is
// treated as one character for colouring purposes, not split apart. Known
// limitation, flagged rather than hidden: the *wrapping width* math for
// the plain (non-rich) path still counts in UTF-16 code units, so a
// multi-unit emoji can make wrapMessage() wrap a line slightly earlier
// than strictly necessary. Safe direction (under-fills a line rather than
// overflowing the grid) — this module's own richWrap() below does not
// have that problem since it walks graphemes directly.

import type { BoardColor, FormatOptions, FormattedGrid, RichChar } from "./message-types";

const DEFAULT_COLUMNS = 32;
const DEFAULT_ROWS = 8;

const COLOR_TAGS: Record<string, BoardColor> = {
  amber: "amber",
  warm: "amber",
  blue: "blue",
  accent: "blue",
  green: "green",
  success: "green",
  white: "white",
};

const TAG_RE = /\[(\/?)(\w+)\]/g;

export function segmentGraphemes(text: string): string[] {
  if (typeof Intl !== "undefined" && "Segmenter" in Intl) {
    const segmenter = new Intl.Segmenter(undefined, { granularity: "grapheme" });
    return Array.from(segmenter.segment(text), (s) => s.segment);
  }
  // Fallback for environments without Intl.Segmenter (very old browsers,
  // some server runtimes) — still better than raw .split("") since it at
  // least keeps surrogate pairs together.
  return Array.from(text);
}

/** Strip all recognised colour tags, leaving plain readable text — used
 * anywhere a caller needs a plain-text version of a rich message (e.g. a
 * character-count display that shouldn't count markup as content). */
export function stripRichMarkup(input: string): string {
  return input.replace(TAG_RE, (full, _closing, name) => (COLOR_TAGS[name.toLowerCase()] ? "" : full));
}

/** Parses markup into a flat, grapheme-level array of coloured characters.
 * Cleanup (whitespace normalisation, curly-quote replacement, uppercasing)
 * happens on the raw string first, before tag parsing — same as
 * normaliseMessage() in format-message.ts, so rich and plain messages
 * behave identically outside of colour. */
export function parseRichText(input: string, uppercase = true): { richChars: RichChar[] } {
  let working = input
    .replace(/\r\n/g, "\n")
    .replace(/\t/g, " ")
    .replace(/[""]/g, '"')
    .replace(/['']/g, "'")
    .trim();
  if (uppercase) working = working.toUpperCase();

  const richChars: RichChar[] = [];
  const colorStack: BoardColor[] = ["white"];

  const pushText = (text: string) => {
    const color = colorStack[colorStack.length - 1] ?? "white";
    for (const grapheme of segmentGraphemes(text)) {
      richChars.push({ char: grapheme, color });
    }
  };

  let lastIndex = 0;
  TAG_RE.lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = TAG_RE.exec(working))) {
    const [full, closing, nameRaw] = match;
    pushText(working.slice(lastIndex, match.index));

    const name = (nameRaw ?? "").toLowerCase();
    const resolved = COLOR_TAGS[name];
    if (resolved) {
      if (closing) {
        if (colorStack.length > 1) colorStack.pop();
      } else {
        colorStack.push(resolved);
      }
    } else {
      // Unrecognised tag — keep it as literal text so a typo is visible
      // rather than silently disappearing.
      pushText(full);
    }
    lastIndex = match.index + full.length;
  }
  pushText(working.slice(lastIndex));

  return { richChars };
}

// Word-wrap over RichChar[] instead of a JS string — mirrors
// wrapMessage()'s algorithm (paragraph split on \n, greedy word packing,
// hard-break words longer than one line) exactly, but counts graphemes
// rather than UTF-16 code units so multi-unit emoji wrap correctly.
function richWrap(chars: RichChar[], columns: number): RichChar[][] {
  const paragraphs: RichChar[][] = [];
  let currentParagraph: RichChar[] = [];
  for (const c of chars) {
    if (c.char === "\n") {
      paragraphs.push(currentParagraph);
      currentParagraph = [];
    } else {
      currentParagraph.push(c);
    }
  }
  paragraphs.push(currentParagraph);

  const output: RichChar[][] = [];
  const isSpace = (c: RichChar) => /\s/.test(c.char);

  for (const paragraph of paragraphs) {
    if (paragraph.length === 0 || paragraph.every(isSpace)) {
      output.push([]);
      continue;
    }

    const words: RichChar[][] = [];
    let word: RichChar[] = [];
    for (const c of paragraph) {
      if (isSpace(c)) {
        if (word.length > 0) {
          words.push(word);
          word = [];
        }
      } else {
        word.push(c);
      }
    }
    if (word.length > 0) words.push(word);

    let currentLine: RichChar[] = [];
    for (const w of words) {
      if (w.length > columns) {
        if (currentLine.length > 0) {
          output.push(currentLine);
          currentLine = [];
        }
        for (let i = 0; i < w.length; i += columns) {
          output.push(w.slice(i, i + columns));
        }
        continue;
      }

      const candidateLength = currentLine.length === 0 ? w.length : currentLine.length + 1 + w.length;
      if (candidateLength <= columns) {
        if (currentLine.length > 0) currentLine.push({ char: " ", color: "white" });
        currentLine.push(...w);
      } else {
        output.push(currentLine);
        currentLine = [...w];
      }
    }
    if (currentLine.length > 0) output.push(currentLine);
  }

  return output;
}

function alignRichLine(line: RichChar[], columns: number, align: "left" | "right" | "center"): RichChar[] {
  const clipped = line.slice(0, columns);
  const pad = (n: number): RichChar[] => Array.from({ length: Math.max(0, n) }, () => ({ char: " ", color: "white" as BoardColor }));

  if (align === "left") return [...clipped, ...pad(columns - clipped.length)];
  if (align === "right") return [...pad(columns - clipped.length), ...clipped];

  const left = Math.floor((columns - clipped.length) / 2);
  const right = columns - clipped.length - left;
  return [...pad(left), ...clipped, ...pad(right)];
}

export function formatRichMessageForGrid(input: string, options: FormatOptions = {}): FormattedGrid {
  const columns = options.columns ?? DEFAULT_COLUMNS;
  const rows = options.rows ?? DEFAULT_ROWS;
  const uppercase = options.uppercase ?? true;
  const trimTrailingSpaces = options.trimTrailingSpaces ?? true;
  const align = options.align ?? "center";

  const { richChars } = parseRichText(input, uppercase);
  const wrapped = richWrap(richChars, columns);
  const visibleWrapped = wrapped.slice(0, rows);
  const overflow = wrapped.length > rows;

  // Bottom-pack, matching formatMessageForGrid() (session 6): blank rows
  // go at the top, content ends on the last row. Row 1 only fills when
  // the full row block is needed.
  const topOffset = rows - visibleWrapped.length;
  const paddedRows: RichChar[][] = Array.from({ length: rows }, (_, index) => {
    const sourceIndex = index - topOffset;
    const line = sourceIndex >= 0 ? (visibleWrapped[sourceIndex] ?? []) : [];
    let end = line.length;
    if (trimTrailingSpaces) {
      while (end > 0 && line[end - 1]?.char === " ") end--;
    }
    return alignRichLine(line.slice(0, end), columns, align);
  });

  const lines = paddedRows.map((row) => row.map((c) => c.char).join(""));
  const cells = paddedRows.map((row) => row.map((c) => c.char));
  const characterCount = richChars.filter((c) => c.char !== "\n").length;
  const remainingSlots = Math.max(0, columns * rows - lines.join("").trimEnd().length);

  return {
    columns,
    rows,
    lines,
    cells,
    characterCount,
    wrappedLineCount: wrapped.length,
    overflow,
    remainingSlots,
    richCells: paddedRows,
  };
}

/** Convert plain lines (e.g. weather, spacer rows) into "white" RichChar
 * rows, so callers that mix rich content rows with non-rich rows can build
 * one uniform richCells[][] to hand to DisplayGrid. */
export function toRichLine(line: string, columns: number): RichChar[] {
  const chars = segmentGraphemes(line.padEnd(columns, " ").slice(0, columns));
  return chars.map((char) => ({ char, color: "white" as BoardColor }));
}
