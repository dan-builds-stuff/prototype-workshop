// src/components/board/message-preview.tsx
//
// Wraps DisplayGrid in the same framed treatment used on /board, scaled
// down for /board/control. Takes pre-composed lines (weather + content) so
// what you see here is exactly what the board will show.

import { DisplayGrid } from "./display-grid";

type MessagePreviewProps = {
  lines: string[];
  animationKey?: number;
};

export function MessagePreview({ lines, animationKey = 0 }: MessagePreviewProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-4">
      <div className="aspect-video w-full rounded-xl border border-border bg-background p-4">
        <DisplayGrid lines={lines} animationKey={animationKey} />
      </div>
    </div>
  );
}
