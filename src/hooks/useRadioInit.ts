import { useEffect } from "react";
import { useRadioStore } from "@/store/radio";

export const useRadioInit = () => {
  const fetchStations = useRadioStore((state) => state.fetchStations);
  const mode = useRadioStore((state) => state.mode);
  const stationQuery = useRadioStore((state) => state.stationQuery);
  const limit = useRadioStore((state) => state.limit);
  const currentStationInfo = useRadioStore((state) => state.currentStationInfo);
  const initializeAudio = useRadioStore((state) => state.initializeAudio);

  useEffect(() => {
    if (currentStationInfo) {
      initializeAudio(currentStationInfo);
    }
  }, []);

  useEffect(() => {
    fetchStations();
  }, [mode, stationQuery, limit]);
};
