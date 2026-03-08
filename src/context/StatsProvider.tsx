import { useState, type ReactNode } from "react";
import type { QuestionResult, RecordAnswerParams } from "@/types/game";
import { calculateScore } from "@/utils/scoreCalculator";

import { StatsContext } from "./StatsContext";

export const StatsProvider = ({ children }: { children: ReactNode }) => {
  //* ====== Game Stats ======
  const [totalScore, setTotalScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);

  //* ====== Question Stats Tracking ======
  const [questionResults, setQuestionResults] = useState<QuestionResult[]>([]);

  const recordAnswer = ({
    questionIndex,
    difficulty,
    correct,
    timeTaken,
    timeLeft,
    totalTime,
  }: RecordAnswerParams) => {
    if (correct) {
      setCorrectCount((prev) => prev + 1);

      const newStreak = Math.min(currentStreak + 1, 3);
      setCurrentStreak(newStreak);
      setMaxStreak((prev) => Math.max(prev, newStreak));

      const { points, breakdown } = calculateScore(
        difficulty,
        timeLeft,
        totalTime,
        newStreak,
      );

      setTotalScore((prev) => prev + points);

      setQuestionResults((prev) => [
        ...prev,
        {
          questionIndex,
          difficulty,
          correct: true,
          timeTaken,
          timeLeft,
          streak: newStreak,
          scoreBreakdown: breakdown,
        },
      ]);

      return { points, multiplier: newStreak };
    } else {
      setCurrentStreak(0);
      setQuestionResults((prev) => [
        ...prev,
        {
          questionIndex,
          difficulty,
          correct: false,
          timeTaken,
          timeLeft,
          streak: 0,
          scoreBreakdown: {
            basePoints: 0,
            timeBonus: 0,
            multiplier: 0,
            totalScore: 0,
          },
        },
      ]);
      return null;
    }
  };

  const resetStreak = () => setCurrentStreak(0);

  const resetStats = () => {
    setTotalScore(0);
    setCorrectCount(0);
    setCurrentStreak(0);
    setMaxStreak(0);
    setQuestionResults([]);
  };

  const getGameStats = () => ({
    totalScore,
    correctCount,
    totalQuestions: questionResults.length,
    maxStreak,
    questionResults,
  });

  return (
    <StatsContext.Provider
      value={{
        totalScore,
        correctCount,
        currentStreak,
        maxStreak,
        questionResults,
        recordAnswer,
        resetStreak,
        resetStats,
        getGameStats,
      }}
    >
      {children}
    </StatsContext.Provider>
  );
};
