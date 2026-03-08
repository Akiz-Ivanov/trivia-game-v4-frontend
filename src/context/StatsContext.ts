import { createContext } from "react";
import type {
  QuestionResult,
  RecordAnswerParams,
  GameStats,
} from "@/types/game";

export type StatsContextType = {
  totalScore: number;
  correctCount: number;
  currentStreak: number;
  maxStreak: number;
  questionResults: QuestionResult[];

  recordAnswer: (
    params: RecordAnswerParams,
  ) => { points: number; multiplier: number } | null;

  resetStreak: () => void;
  resetStats: () => void;
  getGameStats: () => GameStats;
};

export const StatsContext = createContext<StatsContextType | undefined>(
  undefined,
);
