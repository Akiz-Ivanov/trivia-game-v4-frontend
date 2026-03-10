import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type DifficultyBarProps = {
  difficulty: string;
  correct: number;
  total: number;
  delay?: number;
};

const DifficultyBar = ({
  difficulty,
  correct,
  total,
  delay = 0,
}: DifficultyBarProps) => {
  const percentage = total > 0 ? (correct / total) * 100 : 0;

  const gradients = {
    easy: "bg-gradient-to-r from-green-400 to-green-600",
    medium: "bg-gradient-to-r from-blue-400 to-blue-600",
    hard: "bg-gradient-to-r from-red-400 to-red-600",
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      className="mb-3 last:mb-0"
      role="group"
      aria-label={`${difficulty} difficulty: ${correct} out of ${total} correct`}
    >
      <div className="flex justify-between text-sm mb-1.5">
        <span className="text-foreground capitalize font-medium">
          {difficulty}
        </span>
        <span className="text-muted-foreground">
          {correct}/{total} · {Math.round(percentage)}%
        </span>
      </div>
      <div
        className="h-2.5 bg-muted rounded-full overflow-hidden"
        role="progressbar"
        aria-valuenow={percentage}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, delay: delay + 0.2 }}
          className={cn(
            "h-full",
            gradients[difficulty as keyof typeof gradients],
          )}
        />
      </div>
    </motion.div>
  );
};

export default DifficultyBar;
