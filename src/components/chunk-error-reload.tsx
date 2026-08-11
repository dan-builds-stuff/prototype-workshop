"use client";

// Lesson learned from the main Digital Workshop site: Cloudflare Pages can
// serve a stale-cached HTML document that references JS chunk hashes from a
// previous deploy, which throws a ChunkLoadError and renders a blank page.
// The `_headers` file stops the HTML from being cached stale in the first
// place; this is the safety net for anyone with an old tab open across a
// deploy anyway.

import { useEffect } from "react";

const RELOAD_FLAG = "sandbox:chunk-error-reload";

export function ChunkErrorReload() {
  useEffect(() => {
    function isChunkLoadError(message: unknown) {
      return (
        typeof message === "string" &&
        (message.includes("ChunkLoadError") || message.includes("Loading chunk"))
      );
    }
    function handleReload() {
      if (sessionStorage.getItem(RELOAD_FLAG)) return;
      sessionStorage.setItem(RELOAD_FLAG, "1");
      window.location.reload();
    }
    function onError(event: ErrorEvent) {
      if (isChunkLoadError(event.message) || isChunkLoadError(event.error?.message)) {
        handleReload();
      }
    }
    function onUnhandledRejection(event: PromiseRejectionEvent) {
      if (isChunkLoadError(event.reason?.message) || isChunkLoadError(String(event.reason))) {
        handleReload();
      }
    }
    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onUnhandledRejection);
    const clearGuardTimer = setTimeout(() => {
      sessionStorage.removeItem(RELOAD_FLAG);
    }, 5000);
    return () => {
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onUnhandledRejection);
      clearTimeout(clearGuardTimer);
    };
  }, []);

  return null;
}
