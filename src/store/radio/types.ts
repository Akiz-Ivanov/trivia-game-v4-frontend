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

// export type RadioStore = {
//   stations: Station[];
//   currentStation: Station | null;
//   currentStationInfo: Station | null;
//   currentStationId: string | undefined;
//   isPlaying: boolean;
//   togglePlay: () => void;
//   nextStation: () => void;
//   prevStation: () => void;
//   selectStation: (station: Station) => void;
//   volume: number;
//   setVolume: (v: number) => void;
//   loadingFetch: boolean;
//   loadingHowl: boolean;
//   fetchError: string | null;
//   howlError: string | null;
//   setActiveList: (list: Station[], type: "search" | "favorites") => void;
//   mode: Mode;
//   setMode: (mode: Mode) => void;
//   stationQuery: string;
//   setStationQuery: (query: string) => void;
//   limit: number | undefined;
//   setLimit: (limit: number | undefined) => void;
//   activeList: Station[];
//   activeListType: "search" | "favorites";
//   favorites: Station[];
//   toggleFavorite: (station: Station) => void;
//   isFavorite: (uuid: string) => boolean;
//   reorderFavorites: (newOrder: Station[]) => void;
//   loadFallbackStations: () => void;
//   initializeAudio: (station: Station) => void;
// };
