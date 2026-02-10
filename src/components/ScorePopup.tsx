import { motion, AnimatePresence } from "framer-motion";
import { Zap } from "lucide-react";

type ScorePopupProps = {
  points: number;
  multiplier: number;
  show: boolean;
};

export const ScorePopup = ({ points, multiplier, show }: ScorePopupProps) => {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="absolute bottom-16 left-1/2 -translate-x-1/2 z-30 pointer-events-none"
          initial={{ opacity: 0, y: 10, scale: 0.8 }}
          animate={{
            opacity: [0, 1, 1, 0],
            y: [10, -20, -30, -50],
            scale: [0.8, 1.2, 1, 0.9],
          }}
          transition={{
            duration: 1.5,
            times: [0, 0.2, 0.7, 1],
            ease: "easeOut",
          }}
        >
          <div className="px-4 py-2 rounded-full bg-linear-to-b from-[#B916BC] to-[#F8282C] backdrop-blur-md outline border-white/30">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-300 fill-yellow-300" />
              <span className="text-xl font-black text-white">
                +{points.toLocaleString()}
              </span>
              {multiplier > 1 && (
                <span className="text-xs text-yellow-200">x{multiplier}</span>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
