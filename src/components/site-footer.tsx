import Link from "next/link";

// No link back to the main Digital Workshop site — the two are deliberately
// unlinked for now. Revisit if/when that changes.
export function SiteFooter() {
  return (
    <footer className="border-t border-border/60">
      <div className="container flex flex-col gap-6 py-10 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted">
          © {new Date().getFullYear()} Dan. A prototype space — expect rough edges.
        </p>

        <nav aria-label="Footer" className="flex flex-wrap gap-6 text-sm text-muted">
          <Link href="/#top" className="transition-colors duration-200 ease-calm hover:text-foreground">
            Back to top
          </Link>
          <Link href="/access" className="transition-colors duration-200 ease-calm hover:text-foreground">
            Access information
          </Link>
        </nav>
      </div>
    </footer>
  );
}
