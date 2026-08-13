// src/components/board/display-cell.tsx
//
// A single character slot in the 32x8 grid. Cell aspect is 0.73 (taller
// than wide, matching a real split-flap unit) rather than square — a 32x8
// grid of square cells works out to a 4:1 rectangle, filling only ~44% of
// a 16:9 screen vertically; at 0.73 it's ~2.9:1, filling ~61%.

"use client";

import { motion, AnimatePresence } from "framer-motion";

type DisplayCellProps = {
  char: string;
  rowIndex: number;
  columnIndex: number;
  animationKey: number;
};

export function DisplayCell({ char, rowIndex, columnIndex, animationKey }: DisplayCellProps) {
  const display = char === " " ? " " : char;

  return (
    <div className="relative aspect-[0.73] min-w-0 overflow-hidden rounded-[4px] border border-border bg-elevated shadow-[inset_0_1px_1px_rgba(255,255,255,.06),0_1px_2px_rgba(0,0,0,.4)]">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.div
          key={`${char}-${animationKey}`}
          initial={{ rotateX: -85, opacity: 0.3 }}
          animate={{ rotateX: 0, opacity: 1 }}
          exit={{ rotateX: 85, opacity: 0 }}
          transition={{
            delay: Math.min((rowIndex * 32 + columnIndex) * 0.003, 0.4),
            duration: 0.16,
            ease: "easeOut",
          }}
          className="absolute inset-0 flex items-center justify-center text-[clamp(.7rem,2.4vw,3.6rem)] font-semibold leading-none text-foreground"
          style={{ transformOrigin: "center" }}
        >
          <span className="translate-y-[1px] font-mono">{display}</span>
        </motion.div>
      </AnimatePresence>
      <div className="pointer-events-none absolute left-0 right-0 top-1/2 h-px bg-black/70" />
    </div>
  );
}
