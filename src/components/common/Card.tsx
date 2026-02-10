import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import type { HTMLMotionProps } from "framer-motion";
import { forwardRef } from "react";
import { useSettingsStore } from "@/store/settingsStore";

type BaseProps = {
  children: React.ReactNode;
  asMotion?: boolean;
  bgUrl?: string;
  refProp?: React.Ref<HTMLDivElement>;
};

type DivProps = React.HTMLAttributes<HTMLDivElement>; // Regular DIV props
type MotionDivProps = HTMLMotionProps<"div">; // Motion DIV props

type CardProps = BaseProps & DivProps & MotionDivProps;

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ children, asMotion, className, style, ...props }, ref) => {
    const Comp = asMotion ? motion.div : "div";

    const theme = useSettingsStore((state) => state.theme);
    const illustrations = useSettingsStore((state) => state.illustrations);

    const isHallowen = theme === "halloween";

    const backgroundImage = illustrations ? style?.backgroundImage : "none";

    const styles = {
      ...style,
      backgroundImage: backgroundImage,
    };

    return (
      <Comp
        ref={ref}
        style={styles}
        className={cn(
          "flex flex-col items-center text-center w-full min-h-screen xs:min-h-0",
          "bg-card bg-no-repeat bg-[position:center_top]",
          "xs:shadow-[0_8px_32px_rgba(0,0,0,0.2)]",
          "xs:backdrop-blur-[5px]",
          "border border-transparent xs:border-white/20",
          "xs:rounded-2xl ring-5 ring-white/3",
          "p-16-24 gap-4 xs:shadow-card",
          "px-16-64 py-8 md:p-24-36 lg:p-9 contrast-110",
          isHallowen && "contrast-115",
          className,
        )}
        {...props}
      >
        {children}
      </Comp>
    );
  },
);

export default Card;
