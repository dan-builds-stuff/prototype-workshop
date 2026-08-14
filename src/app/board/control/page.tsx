// src/app/board/control/page.tsx
//
// Compose, preview and publish messages to /board. Protected by
// functions/_middleware.ts (a Cloudflare Pages Function, not Next
// middleware — this is a static export, Next middleware doesn't run) — by
// the time this page reaches the browser, the request already passed the
// shared-password cookie check.

import type { Metadata } from "next";
import Link from "next/link";
import { Eye, ShieldCheck } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { MessageComposer } from "@/components/board/message-composer";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Board control — dan's sandbox",
  description: "Compose and publish a message to the live board.",
};

export default function BoardControlPage() {
  return (
    <article className="container py-20 sm:py-28">
      <Reveal className="flex flex-wrap items-center justify-between gap-4">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-warm/15 px-2.5 py-1 text-xs font-medium text-warm">
          <ShieldCheck className="h-3 w-3" aria-hidden="true" />
          Protected
        </span>

        {/* A real, separate action — not styled like the "back to X"
            navigation links used elsewhere, since it isn't going back to
            anything, it's opening a different live page. */}
        <Link
          href="/board"
          className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
        >
          <Eye className="h-4 w-4" aria-hidden="true" />
          View live board
        </Link>
      </Reveal>

      <Reveal delay={0.06} className="mt-8 space-y-3">
        <h1 className="max-w-2xl text-balance text-4xl font-medium tracking-tight sm:text-5xl">
          Board control
        </h1>
        <p className="max-w-2xl text-balance text-lg leading-relaxed text-muted">
          Rows 1-2 of the board are always live weather. This composes rows 3-8 — up to 6
          lines of 32 characters. Unlike the placeholder forms elsewhere on this site, this
          one is actually wired up: publishing here updates the live board immediately.
        </p>
      </Reveal>

      <Reveal delay={0.12} className="mt-10">
        <MessageComposer />
      </Reveal>
    </article>
  );
}
