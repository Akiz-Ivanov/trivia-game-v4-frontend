import { useSettingsStore } from "@/store/settingsStore";
import type { DetailedGameStats } from "@/utils/calculateGameStats";
import StatRow from "./StatRow";
import MetricCard from "./MetricCard";

type StatsTabProps = {
  detailedStats: DetailedGameStats;
};

const StatsTab = ({ detailedStats }: StatsTabProps) => {
  const isTimerMode = useSettingsStore((state) => state.timer);

  return (
    <div className="space-y-6">
      {/* Performance Overview */}
      <section
        className="bg-card/30 p-6 rounded-xl border border-border"
        aria-labelledby="performance-heading"
      >
        <h3
          id="performance-heading"
          className="text-foreground font-semibold mb-4 text-lg"
        >
          Performance Overview
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <MetricCard
            value={`${detailedStats.percentage.toFixed(1)}%`}
            label="Accuracy"
          />
          <MetricCard value={detailedStats.rank} label="Rank" />
          <MetricCard value={detailedStats.maxStreak} label="Max Streak" />
          <MetricCard
            value={detailedStats.perfectStreak ? "Yes" : "No"}
            label="Perfect Streak"
          />
        </div>
      </section>

      {/* Score Breakdown */}
      <section
        className="bg-card/30 p-6 rounded-xl border border-border"
        aria-labelledby="score-breakdown-heading"
      >
        <h3
          id="score-breakdown-heading"
          className="text-foreground font-semibold mb-4 text-lg"
        >
          Score Breakdown
        </h3>
        <dl className="space-y-3">
          <StatRow label="Base Points" value={detailedStats.basePointsTotal} />
          <StatRow
            label="Speed Bonus"
            value={detailedStats.speedBonusTotal}
            valuePrefix="+"
          />
          <StatRow
            label="Combo Bonus"
            value={detailedStats.comboBonusTotal}
            valuePrefix="+"
          />
          <div className="h-px bg-border my-2" role="separator" />
          <StatRow label="Total Score" value={detailedStats.totalScore} bold />
        </dl>
      </section>

      {/* Timer Stats (if timer enabled) */}
      {isTimerMode && (
        <section
          className="bg-card/30 p-6 rounded-xl border border-border"
          aria-labelledby="time-analysis-heading"
        >
          <h3
            id="time-analysis-heading"
            className="text-foreground font-semibold mb-4 text-lg"
          >
            Time Analysis
          </h3>
          <dl className="space-y-3">
            <StatRow
              label="Total Time"
              value={`${(detailedStats.totalTimeTaken ?? 0).toFixed(1)}s`}
            />
            <StatRow
              label="Avg per Question"
              value={`${(detailedStats.avgTimePerQuestion ?? 0).toFixed(1)}s`}
            />
            <StatRow
              label="Fastest Answer"
              value={`${(detailedStats.fastestAnswer ?? 0).toFixed(1)}s`}
            />
          </dl>
        </section>
      )}
    </div>
  );
};

export default StatsTab;
