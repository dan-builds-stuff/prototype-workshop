// src/app/board/login/page.tsx
//
// Shared-password sign-in for /board/control. See functions/_middleware.ts
// (the Cloudflare Pages Function that actually enforces the gate) and
// functions/api/auth.ts (checks the password, sets the cookie).

"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Reveal } from "@/components/motion/reveal";

function LoginForm() {
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/board/control";

  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const response = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        setError(data.error ?? "Something went wrong.");
        return;
      }
      window.location.href = next;
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <article className="container flex min-h-[70vh] items-center justify-center py-20">
      <Reveal className="w-full max-w-sm space-y-4 rounded-2xl border border-border bg-surface p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
              Board control
            </p>
            <h1 className="text-2xl font-medium tracking-tight text-foreground">Sign in</h1>
            <p className="text-sm text-muted">
              This page is private. Enter the shared password to continue.
            </p>
          </div>

          <input
            type="password"
            autoFocus
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Password"
            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground outline-none focus:border-accent"
          />

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={submitting || password.length === 0}
            className="w-full rounded-xl bg-foreground px-4 py-3 font-medium text-background disabled:cursor-not-allowed disabled:opacity-40"
          >
            {submitting ? "Checking…" : "Continue"}
          </button>
        </form>
      </Reveal>
    </article>
  );
}

export default function BoardLoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
