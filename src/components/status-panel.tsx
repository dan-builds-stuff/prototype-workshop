import { prototypes } from "@/data/prototypes";
import { forms } from "@/data/forms";
import { Reveal } from "@/components/motion/reveal";

const dateFormatter = new Intl.DateTimeFormat("en-AU", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

function mostRecentUpdate() {
  const dates = [...prototypes, ...forms].map((item) => item.lastUpdated);
  return dates.sort().at(-1);
}

export function StatusPanel() {
  const activeCount = prototypes.filter((p) => p.status !== "archived").length;
  const publicCount = prototypes.filter((p) => p.access === "public").length;
  const protectedCount = forms.length;
  const lastUpdated = mostRecentUpdate();

  const stats = [
    { label: "Active prototypes", value: String(activeCount) },
    { label: "Open to view", value: String(publicCount) },
    { label: "Protected forms", value: String(protectedCount) },
    {
      label: "Last updated",
      value: lastUpdated ? dateFormatter.format(new Date(lastUpdated)) : "—",
    },
  ];

  return (
    <section aria-label="Workshop status" className="border-b border-border/60 py-12">
      <div className="container">
        <Reveal>
          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="bg-surface p-6">
                <p className="font-mono text-xs uppercase tracking-wide text-muted">
                  {stat.label}
                </p>
                <p className="mt-2 text-2xl font-medium tracking-tight text-foreground">
                  {stat.value}
                </p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
