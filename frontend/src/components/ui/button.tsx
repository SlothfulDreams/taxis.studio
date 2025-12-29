import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2 whitespace-nowrap",
    "rounded-lg font-medium",
    "transition-all duration-200 ease-in-out",
    "disabled:pointer-events-none disabled:opacity-50",
    "[&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4",
    "shrink-0 [&_svg]:shrink-0",
    "outline-none select-none",
    "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
  ].join(" "),
  {
    variants: {
      variant: {
        default: [
          "bg-primary text-primary-foreground",
          "hover:bg-primary/90",
          "shadow-sm hover:shadow-md",
          "active:scale-[0.98]",
        ].join(" "),

        // Premium - Clean, high contrast, white on dark
        premium: [
          "bg-white text-black",
          "hover:bg-white/90",
          "shadow-sm hover:shadow-md",
          "border border-white/20", // Subtle border for depth
          "active:scale-[0.98]",
        ].join(" "),

        // Glass - Frosted and subtle
        glass: [
          "bg-white/5 backdrop-blur-md",
          "border border-white/10",
          "text-foreground",
          "hover:bg-white/10 hover:border-white/20",
          "active:scale-[0.98]",
        ].join(" "),

        // Outline - Clean border
        outline: [
          "border border-input bg-transparent",
          "hover:bg-accent hover:text-accent-foreground",
          "active:scale-[0.98]",
        ].join(" "),

        // Ghost - Minimal
        ghost: [
          "hover:bg-accent hover:text-accent-foreground",
          "active:scale-[0.98]",
        ].join(" "),

        // Secondary
        secondary: [
          "bg-secondary text-secondary-foreground",
          "hover:bg-secondary/80",
          "shadow-sm",
        ].join(" "),

        // Destructive
        destructive: [
          "bg-destructive text-destructive-foreground",
          "hover:bg-destructive/90",
          "shadow-sm",
        ].join(" "),
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-11 rounded-md px-8",
        xl: "h-12 rounded-lg px-8 text-base",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
