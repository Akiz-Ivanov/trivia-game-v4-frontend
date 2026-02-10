import type { StateCreator } from "zustand";
import type { RadioStore, Station } from "./types";

export interface FavoritesSlice {
  favorites: Station[];

  toggleFavorite: (station: Station) => void;
  isFavorite: (uuid: string) => boolean;
  reorderFavorites: (newOrder: Station[]) => void;
}

export const createFavoritesSlice: StateCreator<
  RadioStore,
  [],
  [],
  FavoritesSlice
> = (set, get) => ({
  //* State
  favorites: [],

  //* Actions
  toggleFavorite: (station: Station) => {
    set((state) => {
      const existing = state.favorites.find(
        (s) => s.stationuuid === station.stationuuid,
      );

      return {
        favorites: existing
          ? state.favorites.filter((s) => s.stationuuid !== station.stationuuid)
          : [...state.favorites, station],
      };
    });
  },

  isFavorite: (uuid: string) => {
    return get().favorites.some((s) => s.stationuuid === uuid);
  },

  reorderFavorites: (newOrder: Station[]) => {
    set({ favorites: newOrder });
  },
});
