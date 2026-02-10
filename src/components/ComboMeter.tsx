import { cn } from "@/lib/utils"

type ComboMeterProps = {
  currentStreak: number
  isHalloween: boolean
}

const COMBO_MULTIPLIERS = ["x1", "x2", "x3"]

const renderSegments = (currentStreak: number, isHalloween: boolean) => {

  const segments = COMBO_MULTIPLIERS.map((label, i) => {
    const isActive = i < currentStreak

    return (
      <div
        key={i}
        className={cn(
          "relative w-1/3 flex items-center justify-center",
          "transition-all duration-500 px-6 text-accent transform-gpu",
          "-skew-x-[12deg]",
          {
            "-inset-x-[1px]": i === 0,
            "inset-x-[1px]": i === 2,
            "text-white": isActive
          }
        )}
      >

        {/* Fill background - animates in */}
        <div
          className={cn(
            "absolute inset-0 transition-all duration-500",
            isActive
              ? "bg-secondary opacity-100 shadow-[inset_0_-6px_4px_rgba(0,0,0,0.25),inset_0_6px_4px_rgba(255,255,255,0.37)]"
              : "opacity-0",
            isActive && isHalloween && "bg-primary"
          )}
        >
        </div>

        {/* Label */}
        <span
          className="font-bold text-16-18 z-10 drop-shadow-[0px_0px_10px_rgba(0,155,255,0.9)]"
        >
          {label}
        </span>

        {/* Dark divider line between segments */}
        {i < 2 && (
          <div className="absolute -right-[1px] inset-y-0 w-[2px] bg-slate-700 z-50" />
        )}
      </div>
    )
  })

  return segments
}

const ComboMeter = ({ currentStreak, isHalloween }: ComboMeterProps) => {
  return (
    <div className={cn("relative inline-flex rounded-full border-2 border-white/30 overflow-hidden h-10",
      currentStreak === 1 && "shadow-[0px_0px_7px_rgba(0,155,255,0.5)]",
      currentStreak === 2 && "shadow-[0px_0px_9px_rgba(0,155,255,0.7)]",
      currentStreak === 3 && "shadow-[0px_0px_10px_rgba(0,155,255,0.9)]",
    )}
    >

      {/* Background */}
      <div className="absolute inset-0 bg-gray-800" />

      {/* Segments */}
      {renderSegments(currentStreak, isHalloween)}
    </div>
  )
}

export default ComboMeter