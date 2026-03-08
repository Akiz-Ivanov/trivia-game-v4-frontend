import { useState, useEffect } from "react";
import { useGame } from "@/hooks/useGame";
import { useGameStats } from "@/hooks/useGameStats";
import shuffleArray from "@/utils/shuffle";
import QuizCard from "./trivia/QuizCard";
import Results from "./results/Results";
import { AnimatePresence } from "framer-motion";
import { playCorrectSound } from "@/utils/soundManager";
import { ScorePopup } from "../ScorePopup";

import type { TriviaQuestion } from "@/types/trivia-db";
import type { GameScreen } from "@/types/screen";
import { StatsProvider } from "@/context/StatsProvider";
import { GameProvider } from "@/context/GameProvider";
import type { ProcessAnswerSelection } from "@/types/game";

type GameManagerProps = {
  triviaData: TriviaQuestion[];
  resetGame: () => void;
};

const GameManagerContent = ({
  triviaData,
  resetGame,
}: GameManagerProps): React.JSX.Element => {
  //* ====== Game State ======
  const [gameScreen, setGameScreen] = useState<GameScreen>("quiz");
  const game = useGame();
  const stats = useGameStats();
  // const isTimerEnabled = useSettingsStore((state) => state.timer);

  const [shuffledAnswers, setShuffledAnswers] = useState<string[]>([]);
  const [showScorePopup, setShowScorePopup] = useState(false);
  const [lastScore, setLastScore] = useState<{
    points: number;
    multiplier: number;
  } | null>(null);

  // Shuffle answers when question changes
  useEffect(() => {
    if (triviaData.length) {
      const { incorrect_answers, correct_answer } =
        triviaData[game.currentQuestionIndex];
      const answers = shuffleArray([...incorrect_answers, correct_answer]);
      setShuffledAnswers(answers);
    }
  }, [triviaData, game.currentQuestionIndex]);

  const processAnswerSelection: ProcessAnswerSelection = (
    answer,
    isCorrect,
    timeLeft,
    totalTime = 30,
  ) => {
    if (game.selectedAnswer) return;
    game.setSelectedAnswer(answer);

    const difficulty = triviaData[game.currentQuestionIndex].difficulty;
    const timeTaken = timeLeft !== undefined ? totalTime - timeLeft : 0;

    const result = stats.recordAnswer({
      questionIndex: game.currentQuestionIndex,
      difficulty: difficulty as "easy" | "medium" | "hard",
      correct: isCorrect,
      timeTaken,
      timeLeft: timeLeft ?? totalTime,
      totalTime,
    });

    if (result) {
      setLastScore(result);
      setShowScorePopup(true);
      setTimeout(() => setShowScorePopup(false), 2000);
      playCorrectSound();
    }
  };

  const handleShowResults = () => {
    setGameScreen("results");
  };

  const handleTimedOut = () => {
    const incorrectAnswers =
      triviaData[game.currentQuestionIndex].incorrect_answers;
    const randomIncorrect =
      incorrectAnswers[Math.floor(Math.random() * incorrectAnswers.length)];
    game.setSelectedAnswer(randomIncorrect);
    stats.resetStreak();

    //* Record the timeout as incorrect
    const difficulty = triviaData[game.currentQuestionIndex].difficulty;
    stats.recordAnswer({
      questionIndex: game.currentQuestionIndex,
      difficulty: difficulty as "easy" | "medium" | "hard",
      correct: false,
      timeTaken: 30, // Used all time
      timeLeft: 0,
      totalTime: 30,
    });
  };

  return (
    <>
      {lastScore && (
        <ScorePopup
          points={lastScore.points}
          multiplier={lastScore.multiplier}
          show={showScorePopup}
        />
      )}

      {gameScreen === "quiz" && (
        <AnimatePresence mode="wait">
          <QuizCard
            key={triviaData[game.currentQuestionIndex].id}
            questionData={triviaData[game.currentQuestionIndex]}
            answers={shuffledAnswers}
            isLastQuestion={game.currentQuestionIndex === triviaData.length - 1}
            processAnswerSelection={processAnswerSelection}
            numOfQuestions={triviaData.length}
            handleShowResults={handleShowResults}
            handleTimedOut={handleTimedOut}
          />
        </AnimatePresence>
      )}

      {gameScreen === "results" && <Results resetGame={resetGame} />}
    </>
  );
};

// Wrap with both providers
const GameManager = (props: GameManagerProps) => (
  <GameProvider>
    <StatsProvider>
      <GameManagerContent {...props} />
    </StatsProvider>
  </GameProvider>
);

export default GameManager;
