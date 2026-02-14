// components/AnimatedScore.tsx
import { motion, useSpring, useTransform } from "framer-motion";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Trophy } from "lucide-react";

type AnimatedScoreProps = {
  score: number;
  className?: string;
};

export const AnimatedScore = ({ score, className }: AnimatedScoreProps) => {
  const [displayScore, setDisplayScore] = useState(0);

  // Smooth number animation
  const spring = useSpring(displayScore, {
    damping: 30,
    stiffness: 200,
  });

  useEffect(() => {
    setDisplayScore(score);
  }, [score]);

  return (
    <motion.div
      className={cn(
        "px-2 py-1.5 rounded-full",
        "bg-gradient-to-r from-purple-500/20 to-pink-500/20",
        "backdrop-blur-md border-2 border-white/20",
        "shadow-lg scale-80 md:scale-100",
        className,
      )}
      animate={{
        scale: displayScore > 0 ? [1, 1.1, 1] : 1,
      }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center gap-1.5 md:gap-2 min-w-16 justify-between px-2">
        <Trophy className="w-4 h-4 text-yellow-400 md:hidden" />
        <span className="text-sm text-white/70 font-semibold hidden md:inline-flex">
          Score
        </span>
        <motion.span className="text-lg md:text-xl font-black text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
          {Math.round(spring.get()).toLocaleString()}
        </motion.span>
      </div>
    </motion.div>
  );
};
