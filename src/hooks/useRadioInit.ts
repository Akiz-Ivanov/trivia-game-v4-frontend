import { useEffect } from "react";
import { useRadioStore } from "@/store/radio";

export const useRadioInit = () => {
  const fetchStations = useRadioStore((state) => state.fetchStations);
  const mode = useRadioStore((state) => state.mode);
  const stationQuery = useRadioStore((state) => state.stationQuery);
  const limit = useRadioStore((state) => state.limit);

  useEffect(() => {
    fetchStations();
  }, [mode, stationQuery, limit]);
};
