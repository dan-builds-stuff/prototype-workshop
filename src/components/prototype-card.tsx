import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Prototype } from "@/data/prototypes";
import { StatusBadge } from "@/components/status-badge";
import { AccessBadge } from "@/components/access-badge";

const dateFormatter = new Intl.DateTimeFormat("en-AU", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

const typeLabels: Record<string, string> = {
  demo: "Demo",
  form: "Form",
  tool: "Tool",
  experiment: "Experiment",
  automation: "Automation",
  workflow: "Workflow",
};

export function PrototypeCard({ prototype }: { prototype: Prototype }) {
  return (
    <article className="group flex h-full flex-col rounded-xl border border-border bg-surface p-6 transition-colors duration-200 ease-calm hover:border-accent/30">
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-mono text-xs uppercase tracking-wide text-muted">
          {typeLabels[prototype.type] ?? prototype.type}
        </span>
        <StatusBadge status={prototype.status} />
        <AccessBadge access={prototype.access} />
      </div>

      <h3 className="mt-3 text-lg font-medium leading-snug tracking-tight text-foreground">
        {prototype.name}
      </h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
        {prototype.description}
      </p>

      <div className="mt-5 flex items-center justify-between gap-4">
        <time
          dateTime={prototype.lastUpdated}
          className="font-mono text-xs uppercase tracking-wide text-muted"
        >
          Updated {dateFormatter.format(new Date(prototype.lastUpdated))}
        </time>
        <Link
          href={`/prototypes/${prototype.slug}`}
          className="inline-flex shrink-0 items-center gap-1.5 text-sm font-medium text-foreground opacity-80 transition-all duration-200 ease-calm group-hover:translate-x-1 group-hover:opacity-100"
        >
          Details
          <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}
