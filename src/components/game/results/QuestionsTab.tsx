import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useSettingsStore } from "@/store/settingsStore";
import { useGameStats } from "@/hooks/useGameStats";

const QuestionsTab = () => {
  const isTimerMode = useSettingsStore((state) => state.timer);
  const { questionResults } = useGameStats();

  return (
    <section
      className="bg-card/30 rounded-xl border border-border overflow-hidden"
      aria-labelledby="questions-heading"
    >
      <h3 className="sr-only" id="questions-heading">
        Question by Question Breakdown
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 border-b border-border">
            <tr className="text-muted-foreground">
              <th scope="col" className="p-3 text-left font-semibold">
                Q#
              </th>
              <th scope="col" className="p-3 text-left font-semibold">
                Difficulty
              </th>
              <th scope="col" className="p-3 text-center font-semibold">
                Result
              </th>
              <th scope="col" className="p-3 text-right font-semibold">
                Streak
              </th>
              <th scope="col" className="p-3 text-right font-semibold">
                Points
              </th>
              {isTimerMode && (
                <th scope="col" className="p-3 text-right font-semibold">
                  Time
                </th>
              )}
            </tr>
          </thead>
          <tbody className="text-foreground">
            {questionResults.map((q, index) => (
              <motion.tr
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors"
              >
                <th scope="row" className="p-3 font-medium">
                  {index + 1}
                </th>
                <td className="p-3">
                  <span
                    className={cn(
                      "inline-block px-2 py-1 rounded-md text-xs font-semibold capitalize",
                      q.difficulty === "easy" &&
                        "bg-green-500/20 text-green-400",
                      q.difficulty === "medium" &&
                        "bg-yellow-500/20 text-yellow-400",
                      q.difficulty === "hard" && "bg-red-500/20 text-red-400",
                    )}
                  >
                    {q.difficulty}
                  </span>
                </td>
                <td className="p-3 text-center text-lg">
                  {q.correct ? (
                    <span className="text-green-400" aria-label="Correct">
                      ✓
                    </span>
                  ) : (
                    <span className="text-red-400" aria-label="Incorrect">
                      ✗
                    </span>
                  )}
                </td>
                <td className="p-3 text-right font-mono">
                  {q.streak > 0 && (
                    <span className="text-orange-400">{q.streak}🔥</span>
                  )}
                </td>
                <td className="p-3 text-right font-mono font-semibold">
                  {q.scoreBreakdown.totalScore > 0
                    ? `+${q.scoreBreakdown.totalScore}`
                    : "0"}
                </td>
                {isTimerMode && (
                  <td className="p-3 text-right font-mono text-muted-foreground">
                    {q.timeTaken.toFixed(1)}s
                  </td>
                )}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default QuestionsTab;
