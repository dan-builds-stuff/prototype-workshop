import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { FormShell } from "@/components/form-shell";
import { forms } from "@/data/forms";

export function generateStaticParams() {
  return forms.map((form) => ({ slug: form.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const form = forms.find((item) => item.slug === slug);
  if (!form) return {};
  return {
    title: `${form.name} — dan's sandbox`,
    description: form.description,
  };
}

export default async function FormDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const form = forms.find((item) => item.slug === slug);
  if (!form) notFound();

  return (
    <article className="container py-20 sm:py-28">
      <Reveal>
        <Link
          href="/forms"
          className="inline-flex items-center gap-2 text-sm text-muted transition-colors duration-200 ease-calm hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to protected forms
        </Link>
      </Reveal>

      <Reveal delay={0.06} className="mt-8">
        <FormShell form={form} />
      </Reveal>
    </article>
  );
}
