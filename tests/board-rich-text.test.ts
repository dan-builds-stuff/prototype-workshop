// tests/board-rich-text.test.ts
// Vitest tests for the colour/emoji rich-text pipeline.

import { describe, expect, it } from "vitest";
import { formatRichMessageForGrid, parseRichText, segmentGraphemes, stripRichMarkup } from "../src/lib/board/rich-text";

describe("parseRichText", () => {
  it("colours tagged text and leaves the rest white", () => {
    const { richChars } = parseRichText("HI [amber]LATE[/amber] BYE", false);
    const plain = richChars.map((c) => c.char).join("");
    expect(plain).toBe("HI LATE BYE");
    const lateChars = richChars.slice(3, 7);
    expect(lateChars.map((c) => c.char).join("")).toBe("LATE");
    expect(lateChars.every((c) => c.color === "amber")).toBe(true);
    expect(richChars[0]?.color).toBe("white");
  });

  it("supports nested/aliased tags (warm == amber, accent == blue)", () => {
    const { richChars } = parseRichText("[warm]A[/warm][accent]B[/accent]", false);
    expect(richChars.map((c) => c.color)).toEqual(["amber", "blue"]);
  });

  it("keeps an unrecognised tag as literal text rather than eating it", () => {
    const { richChars } = parseRichText("[glitter]HI[/glitter]", false);
    expect(richChars.map((c) => c.char).join("")).toBe("[glitter]HI[/glitter]");
  });

  it("uppercases outside of tag names", () => {
    const { richChars } = parseRichText("[amber]hi[/amber]", true);
    expect(richChars.map((c) => c.char).join("")).toBe("HI");
    expect(richChars.every((c) => c.color === "amber")).toBe(true);
  });
});

describe("segmentGraphemes", () => {
  it("keeps a compound emoji as one grapheme", () => {
    const segments = segmentGraphemes("A👍B");
    expect(segments).toEqual(["A", "👍", "B"]);
  });
});

describe("stripRichMarkup", () => {
  it("removes recognised colour tags only", () => {
    expect(stripRichMarkup("[amber]LATE[/amber] and [glitter]X[/glitter]")).toBe("LATE and [glitter]X[/glitter]");
  });
});

describe("formatRichMessageForGrid", () => {
  it("produces columns x rows richCells matching lines", () => {
    // Session 6: a single-line message bottom-packs onto the last row of
    // the block, not the first.
    const result = formatRichMessageForGrid("[green]ALL CLEAR[/green]", { rows: 5 });
    expect(result.rows).toBe(5);
    expect(result.richCells?.length).toBe(5);
    result.richCells?.forEach((row) => expect(row.length).toBe(32));
    expect(result.lines[result.lines.length - 1]).toContain("ALL CLEAR");
  });

  it("does not overflow for a message that fits", () => {
    const result = formatRichMessageForGrid("SHORT MESSAGE", { rows: 5 });
    expect(result.overflow).toBe(false);
  });

  it("flags overflow the same way as plain formatMessageForGrid for long input", () => {
    const input = Array.from({ length: 12 }, (_, i) => `LINE ${i + 1}`).join("\n");
    const result = formatRichMessageForGrid(input, { rows: 5 });
    expect(result.overflow).toBe(true);
  });

  it("does not lose any words when wrapping coloured text", () => {
    const result = formatRichMessageForGrid("[blue]ONE TWO THREE FOUR FIVE SIX SEVEN EIGHT[/blue]", {
      columns: 12,
      rows: 8,
    });
    const joined = result.lines.map((l) => l.trim()).filter(Boolean).join(" ");
    expect(joined).toBe("ONE TWO THREE FOUR FIVE SIX SEVEN EIGHT");
  });
});
