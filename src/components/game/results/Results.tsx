import { Power, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";
import Card from "@/components/common/Card";
import { Button } from "@/components/ui/button";
import { useGameStats } from "@/hooks/useGameStats";
import { useSettingsStore } from "@/store/settingsStore";
import { calculateDetailedStats } from "@/utils/calculateGameStats";
import ResultsTabs from "./ResultsTabs";

type ResultsProps = {
  resetGame: () => void;
};

const Results = ({ resetGame }: ResultsProps) => {
  const isTimerMode = useSettingsStore((state) => state.timer);
  const stats = useGameStats();
  const gameStats = stats.getGameStats();

  const {
    totalScore,
    correctCount,
    totalQuestions,
    maxStreak,
    questionResults,
  } = gameStats;

  const detailedStats = calculateDetailedStats(
    totalScore,
    correctCount,
    totalQuestions,
    maxStreak,
    questionResults,
    isTimerMode,
  );

  const animations = useSettingsStore((state) => state.animations);
  const backgroundGlow = useSettingsStore((state) => state.backgroundGlow);

  return (
    <Card
      role="region"
      aria-label="Quiz results"
      className={cn(
        "gap-6 px-6 py-6 relative max-w-2xl w-full",
        "shadow-[0_8px_32px_rgba(0,0,0,0.2)]",
        backgroundGlow && "side-glow",
      )}
    >
      {/* Screen reader announcement */}
      <p aria-live="polite" className="sr-only">
        You scored {detailedStats.totalScore} points. You answered{" "}
        {detailedStats.correctCount} out of {detailedStats.totalQuestions}{" "}
        questions correctly. That's {detailedStats.percentage.toFixed(0)}%.
        Grade: {detailedStats.grade}
      </p>

      <ResultsTabs detailedStats={detailedStats} animations={animations} />

      {/* Action Buttons */}
      <nav className="flex gap-4 mt-6" aria-label="Game actions">
        <Button type="button" onClick={resetGame} variant="play-again">
          <Power className="mr-2" size={20} />
          Play Again
        </Button>
        <Button
          type="button"
          variant="outline"
          className="flex-1 font-semibold py-6 text-base"
          onClick={() => console.log("Share results")}
        >
          <Trophy className="mr-2" size={20} />
          Share
        </Button>
      </nav>
    </Card>
  );
};

export default Results;
