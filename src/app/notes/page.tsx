import type { Metadata } from "next";
import { Reveal } from "@/components/motion/reveal";
import { experimentNotes } from "@/data/notes";

export const metadata: Metadata = {
  title: "Experiment notes — dan's sandbox",
  description: "Short notes on what's being tested, learnt or improved in this space.",
};

const dateFormatter = new Intl.DateTimeFormat("en-AU", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

export default function NotesPage() {
  return (
    <div className="container py-20 sm:py-28">
      <Reveal>
        <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-accent">
          Field notes
        </p>
        <h1 className="max-w-2xl text-balance text-4xl font-medium tracking-tight sm:text-5xl">
          Experiment notes
        </h1>
        <p className="mt-5 max-w-2xl text-balance text-lg leading-relaxed text-muted">
          Short and honest — what worked, what didn&rsquo;t, what&rsquo;s still parked.
        </p>
      </Reveal>

      <ul className="mt-12 max-w-prose space-y-10">
        {experimentNotes.map((note, index) => (
          <Reveal as="li" key={note.slug} delay={index * 0.06}>
            <article className="border-t border-border pt-8 first:border-t-0 first:pt-0">
              <time
                dateTime={note.date}
                className="font-mono text-xs uppercase tracking-wide text-muted"
              >
                {dateFormatter.format(new Date(note.date))} · {note.readTime}
              </time>
              <h2 className="mt-2 text-xl font-medium tracking-tight text-foreground">
                {note.title}
              </h2>
              <div className="mt-3 space-y-3 leading-relaxed text-foreground/90">
                {note.body.map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
            </article>
          </Reveal>
        ))}
      </ul>
    </div>
  );
}
