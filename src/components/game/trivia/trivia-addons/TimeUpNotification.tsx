import { AnimatePresence, motion } from "framer-motion";
import { Timer } from "lucide-react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useSettingsStore } from "@/store/settingsStore";

type TimeUpNotificationProps = {
  timeLeft: number;
  timeUpMessage: string;
  isTimerEnabled: boolean;
};

export const TimeUpNotification = ({
  timeLeft,
  timeUpMessage,
  isTimerEnabled,
}: TimeUpNotificationProps) => {
  const isXs = useMediaQuery("(min-width: 480px)");
  const animations = useSettingsStore((state) => state.animations);

  if (!isXs || !animations || !isTimerEnabled || timeLeft !== 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        role="alert"
        aria-atomic="true"
        className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 flex justify-center items-center"
        initial={{ opacity: 0, scale: 0.5, y: -20 }}
        animate={{
          opacity: 1,
          scale: 1,
          y: 0,
          transition: {
            delay: 1.5,
            duration: 0.4,
            ease: [0.34, 1.56, 0.64, 1],
          },
        }}
        exit={{
          opacity: 0,
          scale: 0.8,
          transition: { duration: 0.2 },
        }}
      >
        <div className="whitespace-nowrap border-2 border-error-foreground rounded-full py-1.5 px-4 bg-popover text-error-foreground font-bold inline-flex justify-center items-center gap-1.5 shadow-lg ring-2 ring-accent ring-offset-2 ring-offset-background">
          <Timer size={20} />
          <span>{timeUpMessage}</span>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
