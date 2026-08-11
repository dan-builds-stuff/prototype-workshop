import type { Metadata } from "next";
import { Globe, ShieldCheck, UserCheck, Lock } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";

export const metadata: Metadata = {
  title: "Access information — dan's sandbox",
  description: "What the access levels on this site mean, in plain English.",
};

const accessLevels = [
  {
    icon: Globe,
    label: "Public",
    description:
      "Visible to anyone with the link, no login required. Still a prototype — status badges say how finished it actually is.",
  },
  {
    icon: ShieldCheck,
    label: "Protected",
    description:
      "Intended to require a login or access code once wired up. In this first version, no real authentication exists yet — the page is a UI placeholder.",
  },
  {
    icon: UserCheck,
    label: "Invite only",
    description:
      "Shared with specific people for feedback, not published broadly. Ask me directly if you think you should have access to something marked this way.",
  },
  {
    icon: Lock,
    label: "Private",
    description:
      "Not meant to be shared at all. Listed here only so the structure exists — nothing sensitive lives behind it in this build.",
  },
];

export default function AccessPage() {
  return (
    <div className="container py-20 sm:py-28">
      <Reveal>
        <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-accent">
          Read this first
        </p>
        <h1 className="max-w-2xl text-balance text-4xl font-medium tracking-tight sm:text-5xl">
          Access information
        </h1>
        <p className="mt-5 max-w-2xl text-balance text-lg leading-relaxed text-muted">
          This is a working prototype and forms lab, not a finished product. Some
          things here are public, some are gated, and some are unfinished on purpose.
          Here&rsquo;s what each access level actually means right now.
        </p>
      </Reveal>

      <ul className="mt-12 grid max-w-3xl gap-6 sm:grid-cols-2">
        {accessLevels.map((level, index) => (
          <Reveal as="li" key={level.label} delay={index * 0.06}>
            <div className="h-full rounded-xl border border-border bg-surface p-6">
              <level.icon className="h-5 w-5 text-accent" aria-hidden="true" />
              <h2 className="mt-3 text-lg font-medium tracking-tight text-foreground">
                {level.label}
              </h2>
              <p className="mt-2 leading-relaxed text-muted">{level.description}</p>
            </div>
          </Reveal>
        ))}
      </ul>

      <Reveal delay={0.2} className="mt-12 max-w-3xl rounded-xl border border-warm/30 bg-warm/10 p-6">
        <h2 className="text-lg font-medium tracking-tight text-foreground">
          A few honest ground rules
        </h2>
        <ul className="mt-3 space-y-2 text-sm leading-relaxed text-foreground/90">
          <li>
            No prototype or form on this site should be treated as production ready
            unless its status badge explicitly says live.
          </li>
          <li>
            No protected form collects or stores real data yet — every one currently
            is UI and routing only, clearly labelled as such.
          </li>
          <li>
            This site is intentionally not linked from the main Digital Workshop site
            at this stage — that may change later.
          </li>
        </ul>
      </Reveal>
    </div>
  );
}
