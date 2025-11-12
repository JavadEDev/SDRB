import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger";
  size?: "sm" | "md" | "lg";
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", asChild = false, ...props }, ref) => {
    const Comp: any = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(
          "inline-flex items-center justify-center rounded-full font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 shadow-sm",
          {
            "px-6 py-3": size === "md",
            "px-4 py-2 text-sm": size === "sm",
            "px-8 py-4 text-lg": size === "lg",
            "bg-primary text-primary-foreground hover:opacity-90 focus:ring-[var(--action-primary-bg)]":
              variant === "primary",
            "bg-secondary text-secondary-foreground hover:opacity-90 focus:ring-[var(--action-secondary-bg)]":
              variant === "secondary",
            "bg-destructive text-destructive-foreground hover:opacity-90 focus:ring-[var(--action-destructive-bg)]":
              variant === "danger",
          },
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };

