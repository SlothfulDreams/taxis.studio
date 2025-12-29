import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2 whitespace-nowrap",
    "rounded-xl text-sm font-medium",
    "transition-all duration-200",
    "disabled:pointer-events-none disabled:opacity-50",
    "[&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4",
    "shrink-0 [&_svg]:shrink-0",
    "outline-none",
    "focus-visible:ring-2 focus-visible:ring-violet-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950",
  ].join(" "),
  {
    variants: {
      variant: {
        default: [
          "bg-violet-600 text-white",
          "hover:bg-violet-500",
          "shadow-[0_0_20px_rgba(139,92,246,0.2)]",
          "hover:shadow-[0_0_25px_rgba(139,92,246,0.35)]",
          "active:scale-[0.98]",
        ].join(" "),

        // Premium gradient button with shimmer
        premium: [
          "relative overflow-hidden",
          "bg-gradient-to-r from-violet-600 via-fuchsia-500 to-violet-600",
          "bg-[length:200%_100%]",
          "text-white font-semibold",
          "shadow-[0_0_20px_rgba(139,92,246,0.3)]",
          "hover:shadow-[0_0_30px_rgba(139,92,246,0.5)]",
          "hover:scale-[1.02]",
          "active:scale-[0.98]",
          "shimmer",
        ].join(" "),

        // Glass button
        glass: [
          "bg-white/[0.08] backdrop-blur-xl",
          "border border-white/[0.12]",
          "text-white",
          "hover:bg-white/[0.12]",
          "hover:border-white/[0.2]",
          "shadow-[0_4px_16px_rgba(0,0,0,0.2)]",
          "hover:shadow-[0_6px_20px_rgba(0,0,0,0.25)]",
          "active:scale-[0.98]",
        ].join(" "),

        outline: [
          "border border-white/10",
          "bg-transparent",
          "hover:bg-white/5",
          "text-slate-300 hover:text-white",
          "active:scale-[0.98]",
        ].join(" "),

        ghost: [
          "hover:bg-white/5",
          "text-slate-400 hover:text-white",
          "active:scale-[0.98]",
        ].join(" "),

        success: [
          "bg-emerald-600 text-white",
          "hover:bg-emerald-500",
          "shadow-[0_0_20px_rgba(16,185,129,0.2)]",
          "hover:shadow-[0_0_25px_rgba(16,185,129,0.35)]",
          "active:scale-[0.98]",
        ].join(" "),
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-9 rounded-lg px-4 text-xs",
        lg: "h-12 rounded-xl px-8 text-base",
        xl: "h-14 rounded-xl px-10 text-lg",
        icon: "size-10",
        "icon-sm": "size-9",
        "icon-lg": "size-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
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
