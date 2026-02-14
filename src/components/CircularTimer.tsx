// components/CircularTimer.tsx
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useMemo } from "react";

type CircularTimerProps = {
  timeLeft: number;
  totalTime: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
};

export const CircularTimer = ({
  timeLeft,
  totalTime,
  size = 80,
  strokeWidth = 6,
  className,
}: CircularTimerProps) => {
  const { radius, circumference, progress } = useMemo(() => {
    const radius = (size - strokeWidth) / 2 - 1;
    const circumference = radius * 2 * Math.PI;
    const progress = (timeLeft / totalTime) * circumference;
    return { radius, circumference, progress };
  }, [size, strokeWidth, timeLeft, totalTime]);

  // Color based on time remaining
  const getColor = () => {
    if (timeLeft <= 5) return "#ef4444"; // red
    if (timeLeft <= 10) return "#f97316"; // orange
    return "#06b6d4"; // cyan
  };

  return (
    <div
      className={cn(
        "relative inline-flex items-center justify-center",
        className,
      )}
    >
      <svg width={size} height={size} className="transform -rotate-90">
        <defs>
          {/* Outer ring lighting (main bevel / plastic effect) */}
          <linearGradient
            id="outerRingShade"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="white" stopOpacity="0.6" />{" "}
            {/* top-left highlight */}
            <stop offset="40%" stopColor="#e5e7eb" stopOpacity="0.3" />{" "}
            {/* soft transition */}
            <stop offset="100%" stopColor="#111827" stopOpacity="0.4" />{" "}
            {/* bottom-right shadow */}
          </linearGradient>

          {/* Subtle highlight across the middle */}
          <radialGradient id="glare" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="white" stopOpacity="0.3" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </defs>

        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#outerRingShade)"
          strokeWidth={strokeWidth + 1}
          fill="none"
        />

        {/* Inner glare overlay */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#glare)"
          strokeWidth={strokeWidth}
          fill="none"
        />

        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={getColor()}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{
            strokeDashoffset: circumference - progress,
            stroke: getColor(),
          }}
          transition={{ duration: 1, ease: "linear" }}
          style={{
            mixBlendMode: "overlay",
          }}
        />
      </svg>

      {/* Time display */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          key={timeLeft}
          className={cn(
            "text-2xl font-bold text-accent",
            timeLeft <= 10 && "text-orange-400",
            timeLeft <= 5 && "text-error-foreground",
          )}
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          {timeLeft}
        </motion.span>
      </div>
    </div>
  );
};
