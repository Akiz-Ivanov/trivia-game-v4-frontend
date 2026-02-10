import type { StateCreator } from "zustand";
import type { Station, RadioStore } from "./types";
import { fetchStationsByMode, isAbortError } from "./helpers";
import fallbackStations from "@/data/fallbackStations";

//* Non-react internal refs
let abortController: AbortController | null = null;
let hasFetchedInitially = false;

export interface StationsSlice {
  stations: Station[];
  activeList: Station[];
  activeListType: "search" | "favorites";

  currentStationId?: string;
  currentStationInfo: Station | null;

  loadingFetch: boolean;
  fetchError: string | null;

  fetchStations: () => Promise<void>;
  selectStation: (station: Station) => void;
  setActiveList: (list: Station[], type: "search" | "favorites") => void;

  nextStation: () => void;
  prevStation: () => void;

  loadFallbackStations: () => void;
}

export const createStationsSlice: StateCreator<
  RadioStore,
  [],
  [],
  StationsSlice
> = (set, get) => ({
  //* State
  stations: [],
  activeList: [],
  activeListType: "search",

  currentStationId: undefined,
  currentStationInfo: null,

  loadingFetch: false,
  fetchError: null,

  //* Actions
  fetchStations: async () => {
    const { mode, stationQuery, limit } = get();

    //! Skip fetching if mode is null and we've already fetched once
    //! (you probably don't need this anymore since mode defaults to "popular")
    if (!mode && hasFetchedInitially) return;

    if (abortController) abortController.abort();
    abortController = new AbortController();

    const { signal } = abortController;

    set({
      loadingFetch: true,
      fetchError: null,
    });

    try {
      const data = await fetchStationsByMode(mode, stationQuery, limit, signal);

      if (signal.aborted) return;

      set({
        stations: data,
        activeList: data,
        activeListType: "search",
      });

      hasFetchedInitially = true;

      //* If first fetch, auto-select first station
      const { currentStationId } = get();

      if (!currentStationId && data.length > 0) {
        set({
          currentStationId: data[0].stationuuid,
          currentStationInfo: data[0],
        });
      }
    } catch (err) {
      if (isAbortError(err)) return;
      console.error("Failed to fetch stations:", err);
      if (signal.aborted) return;
      set({ fetchError: "Failed to load stations" });
    } finally {
      if (!signal.aborted) set({ loadingFetch: false });
    }
  },

  selectStation: (station: Station) => {
    set({
      currentStationId: station.stationuuid,
      currentStationInfo: station,
      isPlaying: true,
    });
    get().initializeAudio(station);
  },

  setActiveList: (list: Station[], type: "search" | "favorites") => {
    set({
      activeList: list,
      activeListType: type,
    });
  },

  nextStation: () => {
    const { activeList, currentStationId } = get();
    if (!currentStationId || activeList.length === 0) return;

    const idx = activeList.findIndex((s) => s.stationuuid === currentStationId);
    if (idx === -1) return;

    const nextIdx = (idx + 1) % activeList.length;
    get().selectStation(activeList[nextIdx]);
  },

  prevStation: () => {
    const { activeList, currentStationId } = get();
    if (!currentStationId || activeList.length === 0) return;

    const idx = activeList.findIndex((s) => s.stationuuid === currentStationId);
    if (idx === -1) return;

    const prevIdx = (idx - 1 + activeList.length) % activeList.length;
    get().selectStation(activeList[prevIdx]);
  },

  loadFallbackStations: () => {
    if (!fallbackStations || fallbackStations.length === 0) return;

    set({
      stations: fallbackStations,
      activeList: fallbackStations,
      activeListType: "search",
      fetchError: "Loaded fallback stations (server unavailable)",
      currentStationId: fallbackStations[0].stationuuid,
      currentStationInfo: fallbackStations[0],
    });
  },
});
