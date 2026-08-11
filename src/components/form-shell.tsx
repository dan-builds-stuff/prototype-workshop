"use client";

import { FileWarning } from "lucide-react";
import type { ProtectedForm } from "@/data/forms";
import { AccessBadge } from "@/components/access-badge";
import { StatusBadge } from "@/components/status-badge";

export function FormShell({ form }: { form: ProtectedForm }) {
  return (
    <div className="max-w-2xl">
      <div className="flex flex-wrap items-center gap-2">
        <StatusBadge status={form.status} />
        <AccessBadge access={form.access} />
      </div>

      <h1 className="mt-4 text-balance text-3xl font-medium tracking-tight sm:text-4xl">
        {form.name}
      </h1>
      <p className="mt-4 leading-relaxed text-muted">{form.description}</p>

      <div className="mt-8 space-y-4 rounded-xl border border-border bg-surface p-6 text-sm leading-relaxed">
        <div>
          <p className="font-mono text-xs uppercase tracking-wide text-accent">Purpose</p>
          <p className="mt-1.5 text-foreground/90">{form.purpose}</p>
        </div>
        <div>
          <p className="font-mono text-xs uppercase tracking-wide text-accent">
            What&rsquo;s collected
          </p>
          <p className="mt-1.5 text-foreground/90">{form.dataCollected}</p>
        </div>
        <div>
          <p className="font-mono text-xs uppercase tracking-wide text-accent">
            Who can access submissions
          </p>
          <p className="mt-1.5 text-foreground/90">{form.whoCanAccess}</p>
        </div>
      </div>

      <div className="mt-6 flex items-start gap-3 rounded-lg border border-warm/30 bg-warm/10 p-4 text-sm leading-relaxed text-foreground/90">
        <FileWarning className="mt-0.5 h-4 w-4 shrink-0 text-warm" aria-hidden="true" />
        <p>
          Prototype form — UI and layout only. There is no submission endpoint connected
          yet, so nothing typed below is sent or stored anywhere.
        </p>
      </div>

      <form
        className="mt-8 space-y-5 rounded-xl border border-border bg-elevated p-6"
        onSubmit={(event) => event.preventDefault()}
      >
        {form.fields.map((field) => (
          <div key={field.label}>
            <label className="block text-sm font-medium text-foreground" htmlFor={field.label}>
              {field.label}
            </label>
            {field.type === "textarea" ? (
              <textarea
                id={field.label}
                disabled
                rows={3}
                className="mt-2 w-full resize-none rounded-md border border-border bg-surface px-3 py-2 text-sm text-muted placeholder:text-muted/60 disabled:cursor-not-allowed"
                placeholder="Not wired up yet"
              />
            ) : field.type === "select" ? (
              <select
                id={field.label}
                disabled
                className="mt-2 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-muted disabled:cursor-not-allowed"
              >
                {field.options?.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            ) : (
              <input
                id={field.label}
                type="text"
                disabled
                className="mt-2 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-muted placeholder:text-muted/60 disabled:cursor-not-allowed"
                placeholder="Not wired up yet"
              />
            )}
          </div>
        ))}

        <button
          type="submit"
          disabled
          className="inline-flex h-11 items-center justify-center rounded-md bg-foreground/40 px-5 text-sm font-medium text-background/80 disabled:cursor-not-allowed"
        >
          Submit (not connected)
        </button>
      </form>
    </div>
  );
}
