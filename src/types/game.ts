import type { DifficultyValue } from "./formConfig";

export type ScoreBreakdown = {
  basePoints: number;
  timeBonus: number;
  multiplier: number;
  totalScore: number;
};

type QuestionStatsBase = {
  questionIndex: number;
  difficulty: DifficultyValue;
  correct: boolean;
  timeTaken: number;
  timeLeft: number;
};

export interface RecordAnswerParams extends QuestionStatsBase {
  totalTime: number;
}

export interface QuestionResult extends QuestionStatsBase {
  streak: number;
  scoreBreakdown: ScoreBreakdown;
}

export type GameStats = {
  totalScore: number;
  correctCount: number;
  totalQuestions: number;
  maxStreak: number;
  questionResults: QuestionResult[];
};

export type ProcessAnswerSelection = (
  answer: string,
  isCorrect: boolean,
  timeLeft?: number,
  totalTime?: number,
) => void;
