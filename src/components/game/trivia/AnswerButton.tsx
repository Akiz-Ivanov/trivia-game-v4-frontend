import { motion } from "framer-motion";
import { cva } from "class-variance-authority";
import type { TriviaQuestion } from "@/types/trivia-db.types.js";
import { useSettingsStore } from "@/store/settingsStore";

const answerButtonVariants = cva(
  //* Base styles common to all
  "w-full min-h-[4rem] box-border text-15-16 px-4 py-2 will-change-transform",
  {
    variants: {
      theme: {
        default:
          "bg-origin-border rounded-full xs:rounded-md border-2 border-white/30 transition-transform duration-200 ease-in-out",
        halloween:
          "rounded-[1.25rem] border-[3px] border-[#5a2800] transition-transform duration-200 ease-in-out shadow-[inset_0_-5px_10px_rgba(0,0,0,0.3),0_5px_20px_rgba(255,107,26,0.4)] text-[#2d1300] font-semibold [text-shadow:0_1px_2px_rgba(255,255,255,0.3)] relative overflow-visible",
      },
      answerState: {
        idle: "",
        correct: "!opacity-100 pointer-events-none",
        incorrect: "!opacity-100 pointer-events-none",
        neutral: "opacity-50 cursor-default pointer-events-none",
        disabled: "cursor-default pointer-events-none",
      },
    },
    compoundVariants: [
      //* Default theme + idle state (unselected)
      {
        theme: "default",
        answerState: "idle",
        className:
          "bg-[linear-gradient(135deg,rgb(0,195,255),rgb(214,0,186))] hover:scale-[1.02] hover:shadow-[0_0_15px_rgba(0,195,255,0.4)] active:scale-95 active:shadow-[0_0_8px_rgba(0,195,255,0.2)]",
      },
      //* Default theme + correct
      {
        theme: "default",
        answerState: "correct",
        className:
          "!bg-correct !border-correct !text-white [text-shadow:0_2px_4px_rgba(0,0,0,0.5)]",
      },
      //* Default theme + incorrect
      {
        theme: "default",
        answerState: "incorrect",
        className:
          "!bg-incorrect !border-incorrect !text-white [text-shadow:0_2px_4px_rgba(0,0,0,0.5)]",
      },
      //* Default theme + neutral state (other answer selected)
      {
        theme: "default",
        answerState: "neutral",
        className:
          "scale-100 shadow-none hover:shadow-none hover:scale-100 bg-[linear-gradient(135deg,rgba(0,195,255,0.8),rgba(214,0,186,0.8))]",
      },
      //* Halloween theme + idle state
      {
        theme: "halloween",
        answerState: "idle",
        className:
          "bg-[radial-gradient(circle_at_30%_30%,#ff9d4a_0%,#ff6b1a_50%,#d64800_100%)] hover:scale-105 active:scale-95 hover:shadow-[inset_0_-5px_10px_rgba(0,0,0,0.3),0_5px_30px_rgba(255,107,26,0.8),0_0_30px_rgba(255,200,0,0.6)]",
      },
      //* Halloween theme + correct
      {
        theme: "halloween",
        answerState: "correct",
        className:
          "!bg-correct !border-correct !text-white [text-shadow:0_2px_4px_rgba(0,0,0,0.8)] !shadow-[0_0_30px_rgba(100,255,100,0.6)]",
      },
      //* Halloween theme + incorrect
      {
        theme: "halloween",
        answerState: "incorrect",
        className:
          "!bg-incorrect !border-incorrect !text-white [text-shadow:0_2px_4px_rgba(0,0,0,0.8)] !shadow-[0_0_30px_rgba(255,100,60,0.6)]",
      },
      //* Halloween theme + neutral state
      {
        theme: "halloween",
        answerState: "neutral",
        className:
          "scale-100 shadow-none hover:shadow-none hover:scale-100 !bg-[linear-gradient(135deg,#5a4230,#3d2817)] !border-[#5a2800] !text-[#9d8266]",
      },
    ],
    defaultVariants: {
      theme: "default",
      answerState: "idle",
    },
  },
);

type AnswerButtonProps = {
  answer: string;
  questionData: TriviaQuestion;
  selectedAnswer: string | null;
  removedAnswers: string[];
  processAnswerSelection: (
    answer: string,
    isCorrect: boolean,
    timeLeft?: number,
  ) => void;
  index: number;
  firstAnswerRef?: React.RefObject<HTMLButtonElement | null>;
  timeLeft?: number;
};

const AnswerButton = ({
  answer,
  questionData,
  selectedAnswer,
  removedAnswers,
  processAnswerSelection,
  index,
  firstAnswerRef,
  timeLeft,
}: AnswerButtonProps) => {
  const isSelected = answer === selectedAnswer;
  const isCorrect = answer === questionData.correct_answer;
  const isIncorrect = isSelected && !isCorrect;
  const isDisabled = !!selectedAnswer || removedAnswers.includes(answer);
  const isNeutral = isDisabled && !isCorrect && !isIncorrect;

  const theme = useSettingsStore((state) => state.theme);

  // Determine answer state
  const getAnswerState = () => {
    if (selectedAnswer && isCorrect) return "correct";
    if (isIncorrect) return "incorrect";
    if (isNeutral) return "neutral";
    if (isDisabled) return "disabled";
    return "idle";
  };

  return (
    <motion.button
      key={`${questionData.id}-${answer}`}
      ref={index === 0 ? firstAnswerRef : null}
      whileHover={{ scale: isDisabled ? 1 : 1.05 }}
      type="button"
      role="listitem"
      onClick={() => processAnswerSelection(answer, isCorrect, timeLeft)}
      aria-pressed={isSelected}
      disabled={isDisabled}
      aria-disabled={isDisabled}
      tabIndex={isDisabled ? -1 : 0}
      className={answerButtonVariants({
        theme: theme === "halloween" ? "halloween" : "default",
        answerState: getAnswerState(),
      })}
    >
      <span>{answer}</span>
    </motion.button>
  );
};

export default AnswerButton;
