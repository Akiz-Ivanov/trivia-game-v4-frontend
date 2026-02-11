import { create } from "zustand";
import {
  persist,
  createJSONStorage,
  subscribeWithSelector,
} from "zustand/middleware";
import { createStationsSlice } from "./stationsSlice";
import { createPlaybackSlice } from "./playbackSlice";
import { createFavoritesSlice } from "./favoritesSlice";
import { createUiSlice } from "./uiSlice";
import type { RadioStore } from "./types";

export const useRadioStore = create<RadioStore>()(
  subscribeWithSelector(
    persist(
      (...a) => ({
        ...createUiSlice(...a),
        ...createStationsSlice(...a),
        ...createPlaybackSlice(...a),
        ...createFavoritesSlice(...a),
      }),
      {
        name: "radio-storage",
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({
          volume: state.volume,
          favorites: state.favorites,
          currentStationId: state.currentStationId,
          currentStationInfo: state.currentStationInfo,
        }),
      },
    ),
  ),
);
