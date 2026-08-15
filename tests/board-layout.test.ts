// tests/board-layout.test.ts
// Session 6: content bottom-packs within the row block instead of
// top-packing — rows 2-5 are the normal content area, row 1 is overflow
// spillover only. Covers plain messages, rich (colour) messages, and the
// dad-joke feed, since all three share this rule.

import { describe, expect, it } from "vitest";
import { formatMessageForGrid } from "../src/lib/board/format-message";
import { formatRichMessageForGrid } from "../src/lib/board/rich-text";
import { formatDadJokeLines } from "../src/lib/board/dad-joke";

describe("formatMessageForGrid bottom-packing", () => {
  it("puts a single line on the last row, leaving earlier rows blank", () => {
    const result = formatMessageForGrid("HELLO", { rows: 5 });
    expect(result.lines.slice(0, 4).every((l) => l.trim() === "")).toBe(true);
    expect(result.lines[4]).toContain("HELLO");
  });

  it("fills rows 2-5 for a 4-line message, leaving row 1 blank", () => {
    const result = formatMessageForGrid("ONE\nTWO\nTHREE\nFOUR", { rows: 5 });
    expect(result.lines[0]?.trim()).toBe("");
    expect(result.lines[1]).toContain("ONE");
    expect(result.lines[4]).toContain("FOUR");
  });

  it("spills into row 1 for a 5-line message that fits exactly", () => {
    const result = formatMessageForGrid("A\nB\nC\nD\nE", { rows: 5 });
    expect(result.lines[0]).toContain("A");
    expect(result.lines[4]).toContain("E");
    expect(result.overflow).toBe(false);
  });

  it("still flags overflow for a 6-line message", () => {
    const result = formatMessageForGrid("A\nB\nC\nD\nE\nF", { rows: 5 });
    expect(result.overflow).toBe(true);
  });
});

describe("formatRichMessageForGrid bottom-packing", () => {
  it("bottom-packs coloured content the same way as plain text", () => {
    const result = formatRichMessageForGrid("[amber]LATE[/amber]", { rows: 5 });
    result.richCells?.slice(0, 4).forEach((row) => {
      expect(row.every((c) => c.char === " ")).toBe(true);
    });
    expect(result.richCells?.[4]?.some((c) => c.char !== " " && c.color === "amber")).toBe(true);
  });
});

describe("formatDadJokeLines", () => {
  it("appends a laughing emoji after the punchline", () => {
    const lines = formatDadJokeLines(
      "Why did the chicken cross the road? To get to the other side.",
      32,
      5
    );
    expect(lines.some((l) => l.includes("😂"))).toBe(true);
  });

  it("appends the laughing emoji to a single-block joke with no question mark", () => {
    const lines = formatDadJokeLines("Cache invalidation is hard.", 32, 5);
    expect(lines.some((l) => l.includes("😂"))).toBe(true);
  });

  it("bottom-packs a short joke, leaving row 1 blank", () => {
    const lines = formatDadJokeLines("Short one. Ha.", 32, 5);
    expect(lines[0]?.trim()).toBe("");
  });
});
