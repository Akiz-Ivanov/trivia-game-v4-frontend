import { motion, useSpring, useTransform } from "framer-motion";
import { useEffect } from "react";
import { useSettingsStore } from "@/store/settingsStore";

type AnimatedNumberProps = {
  value: number;
  className?: string;
};

export const AnimatedNumber = ({ value, className }: AnimatedNumberProps) => {
  const animations = useSettingsStore((state) => state.animations);
  const spring = useSpring(value, { damping: 30, stiffness: 200 });
  const display = useTransform(spring, (val) =>
    Math.round(val).toLocaleString(),
  );

  useEffect(() => {
    if (animations) {
      spring.set(value);
    } else {
      spring.jump(value);
    }
  }, [value, spring, animations]);

  return (
    <motion.span className={className}>
      {animations ? display : value.toLocaleString()}
    </motion.span>
  );
};
