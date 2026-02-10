import type { StateCreator } from "zustand";
import type { Mode, RadioStore } from "./types";

export interface UiSlice {
  mode: Mode;
  stationQuery: string;
  limit?: number;

  setMode: (mode: Mode) => void;
  setStationQuery: (query: string) => void;
  setLimit: (limit?: number) => void;
  resetQuery: () => void;
}

export const createUiSlice: StateCreator<RadioStore, [], [], UiSlice> = (
  set,
) => ({
  //* State
  mode: "popular",
  stationQuery: "",
  limit: undefined,

  //* Actions
  setMode: (mode) => set({ mode }),
  setStationQuery: (query) => set({ stationQuery: query }),
  setLimit: (limit) => set({ limit }),
  resetQuery: () => set({ stationQuery: "", limit: undefined }),
});
