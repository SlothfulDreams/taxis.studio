"use client";

import { useEffect, useRef, useCallback } from "react";
import { Canvas, FabricImage, PencilBrush } from "fabric";
import { useEditor } from "./EditorContext";

interface ImageCanvasProps {
  width?: number;
  height?: number;
}

export function ImageCanvas({ width = 800, height = 600 }: ImageCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const fabricRef = useRef<Canvas | null>(null);

  const {
    setCanvas,
    currentImage,
    activeTool,
    brushSize,
    brushColor,
  } = useEditor();

  // Initialize Fabric canvas
  useEffect(() => {
    if (!canvasRef.current || fabricRef.current) return;

    const canvas = new Canvas(canvasRef.current, {
      width,
      height,
      backgroundColor: "#1e293b",
      selection: activeTool === "select",
    });

    // Set up brush
    const brush = new PencilBrush(canvas);
    brush.color = brushColor;
    brush.width = brushSize;
    canvas.freeDrawingBrush = brush;

    fabricRef.current = canvas;
    setCanvas(canvas);

    return () => {
      canvas.dispose();
      fabricRef.current = null;
      setCanvas(null);
    };
  }, []);

  // Update canvas size on container resize
  useEffect(() => {
    const container = containerRef.current;
    if (!container || !fabricRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      const { width: containerWidth, height: containerHeight } = entries[0].contentRect;
      const canvas = fabricRef.current;
      if (!canvas) return;

      // Maintain aspect ratio while fitting container
      const aspectRatio = width / height;
      let newWidth = containerWidth;
      let newHeight = containerWidth / aspectRatio;

      if (newHeight > containerHeight) {
        newHeight = containerHeight;
        newWidth = containerHeight * aspectRatio;
      }

      canvas.setDimensions({ width: newWidth, height: newHeight });
      canvas.renderAll();
    });

    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
    };
  }, [width, height]);

  // Load image when currentImage changes
  useEffect(() => {
    const canvas = fabricRef.current;
    if (!canvas || !currentImage) return;

    // Clear existing objects
    canvas.clear();
    canvas.backgroundColor = "#1e293b";

    // Load the image
    FabricImage.fromURL(currentImage).then((img) => {
      if (!img || !fabricRef.current) return;

      const canvasWidth = canvas.width || width;
      const canvasHeight = canvas.height || height;

      // Scale image to fit canvas while maintaining aspect ratio
      const imgWidth = img.width || 1;
      const imgHeight = img.height || 1;
      const scale = Math.min(
        canvasWidth / imgWidth,
        canvasHeight / imgHeight
      ) * 0.9; // 90% to leave some padding

      img.scale(scale);
      img.set({
        left: (canvasWidth - imgWidth * scale) / 2,
        top: (canvasHeight - imgHeight * scale) / 2,
        selectable: false,
        evented: false,
      });

      canvas.add(img);
      canvas.sendObjectToBack(img);
      canvas.renderAll();
    });
  }, [currentImage, width, height]);

  // Update drawing mode based on active tool
  useEffect(() => {
    const canvas = fabricRef.current;
    if (!canvas) return;

    canvas.isDrawingMode = activeTool === "brush" || activeTool === "eraser";
    canvas.selection = activeTool === "select";

    if (canvas.freeDrawingBrush) {
      if (activeTool === "eraser") {
        // For eraser, we'll use a special color that we can identify later
        canvas.freeDrawingBrush.color = "rgba(0, 0, 0, 1)";
      } else {
        canvas.freeDrawingBrush.color = brushColor;
      }
    }
  }, [activeTool, brushColor]);

  // Update brush size
  useEffect(() => {
    const canvas = fabricRef.current;
    if (!canvas || !canvas.freeDrawingBrush) return;

    canvas.freeDrawingBrush.width = brushSize;
  }, [brushSize]);

  // Update brush color
  useEffect(() => {
    const canvas = fabricRef.current;
    if (!canvas || !canvas.freeDrawingBrush) return;

    if (activeTool !== "eraser") {
      canvas.freeDrawingBrush.color = brushColor;
    }
  }, [brushColor, activeTool]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full flex items-center justify-center overflow-hidden"
    >
      <canvas ref={canvasRef} className="rounded-lg shadow-2xl" />
    </div>
  );
}
