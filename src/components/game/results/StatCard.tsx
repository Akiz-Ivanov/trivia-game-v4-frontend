import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type StatCardProps = {
  icon: React.ElementType;
  label: string;
  value: number;
  color: string;
  delay?: number;
};

const StatCard = ({
  icon: Icon,
  label,
  value,
  color,
  delay = 0,
}: StatCardProps) => (
  <motion.article
    initial={{ y: 20, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ duration: 0.4, delay }}
    className="bg-card/50 backdrop-blur p-4 rounded-xl border border-border"
  >
    <div
      className={cn("text-3xl mb-2 flex justify-center", color)}
      aria-hidden="true"
    >
      <Icon size={32} />
    </div>
    <div className="text-foreground text-2xl font-bold text-center">
      {value.toLocaleString()}
    </div>
    <div className="text-muted-foreground text-sm text-center mt-1">
      {label}
    </div>
  </motion.article>
);

export default StatCard;
