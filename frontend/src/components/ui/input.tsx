import type * as React from "react";
import { useId } from "react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        // Base sizing and layout
        "h-11 w-full min-w-0 rounded-xl px-4 text-sm",
        // Glass background
        "bg-white/[0.05] backdrop-blur-sm",
        "border border-white/[0.1]",
        // Text styling
        "text-white placeholder:text-slate-500",
        // Focus states with violet accent
        "focus:outline-none",
        "focus:border-violet-500/50",
        "focus:ring-2 focus:ring-violet-500/20",
        "focus:bg-white/[0.08]",
        // Transitions
        "transition-all duration-200",
        // File input styling
        "file:mr-4 file:h-8 file:border-0 file:bg-violet-600 file:px-4",
        "file:text-sm file:font-medium file:text-white file:rounded-lg",
        "file:cursor-pointer file:hover:bg-violet-500",
        // Selection styling
        "selection:bg-violet-500 selection:text-white",
        // Disabled state
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        // Invalid/error state
        "aria-invalid:border-red-500/50 aria-invalid:ring-red-500/20",
        className,
      )}
      {...props}
    />
  );
}

// Variant with floating label (for auth forms etc.)
function InputWithLabel({
  className,
  type,
  label,
  id,
  ...props
}: React.ComponentProps<"input"> & { label: string }) {
  const generatedId = useId();
  const inputId = id || generatedId;

  return (
    <div className="relative">
      <input
        id={inputId}
        type={type}
        data-slot="input"
        placeholder=" "
        className={cn(
          // Base sizing and layout
          "peer h-12 w-full min-w-0 rounded-xl px-4 pt-4 pb-1 text-sm",
          // Glass background
          "bg-white/[0.05] backdrop-blur-sm",
          "border border-white/[0.1]",
          // Text styling
          "text-white placeholder:text-transparent",
          // Focus states with violet accent
          "focus:outline-none",
          "focus:border-violet-500/50",
          "focus:ring-2 focus:ring-violet-500/20",
          "focus:bg-white/[0.08]",
          // Transitions
          "transition-all duration-200",
          // Disabled state
          "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        {...props}
      />
      <label
        htmlFor={inputId}
        className={cn(
          "absolute left-4 top-1/2 -translate-y-1/2",
          "text-slate-500 text-sm",
          "transition-all duration-200",
          "pointer-events-none",
          // Float up when focused or has value
          "peer-focus:top-3 peer-focus:text-xs peer-focus:text-violet-400",
          "peer-[:not(:placeholder-shown)]:top-3 peer-[:not(:placeholder-shown)]:text-xs",
        )}
      >
        {label}
      </label>
    </div>
  );
}

// Search input variant
function SearchInput({
  className,
  ...props
}: Omit<React.ComponentProps<"input">, "type">) {
  return (
    <div className="relative">
      <svg
        className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-500"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
      <input
        type="search"
        data-slot="input"
        className={cn(
          // Base sizing and layout
          "h-10 w-full min-w-0 rounded-xl pl-10 pr-4 text-sm",
          // Glass background
          "bg-white/[0.05] backdrop-blur-sm",
          "border border-white/[0.1]",
          // Text styling
          "text-white placeholder:text-slate-500",
          // Focus states with violet accent
          "focus:outline-none",
          "focus:border-violet-500/50",
          "focus:ring-2 focus:ring-violet-500/20",
          "focus:bg-white/[0.08]",
          // Transitions
          "transition-all duration-200",
          className,
        )}
        {...props}
      />
    </div>
  );
}

export { Input, InputWithLabel, SearchInput };
