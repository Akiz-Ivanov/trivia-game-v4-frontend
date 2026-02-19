import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { ArrowRight, BarChart2, Clock, Eye, EyeOff, Timer } from "lucide-react";
import { getPreloadedCategoryBg } from "@/assets/imports.ts";
import insertSoftHyphens from "@/utils/insertSoftHyphens.js";
import GameMeta from "./GameMeta.js";
import TriviaAddons from "./trivia-addons/TriviaAddons.js";
import Card from "@/components/common/Card.js";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button.js";
import type { TriviaQuestion } from "@/types/trivia-db.types.js";
import type { Category } from "@/types/imports.types.js";
import AnswerButton from "./AnswerButton.js";
import { useQuizTimer } from "@/hooks/useQuizTimer.js";
import { CircularTimer } from "@/components/CircularTimer.js";
import ComboMeter from "@/components/ComboMeter.js";
import { AnimatedScore } from "@/components/AnimatedScore.js";
import { useQuizLogic } from "@/hooks/useQuizLogic.js";
import { useSettingsStore } from "@/store/settingsStore.js";
import { formatTime } from "@/utils/formatTime.js";
import { StickyWrapper } from "@/components/StickyWrapper.js";

type QuizCardProps = {
  questionData: TriviaQuestion;
  answers: string[];
  processAnswerSelection: (
    answer: string,
    isCorrect: boolean,
    timeLeft?: number,
  ) => void;
  nextQuestion: () => void;
  isLastQuestion: boolean;
  selectedAnswer: string | null;
  currentQuestionIndex: number;
  numOfQuestions: number;
  handleShowResults: () => void;
  isMetaVisible: boolean;
  toggleMetaVisibility: () => void;
  handleTimedOut: () => void;
  currentStreak: number;
  totalScore: number;
};

const QuizCard = ({
  questionData,
  answers,
  processAnswerSelection,
  nextQuestion,
  isLastQuestion,
  selectedAnswer,
  currentQuestionIndex,
  numOfQuestions,
  handleShowResults,
  isMetaVisible,
  toggleMetaVisibility,
  handleTimedOut,
  currentStreak,
  totalScore,
}: QuizCardProps): React.JSX.Element => {
  //* State values
  const [bgUrl, setBgUrl] = useState<string | null>(null);

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
  const isXs = window.matchMedia("(min-width: 480px)").matches;

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
          "before:content-[''] before:absolute before:inset-0 before:bg-[oklch(0%_0_none_/_0.3)] before:-z-10 xs:before:rounded-xl",
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
        {isXs && animations && isTimerEnabled && (
          <AnimatePresence>
            {timeLeft === 0 && (
              <motion.div
                role="alert"
                aria-atomic="true"
                className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 flex justify-center items-center"
                initial={{ opacity: 0, scale: 0.5, y: -20 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  y: 0,
                  transition: {
                    delay: 1.5,
                    duration: 0.4,
                    ease: [0.34, 1.56, 0.64, 1],
                  },
                }}
                exit={{
                  opacity: 0,
                  scale: 0.8,
                  transition: { duration: 0.2 },
                }}
              >
                <div className="whitespace-nowrap border-2 border-error-foreground rounded-full py-1.5 px-4 bg-popover text-error-foreground font-bold inline-flex justify-center items-center gap-1.5 shadow-lg ring-2 ring-accent ring-offset-2 ring-offset-background">
                  <Timer size={20} />
                  <span>{timeUpMessage}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}
        <p key={selectedAnswer} aria-live="polite" className="sr-only">
          {selectedAnswer
            ? selectedAnswer === questionData.correct_answer
              ? "Correct answer selected."
              : "Incorrect answer selected."
            : ""}
        </p>

        {/* ====== Meta Toggle Button ====== */}
        <div className="absolute top-2 right-10 xs:top-2.5 xs:right-2">
          <button
            type="button"
            onClick={toggleMetaVisibility}
            className={cn(
              "rounded-full bg-popover text-accent/50",
              "transition-all duration-400 focus:outline-none focus:ring-2 focus:ring-ring/50",
              "opacity-50 hover:opacity-100 hover:outline-1 hover:outline-ring",
              "flex items-center justify-center overflow-hidden",
              "focus:opacity-100 xs:focus-within:w-[7.5rem]",
              "size-8 xs:hover:w-[7.5rem] group relative",
            )}
            aria-label={
              isMetaVisible ? "Hide game information" : "Show game information"
            }
          >
            {/* Text - visible on hover or focus on larger screens */}
            {isXs && (
              <span
                className={cn(
                  "whitespace-nowrap text-sm font-medium",
                  "transition-all duration-200",
                  "opacity-0 max-w-0 group-hover:opacity-100 group-hover:max-w-[5rem]",
                  "group-focus:opacity-100 group-focus:max-w-[5rem]",
                  "ml-2 mr-6",
                )}
              >
                {isMetaVisible ? "Hide Info" : "Show Info"}
              </span>
            )}

            {/* Icon - centered with absolute positioning */}
            <span className="absolute xs:right-1.5 flex-shrink-0">
              {isMetaVisible ? (
                <EyeOff className="size-6 xs:size-5" />
              ) : (
                <Eye className="size-6 xs:size-5" />
              )}
            </span>
          </button>
        </div>

        {/* ====== Meta ====== */}
        {isMetaVisible && (
          <GameMeta
            category={questionData.category}
            difficulty={questionData.difficulty}
            currentQuestionIndex={currentQuestionIndex}
            numOfQuestions={numOfQuestions}
          />
        )}

        {/* ====== Desktop Layout HUD ====== */}
        <div className="hidden xs:flex w-full justify-between items-center relative">
          <AnimatedScore score={totalScore} />

          <div className="absolute left-1/2 -translate-x-1/2">
            <ComboMeter
              currentStreak={currentStreak}
              isHalloween={isHalloween}
            />
          </div>

          {isTimerEnabled && (
            <div>
              <CircularTimer
                timeLeft={timeLeft}
                totalTime={totalTime}
                size={46}
                strokeWidth={4}
              />
            </div>
          )}
        </div>

        {/* ====== Mobile Layout HUD ====== */}
        <StickyWrapper>
          <div className="flex xs:hidden w-screen justify-between items-center relative">
            <AnimatedScore score={totalScore} />

            <div className="absolute left-1/2 -translate-x-1/2 pointer-events-none">
              <ComboMeter
                currentStreak={currentStreak}
                isHalloween={isHalloween}
              />
            </div>

            {isTimerEnabled && (
              <div className="rounded-s-full rounded-e-none score-time-container py-1 px-3 min-w-16 flex items-center gap-1">
                <span className="font-bold text-lg tabular-nums">
                  {formatTime(timeLeft)}
                </span>
                <Clock className="size-4" />
              </div>
            )}
          </div>
        </StickyWrapper>

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
          className="btn-wrapper grid sm:grid-cols-2 gap-6 w-full xs:my-2 sm:my-3 relative"
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

        <div
          className="relative w-full h-fit"
          // after:content-[''] after:absolute after:bg-[url('/src/assets/svgs/halloween/evil-ghost.svg')]
          // after:left-0 after:sm:size-32 after:lg:size-42 after:-top-4
          // after:pointer-events-none"
        >
          {/* ====== NextQuestion/ShowResults button ====== */}
          <Button
            type="button"
            onClick={isLastQuestion ? handleShowResults : nextQuestion}
            disabled={!selectedAnswer}
            aria-disabled={!selectedAnswer}
            title={!selectedAnswer ? "Choose an answer to continue" : undefined}
            ref={nextButtonRef}
            className={cn(
              "inline-flex items-center justify-center px-8 py-3 mt-4 text-white font-semibold text-[1.1rem]",
              "rounded-[2rem] border-2 border-white/30 bg-origin-border",
              "transition-all duration-300 ease-in-out backdrop-blur-[4px]",
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
