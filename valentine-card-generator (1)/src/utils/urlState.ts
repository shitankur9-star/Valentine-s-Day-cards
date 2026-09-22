import type { CardConfig } from "../types/card";

export function encodeConfig(config: CardConfig) {
  const json = JSON.stringify(config);
  return btoa(encodeURIComponent(json));
}

export function decodeConfig(value: string): CardConfig | null {
  try {
    return JSON.parse(decodeURIComponent(atob(value))) as CardConfig;
  } catch {
    return null;
  }
}