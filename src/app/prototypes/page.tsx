import type { Metadata } from "next";
import { Reveal } from "@/components/motion/reveal";
import { PrototypeTable } from "@/components/prototype-table";
import { prototypes } from "@/data/prototypes";

export const metadata: Metadata = {
  title: "Prototypes — dan's sandbox",
  description: "Every prototype in this space, with status and access at a glance.",
};

export default function PrototypesPage() {
  return (
    <div className="container py-20 sm:py-28">
      <Reveal>
        <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-accent">
          Index
        </p>
        <h1 className="max-w-2xl text-balance text-4xl font-medium tracking-tight sm:text-5xl">
          Prototypes
        </h1>
        <p className="mt-5 max-w-2xl text-balance text-lg leading-relaxed text-muted">
          Demos, tools and experiments in progress. Status and access are shown for
          every entry — nothing here is production ready unless it says live.
        </p>
      </Reveal>

      <Reveal delay={0.08} className="mt-12">
        <PrototypeTable prototypes={prototypes} />
      </Reveal>
    </div>
  );
}
