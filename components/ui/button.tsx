import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex min-h-11 items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4",
  {
    variants: {
      variant: {
        default:
          "border border-transparent bg-primary text-primary-foreground shadow-[0_14px_28px_-18px_rgba(123,143,114,0.9)] hover:bg-primary/90 dark:border-primary/28 dark:bg-primary/18 dark:text-primary dark:shadow-none dark:hover:border-primary/36 dark:hover:bg-primary/24",
        outline:
          "border border-border bg-card/85 text-foreground shadow-[0_10px_24px_-20px_rgba(67,73,54,0.45)] hover:bg-card hover:border-foreground/12 dark:border-white/14 dark:bg-[#151b1d] dark:text-[#eef1eb] dark:shadow-[0_14px_28px_-22px_rgba(0,0,0,0.7)] dark:hover:border-white/22 dark:hover:bg-[#1b2224]",
        secondary:
          "border border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80 dark:border-white/10 dark:bg-[#202729] dark:text-[#eef1eb] dark:hover:bg-[#283032]",
        ghost: "hover:bg-muted/80 dark:hover:bg-[#262d2f]",
      },
      size: {
        default: "px-4 py-2.5",
        sm: "min-h-9 px-3",
        lg: "min-h-12 px-6",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
