import { randomTitle } from "@/data/data";
import SelectGroup from "./SelectGroup";
import Card from "@/components/common/Card";
import newYear from "@/assets/svgs/new-year.svg";
import cherryBlossom from "@/assets/svgs/cherry-blossom.svg";
import halloweenGate from "@/assets/svgs/halloween/halloween-gate.svg";

import type { GameFormProps } from "../../types/game-form.types";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import ToggleSwitch from "../common/ToggleSwitch";
import { useSettingsStore } from "@/store/settingsStore";

const GameForm = ({
  onSubmit,
  onChange,
  formData,
}: GameFormProps): React.JSX.Element => {
  const illustrations = useSettingsStore((state) => state.illustrations);
  const theme = useSettingsStore((state) => state.theme);
  const timer = useSettingsStore((state) => state.timer);
  const backgroundGlow = useSettingsStore((state) => state.backgroundGlow);

  const toggleTimer = useSettingsStore((state) => state.toggleTimer);

  const isHalloween = theme === "halloween";

  return (
    <div className="relative overflow-hidden xs:overflow-visible xs:rounded-xl">
      {/* ====== Side Glow ====== */}
      {backgroundGlow && (
        <>
          <div
            className="absolute inset-0 translate-x-[-100%]
                        bg-[radial-gradient(circle_at_150%_50%,rgba(0,195,255,0.4),transparent_45%)]"
          />

          <div
            className="absolute inset-0 translate-x-full
                        bg-[radial-gradient(circle_at_-50%_50%,rgba(214,0,186,0.6),transparent_45%)]"
          />
        </>
      )}

      {/* ====== Form ====== */}
      <Card
        tabIndex={-1}
        className={cn(
          "relative gap-12 text-left overflow-hidden",
          isHalloween && illustrations
            ? "before:absolute before:content-[''] before:inset-0 before:bg-[url('/src/assets/svgs/halloween/evil-ghosts.svg')] before:bg-no-repeat before:opacity-35 before:-z-10 before:bg-[rgba(22,110,97,0.25)]"
            : "bg-[url('/src/assets/svgs/balloons.svg')] bg-[rgba(100,150,255,0.07)]",
        )}
      >
        {isHalloween && (
          <div
            className={`absolute inset-0.5 xs:rounded-[inherit] bg-transparent -z-50
                        bg-[url('/src/assets/svgs/halloween/cyan-texture.webp')] bg-no-repeat bg-cover brightness-35`}
          />
        )}

        {isHalloween && illustrations && (
          <img
            src={halloweenGate}
            alt=""
            className="absolute -bottom-5 left-0 w-full opacity-15 pointer-events-none xs:hidden"
          />
        )}

        <form
          onSubmit={onSubmit}
          className="flex flex-col justify-center gap-3 xs:gap-4 px-4 py-4 xs:py-8 rounded-[.5rem] w-full"
        >
          <h1>{randomTitle}</h1>

          {/* ====== Select Elements ====== */}
          <SelectGroup
            onChange={onChange}
            formData={formData}
            isHalloween={isHalloween}
          />

          <div className="flex flex-row mx-2">
            {/* ====== Timer Toggle ====== */}
            <ToggleSwitch
              id="timer-toggle"
              label="Timer"
              checked={timer}
              onChange={toggleTimer}
            />
          </div>

          {/* ====== Submit & Start Game ====== */}
          <div className="flex flex-row justify-center relative">
            <Button
              type="submit"
              className={cn(
                "animate-flicker hover:animate-none focus:animate-none",
                "w-50 cursor-pointer px-4 py-2.5 mx-auto mt-2 z-999",
                "rounded-full font-semibold border-[3.5px] border-white",
                " transition-all duration-400 ease-in-out will-change-transform",
                " text-18-22 outline-none hover:scale-[1.05]",
                " hover:shadow-[0_0_20px_rgba(0,255,255,0.5),0_0_40px_rgba(255,102,196,0.4)]",
                "focus:ring-offset-1 focus:ring-offset-background",
                "focus-visible:ring-ring focus:border-white focus-visible:border-white",
                "relative group animate-angle",
                "bg-[radial-gradient(ellipse_at_bottom,rgba(255,180,60,0.7)_0%,rgba(255,90,0,0.3)_45%,rgba(10,5,0,0.05)_95%)]",
                isHalloween && "halloween-form-submit",
              )}
            >
              Start Game
            </Button>

            {illustrations && !isHalloween && (
              <img
                src={newYear}
                alt=""
                className="absolute top-[-40%] left-0 w-40 opacity-70 hover:opacity-100 hover:brightness-125
                            transition-opacity duration-500 z-1"
              />
            )}

            {illustrations && !isHalloween && (
              <img
                src={cherryBlossom}
                alt=""
                fetchPriority="high"
                className="absolute top-[-60%] right-0 w-40 opacity-30 hover:opacity-100
                            transition-opacity duration-500 z-1"
              />
            )}
          </div>
        </form>
      </Card>
    </div>
  );
};

export default GameForm;
