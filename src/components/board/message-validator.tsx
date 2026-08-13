// src/components/board/message-validator.tsx

import type { FormattedGrid } from "@/lib/board/message-types";

export function MessageValidator({ preview }: { preview: FormattedGrid }) {
  return (
    <>
      <div className="grid grid-cols-2 gap-3 text-sm text-muted">
        <div>Characters: {preview.characterCount}</div>
        <div>
          Lines: {preview.wrappedLineCount} / {preview.rows}
        </div>
        <div>Remaining slots: {preview.remainingSlots}</div>
        <div>Status: {preview.overflow ? "Overflow" : "Ready"}</div>
      </div>

      {preview.overflow && (
        <div className="rounded-xl border border-warm/30 bg-warm/10 p-3 text-sm text-warm">
          This message exceeds the {preview.columns} x {preview.rows} content area. Shorten it
          before publishing.
        </div>
      )}
    </>
  );
}
