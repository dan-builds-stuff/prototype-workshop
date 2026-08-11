import Link from "next/link";
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

export function PrototypeTable({ prototypes }: { prototypes: Prototype[] }) {
  return (
    <div className="overflow-hidden rounded-xl border border-border">
      <table className="w-full border-collapse text-left text-sm">
        <caption className="sr-only">List of prototypes with status and access</caption>
        <thead>
          <tr className="border-b border-border bg-surface text-xs uppercase tracking-wide text-muted">
            <th scope="col" className="px-4 py-3 font-medium">
              Name
            </th>
            <th scope="col" className="hidden px-4 py-3 font-medium sm:table-cell">
              Type
            </th>
            <th scope="col" className="px-4 py-3 font-medium">
              Status
            </th>
            <th scope="col" className="px-4 py-3 font-medium">
              Access
            </th>
            <th scope="col" className="hidden px-4 py-3 font-medium md:table-cell">
              Updated
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {prototypes.map((prototype) => (
            <tr key={prototype.slug} className="transition-colors duration-200 ease-calm hover:bg-surface/60">
              <td className="px-4 py-3">
                <Link
                  href={`/prototypes/${prototype.slug}`}
                  className="font-medium text-foreground underline-offset-4 hover:underline"
                >
                  {prototype.name}
                </Link>
              </td>
              <td className="hidden px-4 py-3 text-muted sm:table-cell">
                {typeLabels[prototype.type] ?? prototype.type}
              </td>
              <td className="px-4 py-3">
                <StatusBadge status={prototype.status} />
              </td>
              <td className="px-4 py-3">
                <AccessBadge access={prototype.access} />
              </td>
              <td className="hidden px-4 py-3 text-muted md:table-cell">
                <time dateTime={prototype.lastUpdated}>
                  {dateFormatter.format(new Date(prototype.lastUpdated))}
                </time>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
