import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { ArrowRight, BarChart2, Clock } from "lucide-react";
import { getPreloadedCategoryBg } from "@/assets/imports.ts";
import insertSoftHyphens from "@/utils/insertSoftHyphens.js";
import GameMeta from "./GameMeta.js";
import TriviaAddons from "./trivia-addons/TriviaAddons.js";
import Card from "@/components/common/Card.js";
import { Button } from "@/components/ui/button.js";
import type { TriviaQuestion } from "@/types/trivia-db.js";
import type { Category } from "@/types/imports.js";
import AnswerButton from "./AnswerButton.js";
import { useQuizTimer } from "@/hooks/useQuizTimer.js";
import { useQuizLogic } from "@/hooks/useQuizLogic.js";
import { useSettingsStore } from "@/store/settingsStore.js";
import { useMediaQuery } from "@/hooks/useMediaQuery.js";
import { useGame } from "@/hooks/useGame.js";
import { useGameStats } from "@/hooks/useGameStats.js";
import { MetaToggleButton } from "./trivia-addons/MetaToggleButton.js";
import { TimeUpNotification } from "./trivia-addons/TimeUpNotification.js";
import type { ProcessAnswerSelection } from "@/types/game.js";
import { DesktopHUD, MobileHUD } from "./trivia-addons/QuizHUD.js";

type QuizCardProps = {
  questionData: TriviaQuestion;
  answers: string[];
  processAnswerSelection: ProcessAnswerSelection;
  isLastQuestion: boolean;
  numOfQuestions: number;
  handleShowResults: () => void;
  handleTimedOut: () => void;
};

const QuizCard = ({
  questionData,
  answers,
  processAnswerSelection,
  isLastQuestion,
  numOfQuestions,
  handleShowResults,
  handleTimedOut,
}: QuizCardProps): React.JSX.Element => {
  //* State values
  const [bgUrl, setBgUrl] = useState<string | null>(null);

  const {
    selectedAnswer,
    isMetaVisible,
    currentQuestionIndex,
    nextQuestion,
    toggleMeta,
  } = useGame();

  const { totalScore, currentStreak } = useGameStats();

  const animations = useSettingsStore((state) => state.animations);
  const illustrations = useSettingsStore((state) => state.illustrations);
  const theme = useSettingsStore((state) => state.theme);
  const timer = useSettingsStore((state) => state.timer);

  //* Constants
  const shouldAnimate = animations;
  const isHalloween = theme === "halloween";
  const isTimerEnabled = timer;

  //* Timer state
  const { timeLeft, timeUpMessage, timerRef, totalTime } = useQuizTimer(
    isTimerEnabled,
    selectedAnswer,
    questionData.id,
    handleTimedOut,
  );

  const { removedAnswers, firstAnswerRef, nextButtonRef, handleFiftyFifty } =
    useQuizLogic({ questionData, selectedAnswer });

  //* ====== Load category background ======
  useEffect(() => {
    const url = getPreloadedCategoryBg(questionData.category as Category);
    setBgUrl(url);
  }, [questionData.category]);

  //* ====== Render Answers ======
  const answerButtons = answers.map((answer: string, index: number) => (
    <AnswerButton
      key={`${questionData.id}-${answer}`}
      answer={answer}
      questionData={questionData}
      selectedAnswer={selectedAnswer}
      removedAnswers={removedAnswers}
      processAnswerSelection={processAnswerSelection}
      index={index}
      firstAnswerRef={index === 0 ? firstAnswerRef : undefined}
      timeLeft={isTimerEnabled ? timeLeft : undefined}
    />
  ));

  const isCorrect = selectedAnswer === questionData.correct_answer;
  const difficultyShadow = `var(--shadow-${questionData.difficulty})`;
  const isXs = useMediaQuery("(min-width: 480px)");

  return (
    <div className="relative w-full">
      {isHalloween && (
        <div
          className={`absolute inset-0 xs:rounded-2xl bg-transparent 
                    bg-[url('/src/assets/svgs/halloween/cyan-texture.webp')] bg-no-repeat bg-cover brightness-45`}
        />
      )}

      {isXs && isTimerEnabled && (
        <div ref={timerRef} className="timer-border absolute inset-0"></div>
      )}

      <Card
        key={questionData.id}
        asMotion={true}
        className={cn(
          "gap-3-16 text-15-18 sm:px-8 relative",
          "before:content-[''] before:absolute before:inset-0 before:bg-[oklch(0%_0_none/0.3)] before:-z-10 xs:before:rounded-xl",
          {
            "xs:shadow-hard": questionData.difficulty === "hard",
            "xs:shadow-medium": questionData.difficulty === "medium",
            "xs:shadow-easy": questionData.difficulty === "easy",
            "bg-transparent bg-no-repeat": isHalloween,
          },
        )}
        style={{
          backgroundImage: bgUrl && illustrations ? `url(${bgUrl})` : "none",
          willChange: shouldAnimate ? "transform, opacity" : "auto",
        }}
        initial={shouldAnimate ? { opacity: 0 } : undefined}
        animate={
          shouldAnimate
            ? {
                opacity: 1,
                //*====== Correct and Incorrect shadow flash ======
                boxShadow:
                  selectedAnswer && isXs
                    ? [
                        `0 0 0 calc(4px + 1px) rgba(255,255,255,0.06), ${difficultyShadow}`, //* default
                        `0 0 0 calc(4px + 1px) ${isCorrect ? "rgba(34,197,94,0.8)" : "rgba(239,68,68,0.8)"}, ${difficultyShadow}`, //* flash
                        `0 0 0 calc(4px + 1px) rgba(255,255,255,0.06), ${difficultyShadow}`, //* back to default
                      ]
                    : undefined,
              }
            : undefined
        }
        exit={shouldAnimate ? { opacity: 0 } : undefined}
        transition={
          shouldAnimate
            ? {
                opacity: { duration: 0.2, ease: "easeOut" },
                boxShadow: isXs
                  ? {
                      duration: 0.5,
                      ease: [0.417, 0, 0.867, 1],
                      times: [0, 0.3, 1],
                    }
                  : undefined,
              }
            : undefined
        }
      >
        {/* Time's up notification */}
        <TimeUpNotification
          timeLeft={timeLeft}
          timeUpMessage={timeUpMessage}
          isTimerEnabled={isTimerEnabled}
        />
        <p key={selectedAnswer} aria-live="polite" className="sr-only">
          {selectedAnswer
            ? selectedAnswer === questionData.correct_answer
              ? "Correct answer selected."
              : "Incorrect answer selected."
            : ""}
        </p>

        {/* ====== Meta Toggle Button ====== */}
        <MetaToggleButton
          isMetaVisible={isMetaVisible}
          toggleMeta={toggleMeta}
        />

        {/* ====== Meta ====== */}
        {isMetaVisible && (
          <GameMeta
            category={questionData.category}
            difficulty={questionData.difficulty}
            currentQuestionIndex={currentQuestionIndex}
            numOfQuestions={numOfQuestions}
          />
        )}

        <DesktopHUD
          totalScore={totalScore}
          currentStreak={currentStreak}
          isHalloween={isHalloween}
          isTimerEnabled={isTimerEnabled}
          timeLeft={timeLeft}
          totalTime={totalTime}
        />

        <MobileHUD
          totalScore={totalScore}
          currentStreak={currentStreak}
          isHalloween={isHalloween}
          isTimerEnabled={isTimerEnabled}
          timeLeft={timeLeft}
        />

        {/* ====== Question ====== */}
        <h2
          className="text-[clamp(1.3rem,2.5vw,1.75rem)] font-bold leading-1.4 mt-2 mb-2 text-balance wrap-break-word"
          id={`question-${questionData.id}`}
        >
          {insertSoftHyphens(questionData.question)}
        </h2>

        {/* ====== Answers ====== */}
        <div
          role="list"
          aria-labelledby={`question-${questionData.id}`}
          aria-describedby="answer-instruction"
          className="btn-wrapper grid sm:grid-cols-2 gap-3 xs:gap-6 w-full xs:my-2 sm:my-3 relative"
          onKeyDown={(e) => {
            if (e.key === "ArrowDown" || e.key === "ArrowRight") {
              e.preventDefault();
              const focused = document.activeElement as HTMLElement;
              const next = focused.nextElementSibling as HTMLElement;
              next?.focus();
            } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
              e.preventDefault();
              const focused = document.activeElement as HTMLElement;
              const prev = focused.previousElementSibling as HTMLElement;
              prev?.focus();
            }
          }}
        >
          {answerButtons}
        </div>

        <p id="answer-instruction" className="sr-only">
          Choose one of the answers.
        </p>

        {/* ====== NextQuestion/ShowResults button ====== */}
        <div className="relative w-full h-fit">
          <Button
            type="button"
            onClick={isLastQuestion ? handleShowResults : nextQuestion}
            disabled={!selectedAnswer}
            aria-disabled={!selectedAnswer}
            title={!selectedAnswer ? "Choose an answer to continue" : undefined}
            ref={nextButtonRef}
            className={cn(
              "inline-flex items-center justify-center px-8 py-3 mt-4 text-white font-semibold text-[1.1rem]",
              "rounded-4xl border-2 border-white/30 bg-origin-border",
              "transition-all duration-300 ease-in-out backdrop-blur-xs",
              "hover:scale-[1.03] active:scale-95 active:shadow-[0_0_8px_rgba(0,195,255,0.2)]",
              "focus-visible:border-none outline-none will-change-transform",
              "focus-visible:ring-2 focus-visible:ring-ring",
              "focus-visible:ring-offset-2 focus-visible:ring-offset-background",
              {
                "bg-[linear-gradient(135deg,rgba(0,200,120,0.8),rgba(0,160,80,0.8))] hover:shadow-[0_0_20px_rgba(0,255,180,0.3)] focus-visible:shadow-[0_0_0_4px_rgba(0,195,255,0.3)]":
                  isLastQuestion,
                "bg-[linear-gradient(135deg,rgba(0,195,255,0.8),rgba(214,0,186,0.8))] hover:shadow-[0_0_20px_rgba(0,195,255,0.3)] focus-visible:shadow-[0_0_0_4px_rgba(0,195,255,0.3)]":
                  !isLastQuestion,
                "cursor-not-allowed opacity-60 bg-white/10 scale-100 shadow-none":
                  !selectedAnswer,
              },
            )}
          >
            {isLastQuestion ? (
              <>
                Show Results <BarChart2 className="icon ml-2" size={20} />
              </>
            ) : (
              <>
                Next Question <ArrowRight className="icon ml-2" size={20} />
              </>
            )}
          </Button>
        </div>

        {/* ====== TriviaAddons ====== */}
        <TriviaAddons
          questionData={questionData}
          selectedAnswer={selectedAnswer}
          handleFiftyFifty={handleFiftyFifty}
          removedAnswers={removedAnswers}
        />
      </Card>
    </div>
  );
};

export default QuizCard;
