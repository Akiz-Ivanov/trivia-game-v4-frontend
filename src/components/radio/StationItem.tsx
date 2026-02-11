import { Star } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import type { Station } from "@/types/radio.types";
import { useRadioStore } from "@/store/radio";

type StationItemProps = {
  station: Station;
};

const StationItem = ({ station }: StationItemProps) => {
  //* ====== State ======
  const currentStationId = useRadioStore(
    (state) => state.currentStationInfo?.stationuuid,
  );
  const toggleFavorite = useRadioStore((state) => state.toggleFavorite);
  const selectStation = useRadioStore((state) => state.selectStation);
  const isStationFavorite = useRadioStore((state) =>
    state.favorites.some((s) => s.stationuuid === station.stationuuid),
  );

  //* ====== Derived ======
  const isCurrent = currentStationId === station.stationuuid;
  const { name } = station;

  return (
    <div role="listitem">
      <div
        onClick={() => selectStation(station)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            selectStation(station);
          }
        }}
        aria-current={isCurrent ? "true" : undefined}
        aria-label={`Select station ${name}${isCurrent ? " (currently playing)" : ""}`}
        className={cn(
          "text-radio-glow bg-transparent p-1 mb-2 text-left",
          "w-full justify-between mb-1 h-auto flex",
          "text-sm font-medium shadow-sm cursor-pointer w-full",
          "hover:outline-1 hover:outline-radio-glow truncate relative pr-2 hover:bg-transparent",
          {
            "text-radio-glow/30": isCurrent,
          },
        )}
      >
        {/* Station name */}
        <span className="text-left truncate flex-1" aria-hidden="true">
          {name}
        </span>

        {/* Favorite button */}
        <Button
          variant="ghost"
          className="w-fit h-fit p-0 hover:bg-transparent group"
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(station);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              e.stopPropagation();
              toggleFavorite(station);
            }
          }}
          aria-label={`${isStationFavorite ? "Remove" : "Add"} ${name} ${isStationFavorite ? "from" : "to"} favorites`}
          tabIndex={0}
        >
          <Star
            className={cn(
              "size-4",
              isStationFavorite
                ? "fill-radio-glow text-radio-glow"
                : "text-radio-glow",
            )}
            aria-hidden="true"
          />
        </Button>
      </div>
    </div>
  );
};

export default StationItem;
