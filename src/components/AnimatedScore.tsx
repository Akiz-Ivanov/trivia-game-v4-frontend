// components/AnimatedScore.tsx
import { motion, useSpring, useTransform } from "framer-motion"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

type AnimatedScoreProps = {
  score: number
  className?: string
}

export const AnimatedScore = ({ score, className }: AnimatedScoreProps) => {
  const [displayScore, setDisplayScore] = useState(0)

  // Smooth number animation
  const spring = useSpring(displayScore, {
    damping: 30,
    stiffness: 200
  })

  useEffect(() => {
    setDisplayScore(score)
  }, [score])

  return (
    <motion.div
      className={cn(
        "px-6 py-2 rounded-full",
        "bg-gradient-to-r from-purple-500/20 to-pink-500/20",
        "backdrop-blur-md border-2 border-white/20",
        "shadow-lg",
        className
      )}
      animate={{
        scale: displayScore > 0 ? [1, 1.1, 1] : 1
      }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center gap-2">
        <span className="text-sm text-white/70 font-semibold">Score</span>
        <motion.span
          className="text-2xl font-black text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]"
        >
          {Math.round(spring.get()).toLocaleString()}
        </motion.span>
      </div>
    </motion.div>
  )
}