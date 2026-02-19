import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type StickyWrapperProps = {
  children: ReactNode;
  className?: string;
  stickyClassName?: string;
};

export const StickyWrapper = ({
  children,
  className,
  stickyClassName = "sticky-container",
}: StickyWrapperProps) => {
  const [isStuck, setIsStuck] = useState(false);
  const stickyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsStuck(entry.intersectionRatio < 1);
      },
      { threshold: [1], rootMargin: "-1px 0px 0px 0px" },
    );

    if (stickyRef.current) {
      observer.observe(stickyRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={stickyRef}
      className={cn(
        "sticky top-0 z-[9999] pt-2 pb-1.5",
        isStuck && stickyClassName,
        className,
      )}
    >
      {children}
    </div>
  );
};
