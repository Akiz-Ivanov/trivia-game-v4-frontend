import { forwardRef } from "react"
import type { ComponentProps, Ref } from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-xs",
        destructive:
          "bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border bg-background shadow-xs hover:bg-primary hover:text-primary-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
        ghost:
          "hover:bg-primary hover:text-primary-foreground dark:hover:bg-primary/50",
        link:
          "text-primary underline-offset-4 hover:underline",
        "menu-default":
          "bg-gradient-to-br from-accent/70 to-primary/70 bg-origin-border will-change-transform transition-all duration-300 ease-in-out hover:scale-[1.02] active:scale-95 shadow-inset-border hover:shadow-[var(--shadow-inset-border),var(--shadow-accent)] disabled:transform-none disabled:shadow-none",
        "menu-halloween":
          "bg-origin-border will-change-transform transition-all duration-300 ease-in-out hover:scale-[1.02] active:scale-95 shadow-halloween-inset-border hover:shadow-collapsible-hover disabled:transform-none disabled:shadow-none bg-[radial-gradient(circle_at_center,rgba(255,180,60,0.2)_0%,rgba(255,90,0,0.3)_30%,rgba(10,5,0,0.05)_70%),radial-gradient(circle_at_center,rgba(255,180,60,0.5)_0%,rgba(255,90,0,0.3)_45%,rgba(10,5,0,0.05)_95%)]",
        "play-again":
          "gap-1 rounded-[1.5rem] mt-3 px-8 py-3 text-white shadow-[0_4px_20px_rgba(166,119,227,0.4)] transition-all duration-300 ease bg-gradient-to-br from-btn-playagain-from to-btn-playagain-to text-[1.2rem] will-change-transform hover:brightness-110 hover:shadow-[0_6px_25px_rgba(166,119,227,0.6)] hover:-translate-y-1 font-bold active:scale-95",
        purple:
          "purple-bg flex-1 py-2 active:scale-95 active:shadow-[0_0_8px_rgba(0,195,255,0.2)] hover:-translate-y-1 hover:scale-105 active:scale-95 will-change-transform transition-all duration-300",
        "answer-default":
          "w-full min-h-[4rem] box-border bg-origin-border text-15-16 px-4 py-2 rounded-full xs:rounded-md border-2 border-white/30 will-change-transform transition-transform duration-200 ease-in-out hover:scale-[1.02] hover:shadow-[0_0_15px_rgba(0,195,255,0.4)] active:scale-95 active:shadow-[0_0_8px_rgba(0,195,255,0.2)]"
        },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const Button = forwardRef<
  HTMLButtonElement,
  ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }
>(({ 
  className, 
  variant, 
  asChild = false, 
  ...props 
}, ref: Ref<HTMLButtonElement>) => {

  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      ref={ref}
      className={cn(buttonVariants({ variant, className }))}
      {...props}
    />
  )
})

Button.displayName = "Button"

export { Button, buttonVariants }