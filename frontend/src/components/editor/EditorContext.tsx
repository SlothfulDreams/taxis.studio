"use client";

import type { Canvas as FabricCanvas, FabricObject } from "fabric";
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useState,
} from "react";

export type Tool = "select" | "brush" | "eraser";
export type AIModel = "gpt" | "gemini";

interface EditorState {
  // Canvas
  canvas: FabricCanvas | null;
  setCanvas: (canvas: FabricCanvas | null) => void;

  // Current image
  currentImage: string | null;
  setCurrentImage: (image: string | null) => void;

  // Mask
  maskDataUrl: string | null;
  setMaskDataUrl: (mask: string | null) => void;

  // Tools
  activeTool: Tool;
  setActiveTool: (tool: Tool) => void;

  // Brush settings
  brushSize: number;
  setBrushSize: (size: number) => void;
  brushColor: string;
  setBrushColor: (color: string) => void;

  // AI settings
  selectedModel: AIModel;
  setSelectedModel: (model: AIModel) => void;
  prompt: string;
  setPrompt: (prompt: string) => void;

  // Generation state
  isGenerating: boolean;
  setIsGenerating: (generating: boolean) => void;

  // History
  history: string[];
  addToHistory: (imageUrl: string) => void;
  clearHistory: () => void;

  // Actions
  clearMask: () => void;
  exportMask: () => string | null;
}

const EditorContext = createContext<EditorState | undefined>(undefined);

export function EditorProvider({ children }: { children: ReactNode }) {
  const [canvas, setCanvas] = useState<FabricCanvas | null>(null);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [maskDataUrl, setMaskDataUrl] = useState<string | null>(null);
  const [activeTool, setActiveTool] = useState<Tool>("select");
  const [brushSize, setBrushSize] = useState(20);
  const [brushColor, setBrushColor] = useState("rgba(255, 0, 0, 0.5)");
  const [selectedModel, setSelectedModel] = useState<AIModel>("gpt");
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [history, setHistory] = useState<string[]>([]);

  const addToHistory = useCallback((imageUrl: string) => {
    setHistory((prev) => [...prev, imageUrl]);
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  const clearMask = useCallback(() => {
    if (canvas) {
      // Get all objects except the background image
      const objects = canvas.getObjects().filter((obj) => obj.type !== "image");
      objects.forEach((obj) => {
        canvas.remove(obj);
      });
      canvas.renderAll();
      setMaskDataUrl(null);
    }
  }, [canvas]);

  const exportMask = useCallback(() => {
    if (!canvas || !currentImage) return null;

    const objects = canvas.getObjects().filter((obj) => obj.type !== "image");
    if (objects.length === 0) return null;

    const maskCanvas = document.createElement("canvas");
    maskCanvas.width = canvas.width || 512;
    maskCanvas.height = canvas.height || 512;
    const maskCtx = maskCanvas.getContext("2d");

    if (!maskCtx) return null;

    // Fill with black (areas to preserve)
    maskCtx.fillStyle = "black";
    maskCtx.fillRect(0, 0, maskCanvas.width, maskCanvas.height);

    // Draw brush strokes in white (areas to edit)
    objects.forEach((obj: FabricObject) => {
      if (obj.type === "path") {
        maskCtx.save();
        maskCtx.strokeStyle = "white";
        maskCtx.lineWidth = obj.strokeWidth || brushSize;
        maskCtx.lineCap = "round";
        maskCtx.lineJoin = "round";

        const pathObj = obj as FabricObject & { path?: (string | number)[][] };
        const path = new Path2D(
          pathObj.path
            ?.map((p: (string | number)[]) => p.join(" "))
            .join(" ") || "",
        );
        maskCtx.stroke(path);
        maskCtx.restore();
      }
    });

    return maskCanvas.toDataURL("image/png");
  }, [canvas, currentImage, brushSize]);

  return (
    <EditorContext.Provider
      value={{
        canvas,
        setCanvas,
        currentImage,
        setCurrentImage,
        maskDataUrl,
        setMaskDataUrl,
        activeTool,
        setActiveTool,
        brushSize,
        setBrushSize,
        brushColor,
        setBrushColor,
        selectedModel,
        setSelectedModel,
        prompt,
        setPrompt,
        isGenerating,
        setIsGenerating,
        history,
        addToHistory,
        clearHistory,
        clearMask,
        exportMask,
      }}
    >
      {children}
    </EditorContext.Provider>
  );
}

export function useEditor() {
  const context = useContext(EditorContext);
  if (context === undefined) {
    throw new Error("useEditor must be used within an EditorProvider");
  }
  return context;
}
