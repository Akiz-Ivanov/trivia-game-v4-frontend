import { StatsContext } from "@/context/StatsContext";
import { useContext } from "react";

export const useGameStats = () => {
  const context = useContext(StatsContext);
  if (!context) throw new Error("useStats must be used within StatsProvider");
  return context;
};
