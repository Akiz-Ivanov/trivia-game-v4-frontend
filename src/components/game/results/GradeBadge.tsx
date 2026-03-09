import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const GradeBadge = ({ grade }: { grade: string }) => {
  const gradients = {
    S: "from-yellow-400 to-yellow-600",
    A: "from-green-400 to-green-600",
    B: "from-blue-400 to-blue-600",
    C: "from-purple-400 to-purple-600",
    D: "from-orange-400 to-orange-600",
    F: "from-red-400 to-red-600",
  };

  const stars = { S: 5, A: 5, B: 4, C: 3, D: 2, F: 1 }[grade] || 1;

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
      className={cn(
        "bg-linear-to-br p-6 rounded-2xl shadow-2xl text-center",
        gradients[grade as keyof typeof gradients] || gradients.F,
      )}
      role="img"
      aria-label={`Grade ${grade}, ${stars} star${stars !== 1 ? "s" : ""}`}
    >
      <div className="text-white text-5xl font-black mb-2" aria-hidden="true">
        {grade}
      </div>
      <div className="text-yellow-200 text-2xl" aria-hidden="true">
        {"⭐".repeat(stars)}
      </div>
    </motion.div>
  );
};

export default GradeBadge;
