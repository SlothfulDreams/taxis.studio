"use client";

import { motion } from "framer-motion";
import { useEditor } from "./EditorContext";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

const stylePresets = [
  { name: "Modern", icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" },
  { name: "Minimalist", icon: "M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6z" },
  { name: "Scandinavian", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
  { name: "Industrial", icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" },
  { name: "Bohemian", icon: "M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" },
  { name: "Coastal", icon: "M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" },
  { name: "Farmhouse", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
  { name: "Art Deco", icon: "M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" },
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
    <aside className="w-80 border-l border-white/[0.06] bg-slate-900/80 backdrop-blur-xl flex flex-col">
      <Tabs defaultValue="edit" className="flex-1 flex flex-col">
        <div className="p-3 border-b border-white/[0.06]">
          <TabsList className="w-full">
            <TabsTrigger value="edit" className="flex items-center gap-1.5">
              <svg className="size-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit
            </TabsTrigger>
            <TabsTrigger value="generate" className="flex items-center gap-1.5">
              <svg className="size-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Generate
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-1.5">
              <svg className="size-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              History
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent
          value="edit"
          className="flex-1 p-4 space-y-5 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent"
        >
          {/* Model Selection */}
          <div>
            <label className="block text-xs uppercase tracking-wider font-medium text-slate-400 mb-3">
              AI Model
            </label>
            <div className="grid grid-cols-2 gap-2">
              <motion.button
                onClick={() => setSelectedModel("gpt")}
                className={`relative p-3 rounded-xl border text-left transition-all duration-200 overflow-hidden ${
                  selectedModel === "gpt"
                    ? "border-violet-500/50 bg-gradient-to-br from-violet-600/20 to-fuchsia-600/20 text-white"
                    : "border-white/[0.06] bg-slate-800/50 text-slate-400 hover:border-white/[0.12] hover:text-white"
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {selectedModel === "gpt" && (
                  <motion.div
                    layoutId="modelSelection"
                    className="absolute inset-0 bg-gradient-to-br from-violet-600/10 to-fuchsia-600/10"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <div className="relative">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="size-2 rounded-full bg-violet-500" />
                    <p className="font-medium text-sm">GPT Image</p>
                  </div>
                  <p className="text-xs opacity-70">Precise mask edits</p>
                </div>
              </motion.button>
              <motion.button
                onClick={() => setSelectedModel("gemini")}
                className={`relative p-3 rounded-xl border text-left transition-all duration-200 overflow-hidden ${
                  selectedModel === "gemini"
                    ? "border-violet-500/50 bg-gradient-to-br from-violet-600/20 to-fuchsia-600/20 text-white"
                    : "border-white/[0.06] bg-slate-800/50 text-slate-400 hover:border-white/[0.12] hover:text-white"
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {selectedModel === "gemini" && (
                  <motion.div
                    layoutId="modelSelection"
                    className="absolute inset-0 bg-gradient-to-br from-violet-600/10 to-fuchsia-600/10"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <div className="relative">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="size-2 rounded-full bg-fuchsia-500" />
                    <p className="font-medium text-sm">Gemini</p>
                  </div>
                  <p className="text-xs opacity-70">Fast iterations</p>
                </div>
              </motion.button>
            </div>
          </div>

          {/* Prompt */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs uppercase tracking-wider font-medium text-slate-400">
                Edit Instructions
              </label>
              <span className="text-xs text-slate-500">{prompt.length}/500</span>
            </div>
            <div className="relative">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value.slice(0, 500))}
                placeholder={
                  selectedModel === "gpt"
                    ? "Describe changes for the masked area..."
                    : "Describe what to change (e.g., 'change the sofa to brown leather')..."
                }
                className="w-full h-28 px-4 py-3 bg-slate-800/50 border border-white/[0.06] rounded-xl text-white placeholder:text-slate-500 resize-none focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-transparent transition-all duration-200"
              />
              <div className="absolute bottom-3 right-3">
                <motion.div
                  className="size-1.5 rounded-full bg-violet-500"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
            </div>
          </div>

          {/* Style Presets */}
          <div>
            <label className="block text-xs uppercase tracking-wider font-medium text-slate-400 mb-3">
              Style Presets
            </label>
            <div className="flex flex-wrap gap-2">
              {stylePresets.map((style) => (
                <motion.button
                  key={style.name}
                  onClick={() => addStyleToPrompt(style.name)}
                  className="group flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-800/50 border border-white/[0.06] text-slate-300 hover:border-violet-500/30 hover:bg-violet-600/10 hover:text-white transition-all duration-200"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg className="size-3 opacity-50 group-hover:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={style.icon} />
                  </svg>
                  <span className="text-xs font-medium">{style.name}</span>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <Button
            onClick={handleGenerate}
            disabled={isGenerating || !currentImage}
            variant="premium"
            className="w-full h-12"
          >
            {isGenerating ? (
              <>
                <motion.div
                  className="size-5 rounded-full border-2 border-white/30 border-t-white"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                <span className="ml-2">Generating...</span>
              </>
            ) : (
              <>
                <svg
                  className="size-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
                <span className="ml-2">Apply Edit</span>
              </>
            )}
          </Button>

          {selectedModel === "gpt" && (
            <motion.p
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs text-slate-500 text-center flex items-center justify-center gap-2"
            >
              <svg className="size-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Use the brush tool to mask areas you want to edit
            </motion.p>
          )}
        </TabsContent>

        <TabsContent value="generate" className="flex-1 p-4 space-y-4 overflow-y-auto">
          <div>
            <label className="block text-xs uppercase tracking-wider font-medium text-slate-400 mb-3">
              Generate New Image
            </label>
            <textarea
              placeholder="Describe the interior you want to create..."
              className="w-full h-28 px-4 py-3 bg-slate-800/50 border border-white/[0.06] rounded-xl text-white placeholder:text-slate-500 resize-none focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-transparent transition-all duration-200"
            />
          </div>

          <Button variant="success" className="w-full h-12">
            <svg
              className="size-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            <span className="ml-2">Generate New</span>
          </Button>
        </TabsContent>

        <TabsContent value="history" className="flex-1 p-4 overflow-y-auto">
          {allHistory.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-12"
            >
              <motion.div
                className="mb-4 flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600/20 to-fuchsia-600/20 border border-white/[0.08]"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <svg className="size-8 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </motion.div>
              <p className="text-slate-400 font-medium">No edit history yet</p>
              <p className="text-xs text-slate-500 mt-1">
                Your generated images will appear here
              </p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-3"
            >
              {allHistory.map((item, index) => (
                <motion.button
                  key={item._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => item.url && handleSelectHistory(item.url)}
                  className="group w-full text-left rounded-xl overflow-hidden border border-white/[0.06] bg-slate-800/50 hover:border-violet-500/30 hover:bg-slate-800/80 transition-all duration-200"
                >
                  {item.url && (
                    <div className="relative aspect-video overflow-hidden">
                      <img
                        src={item.url}
                        alt={item.prompt || "Generated image"}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-3">
                        <span className="text-xs font-medium text-white bg-violet-600/80 px-3 py-1 rounded-full">
                          Load Image
                        </span>
                      </div>
                    </div>
                  )}
                  <div className="p-3">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span
                        className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full font-medium ${
                          item.type === "original"
                            ? "bg-emerald-500/20 text-emerald-400"
                            : "bg-violet-500/20 text-violet-400"
                        }`}
                      >
                        {item.type}
                      </span>
                      {item.aiModel && (
                        <span className="text-[10px] text-slate-500">
                          {item.aiModel}
                        </span>
                      )}
                    </div>
                    {item.prompt && (
                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                        {item.prompt}
                      </p>
                    )}
                  </div>
                </motion.button>
              ))}
            </motion.div>
          )}
        </TabsContent>
      </Tabs>
    </aside>
  );
}
