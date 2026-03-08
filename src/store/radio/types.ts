import type { StationsSlice } from "./stationsSlice";
import type { PlaybackSlice } from "./playbackSlice";
import type { FavoritesSlice } from "./favoritesSlice";
import type { UiSlice } from "./uiSlice";
export type Mode = "tag" | "country" | "popular" | "search" | null;

export type RadioStore = StationsSlice &
  PlaybackSlice &
  FavoritesSlice &
  UiSlice;

export interface Station {
  name: string;
  url_resolved: string;
  favicon: string;
  country: string;
  tags: string[];
  stationuuid: string;
}

export interface RadioOptions {
  mode?: Mode | null;
  search?: string;
  limit?: number;
}
