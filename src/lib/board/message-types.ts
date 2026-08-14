// src/lib/board/message-types.ts

export type MessageSource = "control-page" | "whatsapp" | "system" | "default";
export type MessageStatus = "active" | "expired" | "cleared" | "rejected";

export interface FormattedGrid {
  columns: number;
  rows: number;
  lines: string[];
  cells: string[][];
  characterCount: number;
  wrappedLineCount: number;
  overflow: boolean;
  remainingSlots: number;
}

export type LineAlign = "left" | "right" | "center";

export interface FormatOptions {
  columns?: number;
  rows?: number;
  uppercase?: boolean;
  trimTrailingSpaces?: boolean;
  /** Alignment applied to every wrapped line. Defaults to "center" — the
   * board centres content by default; only the dad-joke feed (built with
   * its own per-part alignment, see dad-joke.ts) breaks from this. */
  align?: LineAlign;
}

export interface StoredMessage {
  id: string;
  message: string;
  source: MessageSource;
  status: MessageStatus;
  createdAt: string;
  expiresAt?: string;
}

export const DISPLAY_MODES = {
  default: { columns: 32, rows: 8, label: "Default", enabled: true },
  compatibility: { columns: 22, rows: 6, label: "Compatibility (Vestaboard-style)", enabled: false },
  dense: { columns: 40, rows: 10, label: "Dense (future dashboard)", enabled: false },
} as const;

export type DisplayModeKey = keyof typeof DISPLAY_MODES;

// Layout (session 4): weather moved from the top to the bottom two rows,
// with row 6 permanently blank as a spacer above it — a deliberate gap
// between message content and the always-on weather strip, not a bug.
// Row order top-to-bottom: content (rows 1-5), spacer (row 6), weather
// (rows 7-8). Nothing writes into WEATHER_ROWS except
// src/lib/board/weather.ts; nothing writes into the spacer row, ever.
export const GRID_COLUMNS = 32;
export const GRID_ROWS = 8;
export const WEATHER_ROWS = 2;
export const SPACER_ROWS = 1;
export const CONTENT_ROWS = GRID_ROWS - WEATHER_ROWS - SPACER_ROWS;
