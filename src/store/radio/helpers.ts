import {
  getStationsByTag,
  getStationsByCountry,
  getStationsByClicks,
  getStationByName,
} from "@/services/radioService";
import type { Station, RadioOptions } from "./types";

export const fetchStationsByMode = async (
  mode: RadioOptions["mode"],
  search: string,
  limit: number | undefined,
  signal: AbortSignal,
): Promise<Station[]> => {
  switch (mode) {
    case "popular":
      return getStationsByClicks(limit, signal);

    case "country":
      return getStationsByCountry(search, limit, signal);

    case "tag":
      return getStationsByTag(search, limit, signal);

    case "search":
      return getStationByName(search, limit, signal);

    default:
      return getStationsByClicks(50, signal);
  }
};

export const isAbortError = (err: unknown) =>
  err instanceof DOMException && err.name === "AbortError";
