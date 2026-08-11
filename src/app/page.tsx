import Link from "next/link";
import { ArrowUpRight, ShieldQuestion } from "lucide-react";
import { HeroIntro } from "@/components/hero-intro";
import { StatusPanel } from "@/components/status-panel";
import { PrototypeCard } from "@/components/prototype-card";
import { AccessBadge } from "@/components/access-badge";
import { StatusBadge } from "@/components/status-badge";
import { Reveal } from "@/components/motion/reveal";
import { prototypes } from "@/data/prototypes";
import { forms } from "@/data/forms";
import { experimentNotes } from "@/data/notes";

export default function Home() {
  return (
    <>
      <HeroIntro />
      <StatusPanel />

      <section
        id="prototypes"
        aria-labelledby="prototypes-heading"
        className="border-b border-border/60 py-24 sm:py-32"
      >
        <div className="container">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-accent">
                  In the workshop
                </p>
                <h2
                  id="prototypes-heading"
                  className="max-w-2xl text-balance text-3xl font-medium tracking-tight sm:text-4xl"
                >
                  Featured prototypes
                </h2>
              </div>
              <Link
                href="/prototypes"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground opacity-80 transition-opacity duration-200 ease-calm hover:opacity-100"
              >
                View all prototypes
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </Reveal>

          <ul className="mt-10 grid gap-6 sm:grid-cols-2">
            {prototypes.map((prototype, index) => (
              <Reveal as="li" key={prototype.slug} delay={index * 0.06}>
                <PrototypeCard prototype={prototype} />
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section
        id="forms"
        aria-labelledby="forms-heading"
        className="border-b border-border/60 bg-surface/40 py-24 sm:py-32"
      >
        <div className="container">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-accent">
                  Controlled access
                </p>
                <h2
                  id="forms-heading"
                  className="max-w-2xl text-balance text-3xl font-medium tracking-tight sm:text-4xl"
                >
                  Protected forms
                </h2>
                <p className="mt-4 max-w-xl text-balance leading-relaxed text-muted">
                  Forms that may require login, an access code, or an invite once
                  they&rsquo;re actually wired up. For now, UI and routing only.
                </p>
              </div>
              <Link
                href="/forms"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground opacity-80 transition-opacity duration-200 ease-calm hover:opacity-100"
              >
                View all forms
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </Reveal>

          <div className="mt-10 divide-y divide-border border-y border-border">
            {forms.map((form, index) => (
              <Reveal key={form.slug} delay={index * 0.06}>
                <Link
                  href={`/forms/${form.slug}`}
                  className="group flex flex-col gap-4 py-6 transition-colors duration-200 ease-calm hover:bg-surface/60 sm:flex-row sm:items-center sm:justify-between sm:gap-8 sm:px-2"
                >
                  <div className="max-w-xl">
                    <div className="flex flex-wrap items-center gap-2">
                      <StatusBadge status={form.status} />
                      <AccessBadge access={form.access} />
                    </div>
                    <h3 className="mt-2 text-lg font-medium tracking-tight text-foreground">
                      {form.name}
                    </h3>
                    <p className="mt-2 leading-relaxed text-muted">{form.description}</p>
                  </div>
                  <span className="flex shrink-0 items-center gap-2 text-sm font-medium text-foreground opacity-80 transition-all duration-200 ease-calm group-hover:translate-x-1 group-hover:opacity-100">
                    Open form
                    <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section
        id="notes"
        aria-labelledby="notes-heading"
        className="border-b border-border/60 py-24 sm:py-32"
      >
        <div className="container">
          <Reveal>
            <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-accent">
              Field notes
            </p>
            <h2
              id="notes-heading"
              className="max-w-2xl text-balance text-3xl font-medium tracking-tight sm:text-4xl"
            >
              Experiment notes
            </h2>
            <p className="mt-4 max-w-xl text-balance leading-relaxed text-muted">
              Short notes on what&rsquo;s being tested, learnt or improved in this space.
            </p>
          </Reveal>

          <ul className="mt-10 space-y-8">
            {experimentNotes.map((note, index) => (
              <Reveal as="li" key={note.slug} delay={index * 0.06}>
                <article className="rounded-xl border border-border bg-surface p-6">
                  <time
                    dateTime={note.date}
                    className="font-mono text-xs uppercase tracking-wide text-muted"
                  >
                    {new Intl.DateTimeFormat("en-AU", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    }).format(new Date(note.date))}{" "}
                    · {note.readTime}
                  </time>
                  <h3 className="mt-2 text-lg font-medium tracking-tight text-foreground">
                    {note.title}
                  </h3>
                  <div className="mt-3 space-y-3 text-sm leading-relaxed text-foreground/90">
                    {note.body.map((paragraph, i) => (
                      <p key={i}>{paragraph}</p>
                    ))}
                  </div>
                </article>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section
        id="access"
        aria-labelledby="access-heading"
        className="py-24 sm:py-32"
      >
        <div className="container">
          <Reveal>
            <div className="flex flex-col gap-6 rounded-xl border border-warm/30 bg-warm/10 p-8 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-4">
                <ShieldQuestion
                  className="mt-1 h-6 w-6 shrink-0 text-warm"
                  aria-hidden="true"
                />
                <div>
                  <h2 id="access-heading" className="text-xl font-medium tracking-tight text-foreground">
                    Some of this is private, unfinished or invite only
                  </h2>
                  <p className="mt-2 max-w-xl leading-relaxed text-muted">
                    Status and access badges on every prototype and form say exactly
                    what&rsquo;s real right now. Nothing here should be treated as
                    production ready unless it explicitly says so.
                  </p>
                </div>
              </div>
              <Link
                href="/access"
                className="inline-flex h-11 shrink-0 items-center justify-center rounded-md border border-border bg-elevated px-5 text-sm font-medium text-foreground transition-colors duration-200 ease-calm hover:border-accent/40"
              >
                Read access information
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
