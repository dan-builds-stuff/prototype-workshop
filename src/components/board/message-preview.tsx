// src/components/board/message-preview.tsx
//
// Wraps DisplayGrid in the same framed treatment used on /board, scaled
// down for /board/control. Takes pre-composed lines (weather + content) so
// what you see here is exactly what the board will show.

import { DisplayGrid } from "./display-grid";
import type { RichChar } from "@/lib/board/message-types";

type MessagePreviewProps = {
  lines?: string[];
  richLines?: RichChar[][];
  animationKey?: number;
};

export function MessagePreview({ lines, richLines, animationKey = 0 }: MessagePreviewProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      <div className="aspect-video w-full rounded-xl border border-border bg-background p-4">
        <DisplayGrid lines={lines} richLines={richLines} animationKey={animationKey} />
      </div>
    </div>
  );
}
