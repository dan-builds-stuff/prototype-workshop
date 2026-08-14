// src/components/board/display-grid.tsx
//
// Renders a fixed columns x rows grid of DisplayCells. Feed it either
// `lines` (pre-composed [weatherLine1, weatherLine2, ...contentLines],
// used by /board and /board/control) or `message` (free text, wrapped via
// formatMessageForGrid — kept for simple standalone previews).

"use client";

import { useMemo } from "react";
import { formatMessageForGrid } from "@/lib/board/format-message";
import { toRichLine } from "@/lib/board/rich-text";
import type { RichChar } from "@/lib/board/message-types";
import { DisplayCell } from "./display-cell";

type DisplayGridProps = {
  message?: string;
  lines?: string[];
  /** Per-character coloured rows (colour/emoji posting feature). Takes
   * priority over `lines` when both are given — one row per grid row,
   * already the right length (see toRichLine() for building plain rows to
   * mix in alongside rich ones, e.g. weather/spacer). */
  richLines?: RichChar[][];
  columns?: number;
  rows?: number;
  animationKey?: number;
};

export function DisplayGrid({ message, lines, richLines, columns = 32, rows = 8, animationKey = 0 }: DisplayGridProps) {
  const cells: RichChar[][] = useMemo(() => {
    if (richLines) {
      return Array.from({ length: rows }, (_, i) => {
        const row = richLines[i] ?? [];
        const padded = row.length >= columns ? row.slice(0, columns) : [...row, ...toRichLine("", columns).slice(row.length)];
        return padded;
      });
    }
    if (lines) {
      return Array.from({ length: rows }, (_, i) => toRichLine(lines[i] ?? "", columns));
    }
    const formatted = formatMessageForGrid(message ?? "", { columns, rows, uppercase: true });
    return formatted.cells.map((row) => row.map((char) => ({ char, color: "white" as const })));
  }, [message, lines, richLines, columns, rows]);

  return (
    <div
      className="grid w-full gap-[clamp(3px,.45cqw,9px)] [container-type:inline-size]"
      style={{
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
        gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
      }}
      aria-label={`${columns} by ${rows} message display`}
      role="img"
    >
      {cells.flatMap((row, rowIndex) =>
        row.map((cell, columnIndex) => (
          <DisplayCell
            key={`${rowIndex}-${columnIndex}`}
            char={cell.char}
            color={cell.color}
            columns={columns}
            rowIndex={rowIndex}
            columnIndex={columnIndex}
            animationKey={animationKey}
          />
        ))
      )}
    </div>
  );
}
