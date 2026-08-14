// src/components/board/display-grid.tsx
//
// Renders a fixed columns x rows grid of DisplayCells. Feed it either
// `lines` (pre-composed [weatherLine1, weatherLine2, ...contentLines],
// used by /board and /board/control) or `message` (free text, wrapped via
// formatMessageForGrid — kept for simple standalone previews).

"use client";

import { useMemo } from "react";
import { formatMessageForGrid } from "@/lib/board/format-message";
import { DisplayCell } from "./display-cell";

type DisplayGridProps = {
  message?: string;
  lines?: string[];
  columns?: number;
  rows?: number;
  animationKey?: number;
};

export function DisplayGrid({ message, lines, columns = 32, rows = 8, animationKey = 0 }: DisplayGridProps) {
  const grid = useMemo(() => {
    if (lines) {
      const padded = Array.from({ length: rows }, (_, i) => (lines[i] ?? "").padEnd(columns, " ").slice(0, columns));
      return { cells: padded.map((line) => line.split("")) };
    }
    return formatMessageForGrid(message ?? "", { columns, rows, uppercase: true });
  }, [message, lines, columns, rows]);

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
      {grid.cells.flatMap((row, rowIndex) =>
        row.map((char, columnIndex) => (
          <DisplayCell
            key={`${rowIndex}-${columnIndex}`}
            char={char}
            rowIndex={rowIndex}
            columnIndex={columnIndex}
            animationKey={animationKey}
          />
        ))
      )}
    </div>
  );
}
