import { cn } from "@/lib/utils";
import { forwardRef } from "react";

type UtilityButtonProps = {
  isPressed?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const UtilityButton = forwardRef<HTMLButtonElement, UtilityButtonProps>(
  function UtilityButton({ children, isPressed, className, ...props }, ref) {
    return (
      <button
        ref={ref}
        type="button"
        aria-pressed={isPressed ? true : undefined}
        className={cn(
          "outline-1 outline-radio-glow rounded-none px-1.5 h-5.5 text-sm bg-transparent radio-utility-btn",
          "inline-flex items-center justify-center text-radio-glow radio-utility-btn",
          // Add focus styles
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-radio-glow",
          "focus-visible:bg-radio-glow/10",
          className,
        )}
        {...props}
      >
        {children}
      </button>
    );
  },
);

export default UtilityButton;
