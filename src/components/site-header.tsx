"use client";

import Link from "next/link";
import { Search } from "lucide-react";
import { useCommandPalette } from "@/hooks/use-command-palette";

const navLinks = [
  { label: "Prototypes", href: "/prototypes" },
  { label: "Forms", href: "/forms" },
  { label: "Notes", href: "/notes" },
  { label: "Access", href: "/access" },
];

export function SiteHeader() {
  const { setOpen } = useCommandPalette();

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        <Link
          href="/"
          className="font-mono text-sm font-medium tracking-tight text-foreground"
        >
          dan&rsquo;s sandbox
        </Link>

        <nav
          aria-label="Primary"
          className="hidden items-center gap-8 text-sm text-muted md:flex"
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition-colors duration-200 ease-calm hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 rounded-md border border-border bg-surface px-3 py-2 text-xs text-muted transition-colors duration-200 ease-calm hover:border-accent/40 hover:text-foreground"
          aria-label="Open command palette"
        >
          <Search className="h-3.5 w-3.5" aria-hidden="true" />
          <span className="hidden sm:inline">Search</span>
          <kbd className="hidden rounded border border-border bg-elevated px-1.5 py-0.5 font-mono text-[10px] text-muted sm:inline">
            ⌘K
          </kbd>
        </button>
      </div>
    </header>
  );
}
