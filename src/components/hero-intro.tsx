import Link from "next/link";
import { ArrowDown } from "lucide-react";

export function HeroIntro() {
  return (
    <section
      id="top"
      aria-label="Introduction"
      className="relative flex min-h-[70vh] flex-col justify-center overflow-hidden border-b border-border/60"
    >
      <div
        className="bg-workshop-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_top,black,transparent_75%)]"
        aria-hidden="true"
      />

      <div className="container relative py-20">
        <p className="mb-6 font-mono text-xs uppercase tracking-[0.2em] text-accent">
          Prototype lab
        </p>

        <h1 className="text-balance max-w-4xl text-4xl font-medium leading-[1.08] tracking-tight sm:text-6xl">
          dan&rsquo;s sandbox
        </h1>

        <p className="mt-8 max-w-2xl text-balance text-lg leading-relaxed text-muted sm:text-xl">
          A working space for prototypes, protected webforms and experiments connected
          to what I&rsquo;m building and learning.
        </p>

        <p className="mt-4 max-w-2xl text-balance text-base leading-relaxed text-muted/80">
          Built from the same digital workshop system, this space is where rough ideas,
          practical tests and interactive tools can be tried safely before they become
          polished projects. Some of it works. Some of it is deliberately unfinished.
        </p>

        <div className="mt-12 flex flex-wrap items-center gap-4">
          <Link
            href="/prototypes"
            className="inline-flex h-11 items-center justify-center rounded-md bg-foreground px-5 text-sm font-medium text-background transition-colors duration-200 ease-calm hover:bg-foreground/90"
          >
            Browse prototypes
          </Link>
          <Link
            href="/access"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-border px-5 text-sm font-medium text-foreground transition-colors duration-200 ease-calm hover:border-accent/40"
          >
            How access works
            <ArrowDown className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
