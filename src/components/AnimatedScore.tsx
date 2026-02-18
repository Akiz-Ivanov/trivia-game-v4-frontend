import {
  motion,
  useSpring,
  useTransform,
  useAnimationControls,
} from "framer-motion";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { Trophy } from "lucide-react";

type AnimatedScoreProps = {
  score: number;
  className?: string;
};

export const AnimatedScore = ({ score, className }: AnimatedScoreProps) => {
  const spring = useSpring(score, { damping: 30, stiffness: 200 });
  const displayScore = useTransform(spring, (val) =>
    Math.round(val).toLocaleString(),
  );

  const prevScore = useRef(score);
  const controls = useAnimationControls();

  useEffect(() => {
    spring.set(score);

    //* Only animate when score increases
    if (score > prevScore.current) {
      controls.start({
        scale: [1, 1.15, 1],
        transition: { duration: 0.4, ease: [0.34, 1.56, 0.64, 1] },
      });
    }

    prevScore.current = score;
  }, [score, spring, controls]);

  return (
    <motion.div
      animate={controls}
      className={cn(
        "rounded-s-none rounded-e-full xs:rounded-full score-time-container",
        "py-1 px-3 xs:py-1.5 xs:px-3.5",
        className,
      )}
    >
      <div className="flex items-center gap-1.5 md:gap-2 min-w-16 justify-between">
        <Trophy className="w-4 h-4 text-yellow-400 md:hidden" />
        <span
          className="text-sm font-semibold hidden md:inline-flex"
          style={{ color: "color-mix(in oklch, var(--accent) 90%, white 10%)" }}
        >
          Score
        </span>
        <motion.span
          className="text-lg md:text-xl font-black tabular-nums"
          style={{
            color: "var(--foreground)",
            textShadow: "0 2px 4px rgba(0,0,0,0.5)",
          }}
        >
          {displayScore}
        </motion.span>
      </div>
    </motion.div>
  );
};
