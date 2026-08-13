// src/hooks/use-board-weather.ts
//
// Client-side weather state for the board: fetches on mount, refreshes on
// an interval, caches the last successful reading in localStorage so a
// temporary network blip never blanks rows 1-2.

"use client";

import { useCallback, useEffect, useState } from "react";
import { DEFAULT_LOCATION, FALLBACK_WEATHER, fetchWeather, formatWeatherLines } from "@/lib/board/weather";
import type { WeatherData } from "@/lib/board/weather";

const REFRESH_MS = Number(process.env.NEXT_PUBLIC_WEATHER_REFRESH_MINUTES ?? 15) * 60_000;
const STORAGE_KEY = "board:last-weather";

export type WeatherStatus = "loading" | "live" | "stale" | "demo";

export function useBoardWeather() {
  const [weather, setWeather] = useState<WeatherData>(FALLBACK_WEATHER);
  const [status, setStatus] = useState<WeatherStatus>("loading");

  const load = useCallback(async () => {
    try {
      const data = await fetchWeather();
      setWeather(data);
      setStatus("live");
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ data, savedAt: Date.now() }));
      } catch {
        // Storage can fail (private browsing, quota) — not fatal.
      }
    } catch {
      try {
        const cached = window.localStorage.getItem(STORAGE_KEY);
        if (cached) {
          const parsed = JSON.parse(cached) as { data: WeatherData };
          setWeather(parsed.data);
          setStatus("stale");
          return;
        }
      } catch {
        // Fall through to demo fallback below.
      }
      setWeather(FALLBACK_WEATHER);
      setStatus("demo");
    }
  }, []);

  useEffect(() => {
    load();
    const interval = window.setInterval(load, REFRESH_MS);
    return () => window.clearInterval(interval);
  }, [load]);

  const lines = formatWeatherLines(weather, DEFAULT_LOCATION);

  return { weather, status, lines, refresh: load };
}
