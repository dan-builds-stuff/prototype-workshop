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

export interface FormatOptions {
  columns?: number;
  rows?: number;
  uppercase?: boolean;
  trimTrailingSpaces?: boolean;
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

// Rows 1-2 of the 32x8 grid are permanently reserved for weather. The
// remaining 6 rows are free for messages + date. Nothing writes into
// WEATHER_ROWS except src/lib/board/weather.ts.
export const GRID_COLUMNS = 32;
export const GRID_ROWS = 8;
export const WEATHER_ROWS = 2;
export const CONTENT_ROWS = GRID_ROWS - WEATHER_ROWS;
