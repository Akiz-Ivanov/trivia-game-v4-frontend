import type { QuestionResult } from "@/types/game";

export type DetailedGameStats = {
  // Score breakdown
  totalScore: number;
  basePointsTotal: number;
  speedBonusTotal: number;
  comboBonusTotal: number;

  // Accuracy
  correctCount: number;
  totalQuestions: number;
  percentage: number;

  // Combo/Streak
  maxStreak: number;
  perfectStreak: boolean;

  // Time (conditional on timer mode)
  totalTimeTaken?: number;
  avgTimePerQuestion?: number;
  fastestAnswer?: number;

  // Difficulty breakdown
  difficultyStats: {
    easy: { correct: number; total: number };
    medium: { correct: number; total: number };
    hard: { correct: number; total: number };
  };

  // Grade
  grade: "S" | "A" | "B" | "C" | "D" | "F";
  rank: string;
};

export const calculateDetailedStats = (
  totalScore: number,
  correctCount: number,
  totalQuestions: number,
  maxStreak: number,
  questionResults: QuestionResult[],
  isTimerMode: boolean,
): DetailedGameStats => {
  const percentage = (correctCount / totalQuestions) * 100;

  // Calculate bonuses
  const basePointsTotal = questionResults.reduce(
    (sum, q) => sum + (q.correct ? q.scoreBreakdown.basePoints : 0),
    0,
  );

  const speedBonusTotal = questionResults.reduce(
    (sum, q) => sum + q.scoreBreakdown.timeBonus,
    0,
  );

  const comboBonusTotal = questionResults.reduce((sum, q) => {
    if (!q.correct || q.scoreBreakdown.multiplier === 1) return sum;
    const baseWithTime =
      q.scoreBreakdown.basePoints + q.scoreBreakdown.timeBonus;
    const bonusFromMultiplier =
      baseWithTime * (q.scoreBreakdown.multiplier - 1);
    return sum + bonusFromMultiplier;
  }, 0);

  const perfectStreak = questionResults.every((q) => q.correct);

  // Time stats - calculated from questionResults
  const timeStats = isTimerMode
    ? {
        totalTimeTaken: questionResults.reduce(
          (sum, q) => sum + q.timeTaken,
          0,
        ),
        avgTimePerQuestion:
          questionResults.reduce((sum, q) => sum + q.timeTaken, 0) /
          totalQuestions,
        fastestAnswer: Math.min(...questionResults.map((q) => q.timeTaken)),
      }
    : {};

  // Difficulty breakdown
  const difficultyStats = {
    easy: { correct: 0, total: 0 },
    medium: { correct: 0, total: 0 },
    hard: { correct: 0, total: 0 },
  };

  questionResults.forEach((q) => {
    difficultyStats[q.difficulty].total++;
    if (q.correct) difficultyStats[q.difficulty].correct++;
  });

  const grade =
    percentage >= 95
      ? "S"
      : percentage >= 85
        ? "A"
        : percentage >= 75
          ? "B"
          : percentage >= 65
            ? "C"
            : percentage >= 50
              ? "D"
              : "F";

  const rank =
    percentage >= 95
      ? "Quiz Master"
      : percentage >= 85
        ? "Scholar"
        : percentage >= 75
          ? "Student"
          : percentage >= 65
            ? "Learner"
            : percentage >= 50
              ? "Novice"
              : "Beginner";

  return {
    totalScore,
    basePointsTotal,
    speedBonusTotal,
    comboBonusTotal,
    correctCount,
    totalQuestions,
    percentage,
    maxStreak,
    perfectStreak,
    ...timeStats,
    difficultyStats,
    grade,
    rank,
  };
};
