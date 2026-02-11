import type { StateCreator } from "zustand";
import type { RadioStore, Station } from "./types";
import { Howl } from "howler";

export type PlaybackSlice = {
  isPlaying: boolean;
  volume: number;
  loadingHowl: boolean;
  howlError: string | null;

  togglePlay: () => void;
  setVolume: (v: number) => void;
  initializeAudio: (station: Station) => void;
  cleanupAudio: () => void;
};

let audioInstance: Howl | null = null;
let audioRetryRef = false;
let currentStationUrl = "";

export const createPlaybackSlice: StateCreator<
  RadioStore,
  [],
  [],
  PlaybackSlice
> = (set, get) => ({
  //* State
  isPlaying: false,
  volume: 0.5,
  loadingHowl: false,
  howlError: null,

  //* Actions
  togglePlay: () => {
    if (!audioInstance) return;
    const { isPlaying } = get();

    if (isPlaying) {
      audioInstance.pause();
      set({ isPlaying: false });
    } else {
      if (audioInstance.state() === "loaded") {
        audioInstance.play();
      }
      set({ isPlaying: true });
    }
  },

  setVolume: (v) => {
    set({ volume: v });
    audioInstance?.volume(v);
  },

  initializeAudio: (station: Station) => {
    if (currentStationUrl === station.url_resolved) return;
    currentStationUrl = station.url_resolved;

    //* Clean up previous
    audioInstance?.unload();
    audioInstance = null;
    audioRetryRef = false;

    set({ loadingHowl: true, howlError: null });

    const howl = new Howl({
      src: [station.url_resolved],
      html5: true,
      volume: get().volume,
      preload: true,
      format: ["mp3", "aac", "ogg", "wav", "m3u8", "pls"],

      onload: () => {
        set({ loadingHowl: false });
        if (get().isPlaying) {
          howl.play();
        }
      },

      onloaderror: () => {
        set({ howlError: "Unable to load station.", loadingHowl: false });
      },

      onplayerror: () => {
        if (!audioRetryRef) {
          audioRetryRef = true;
          set({ howlError: "Playback failed. Trying again." });
          setTimeout(() => audioInstance?.play(), 500);
        } else {
          audioRetryRef = false;
          set({
            howlError: "Playback failed. Please try another station.",
            loadingHowl: false,
          });
        }
      },
    });

    audioInstance = howl;
  },

  cleanupAudio: () => {
    audioInstance?.unload();
    audioInstance = null;
    currentStationUrl = "";
    set({ isPlaying: false });
  },
});
