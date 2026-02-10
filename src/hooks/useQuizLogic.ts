import { useEffect, useRef, useState } from "react"
import shuffleArray from "@/utils/shuffle"

import type { TriviaQuestion } from "@/types/trivia-db.types"

type QuizLogicReturn = {
  removedAnswers: string[]
  firstAnswerRef: React.RefObject<HTMLButtonElement | null>
  nextButtonRef: React.RefObject<HTMLButtonElement | null>
  handleFiftyFifty: (questionData: TriviaQuestion) => void
  setRemovedAnswers: React.Dispatch<React.SetStateAction<string[]>>
}

type QuizLogicProps = {
  questionData: TriviaQuestion
  selectedAnswer: string | null
}

export function useQuizLogic({ questionData, selectedAnswer }: QuizLogicProps): QuizLogicReturn {
  const [removedAnswers, setRemovedAnswers] = useState<string[]>([])
  const firstAnswerRef = useRef<HTMLButtonElement>(null)
  const nextButtonRef = useRef<HTMLButtonElement>(null)

  //* Focus management
  useEffect(() => {
    if (!selectedAnswer) {
      firstAnswerRef.current?.focus()
    }
  }, [questionData.id, selectedAnswer])

  useEffect(() => {
    if (selectedAnswer) {
      nextButtonRef.current?.focus()
    }
  }, [selectedAnswer])

  //* ====== Reset removedAnswers when question changes ======
  useEffect(() => {
    setRemovedAnswers([])
  }, [questionData.id])

  const handleFiftyFifty = (questionData: TriviaQuestion) => {
    const shuffledIncorrect = shuffleArray(questionData.incorrect_answers)
    const removed = shuffledIncorrect.slice(0, 2)
    setRemovedAnswers(removed)
  }

  return {
    removedAnswers,
    firstAnswerRef,
    nextButtonRef,
    handleFiftyFifty,
    setRemovedAnswers
  }
}