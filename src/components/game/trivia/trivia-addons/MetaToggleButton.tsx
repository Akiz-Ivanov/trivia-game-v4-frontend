import { cn } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react";
import { useMediaQuery } from "@/hooks/useMediaQuery";

type MetaToggleButtonProps = {
  isMetaVisible: boolean;
  toggleMeta: () => void;
};

export const MetaToggleButton = ({
  isMetaVisible,
  toggleMeta,
}: MetaToggleButtonProps) => {
  const isXs = useMediaQuery("(min-width: 480px)");

  return (
    <div className="absolute top-2 right-10 xs:top-2.5 xs:right-2">
      <button
        type="button"
        onClick={toggleMeta}
        className={cn(
          "rounded-full bg-popover text-accent/50",
          "transition-all duration-400 focus:outline-none focus:ring-2 focus:ring-ring/50",
          "opacity-50 hover:opacity-100 hover:outline-1 hover:outline-ring",
          "flex items-center justify-center overflow-hidden",
          "focus:opacity-100 xs:focus-within:w-30",
          "size-8 xs:hover:w-30 group relative",
        )}
        aria-label={
          isMetaVisible ? "Hide game information" : "Show game information"
        }
      >
        {isXs && (
          <span
            className={cn(
              "whitespace-nowrap text-sm font-medium",
              "transition-all duration-200",
              "opacity-0 max-w-0 group-hover:opacity-100 group-hover:max-w-20",
              "group-focus:opacity-100 group-focus:max-w-20",
              "ml-2 mr-6",
            )}
          >
            {isMetaVisible ? "Hide Info" : "Show Info"}
          </span>
        )}

        <span className="absolute xs:right-1.5 shrink-0">
          {isMetaVisible ? (
            <EyeOff className="size-6 xs:size-5" />
          ) : (
            <Eye className="size-6 xs:size-5" />
          )}
        </span>
      </button>
    </div>
  );
};
