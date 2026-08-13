// src/components/site-chrome.tsx
//
// Wraps the header/command-palette/footer chrome that every page gets by
// default. /board is the one exception — it's meant to be a full-bleed TV
// display with zero site chrome, so this checks the pathname and skips
// rendering SiteHeader/CommandPalette/SiteFooter there. Every other route
// is completely unaffected.

"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { SiteHeader } from "./site-header";
import { SiteFooter } from "./site-footer";
import { CommandPalette } from "./command-palette";

export function SiteChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isFullBleedBoard = pathname === "/board";

  if (isFullBleedBoard) {
    return <main id="main">{children}</main>;
  }

  return (
    <>
      <SiteHeader />
      <CommandPalette />
      <main id="main">{children}</main>
      <SiteFooter />
    </>
  );
}
