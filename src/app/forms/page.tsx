import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { StatusBadge } from "@/components/status-badge";
import { AccessBadge } from "@/components/access-badge";
import { forms } from "@/data/forms";

export const metadata: Metadata = {
  title: "Protected forms — dan's sandbox",
  description: "Forms that may require login, an access code, or an invite once wired up.",
};

export default function FormsPage() {
  return (
    <div className="container py-20 sm:py-28">
      <Reveal>
        <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-accent">
          Controlled access
        </p>
        <h1 className="max-w-2xl text-balance text-4xl font-medium tracking-tight sm:text-5xl">
          Protected forms
        </h1>
        <p className="mt-5 max-w-2xl text-balance text-lg leading-relaxed text-muted">
          Every form here states its purpose, what it collects and who can see
          submissions. For this first version it&rsquo;s UI and routing only — no real
          authentication, no stored data.
        </p>
      </Reveal>

      <div className="mt-12 divide-y divide-border border-y border-border">
        {forms.map((form, index) => (
          <Reveal key={form.slug} delay={index * 0.06}>
            <Link
              href={`/forms/${form.slug}`}
              className="group flex flex-col gap-4 py-8 transition-colors duration-200 ease-calm hover:bg-surface/60 sm:flex-row sm:items-center sm:justify-between sm:gap-8 sm:px-2"
            >
              <div className="max-w-2xl">
                <div className="flex flex-wrap items-center gap-2">
                  <StatusBadge status={form.status} />
                  <AccessBadge access={form.access} />
                </div>
                <h3 className="mt-2 text-xl font-medium tracking-tight text-foreground">
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
  );
}
