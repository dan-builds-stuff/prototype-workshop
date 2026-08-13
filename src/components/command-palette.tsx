"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { FlaskConical, FileText, NotebookPen, ShieldQuestion, Home, LayoutGrid } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useCommandPalette } from "@/hooks/use-command-palette";
import { prototypes } from "@/data/prototypes";
import { forms } from "@/data/forms";

export function CommandPalette() {
  const { open, setOpen } = useCommandPalette();
  const router = useRouter();
  const triggerRef = React.useRef<HTMLElement | null>(null);

  React.useEffect(() => {
    if (open) {
      triggerRef.current = document.activeElement as HTMLElement;
    } else {
      triggerRef.current?.focus?.();
    }
  }, [open]);

  React.useEffect(() => {
    if (!open) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, setOpen]);

  React.useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  function go(href: string) {
    setOpen(false);
    router.push(href);
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-start justify-center bg-background/80 px-4 pt-[12vh] backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
      onClick={() => setOpen(false)}
    >
      <div
        className="w-full max-w-xl overflow-hidden rounded-xl border border-border bg-elevated shadow-2xl animate-fade-up"
        onClick={(event) => event.stopPropagation()}
      >
        <Command shouldFilter>
          <CommandInput
            autoFocus
            placeholder="Search prototypes, forms, notes…"
            aria-label="Search"
          />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>

            <CommandGroup heading="Navigate">
              <CommandItem onSelect={() => go("/")}>
                <Home className="h-4 w-4 text-muted" aria-hidden="true" />
                Home
              </CommandItem>
              <CommandItem onSelect={() => go("/prototypes")}>
                <FlaskConical className="h-4 w-4 text-muted" aria-hidden="true" />
                Prototypes
              </CommandItem>
              <CommandItem onSelect={() => go("/forms")}>
                <FileText className="h-4 w-4 text-muted" aria-hidden="true" />
                Protected forms
              </CommandItem>
              <CommandItem onSelect={() => go("/board")}>
                <LayoutGrid className="h-4 w-4 text-muted" aria-hidden="true" />
                Board (live display)
              </CommandItem>
              <CommandItem onSelect={() => go("/board/control")}>
                <LayoutGrid className="h-4 w-4 text-muted" aria-hidden="true" />
                Board control
              </CommandItem>
              <CommandItem onSelect={() => go("/notes")}>
                <NotebookPen className="h-4 w-4 text-muted" aria-hidden="true" />
                Experiment notes
              </CommandItem>
              <CommandItem onSelect={() => go("/access")}>
                <ShieldQuestion className="h-4 w-4 text-muted" aria-hidden="true" />
                Access information
              </CommandItem>
            </CommandGroup>

            <CommandGroup heading="Prototypes">
              {prototypes.map((prototype) => (
                <CommandItem
                  key={prototype.slug}
                  value={prototype.name}
                  onSelect={() => go(`/prototypes/${prototype.slug}`)}
                >
                  <FlaskConical className="h-4 w-4 text-muted" aria-hidden="true" />
                  {prototype.name}
                </CommandItem>
              ))}
            </CommandGroup>

            <CommandGroup heading="Protected forms">
              {forms.map((form) => (
                <CommandItem
                  key={form.slug}
                  value={form.name}
                  onSelect={() => go(`/forms/${form.slug}`)}
                >
                  <FileText className="h-4 w-4 text-muted" aria-hidden="true" />
                  {form.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
        <div className="flex items-center justify-between border-t border-border px-4 py-2.5 text-xs text-muted">
          <span>Navigate with ↑ ↓, select with ↵</span>
          <span>Esc to close</span>
        </div>
      </div>
    </div>
  );
}
