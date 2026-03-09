import { motion } from "framer-motion";
import { Target, Zap, Flame } from "lucide-react";
import ProgressBar from "@/components/common/ProgressBar";
import type { DetailedGameStats } from "@/utils/calculateGameStats";
import GradeBadge from "./GradeBadge";
import StatCard from "./StatCard";
import DifficultyBar from "./DifficultyBar";
import { AnimatedNumber } from "./AnimatedNumber";

type SummaryTabProps = {
  detailedStats: DetailedGameStats;
  animations: boolean;
};

const SummaryTab = ({ detailedStats, animations }: SummaryTabProps) => {
  return (
    <div className="space-y-6">
      {/* Grade Badge */}
      <header className="flex justify-center">
        <GradeBadge grade={detailedStats.grade} />
      </header>

      {/* Main Score */}
      <motion.section
        initial={animations ? { scale: 0.8, opacity: 0 } : false}
        animate={animations ? { scale: 1, opacity: 1 } : false}
        transition={animations ? { delay: 0.2, duration: 0.5 } : undefined}
        className="relative overflow-hidden bg-gradient-to-br from-primary/20 to-accent/20 p-8 rounded-xl border-2 border-primary/30 shadow-[0_0_30px_rgba(0,195,255,0.2)]"
        aria-labelledby="total-score-heading"
      >
        {/* Glow effect background */}
        <div
          className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 blur-xl"
          aria-hidden="true"
        />

        <div className="relative text-center">
          <div className="text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 mb-3 tabular-nums">
            <AnimatedNumber value={detailedStats.totalScore} />
          </div>
          <h2
            id="total-score-heading"
            className="text-muted-foreground text-sm font-semibold tracking-wider uppercase"
          >
            Total Score
          </h2>
        </div>
      </motion.section>

      {/* Progress Section */}
      <section className="space-y-2" aria-labelledby="accuracy-heading">
        <h3 className="sr-only" id="accuracy-heading">
          Accuracy Progress
        </h3>
        <ProgressBar value={detailedStats.percentage} />
        <p className="text-center text-foreground">
          {detailedStats.correctCount}/{detailedStats.totalQuestions} Correct •
          Max Streak: {detailedStats.maxStreak}🔥
        </p>
      </section>

      {/* Stat Cards */}
      <section
        className="grid grid-cols-3 gap-4"
        aria-labelledby="score-breakdown-heading"
      >
        <h3 className="sr-only" id="score-breakdown-heading">
          Score Component Breakdown
        </h3>
        <StatCard
          icon={Target}
          label="Base"
          value={detailedStats.basePointsTotal}
          color="text-blue-400"
          delay={0}
        />
        <StatCard
          icon={Zap}
          label="Speed"
          value={detailedStats.speedBonusTotal}
          color="text-yellow-400"
          delay={0.1}
        />
        <StatCard
          icon={Flame}
          label="Combo"
          value={detailedStats.comboBonusTotal}
          color="text-orange-400"
          delay={0.2}
        />
      </section>

      {/* Difficulty Breakdown */}
      <section
        className="bg-card/30 p-4 rounded-xl border border-border"
        aria-labelledby="difficulty-heading"
      >
        <h3
          id="difficulty-heading"
          className="text-foreground font-semibold mb-3"
        >
          Difficulty Breakdown
        </h3>
        <DifficultyBar
          difficulty="easy"
          correct={detailedStats.difficultyStats.easy.correct}
          total={detailedStats.difficultyStats.easy.total}
          delay={0}
        />
        <DifficultyBar
          difficulty="medium"
          correct={detailedStats.difficultyStats.medium.correct}
          total={detailedStats.difficultyStats.medium.total}
          delay={0.1}
        />
        <DifficultyBar
          difficulty="hard"
          correct={detailedStats.difficultyStats.hard.correct}
          total={detailedStats.difficultyStats.hard.total}
          delay={0.2}
        />
      </section>
    </div>
  );
};

export default SummaryTab;
