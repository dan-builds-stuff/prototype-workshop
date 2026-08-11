import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container flex min-h-[70vh] flex-col items-start justify-center py-24">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">404</p>
      <h1 className="mt-4 text-balance text-4xl font-medium tracking-tight sm:text-5xl">
        Nothing built here yet.
      </h1>
      <p className="mt-4 max-w-md leading-relaxed text-muted">
        This page doesn&rsquo;t exist — or it&rsquo;s a prototype that never made it
        past the sketch stage.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex h-11 items-center justify-center rounded-md bg-foreground px-5 text-sm font-medium text-background transition-colors duration-200 ease-calm hover:bg-foreground/90"
      >
        Back to the sandbox
      </Link>
    </div>
  );
}
