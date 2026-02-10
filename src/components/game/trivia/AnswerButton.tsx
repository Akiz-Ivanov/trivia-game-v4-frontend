import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import type { TriviaQuestion } from "@/types/trivia-db.types.js"
import { buttonVariants } from "@/components/ui/button"

type AnswerButtonProps = {
  answer: string
  questionData: TriviaQuestion
  selectedAnswer: string | null
  removedAnswers: string[]
  processAnswerSelection: (
    answer: string, 
    isCorrect: boolean,
    timeLeft?: number
  ) => void
  index: number
  firstAnswerRef?: React.RefObject<HTMLButtonElement | null>
  timeLeft?: number
}

const AnswerButton = ({
  answer,
  questionData,
  selectedAnswer,
  removedAnswers,
  processAnswerSelection,
  index,
  firstAnswerRef,
  timeLeft
}: AnswerButtonProps) => {

  const isSelected = answer === selectedAnswer
  const isCorrect = answer === questionData.correct_answer
  const isIncorrect = isSelected && !isCorrect
  const isDisabled = !!selectedAnswer || removedAnswers.includes(answer)
  const isNeutral = isDisabled && !isCorrect && !isIncorrect

  return (
    <motion.button
      key={`${questionData.id}-${answer}`}
      ref={index === 0 ? firstAnswerRef : null}
      whileHover={{ scale: 1.05 }}
      type="button"
      role="listitem"
      onClick={() => processAnswerSelection(answer, isCorrect, timeLeft)}
      aria-pressed={isSelected}
      disabled={isDisabled}
      aria-disabled={isDisabled}
      tabIndex={isDisabled ? -1 : 0}
      className={cn(
        buttonVariants({ variant: "answer-default" }),
        {
          "bg-correct": selectedAnswer && isCorrect,
          "bg-incorrect": isIncorrect,
          "!opacity-100": (isCorrect || isIncorrect) && isDisabled,
          "cursor-default pointer-events-none": isDisabled,
          "opacity-50 scale-100 shadow-none hover:shadow-none hover:scale-100 bg-[linear-gradient(135deg,rgba(0,195,255,0.8),rgba(214,0,186,0.8))]": isNeutral,
          "bg-[linear-gradient(135deg,rgb(0,195,255),rgb(214,0,186))]": !selectedAnswer
        }
      )}
    >
      <span>{answer}</span>
    </motion.button>
  )
}

export default AnswerButton