// src/components/board/frame-shell.tsx
//
// Full-bleed housing for /board. No forced 16:9 outer box — the panel
// hugs the grid's natural size (a 32x8 grid of 0.73-aspect cells is
// ~2.9:1, wider than a 16:9 screen) and is centred on the full-bleed
// stage, so leftover space reads as a deliberate margin around a
// physical object rather than dead space inside its own bezel.

import type { ReactNode } from "react";

export function FrameShell({ children }: { children: ReactNode }) {
  return (
    <main className="flex min-h-screen w-screen items-center justify-center overflow-hidden bg-background p-[1.5vh]">
      <div className="w-[94vw] max-w-[2400px] rounded-[1.4rem] border border-border bg-surface p-[clamp(.75rem,1.6vw,2rem)] shadow-[0_40px_100px_rgba(0,0,0,.6)]">
        {children}
      </div>
    </main>
  );
}
