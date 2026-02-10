import { useEffect, useRef, useState } from "react"

const TIME_UP_MESSAGES = [
    "Oops! Too Slow!",
    "Time Flew By!",
    "Clock Ran Out!",
    "Tick Tock!",
    "Out of Time!",
    "Time's Up!",
]

export const useQuizTimer = (
  isEnabled: boolean,
  selectedAnswer: string | null,
  questionId: string,
  onTimeout: () => void
) => {
  const [timeLeft, setTimeLeft] = useState(30)
  const [timeUpMessage, setTimeUpMessage] = useState("")
  const timerRef = useRef<HTMLDivElement>(null)
  const totalTime = 30

  // Countdown logic
  useEffect(() => {
    if (!isEnabled || selectedAnswer) return

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 0) {
          clearInterval(timer)
          onTimeout()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isEnabled, selectedAnswer, questionId, onTimeout])

  // Update CSS property
  useEffect(() => {
    if (!isEnabled || !timerRef.current) return

    const angle = (timeLeft / totalTime) * 360
    timerRef.current.style.setProperty('--timer-angle', `${angle}deg`)
  }, [isEnabled, timeLeft])

  // Reset on question change
  useEffect(() => {
    if (!isEnabled) return
    setTimeLeft(totalTime)
  }, [isEnabled, questionId])

  // Random message on timeout
  useEffect(() => {
    if (!isEnabled || timeLeft !== 0) return

    const randomMsg = TIME_UP_MESSAGES[Math.floor(Math.random() * TIME_UP_MESSAGES.length)]
    setTimeUpMessage(randomMsg)
  }, [isEnabled, timeLeft])

  return { timeLeft, timeUpMessage, timerRef, totalTime }
}