import { useState, useEffect, useCallback } from "react";
import shuffleArray from "@/utils/shuffle";
import QuizCard from "./trivia/QuizCard";
import Results from "./results/Results";
import { AnimatePresence } from "framer-motion";
import { playCorrectSound } from "@/utils/soundManager";
import { calculateScore } from "@/utils/scoreCalculator";

import type { TriviaQuestion } from "@/types/trivia-db.types";

type GameManagerProps = {
  triviaData: TriviaQuestion[];
  resetGame: () => void;
};

import type { GameScreen } from "@/types/screen.types";
import { ScorePopup } from "../ScorePopup";

const GameManager = ({
  triviaData,
  resetGame,
}: GameManagerProps): React.JSX.Element => {
  //* ====== Game State ======
  const [shuffledAnswers, setShuffledAnswers] = useState<string[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [gameScreen, setGameScreen] = useState<GameScreen>("quiz");
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [isMetaVisible, setIsMetaVisible] = useState<boolean>(true);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [lastScore, setLastScore] = useState<{
    points: number;
    multiplier: number;
  } | null>(null);
  const [showScorePopup, setShowScorePopup] = useState(false);

  const toggleMetaVisibility = () => setIsMetaVisible((prev) => !prev);

  //* ====== Game Config ======
  const numOfQuestions: number = triviaData.length;

  //* ====== Shuffle answers ======
  useEffect(() => {
    if (triviaData.length) {
      const { incorrect_answers, correct_answer } =
        triviaData[currentQuestionIndex];
      const answers = [...incorrect_answers, correct_answer];
      const shuffledAnswers = shuffleArray(answers);
      setShuffledAnswers(shuffledAnswers);
    }
  }, [triviaData, currentQuestionIndex]);

  //* ====== Load next question ======
  const loadNextQuestion = () => {
    setCurrentQuestionIndex(currentQuestionIndex + 1);
    setSelectedAnswer(null);
  };

  //* ====== Process the selected answer (correct or incorrect) ======
  const processAnswerSelection = useCallback(
    (answer: string, isCorrect: boolean, timeLeft?: number) => {
      if (selectedAnswer) return;
      setSelectedAnswer(answer);

      if (isCorrect) {
        setCorrectCount((prev) => prev + 1);

        const newStreak = Math.min(currentStreak + 1, 3);
        setCurrentStreak(newStreak);

        const difficulty = triviaData[currentQuestionIndex].difficulty;

        const points = calculateScore(
          difficulty as "easy" | "medium" | "hard",
          timeLeft ?? 30,
          30,
          newStreak,
        );

        setTotalScore((prev) => prev + points);

        // ✅ Show score popup
        setLastScore({ points, multiplier: newStreak });
        setShowScorePopup(true);

        // Hide popup after 2 seconds
        setTimeout(() => {
          setShowScorePopup(false);
        }, 2000);

        playCorrectSound();
      } else {
        setCurrentStreak(0);
      }
    },
    [selectedAnswer, currentStreak, triviaData, currentQuestionIndex],
  );

  //* ====== Handle game end ======
  const handleShowResults = () => {
    setGameScreen("results");
  };

  const handleTimedOut = useCallback(() => {
    const incorrectAnswers = triviaData[currentQuestionIndex].incorrect_answers;
    const randomIncorrect =
      incorrectAnswers[Math.floor(Math.random() * incorrectAnswers.length)];
    setSelectedAnswer(randomIncorrect);
    setCurrentStreak(0);
  }, [triviaData, currentQuestionIndex]);

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
            key={triviaData[currentQuestionIndex].id}
            questionData={triviaData[currentQuestionIndex]}
            answers={shuffledAnswers}
            isLastQuestion={currentQuestionIndex === triviaData.length - 1}
            selectedAnswer={selectedAnswer}
            processAnswerSelection={processAnswerSelection}
            nextQuestion={loadNextQuestion}
            currentQuestionIndex={currentQuestionIndex}
            numOfQuestions={numOfQuestions}
            handleShowResults={handleShowResults}
            isMetaVisible={isMetaVisible}
            toggleMetaVisibility={toggleMetaVisibility}
            handleTimedOut={handleTimedOut}
            currentStreak={currentStreak}
            totalScore={totalScore}
          />
        </AnimatePresence>
      )}

      {gameScreen === "results" && (
        <Results
          correctCount={correctCount}
          numOfQuestions={numOfQuestions}
          resetGame={resetGame}
        />
      )}
    </>
  );
};

export default GameManager;
