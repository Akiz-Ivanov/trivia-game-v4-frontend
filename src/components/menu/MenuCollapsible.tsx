import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import { useEffect, useRef, useState } from "react";
import { ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { SparklesCore } from "@/components/ui/sparkles";
import { useSettingsStore } from "@/store/settingsStore";

type MenuCollapsibleProps = {
  label: React.ReactNode;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  onMenuOpened?: () => void;
  triggerClassName?: string;
  contentClassName?: string;
  closeButtonClassName?: string;
  flame?: boolean;
};

const MenuCollapsible = ({
  label,
  children,
  className,
  onMenuOpened,
  triggerClassName,
  contentClassName,
  closeButtonClassName,
  flame,
}: MenuCollapsibleProps) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLDivElement>(null);

  const theme = useSettingsStore((state) => state.theme);
  const animations = useSettingsStore((state) => state.animations);

  const isHalloween = theme === "halloween";

  //* Auto-focus the close button when opening
  useEffect(() => {
    if (open && closeButtonRef.current) {
      closeButtonRef.current.focus();
    }
  }, [open]);

  const [isAnimating, setIsAnimating] = useState(false);

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    onMenuOpened?.();

    if (!animations) return;

    setIsAnimating(true);
    //* Show sparkles again after animation completes
    setTimeout(() => {
      setIsAnimating(false);
    }, 300);
  };

  return (
    <Collapsible
      open={open}
      onOpenChange={handleOpenChange}
      className="w-full max-w-2xs lg:max-w-xs mb-1"
    >
      <div
        className={cn(
          `
        menu-collapsible rounded-xl will-change-[transform,opacity]
        transition-all duration-300 ease-in-out
        bg-gradient-to-br from-accent/70 to-primary/70
        shadow-[var(--shadow-inset-border),var(--shadow-glow-soft)] relative
        ${open ? "p-0" : "hover:translate-y-[-1px] hover:shadow-collapsible-hover"}
      `,
          isHalloween &&
            `bg-[radial-gradient(ellipse_at_bottom,rgba(255,180,60,0.7)_0%,rgba(255,90,0,0.3)_45%,rgba(10,5,0,0.05)_95%)]
          before:content-[''] before:absolute before:inset-0 before:pointer-events-none before:bg-[radial-gradient(ellipse_at_bottom,rgba(255,180,60,0.6)_0%,rgba(255,90,0,0.3)_40%,rgba(10,5,0,0.05)_70%)]
          shadow-[var(--shadow-halloween-inset-border),var(--shadow-glow-soft)]`,
          className,
        )}
      >
        {isHalloween && flame && animations && !isAnimating && (
          <>
            <div className="absolute inset-0 pointer-events-none w-3/4 mx-auto">
              <SparklesCore
                id="button-sparkles"
                background="transparent"
                particleDensity={100}
                minSize={0.8}
                maxSize={1.5}
                // particleColor="#ff6b00"
                particleColor="#ff5c33"
                className="w-full h-full"
                gravity={true}
              />
            </div>
          </>
        )}
        <CollapsibleTrigger
          asChild
          className={cn("rounded-xl", triggerClassName)}
        >
          <button
            tabIndex={open ? -1 : 0}
            className={cn(
              `
              w-full p-4 text-16-18 group
              flex items-center justify-center gap-2
              bg-origin-border will-change-transform
              transition-all duration-300 ease-in-out
              active:scale-95
              focus:border-none outline-none
              focus-visible:ring-2 focus-visible:ring-ring
              focus-visible:ring-offset-2 focus-visible:ring-offset-background
              
              ${open ? "rounded-b-none" : ""}
            `,
              triggerClassName,
            )}
          >
            {label}

            <div className="absolute right-4">
              {open && (
                <div
                  ref={closeButtonRef}
                  tabIndex={0}
                  role="button"
                  aria-label={`Collapse menu`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpen(false);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      e.stopPropagation();
                      setOpen(false);
                    }
                  }}
                  className={cn(
                    `
                    p-1 rounded-md outline-none cursor-pointer
                    focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background
                    hover:bg-white/10 transition-colors
                  `,
                    closeButtonClassName,
                  )}
                >
                  <ChevronUp size={20} />
                </div>
              )}
            </div>
          </button>
        </CollapsibleTrigger>

        <AnimatePresence>
          {open && (
            <CollapsibleContent asChild forceMount>
              <motion.div
                ref={ref}
                style={{ willChange: "height, opacity" }}
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{
                  height: 0,
                  opacity: 0,
                  transition: {
                    opacity: { duration: 0.15, ease: "easeOut" },
                    height: { duration: 0.3, ease: "easeInOut" },
                  },
                }}
                transition={{
                  height: { duration: 0.3, ease: "easeInOut" },
                  opacity: { duration: 0.2, ease: "easeOut", delay: 0.15 },
                }}
                className="border-t border-1.5 border-chart-4 max-w-[85%] mx-auto"
                aria-hidden={!open}
              >
                <div className={cn("py-4 w-full", contentClassName)}>
                  {children}
                </div>
              </motion.div>
            </CollapsibleContent>
          )}
        </AnimatePresence>
      </div>
    </Collapsible>
  );
};

export default MenuCollapsible;
