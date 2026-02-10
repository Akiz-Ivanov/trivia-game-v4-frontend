export const calculateScore = (
  difficulty: 'easy' | 'medium' | 'hard',
  timeLeft: number | undefined,
  totalTime: number,
  multiplier: number
): number => {
  const basePoints = {
    easy: 100,
    medium: 200,
    hard: 300
  }[difficulty]

  const effectiveTimeLeft = timeLeft ?? totalTime
  const timeBonus = Math.floor((effectiveTimeLeft / totalTime) * basePoints * 0.5)
  
  const totalScore = (basePoints + timeBonus) * multiplier

  return totalScore
}

// Optional: Show score breakdown
export const getScoreBreakdown = (
  difficulty: string,
  timeLeft: number,
  totalTime: number,
  multiplier: number
) => {
  const base = { easy: 100, medium: 200, hard: 300 }[difficulty] || 100
  const timeBonus = Math.floor((timeLeft / totalTime) * base * 0.5)
  const total = (base + timeBonus) * multiplier

  return {
    base,
    timeBonus,
    multiplier,
    total
  }
}