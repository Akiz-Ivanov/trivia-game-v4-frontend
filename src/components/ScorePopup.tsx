import { motion, AnimatePresence } from "framer-motion";
import { Zap, TrendingUp } from "lucide-react";

type ScorePopupProps = {
  points: number;
  multiplier: number;
  show: boolean;
};

export const ScorePopup = ({ points, multiplier, show }: ScorePopupProps) => {
  const particles = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    angle: (i * 360) / 8,
  }));

  const intensity = multiplier === 3 ? 1.4 : multiplier === 2 ? 1.2 : 1;

  return (
    <AnimatePresence>
      {show && (
        <div className="fixed top-34 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
          <motion.div
            className="relative"
            initial={{ opacity: 0, scale: 0.3, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -60 }}
            transition={{
              duration: 0.6,
              ease: [0.34, 1.56, 0.64, 1],
            }}
          >
            {/* Particles - same */}
            {particles.map((particle) => (
              <motion.div
                key={particle.id}
                className="absolute top-1/2 left-1/2 w-1.5 h-1.5 rounded-full -translate-x-1/2 -translate-y-1/2"
                style={{
                  background: `linear-gradient(135deg, var(--primary), var(--accent))`,
                }}
                initial={{ scale: 0, opacity: 1 }}
                animate={{
                  x:
                    Math.cos((particle.angle * Math.PI) / 180) * 50 * intensity,
                  y:
                    Math.sin((particle.angle * Math.PI) / 180) * 50 * intensity,
                  scale: [0, 1.5, 0],
                  opacity: [1, 1, 0],
                }}
                transition={{
                  duration: 0.8,
                  ease: "easeOut",
                }}
              />
            ))}

            {/* Glow pulse - same */}
            <motion.div
              className="absolute inset-0 rounded-full blur-2xl -z-10"
              style={{
                background: `radial-gradient(circle, var(--accent), transparent)`,
              }}
              animate={{
                scale: [1, 1.5 * intensity, 1],
                opacity: [0.4, 0.8, 0.4],
              }}
              transition={{
                duration: 0.6,
                times: [0, 0.5, 1],
              }}
            />

            {/* Score container - LESS TRANSPARENT */}
            <motion.div
              className="rounded-full backdrop-blur-lg border-2 relative"
              style={{
                // Darker base layer for more opacity
                background: `
                  linear-gradient(135deg, 
                    color-mix(in oklch, var(--background) 85%, transparent),
                    color-mix(in oklch, var(--background) 80%, transparent)
                  )
                `,
                borderColor: `color-mix(in oklch, var(--accent) 70%, white 15%)`,
                padding: `${0.5 * intensity}rem ${1 * intensity}rem`,
                boxShadow: `
                  0 0 ${20 * intensity}px color-mix(in oklch, var(--accent) 50%, transparent),
                  inset 0 1px 0 rgba(255,255,255,0.3),
                  0 4px 12px rgba(0,0,0,0.4)
                `,
              }}
              animate={{ rotate: [0, -3, 3, 0] }}
              transition={{ duration: 0.5, times: [0, 0.3, 0.6, 1] }}
            >
              {/* Color overlay on top for the gradient effect */}
              <div
                className="absolute inset-0 rounded-full -z-10 opacity-60"
                style={{
                  background: `linear-gradient(135deg, 
                    var(--primary), 
                    var(--accent))`,
                }}
              />

              <div className="flex items-center gap-2 relative z-10">
                <motion.div
                  animate={{
                    rotate: multiplier > 1 ? 360 : 0,
                    scale: [1, 1.3, 1],
                  }}
                  transition={{
                    rotate: { duration: 0.6 },
                    scale: { duration: 0.4, times: [0, 0.5, 1] },
                  }}
                >
                  {multiplier > 1 ? (
                    <TrendingUp
                      className="w-5 h-5 text-yellow-300"
                      strokeWidth={3}
                    />
                  ) : (
                    <Zap className="w-5 h-5 text-yellow-300 fill-yellow-300" />
                  )}
                </motion.div>

                <motion.span
                  className="font-black text-white tabular-nums"
                  style={{
                    fontSize: `${1.5 * intensity}rem`,
                    textShadow: `0 2px 8px rgba(0,0,0,0.8), 0 0 20px var(--accent)`,
                  }}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{
                    delay: 0.1,
                    duration: 0.3,
                    ease: [0.34, 1.56, 0.64, 1],
                  }}
                >
                  +{points.toLocaleString()}
                </motion.span>

                {multiplier > 1 && (
                  <motion.div
                    className="px-2 py-0.5 rounded-full font-black text-white text-sm"
                    style={{
                      background: `linear-gradient(135deg, 
                        rgba(234, 179, 8, 0.95), 
                        rgba(245, 158, 11, 0.95))`,
                      boxShadow: `0 0 15px rgba(234, 179, 8, 0.7)`,
                    }}
                    initial={{ scale: 0, x: -10, opacity: 0 }}
                    animate={{ scale: 1, x: 0, opacity: 1 }}
                    transition={{
                      delay: 0.25,
                      duration: 0.4,
                      ease: [0.34, 1.56, 0.64, 1],
                    }}
                  >
                    x{multiplier}
                  </motion.div>
                )}
              </div>
            </motion.div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
