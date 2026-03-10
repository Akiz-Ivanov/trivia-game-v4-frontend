import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useSettingsStore } from "@/store/settingsStore";

type ProgressBarProps = {
  value: number;
  height?: "sm" | "md" | "lg";
  variant?: "default" | "success" | "warning" | "error" | "spectrum";
  className?: string;
  animated?: boolean;
  animateOnMount?: boolean;
};

const ProgressBar = ({
  value,
  height = "md",
  variant = "default",
  className,
  animated = true,
  animateOnMount = false,
}: ProgressBarProps) => {
  const animations = useSettingsStore((state) => state.animations);

  const heightClasses = {
    sm: "h-2",
    md: "h-3",
    lg: "h-4",
  };

  const gradients = {
    default: "from-accent to-chart-2",
    success: "from-green-400 to-green-600",
    warning: "from-yellow-400 to-orange-500",
    error: "from-red-400 to-red-600",
    spectrum: "from-red-500 via-yellow-400 to-green-500",
  };

  const BarComponent = animated && animations ? motion.div : "div";

  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(value)}
      aria-label={`Progress: ${Math.round(value)}%`}
      className={cn(
        "w-full bg-muted/50 rounded-full overflow-clip relative",
        heightClasses[height],
        className,
      )}
    >
      <BarComponent
        className="absolute inset-0 overflow-hidden rounded-full"
        style={{ width: `${value}%` }}
        {...(animated && animations
          ? {
              initial: animateOnMount ? { width: 0 } : undefined,
              animate: { width: `${value}%` },
              transition: { duration: 1, ease: "easeOut" },
            }
          : {})}
      >
        <div
          className={cn(
            "h-full bg-linear-to-r",
            heightClasses[height],
            gradients[variant],
          )}
          style={{
            width: value > 0 ? `${100 / (value / 100)}%` : "100%",
          }}
        />
      </BarComponent>
    </div>
  );
};

export default ProgressBar;
