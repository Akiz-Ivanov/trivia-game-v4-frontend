import { useState, type ReactNode } from "react";
import { GameContext } from "./GameContext";

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isMetaVisible, setIsMetaVisible] = useState(true);

  //* Helper functions
  const nextQuestion = () => {
    setCurrentQuestionIndex((prev) => prev + 1);
    setSelectedAnswer(null);
  };

  const toggleMeta = () => {
    setIsMetaVisible((prev) => !prev);
  };

  return (
    <GameContext.Provider
      value={{
        currentQuestionIndex,
        selectedAnswer,
        isMetaVisible,

        setCurrentQuestionIndex,
        setSelectedAnswer,
        setIsMetaVisible,

        nextQuestion,
        toggleMeta,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
