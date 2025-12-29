"use client";

import { Canvas, FabricImage, PencilBrush } from "fabric";
import { useEffect, useRef } from "react";
import { useEditor } from "./EditorContext";

interface ImageCanvasProps {
  width?: number;
  height?: number;
}

export function ImageCanvas({ width = 800, height = 600 }: ImageCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const fabricRef = useRef<Canvas | null>(null);
  // Store the current image's aspect ratio so ResizeObserver can use it
  const imageAspectRatioRef = useRef<number | null>(null);

  const { setCanvas, currentImage, activeTool, brushSize, brushColor } =
    useEditor();

  // Initialize Fabric canvas - runs once on mount
  // biome-ignore lint/correctness/useExhaustiveDependencies: Canvas initialization runs once; updates handled by separate effects below
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

  // Helper function to resize canvas and re-scale image
  const resizeCanvasToFit = (
    containerWidth: number,
    containerHeight: number,
  ) => {
    const canvas = fabricRef.current;
    if (!canvas) return;

    // Use image aspect ratio if we have one, otherwise use default props
    const aspectRatio = imageAspectRatioRef.current || width / height;

    let newWidth: number;
    let newHeight: number;

    if (containerWidth / containerHeight > aspectRatio) {
      // Container is wider - fit by height
      newHeight = containerHeight;
      newWidth = containerHeight * aspectRatio;
    } else {
      // Container is taller - fit by width
      newWidth = containerWidth;
      newHeight = containerWidth / aspectRatio;
    }

    canvas.setDimensions({ width: newWidth, height: newHeight });

    // Re-scale the background image if one exists
    const objects = canvas.getObjects();
    const bgImage = objects.find((obj) => obj.type === "image") as
      | FabricImage
      | undefined;
    if (bgImage?.width) {
      const scale = newWidth / bgImage.width;
      bgImage.set({
        scaleX: scale,
        scaleY: scale,
        left: 0,
        top: 0,
      });
    }

    canvas.renderAll();
  };

  // Update canvas size on container resize
  // biome-ignore lint/correctness/useExhaustiveDependencies: ResizeObserver handles size changes; resizeCanvasToFit is stable
  useEffect(() => {
    const container = containerRef.current;
    if (!container || !fabricRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      const { width: containerWidth, height: containerHeight } =
        entries[0].contentRect;
      if (containerWidth > 0 && containerHeight > 0) {
        resizeCanvasToFit(containerWidth, containerHeight);
      }
    });

    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  // Load image when currentImage changes
  useEffect(() => {
    const canvas = fabricRef.current;
    const container = containerRef.current;
    if (!canvas || !currentImage || !container) return;

    // Clear existing objects
    canvas.clear();
    canvas.backgroundColor = "#1e293b";

    // Load the image
    FabricImage.fromURL(currentImage, { crossOrigin: "anonymous" }).then(
      (img) => {
        if (!img || !fabricRef.current || !containerRef.current) return;

        const imgWidth = img.width || 1;
        const imgHeight = img.height || 1;

        // Store the image's aspect ratio for the ResizeObserver
        imageAspectRatioRef.current = imgWidth / imgHeight;

        // Get container dimensions
        const containerRect = containerRef.current.getBoundingClientRect();
        const containerWidth = containerRect.width;
        const containerHeight = containerRect.height;

        // Calculate canvas size to exactly match image aspect ratio
        let canvasWidth: number;
        let canvasHeight: number;

        if (containerWidth / containerHeight > imageAspectRatioRef.current) {
          // Container is wider than image - fit by height
          canvasHeight = containerHeight;
          canvasWidth = containerHeight * imageAspectRatioRef.current;
        } else {
          // Container is taller than image - fit by width
          canvasWidth = containerWidth;
          canvasHeight = containerWidth / imageAspectRatioRef.current;
        }

        // Resize canvas to match image aspect ratio
        canvas.setDimensions({ width: canvasWidth, height: canvasHeight });

        // Scale image to fill canvas exactly (no padding/bars)
        const scale = canvasWidth / imgWidth;

        img.set({
          scaleX: scale,
          scaleY: scale,
          left: 0,
          top: 0,
          selectable: false,
          evented: false,
          originX: "left",
          originY: "top",
        });

        canvas.add(img);
        canvas.sendObjectToBack(img);
        canvas.renderAll();
      },
    );
  }, [currentImage]);

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
