import {
  CirclePower,
  Minimize,
  PauseCircle,
  PlayCircle,
  StepBack,
  StepForward,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Loader2 } from "lucide-react";
import RadioDrawer from "./RadioDrawer";
import StationFilter from "./StationFilter";
import VolumeSlider from "./VolumeSlider";
import Marquee from "react-fast-marquee";
import UtilityButton from "./UtilityButton";
import { cn } from "@/lib/utils";
import RadioCatSvg from "@/assets/svgs/radio-cat.svg?react";
import { useSettingsStore } from "@/store/settingsStore";
import { useRadioInit } from "@/hooks/useRadioInit";
import { useRadioStore } from "@/store/radio";

type RadioWidgetProps = {
  powerOff: () => void;
  isRadioOpen: boolean;
  handleRadioOpen: () => void;
  handleRadioClose: () => void;
};

const RadioWidget = ({
  powerOff,
  isRadioOpen,
  handleRadioOpen,
  handleRadioClose,
}: RadioWidgetProps) => {
  const [openDrawer, setOpenDrawer] = useState<boolean>(false);
  const [openScreen, setOpenScreen] = useState<boolean>(false);

  const radioTheme = useSettingsStore((state) => state.radioTheme);

  const theme = radioTheme;

  const widgetRef = useRef<HTMLDivElement>(null);
  const firstFocusableRef = useRef<HTMLButtonElement>(null);

  useRadioInit();

  const currentStation = useRadioStore((state) => state.currentStationInfo);
  const isPlaying = useRadioStore((state) => state.isPlaying);
  const togglePlay = useRadioStore((state) => state.togglePlay);
  const nextStation = useRadioStore((state) => state.nextStation);
  const prevStation = useRadioStore((state) => state.prevStation);
  const volume = useRadioStore((state) => state.volume);
  const setVolume = useRadioStore((state) => state.setVolume);
  const loadingHowl = useRadioStore((state) => state.loadingHowl);
  const howlError = useRadioStore((state) => state.howlError);
  const toggleFavorite = useRadioStore((state) => state.toggleFavorite);
  const isFavorite = useRadioStore((state) =>
    state.favorites.some((s) => s.stationuuid === currentStation?.stationuuid),
  );

  //*====== Close radio widget on click outside ======
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Element;

      //* Check if click is inside the widget
      if (widgetRef.current && !widgetRef.current.contains(target)) {
        //* Check if click is on popover content or combobox trigger
        const isPopoverClick =
          target.closest('[role="combobox"]') ||
          target.closest("[data-radix-popper-content-wrapper]") ||
          target.closest('[role="listbox"]') ||
          target.closest('[role="option"]');

        //* Only close if it's not a popover-related click
        if (!isPopoverClick) {
          handleRadioClose();
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Focus management when radio opens
  useEffect(() => {
    if (isRadioOpen && firstFocusableRef.current) {
      // Small delay to ensure DOM is ready
      setTimeout(() => {
        firstFocusableRef.current?.focus();
      }, 100);
    }
  }, [isRadioOpen]);

  useEffect(() => {
    return useRadioStore.subscribe(
      (state) => state.mode,
      (mode) => {
        if (!mode) return;
        setOpenDrawer(true);
        if (mode === "popular") setOpenScreen(true);
      },
    );
  }, []);

  useEffect(() => {
    return useRadioStore.subscribe(
      (state) => state.stationQuery,
      (query) => setOpenScreen(query.length > 0),
    );
  }, []);

  const stationDisplay = loadingHowl
    ? `Starting playback.`
    : howlError
      ? howlError
      : currentStation?.name ||
        `No station selected. Loading popular stations.`;

  return (
    <div
      ref={widgetRef}
      data-radio-theme={theme}
      className={cn("fixed z-50", {
        "bottom-2 right-2": isRadioOpen,
        "bottom-0 right-0": !isRadioOpen,
      })}
    >
      {isRadioOpen ? (
        <div
          className="radio-wood-frame"
          style={{
            backgroundImage:
              theme === "retro"
                ? "var(--radio-texture)"
                : "var(--radio-texture)",
          }}
        >
          <div className="radio-inner-trim">
            <div className="rounded-xl w-72 flex flex-col gap-4 shadow-inset p-1 relative bg-cover bg-center radio-bg">
              <RadioDrawer openDrawer={openDrawer} openScreen={openScreen} />

              {/* Top-half */}
              <div className="h-1/2 radio-top-half py-3.5 px-4 flex flex-col gap-3.5">
                <div className="flex flex-row justify-between px-1 gap-2">
                  <UtilityButton
                    ref={firstFocusableRef}
                    onClick={() => setOpenDrawer(!openDrawer)}
                    isPressed={openDrawer}
                  >
                    Drawer
                  </UtilityButton>

                  <UtilityButton
                    onClick={() => {
                      setOpenScreen(!openScreen);
                      if (!openScreen) {
                        setOpenDrawer(true);
                      }
                    }}
                    isPressed={openScreen}
                  >
                    Stations
                  </UtilityButton>

                  <UtilityButton
                    onClick={() => {
                      if (!currentStation) return;
                      toggleFavorite(currentStation);
                    }}
                    isPressed={isFavorite}
                  >
                    Favorite
                  </UtilityButton>
                </div>

                <StationFilter />

                {/* Station name with scrolling text */}
                <div className="rounded-lg radio-station-name overflow-hidden">
                  <Marquee
                    speed={40}
                    pauseOnHover={true}
                    pauseOnClick={true}
                    className="text-sm station-name-text select-all"
                  >
                    {stationDisplay}
                  </Marquee>
                </div>
              </div>

              {/* Bottom half */}
              <div className="h-1/2 radio-panel pb-3 pt-5 px-8 flex flex-col gap-4">
                <VolumeSlider
                  volume={volume}
                  onSetVolume={(value) => setVolume(value)}
                />

                {/* Controls */}
                <div className="flex justify-between items-center gap-4 mt-2 px-4">
                  <button
                    className="radio-btn rounded-full p-1.5"
                    onClick={prevStation}
                  >
                    <StepBack className="radio-btn-svg" />
                  </button>
                  <button
                    className="radio-btn rounded-full p-1.5"
                    onClick={togglePlay}
                  >
                    {loadingHowl ? (
                      <Loader2 className="animate-spin text-[#fff] size-6" />
                    ) : isPlaying ? (
                      <PauseCircle className="radio-btn-svg" />
                    ) : (
                      <PlayCircle className="radio-btn-svg" />
                    )}
                  </button>
                  <button
                    className="radio-btn rounded-full p-1.5"
                    onClick={nextStation}
                  >
                    <StepForward className="radio-btn-svg" />
                  </button>
                </div>

                <div
                  className="radio-bottom-panel py-0.5 px-2 mt-0.5
                  flex flex-row justify-center items-center -mb-3 relative
                  rounded-t-[1.2rem] bg-gradient-to-b from-[#2a2a2a] via-[#111] via-40% to-[#111] 
                  shadow-[inset_0_2px_4px_rgba(255,255,255,0.1),inset_0_-2px_4px_rgba(0,0,0,0.8),0_2px_4px_rgba(0,0,0,0.5)]"
                >
                  {/* Power OFF button */}
                  <button
                    className="rounded-full
                    text-sm inline-flex items-center justify-center gap-1 pl-1
                    text-radio-glow hover:text-error-foreground transition-colors duration-200"
                    onClick={powerOff}
                  >
                    OFF <CirclePower className="size-4" />
                  </button>

                  {/* Decorative light */}
                  <div className="border-light h-1 rounded-full w-20 mx-auto" />

                  <button
                    className="rounded-full bottom-1 right-3 
                  text-sm inline-flex items-center pr-1 justify-center gap-1 
                  text-radio-glow hover:text-chart-3 transition-colors duration-200"
                    onClick={handleRadioClose}
                  >
                    <Minimize className="size-4" /> Dock
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <button
          onClick={handleRadioOpen}
          className="group p-0 bg-transparent border-none cursor-pointer
            transition-all duration-300
            hover:-translate-y-1.5 
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2
            hover:[filter:drop-shadow(0_0_15px_rgba(139,92,246,0.6))_drop-shadow(0_0_10px_rgba(59,130,246,0.4))]
            focus-visible:[filter:drop-shadow(0_0_15px_rgba(139,92,246,0.6))_drop-shadow(0_0_10px_rgba(59,130,246,0.4))]
            rounded-lg"
          aria-label="Open Radio Player"
        >
          <RadioCatSvg
            className="w-18 xs:w-22 sm:w-24 lg:w-42 h-auto shadow-lg
              [pointer-events:none] [&_*]:[pointer-events:visiblePainted]
              group-hover:brightness-110"
          />
        </button>
      )}
    </div>
  );
};

export default RadioWidget;
