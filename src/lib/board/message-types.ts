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
  /** Present only when built via formatRichMessageForGrid() — same content
   * as `lines`/`cells` but with per-character colour attached, for the
   * colour/emoji posting feature. Plain formatMessageForGrid() output
   * leaves this undefined; renderers fall back to `lines` in that case. */
  richCells?: RichChar[][];
}

// Restricted to the site's existing palette (see tailwind.config.ts) rather
// than free-form hex codes — a deliberate constraint so coloured messages
// stay readable against the board's calm, physical-object aesthetic instead
// of turning into a colour free-for-all. "white" is the default/no-markup
// colour.
export type BoardColor = "white" | "amber" | "blue" | "green";

// One grapheme (not necessarily one UTF-16 code unit — covers compound
// emoji, flags, skin-tone modifiers, etc. via Intl.Segmenter) plus the
// colour it should render in. Emoji/symbols are single-cell width by
// design (Dan's call) — no double-wide glyph support.
export interface RichChar {
  char: string;
  color: BoardColor;
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
