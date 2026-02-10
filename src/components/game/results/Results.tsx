import { useState } from "react";
import { Power } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import Card from "@/components/common/Card";
import Attributions from "./Attributions";

import success from "@/assets/svgs/breaking-barriers-bro.svg";
import { Button } from "@/components/ui/button";
import { useSettingsStore } from "@/store/settingsStore";
// import okay from "@/assets/svgs/andalusian-fair.svg"

type ResultsProps = {
  correctCount: number;
  numOfQuestions: number;
  resetGame: () => void;
};

const Results = ({
  correctCount,
  numOfQuestions,
  resetGame,
}: ResultsProps): React.JSX.Element => {
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);

  const correctPercentage: number = (correctCount / numOfQuestions) * 100;

  const backgroundGlow = useSettingsStore((state) => state.backgroundGlow);
  const illustrations = useSettingsStore((state) => state.illustrations);
  const animations = useSettingsStore((state) => state.animations);

  const message: string =
    correctPercentage < 33
      ? "Better luck next time!"
      : correctPercentage < 66
        ? "Pretty good!"
        : "Great job!";

  const messageStyle: string =
    correctPercentage < 33
      ? "#ff7043"
      : correctPercentage < 66
        ? "#9fffb8"
        : "#81c784";

  return (
    <Card
      role="region"
      aria-label="Quiz results"
      className={cn(
        "gap-3 px-8 py-4 relative",
        "shadow-[0_8px_32px_rgba(0,0,0,0.2)]",
        "text-[1.2rem] max-w-[30rem]",
        backgroundGlow && "side-glow",
      )}
    >
      <p aria-live="polite" className="sr-only">
        You answered {correctCount} out of {numOfQuestions} questions correctly.
        That's {correctPercentage.toFixed(0)}%. {message}
      </p>
      {illustrations && (
        <div className="img-wrapper min-w-[min(18.75rem,80vw)] min-h-[min(18.75rem,80vw)] relative">
          {!imageLoaded && <Skeleton className="h-full w-full absolute " />}
          <img
            src={success}
            alt="Success"
            onLoad={() => setImageLoaded(true)}
            className={cn(
              "max-w-[18.75rem] object-contain transform will-change-transform transition-all duration-800 ease-out",
              {
                "opacity-100 translate-y-0": imageLoaded && animations,
                "opacity-0 translate-y-5": !imageLoaded && animations,
                "opacity-100 translate-y-0 transition-none": !animations,
              },
            )}
          />
        </div>
      )}
      <h2>
        Correct answers: {correctCount} out of {numOfQuestions}.
      </h2>
      <p>Percentage: {correctPercentage.toFixed(2)}%</p>
      <p style={{ color: messageStyle }}>{message}</p>
      <Button type="button" onClick={resetGame} variant="play-again">
        Play Again <Power className="icon" size={20} strokeWidth={2} />
      </Button>

      <Attributions />
    </Card>
  );
};

export default Results;
