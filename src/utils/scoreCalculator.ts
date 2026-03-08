import type { DifficultyValue } from "@/types/formConfig";
import type { ScoreBreakdown } from "@/types/game";

export const calculateScore = (
  difficulty: DifficultyValue,
  timeLeft: number | undefined,
  totalTime: number,
  multiplier: number,
): { points: number; breakdown: ScoreBreakdown } => {
  const basePoints = {
    easy: 100,
    medium: 200,
    hard: 300,
  }[difficulty];

  const effectiveTimeLeft = timeLeft ?? totalTime;
  const timeBonus = Math.floor(
    (effectiveTimeLeft / totalTime) * basePoints * 0.5,
  );

  const totalScore = (basePoints + timeBonus) * multiplier;

  return {
    points: totalScore,
    breakdown: {
      basePoints,
      timeBonus,
      multiplier,
      totalScore,
    },
  };
};
