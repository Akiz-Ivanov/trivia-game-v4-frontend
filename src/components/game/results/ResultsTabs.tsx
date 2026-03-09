import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import type { DetailedGameStats } from "@/utils/calculateGameStats";
import SummaryTab from "./SummaryTab";
import StatsTab from "./StatsTab";
import QuestionsTab from "./QuestionsTab";

type ResultsTabsProps = {
  detailedStats: DetailedGameStats;
  animations: boolean;
};

const ResultsTabs = ({ detailedStats, animations }: ResultsTabsProps) => {
  return (
    <Tabs defaultValue="summary" className="w-full">
      <TabsList
        className="grid w-full grid-cols-3 mb-4 bg-gradient-to-r
from-primary
to-accent"
      >
        <TabsTrigger
          value="summary"
          className="data-[state=active]:bg-popover/70 data-[state=active]:text-white font-semibold"
        >
          Summary
        </TabsTrigger>
        <TabsTrigger
          value="stats"
          className="data-[state=active]:bg-popover/70 data-[state=active]:text-white font-semibold"
        >
          Stats
        </TabsTrigger>
        <TabsTrigger
          value="questions"
          className="data-[state=active]:bg-popover/70 data-[state=active]:text-white font-semibold"
        >
          Questions
        </TabsTrigger>
      </TabsList>

      <TabsContent value="summary" className="mt-0">
        <SummaryTab detailedStats={detailedStats} animations={animations} />
      </TabsContent>

      <TabsContent value="stats" className="mt-0">
        <StatsTab detailedStats={detailedStats} />
      </TabsContent>

      <TabsContent value="questions" className="mt-0">
        <QuestionsTab />
      </TabsContent>
    </Tabs>
  );
};

export default ResultsTabs;
