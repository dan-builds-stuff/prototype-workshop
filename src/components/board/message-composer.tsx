// src/components/board/message-composer.tsx
//
// Unlike the other forms in src/data/forms.ts (which are deliberately UI
// placeholders per this site's convention — see FormShell), this composer
// is a real, wired-up form: it posts to functions/api/message.ts, which
// validates and stores into Cloudflare KV. Dan asked for this one to
// actually work, not just preview the pattern.

"use client";

import { useMemo, useState } from "react";
import { formatMessageForGrid } from "@/lib/board/format-message";
import { DEFAULT_IDLE_MESSAGE, BOARD_SAMPLE_MESSAGES } from "@/data/board-sample-messages";
import { CONTENT_ROWS } from "@/lib/board/message-types";
import { useBoardWeather } from "@/hooks/use-board-weather";
import { MessagePreview } from "./message-preview";
import { MessageValidator } from "./message-validator";

type PublishState = "idle" | "publishing" | "published" | "error";

export function MessageComposer() {
  const [message, setMessage] = useState(DEFAULT_IDLE_MESSAGE);
  const [animationKey, setAnimationKey] = useState(0);
  const [publishState, setPublishState] = useState<PublishState>("idle");
  const [errorText, setErrorText] = useState<string | null>(null);
  const { lines: weatherLines } = useBoardWeather();

  // Only 6 of the 8 grid rows are available to messages — rows 1-2 are
  // permanently weather. Validate against that, not the full 8.
  const preview = useMemo(() => formatMessageForGrid(message, { rows: CONTENT_ROWS }), [message]);
  const boardLines = useMemo(() => [...weatherLines, ...preview.lines], [weatherLines, preview.lines]);

  async function publishMessage() {
    if (preview.overflow) return;
    setPublishState("publishing");
    setErrorText(null);
    try {
      const response = await fetch("/api/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, source: "control-page" }),
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error ?? "Publish failed");
      }
      setPublishState("published");
      setAnimationKey((v) => v + 1);
    } catch (err) {
      setPublishState("error");
      setErrorText(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  async function clearMessage() {
    setPublishState("publishing");
    setErrorText(null);
    try {
      const response = await fetch("/api/message", { method: "DELETE" });
      if (!response.ok) throw new Error("Clear failed");
      setMessage(DEFAULT_IDLE_MESSAGE);
      setPublishState("published");
      setAnimationKey((v) => v + 1);
    } catch (err) {
      setPublishState("error");
      setErrorText(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  function useDefaultMessage() {
    setMessage(DEFAULT_IDLE_MESSAGE);
    setAnimationKey((v) => v + 1);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[420px_1fr]">
      <div className="space-y-4 rounded-2xl border border-border bg-surface p-5">
        <label htmlFor="message" className="block text-sm font-medium text-muted">
          Message
        </label>
        <textarea
          id="message"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          className="min-h-48 w-full rounded-xl border border-border bg-background p-4 font-mono text-sm text-foreground outline-none focus:border-accent"
        />

        <MessageValidator preview={preview} />

        <div className="flex flex-wrap gap-2">
          <button
            onClick={publishMessage}
            disabled={preview.overflow || publishState === "publishing"}
            className="flex-1 rounded-xl bg-foreground px-4 py-3 font-medium text-background disabled:cursor-not-allowed disabled:opacity-40"
          >
            {publishState === "publishing" ? "Publishing…" : "Publish to board"}
          </button>
          <button
            onClick={clearMessage}
            type="button"
            className="rounded-xl border border-border px-4 py-3 text-sm font-medium text-muted hover:bg-elevated"
          >
            Clear
          </button>
          <button
            onClick={useDefaultMessage}
            type="button"
            className="rounded-xl border border-border px-4 py-3 text-sm font-medium text-muted hover:bg-elevated"
          >
            Default message
          </button>
        </div>

        {publishState === "published" && <p className="text-sm text-success">Published.</p>}
        {publishState === "error" && (
          <p className="text-sm text-red-400">{errorText ?? "Something went wrong. Try again."}</p>
        )}

        <div className="space-y-2 border-t border-border pt-4">
          <p className="text-sm font-medium text-muted">Sample messages</p>
          <div className="flex flex-wrap gap-2">
            {BOARD_SAMPLE_MESSAGES.map((sample) => (
              <button
                key={sample.id}
                type="button"
                onClick={() => {
                  setMessage(sample.message);
                  setAnimationKey((v) => v + 1);
                }}
                className="rounded-lg border border-border bg-elevated px-3 py-1.5 text-xs font-medium text-muted hover:text-foreground"
              >
                {sample.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <MessagePreview lines={boardLines} animationKey={animationKey} />
    </div>
  );
}
