// tests/board-format-message.test.ts
// Vitest tests for the board's core formatting contract.

import { describe, expect, it } from "vitest";
import { formatMessageForGrid, normaliseMessage, padLine, wrapMessage } from "../src/lib/board/format-message";
import { formatWeatherLines, weatherLabel } from "../src/lib/board/weather";

describe("formatMessageForGrid", () => {
  it("fits a short message without overflow", () => {
    const result = formatMessageForGrid("HELLO BOARD");
    expect(result.overflow).toBe(false);
    expect(result.columns).toBe(32);
    expect(result.rows).toBe(8);
  });

  it("produces exactly columns x rows cells", () => {
    const result = formatMessageForGrid("HELLO BOARD");
    expect(result.cells.length).toBe(8);
    result.cells.forEach((row) => expect(row.length).toBe(32));
  });

  it("preserves blank lines", () => {
    const result = formatMessageForGrid("HELLO\n\nWORLD");
    expect((result.lines[0] ?? "").trim()).toBe("HELLO");
    expect((result.lines[1] ?? "").trim()).toBe("");
    expect((result.lines[2] ?? "").trim()).toBe("WORLD");
    expect(result.overflow).toBe(false);
  });

  it("splits a word longer than the column width", () => {
    const result = formatMessageForGrid("SUPERCALIFRAGILISTICEXPIALIDOCIOUS");
    expect(result.overflow).toBe(false);
    expect(result.wrappedLineCount).toBeGreaterThan(1);
  });

  it("flags overflow when wrapped content exceeds the row count", () => {
    const input = Array.from({ length: 12 }, (_, i) => `LINE ${i + 1}`).join("\n");
    const result = formatMessageForGrid(input);
    expect(result.overflow).toBe(true);
  });

  it("respects the 6-row content area used by the board (rows 1-2 are weather)", () => {
    const result = formatMessageForGrid("HELLO", { rows: 6 });
    expect(result.rows).toBe(6);
    expect(result.cells.length).toBe(6);
  });

  it("uppercases by default", () => {
    const result = formatMessageForGrid("hello board");
    expect((result.lines[0] ?? "").trim()).toBe("HELLO BOARD");
  });
});

describe("normaliseMessage", () => {
  it("converts curly quotes to straight quotes", () => {
    expect(normaliseMessage("“HELLO” ‘WORLD’")).toBe('"HELLO" \'WORLD\'');
  });

  it("trims and uppercases", () => {
    expect(normaliseMessage("  hello  ")).toBe("HELLO");
  });
});

describe("wrapMessage", () => {
  it("does not lose any words when wrapping", () => {
    const input = "ONE TWO THREE FOUR FIVE SIX SEVEN EIGHT";
    const lines = wrapMessage(input, 12);
    expect(lines.join(" ")).toBe(input);
  });
});

describe("padLine", () => {
  it("left-aligns and pads to width", () => {
    expect(padLine("HI", 5, "left")).toBe("HI   ");
  });

  it("centers with extra space on the right for odd remainders", () => {
    expect(padLine("HI", 5, "center")).toBe(" HI  ");
  });

  it("truncates content longer than the column width", () => {
    expect(padLine("ABCDEFGH", 5)).toHaveLength(5);
  });
});

describe("weatherLabel", () => {
  it("maps known Open-Meteo codes", () => {
    expect(weatherLabel(0)).toBe("CLEAR");
    expect(weatherLabel(61)).toBe("RAIN");
    expect(weatherLabel(96)).toBe("STORMS");
  });

  it("falls back to CHANGEABLE for unmapped codes", () => {
    expect(weatherLabel(90)).toBe("CHANGEABLE");
  });
});

describe("formatWeatherLines", () => {
  it("produces exactly two 32-char lines with the right content", () => {
    const [line1, line2] = formatWeatherLines(
      { temperature: 18, apparent: 17, wind: 12, code: 0, max: 22, min: 10 },
      { name: "MELBOURNE", latitude: 0, longitude: 0, timezone: "UTC" },
      32
    );
    expect(line1).toHaveLength(32);
    expect(line2).toHaveLength(32);
    expect(line1).toContain("MELBOURNE");
    expect(line2).toContain("LOW 10");
  });
});
