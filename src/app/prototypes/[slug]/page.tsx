import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Lock } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { StatusBadge } from "@/components/status-badge";
import { AccessBadge } from "@/components/access-badge";
import { ProtectedNotice } from "@/components/protected-notice";
import { prototypes } from "@/data/prototypes";

export function generateStaticParams() {
  return prototypes.map((prototype) => ({ slug: prototype.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const prototype = prototypes.find((item) => item.slug === slug);
  if (!prototype) return {};
  return {
    title: `${prototype.name} — dan's sandbox`,
    description: prototype.description,
  };
}

const dateFormatter = new Intl.DateTimeFormat("en-AU", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

const fields: { key: "context" | "whatItTests" | "notes"; label: string }[] = [
  { key: "context", label: "Context" },
  { key: "whatItTests", label: "What it tests" },
  { key: "notes", label: "Notes" },
];

export default async function PrototypeDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const prototype = prototypes.find((item) => item.slug === slug);
  if (!prototype) notFound();

  return (
    <article className="container py-20 sm:py-28">
      <Reveal>
        <Link
          href="/prototypes"
          className="inline-flex items-center gap-2 text-sm text-muted transition-colors duration-200 ease-calm hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to prototypes
        </Link>

        <div className="mt-8 flex flex-wrap items-center gap-2">
          <StatusBadge status={prototype.status} />
          <AccessBadge access={prototype.access} />
          <time
            dateTime={prototype.lastUpdated}
            className="font-mono text-xs uppercase tracking-wide text-muted"
          >
            Updated {dateFormatter.format(new Date(prototype.lastUpdated))}
          </time>
        </div>

        <h1 className="mt-4 max-w-3xl text-balance text-4xl font-medium tracking-tight sm:text-5xl">
          {prototype.name}
        </h1>
        <p className="mt-5 max-w-2xl text-balance text-lg leading-relaxed text-muted">
          {prototype.description}
        </p>
      </Reveal>

      {prototype.access !== "public" && (
        <Reveal delay={0.05} className="mt-8 max-w-2xl">
          <ProtectedNotice
            access={prototype.access}
            wired={!prototype.primaryAction.disabled}
          />
        </Reveal>
      )}

      <div className="mt-16 max-w-prose space-y-12 border-t border-border pt-12">
        {fields.map((field, index) => (
          <Reveal key={field.key} delay={index * 0.05}>
            <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
              {field.label}
            </h2>
            <p className="mt-3 leading-relaxed text-foreground/90">
              {prototype[field.key]}
            </p>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.2} className="mt-12 max-w-prose">
        {prototype.primaryAction.disabled ? (
          <span className="inline-flex h-11 cursor-not-allowed items-center justify-center rounded-md bg-foreground/40 px-5 text-sm font-medium text-background/80">
            {prototype.primaryAction.label} — not wired up yet
          </span>
        ) : (
          <Link
            href={prototype.primaryAction.href}
            className="inline-flex h-11 items-center gap-2 justify-center rounded-md bg-foreground px-5 text-sm font-medium text-background transition-colors duration-200 ease-calm hover:bg-foreground/90"
          >
            {prototype.access !== "public" && (
              <Lock className="h-3.5 w-3.5" aria-hidden="true" />
            )}
            {prototype.primaryAction.label}
          </Link>
        )}
      </Reveal>
    </article>
  );
}
