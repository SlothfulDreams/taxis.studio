"use client";

import { motion } from "framer-motion";
import { useEditor } from "./EditorContext";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

const stylePresets = [
  {
    name: "Modern",
    icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4",
  },
  {
    name: "Minimalist",
    icon: "M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6z",
  },
  {
    name: "Scandinavian",
    icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
  },
  {
    name: "Industrial",
    icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z",
  },
  {
    name: "Bohemian",
    icon: "M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z",
  },
  {
    name: "Coastal",
    icon: "M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z",
  },
  {
    name: "Farmhouse",
    icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
  },
  {
    name: "Art Deco",
    icon: "M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z",
  },
];

interface HistoryImage {
  _id: string;
  url: string | null;
  type: string;
  prompt?: string;
  aiModel?: string;
  createdAt: number;
}

interface PromptPanelProps {
  onGenerate: () => Promise<void>;
  imageHistory?: HistoryImage[];
  onSelectHistoryImage?: (url: string) => void;
}

export function PromptPanel({
  onGenerate,
  imageHistory,
  onSelectHistoryImage,
}: PromptPanelProps) {
  const {
    selectedModel,
    setSelectedModel,
    prompt,
    setPrompt,
    isGenerating,
    currentImage,
    history,
    setCurrentImage,
  } = useEditor();

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a prompt");
      return;
    }
    if (!currentImage) {
      toast.error("Please upload an image first");
      return;
    }
    await onGenerate();
  };

  const addStyleToPrompt = (style: string) => {
    const newPrompt = prompt
      ? `${prompt} Transform to ${style.toLowerCase()} style.`
      : `Transform to ${style.toLowerCase()} style.`;
    setPrompt(newPrompt);
  };

  const handleSelectHistory = (imageUrl: string) => {
    if (onSelectHistoryImage) {
      onSelectHistoryImage(imageUrl);
    } else {
      setCurrentImage(imageUrl);
    }
  };

  // Combine local history with Convex history
  const allHistory: HistoryImage[] =
    imageHistory ||
    history.map((url, index) => ({
      _id: `local-${index}`,
      url,
      type: "generated",
      prompt: undefined,
      aiModel: undefined,
      createdAt: Date.now() - index * 1000,
    }));

  return (
    <aside className="w-80 border-l border-border/40 bg-background/80 backdrop-blur-xl flex flex-col z-20">
      <Tabs defaultValue="edit" className="flex-1 flex flex-col">
        <div className="px-1 pt-3 border-b border-border/40">
          <TabsList className="w-full bg-transparent p-0 gap-4 h-auto justify-start">
            <TabsTrigger
              value="edit"
              className="relative h-9 rounded-none border-b-2 border-transparent bg-transparent px-2 pb-2 pt-1 font-medium text-muted-foreground shadow-none transition-none data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
            >
              Edit
            </TabsTrigger>
            <TabsTrigger
              value="generate"
              className="relative h-9 rounded-none border-b-2 border-transparent bg-transparent px-2 pb-2 pt-1 font-medium text-muted-foreground shadow-none transition-none data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
            >
              Generate
            </TabsTrigger>
            <TabsTrigger
              value="history"
              className="relative h-9 rounded-none border-b-2 border-transparent bg-transparent px-2 pb-2 pt-1 font-medium text-muted-foreground shadow-none transition-none data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
            >
              History
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent
          value="edit"
          className="flex-1 p-5 space-y-6 overflow-y-auto scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent mt-0"
        >
          {/* Model Selection */}
          <div className="space-y-3">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">
              AI Model
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setSelectedModel("gpt")}
                className={`relative flex flex-col items-start gap-2 rounded-xl border p-3 text-left transition-all ${
                  selectedModel === "gpt"
                    ? "border-primary/50 bg-primary/5 text-foreground ring-1 ring-primary/20"
                    : "border-border/60 bg-muted/20 text-muted-foreground hover:bg-muted/40 hover:text-foreground"
                }`}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`size-2 rounded-full ${selectedModel === "gpt" ? "bg-primary" : "bg-muted-foreground/40"}`}
                  />
                  <span className="text-sm font-medium">GPT 4o</span>
                </div>
                <span className="text-[10px] opacity-70">Precise edits</span>
              </button>

              <button
                onClick={() => setSelectedModel("gemini")}
                className={`relative flex flex-col items-start gap-2 rounded-xl border p-3 text-left transition-all ${
                  selectedModel === "gemini"
                    ? "border-primary/50 bg-primary/5 text-foreground ring-1 ring-primary/20"
                    : "border-border/60 bg-muted/20 text-muted-foreground hover:bg-muted/40 hover:text-foreground"
                }`}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`size-2 rounded-full ${selectedModel === "gemini" ? "bg-fuchsia-500" : "bg-muted-foreground/40"}`}
                  />
                  <span className="text-sm font-medium">Gemini</span>
                </div>
                <span className="text-[10px] opacity-70">Fast iterations</span>
              </button>
            </div>
          </div>

          {/* Prompt */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">
                Instructions
              </label>
              <span className="text-[10px] text-muted-foreground">
                {prompt.length}/500
              </span>
            </div>

            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value.slice(0, 500))}
              placeholder={
                selectedModel === "gpt"
                  ? "Describe changes for the masked area..."
                  : "Describe what to change (e.g., 'change the sofa to brown leather')..."
              }
              className="min-h-[120px] w-full resize-none rounded-xl border border-border/40 bg-muted/20 p-4 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/20"
            />
          </div>

          {/* Style Presets */}
          <div className="space-y-3">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">
              Style Presets
            </label>
            <div className="flex flex-wrap gap-2">
              {stylePresets.map((style) => (
                <button
                  key={style.name}
                  onClick={() => addStyleToPrompt(style.name)}
                  className="rounded-full border border-border/40 bg-muted/20 px-3 py-1 text-xs font-medium text-muted-foreground hover:border-primary/30 hover:bg-primary/5 hover:text-foreground transition-colors"
                >
                  {style.name}
                </button>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <Button
            onClick={handleGenerate}
            disabled={isGenerating || !currentImage}
            className="w-full h-12 rounded-xl text-base font-medium shadow-lg shadow-primary/10"
          >
            {isGenerating ? (
              <>
                <motion.div
                  className="mr-2 size-4 rounded-full border-2 border-background/30 border-t-background"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                Processing...
              </>
            ) : (
              <>
                <span className="mr-2">✨</span>
                Apply Edits
              </>
            )}
          </Button>

          {selectedModel === "gpt" && (
            <p className="text-xs text-muted-foreground text-center animate-in fade-in slide-in-from-bottom-2">
              Use the brush tool to mask areas you want to edit
            </p>
          )}
        </TabsContent>

        <TabsContent
          value="generate"
          className="flex-1 p-5 space-y-4 overflow-y-auto mt-0"
        >
          <div className="space-y-3">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">
              Generate New Image
            </label>
            <textarea
              placeholder="Describe the interior you want to create..."
              className="min-h-[140px] w-full resize-none rounded-xl border border-border/40 bg-muted/20 p-4 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/20"
            />
          </div>

          <Button className="w-full h-12 rounded-xl">Generate New</Button>
        </TabsContent>

        <TabsContent
          value="history"
          className="flex-1 p-5 overflow-y-auto mt-0"
        >
          {allHistory.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
              <div className="mb-4 rounded-full bg-muted/50 p-4">
                <svg
                  className="size-6 opacity-50"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
              </div>
              <p className="text-sm font-medium">No history yet</p>
              <p className="text-xs opacity-70 mt-1">
                Generated images will appear here
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {allHistory.map((item, index) => (
                <button
                  key={item._id}
                  onClick={() => item.url && handleSelectHistory(item.url)}
                  className="group relative w-full overflow-hidden rounded-xl border border-border/40 bg-muted/20 transition-all hover:border-primary/30 hover:shadow-md"
                >
                  {item.url && (
                    <div className="aspect-video w-full bg-muted">
                      <img
                        src={item.url}
                        alt={item.prompt || "Generated image"}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                  )}
                  <div className="p-3 text-left">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${
                        item.type === "original"
                          ? "bg-emerald-500/10 text-emerald-500"
                          : "bg-primary/10 text-primary"
                      }`}
                    >
                      {item.type}
                    </span>
                    {item.prompt && (
                      <p className="mt-2 text-xs text-muted-foreground line-clamp-2">
                        {item.prompt}
                      </p>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </aside>
  );
}
