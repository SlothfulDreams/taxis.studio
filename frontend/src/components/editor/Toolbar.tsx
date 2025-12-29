"use client";

import { motion } from "framer-motion";
import { useEditor, Tool } from "./EditorContext";
import { Slider } from "@/components/ui/slider";

const tools: { id: Tool; label: string; shortcut: string; icon: React.ReactNode }[] = [
  {
    id: "select",
    label: "Select",
    shortcut: "V",
    icon: (
      <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
        />
      </svg>
    ),
  },
  {
    id: "brush",
    label: "Brush (Mask)",
    shortcut: "B",
    icon: (
      <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
        />
      </svg>
    ),
  },
  {
    id: "eraser",
    label: "Eraser",
    shortcut: "E",
    icon: (
      <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
        />
      </svg>
    ),
  },
];

export function Toolbar() {
  const {
    activeTool,
    setActiveTool,
    brushSize,
    setBrushSize,
    clearMask,
  } = useEditor();

  const showBrushControls = activeTool === "brush" || activeTool === "eraser";

  return (
    <aside className="w-16 border-r border-border/40 bg-background/80 backdrop-blur-xl flex flex-col items-center py-4 gap-1 z-20">
      {/* Tool buttons container */}
      <div className="flex flex-col gap-1 rounded-xl bg-muted/20 p-1.5 border border-border/40">
        {tools.map((tool) => (
          <motion.button
            key={tool.id}
            onClick={() => setActiveTool(tool.id)}
            className={`group relative p-2.5 rounded-lg transition-all duration-200 ${
              activeTool === tool.id
                ? "bg-primary/10 text-primary shadow-sm"
                : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title={`${tool.label} (${tool.shortcut})`}
          >
            {/* Active glow effect */}
            {activeTool === tool.id && (
              <motion.div
                layoutId="activeToolGlow"
                className="absolute inset-0 rounded-lg bg-primary/5 border border-primary/20"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10">{tool.icon}</span>

            {/* Tooltip */}
            <div className="absolute left-full ml-3 hidden group-hover:flex items-center pointer-events-none z-50">
              <div className="relative rounded-lg bg-popover border border-border px-3 py-1.5 shadow-lg">
                <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 border-8 border-transparent border-r-popover" />
                <p className="text-sm font-medium text-popover-foreground whitespace-nowrap">{tool.label}</p>
                <p className="text-xs text-muted-foreground">{tool.shortcut}</p>
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      <div className="flex-1" />

      {/* Brush Size Controls */}
      {showBrushControls && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="w-full px-2"
        >
          <div className="rounded-xl bg-muted/20 p-3 border border-border/40">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground text-center mb-3 font-medium">
              Size
            </p>
            <div className="flex flex-col items-center gap-3">
              <Slider
                value={[brushSize]}
                onValueChange={(value) => setBrushSize(value[0])}
                min={5}
                max={100}
                step={1}
                className="h-20"
                orientation="vertical"
              />
              <div className="flex items-center justify-center size-8 rounded-lg bg-background border border-border/50">
                <span className="text-xs font-medium text-foreground">{brushSize}</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Clear mask button */}
      <motion.button
        onClick={clearMask}
        className="group relative p-2.5 rounded-lg text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-all duration-200"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        title="Clear Mask"
      >
        <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>

        {/* Tooltip */}
        <div className="absolute left-full ml-3 hidden group-hover:flex items-center pointer-events-none z-50">
          <div className="relative rounded-lg bg-popover border border-border px-3 py-1.5 shadow-lg">
            <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 border-8 border-transparent border-r-popover" />
            <p className="text-sm font-medium text-popover-foreground whitespace-nowrap">Clear Mask</p>
          </div>
        </div>
      </motion.button>
    </aside>
  );
}
