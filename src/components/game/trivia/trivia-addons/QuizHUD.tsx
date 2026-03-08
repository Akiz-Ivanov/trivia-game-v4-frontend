import { CircularTimer } from "@/components/CircularTimer";
import { AnimatedScore } from "@/components/AnimatedScore";
import ComboMeter from "@/components/ComboMeter";
import { StickyWrapper } from "@/components/StickyWrapper";
import { Clock } from "lucide-react";
import { formatTime } from "@/utils/formatTime";

type QuizHUDProps = {
  totalScore: number;
  currentStreak: number;
  isHalloween: boolean;
  isTimerEnabled: boolean;
  timeLeft: number;
  totalTime: number;
};

export const DesktopHUD = ({
  totalScore,
  currentStreak,
  isHalloween,
  isTimerEnabled,
  timeLeft,
  totalTime,
}: QuizHUDProps) => (
  <div className="hidden xs:flex w-full justify-between items-center relative">
    <AnimatedScore score={totalScore} />

    <div className="absolute left-1/2 -translate-x-1/2">
      <ComboMeter currentStreak={currentStreak} isHalloween={isHalloween} />
    </div>

    {isTimerEnabled && (
      <div>
        <CircularTimer
          timeLeft={timeLeft}
          totalTime={totalTime}
          size={46}
          strokeWidth={4}
        />
      </div>
    )}
  </div>
);

export const MobileHUD = ({
  totalScore,
  currentStreak,
  isHalloween,
  isTimerEnabled,
  timeLeft,
}: Omit<QuizHUDProps, "totalTime">) => (
  <StickyWrapper>
    <div className="flex xs:hidden w-screen justify-between items-center relative">
      <AnimatedScore score={totalScore} />

      <div className="absolute left-1/2 -translate-x-1/2 pointer-events-none">
        <ComboMeter currentStreak={currentStreak} isHalloween={isHalloween} />
      </div>

      {isTimerEnabled && (
        <div className="rounded-s-full rounded-e-none score-time-container py-1 px-3 min-w-16 flex items-center gap-1">
          <span className="font-bold text-lg tabular-nums">
            {formatTime(timeLeft)}
          </span>
          <Clock className="size-4" />
        </div>
      )}
    </div>
  </StickyWrapper>
);
