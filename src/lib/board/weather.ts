// src/lib/board/weather.ts
//
// Live weather for the board's permanently-reserved rows 1-2. Uses
// Open-Meteo (no API key) — browser-side fetch, works fine from a static
// export since it doesn't touch this site's own backend at all.

import { padLine } from "./format-message";
import { GRID_COLUMNS } from "./message-types";

export interface WeatherLocation {
  name: string;
  latitude: number;
  longitude: number;
  timezone: string;
}

export interface WeatherData {
  temperature: number;
  apparent: number;
  wind: number;
  code: number;
  max: number;
  min: number;
}

export const DEFAULT_LOCATION: WeatherLocation = {
  name: process.env.NEXT_PUBLIC_BOARD_LOCATION_NAME || "MELBOURNE",
  latitude: Number(process.env.NEXT_PUBLIC_BOARD_LATITUDE ?? -37.814),
  longitude: Number(process.env.NEXT_PUBLIC_BOARD_LONGITUDE ?? 144.96332),
  timezone: process.env.NEXT_PUBLIC_BOARD_TIMEZONE || "Australia/Melbourne",
};

export const FALLBACK_WEATHER: WeatherData = {
  temperature: 14,
  apparent: 12,
  wind: 11,
  code: 3,
  max: 16,
  min: 9,
};

// WMO weather-code category, shared by weatherLabel() and weatherIcon() so
// the two can never drift apart. Session 4 fix: 56/57 (freezing drizzle)
// and 85/86 (snow showers) previously fell through to CHANGEABLE instead
// of RAIN/SNOW — rare conditions, harmless fallback, but wrong.
type WeatherCategory = "CLEAR" | "CLOUDY" | "FOG" | "RAIN" | "SNOW" | "SHOWERS" | "STORMS" | "CHANGEABLE";

function weatherCategory(code: number): WeatherCategory {
  if (code === 0) return "CLEAR";
  if ([1, 2, 3].includes(code)) return "CLOUDY";
  if ([45, 48].includes(code)) return "FOG";
  if ((code >= 51 && code <= 67) || code === 56 || code === 57) return "RAIN";
  if ((code >= 71 && code <= 77) || code === 85 || code === 86) return "SNOW";
  if (code >= 80 && code <= 82) return "SHOWERS";
  if (code >= 95) return "STORMS";
  return "CHANGEABLE";
}

export function weatherLabel(code: number): string {
  return weatherCategory(code);
}

// Single-character mechanical-style symbols rather than real emoji (Dan's
// call, session 4) — keeps the board's monochrome, physical-object feel
// instead of introducing colour. Deliberately single-width glyphs, not
// 2-cell-wide ones: the general "wide glyph" rendering support that'd need
// is scoped separately under rich formatting (still undecided), and these
// render perfectly well in one cell, so there's no need to build that
// infrastructure just for this.
const WEATHER_ICONS: Record<WeatherCategory, string> = {
  CLEAR: "☀",
  CLOUDY: "☁",
  FOG: "≈",
  RAIN: "☂",
  SNOW: "❄",
  SHOWERS: "☂", // same glyph as RAIN — showers are rain, not worth a distinct icon
  STORMS: "⚡",
  CHANGEABLE: "~",
};

export function weatherIcon(code: number): string {
  return WEATHER_ICONS[weatherCategory(code)];
}

export async function fetchWeather(location: WeatherLocation = DEFAULT_LOCATION): Promise<WeatherData> {
  const url =
    `https://api.open-meteo.com/v1/forecast` +
    `?latitude=${location.latitude}&longitude=${location.longitude}` +
    `&current=temperature_2m,apparent_temperature,weather_code,wind_speed_10m` +
    `&daily=temperature_2m_max,temperature_2m_min` +
    `&timezone=${encodeURIComponent(location.timezone)}&forecast_days=1`;

  const response = await fetch(url);
  if (!response.ok) throw new Error("Weather request failed");
  const data = await response.json();

  return {
    temperature: Math.round(data.current.temperature_2m),
    apparent: Math.round(data.current.apparent_temperature),
    wind: Math.round(data.current.wind_speed_10m),
    code: data.current.weather_code,
    max: Math.round(data.daily.temperature_2m_max[0]),
    min: Math.round(data.daily.temperature_2m_min[0]),
  };
}

export function formatWeatherLines(
  weather: WeatherData,
  location: WeatherLocation = DEFAULT_LOCATION,
  columns: number = GRID_COLUMNS
): [string, string] {
  const icon = weatherIcon(weather.code);
  const line1 = padLine(
    `${location.name} ${weather.temperature}° ${icon} ${weatherLabel(weather.code)}`,
    columns,
    "center"
  );
  const line2 = padLine(`LOW ${weather.min}° HIGH ${weather.max}° WIND ${weather.wind}`, columns, "center");
  return [line1, line2];
}
