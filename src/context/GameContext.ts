import { createContext } from "react";

export type GameContextType = {
  // UI State
  currentQuestionIndex: number;
  selectedAnswer: string | null;
  isMetaVisible: boolean;

  // Actions
  setCurrentQuestionIndex: (index: number) => void;
  setSelectedAnswer: (answer: string | null) => void;
  setIsMetaVisible: (visible: boolean) => void;

  // Helpers
  nextQuestion: () => void;
  toggleMeta: () => void;
};

export const GameContext = createContext<GameContextType | undefined>(
  undefined,
);
