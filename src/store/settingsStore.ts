import { create } from "zustand";
import { persist } from "zustand/middleware";

type RadioTheme = "retro" | "futuristic";
type Theme = "default" | "halloween";

interface Settings {
  animations: boolean;
  illustrations: boolean;
  backgroundGlow: boolean;
  sound: boolean;
  backgroundPattern: boolean;
  sparkles: boolean;
  timer: boolean;
  radioTheme: RadioTheme;
  theme: Theme;
}

interface SettingsActions {
  toggleAnimations: () => void;
  toggleIllustrations: () => void;
  toggleBackgroundPattern: () => void;
  toggleSound: () => void;
  toggleBackgroundGlow: () => void;
  toggleSparkles: () => void;
  toggleTimer: () => void;
  setRadioTheme: (theme: RadioTheme) => void;
  setTheme: (theme: Theme) => void;
}

export const useSettingsStore = create<Settings & SettingsActions>()(
  persist(
    (set) => ({
      //* State
      animations: true,
      illustrations: true,
      backgroundGlow: true,
      sound: true,
      backgroundPattern: true,
      sparkles: true,
      timer: true,
      radioTheme: "retro",
      theme: "default",

      //* Actions
      toggleAnimations: () =>
        set((state) => ({ animations: !state.animations })),
      toggleIllustrations: () =>
        set((state) => ({ illustrations: !state.illustrations })),
      toggleBackgroundPattern: () =>
        set((state) => ({ backgroundPattern: !state.backgroundPattern })),
      toggleSound: () => set((state) => ({ sound: !state.sound })),
      toggleBackgroundGlow: () =>
        set((state) => ({ backgroundGlow: !state.backgroundGlow })),
      toggleSparkles: () => set((state) => ({ sparkles: !state.sparkles })),
      toggleTimer: () => set((state) => ({ timer: !state.timer })),
      setRadioTheme: (theme) => set({ radioTheme: theme }),
      setTheme: (theme) => set({ theme }),
    }),
    { name: "settings" },
  ),
);
