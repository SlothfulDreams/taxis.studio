"use client";

import { useCallback, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useEditor } from "./EditorContext";
import { toast } from "sonner";

interface ImageUploadProps {
  onImageUpload?: (file: File, dataUrl: string) => void | Promise<void>;
}

export function ImageUpload({ onImageUpload }: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { setCurrentImage, clearHistory } = useEditor();
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload an image file");
        return;
      }

      // Validate file size (50MB max)
      if (file.size > 50 * 1024 * 1024) {
        toast.error("Image must be less than 50MB");
        return;
      }

      const reader = new FileReader();
      reader.onload = async (event) => {
        const dataUrl = event.target?.result as string;
        setCurrentImage(dataUrl);
        clearHistory();
        toast.success("Image uploaded!");

        // Call the optional callback for Convex storage
        if (onImageUpload) {
          await onImageUpload(file, dataUrl);
        }
      };
      reader.onerror = () => {
        toast.error("Failed to read image");
      };
      reader.readAsDataURL(file);

      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    },
    [setCurrentImage, clearHistory, onImageUpload],
  );

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      const input = fileInputRef.current;
      if (input) {
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        input.files = dataTransfer.files;
        input.dispatchEvent(new Event("change", { bubbles: true }));
      }
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      onClick={() => fileInputRef.current?.click()}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className={`group relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed transition-all duration-300 ${
        isDragging
          ? "border-primary bg-primary/5 scale-[1.02]"
          : "border-border/40 bg-muted/20 hover:border-primary/50 hover:bg-muted/40"
      } h-96 w-full cursor-pointer p-12 text-center`}
    >
      <div className={`mb-6 flex size-20 items-center justify-center rounded-full transition-all duration-300 ${
         isDragging ? "bg-primary/10 text-primary scale-110" : "bg-muted text-muted-foreground group-hover:scale-110 group-hover:bg-primary/10 group-hover:text-primary"
      }`}>
        <svg
            className="size-10"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
      </div>

      <h3 className="mb-2 text-xl font-medium tracking-tight text-foreground">
        Upload an image
      </h3>
      <p className="mb-8 max-w-sm text-sm text-muted-foreground">
        Drag and drop your image here, or click to select from your computer
      </p>

      <div className="flex gap-3">
         <span className="inline-flex items-center rounded-md bg-muted px-2 py-1 text-xs font-medium text-muted-foreground ring-1 ring-inset ring-gray-500/10">JPG</span>
         <span className="inline-flex items-center rounded-md bg-muted px-2 py-1 text-xs font-medium text-muted-foreground ring-1 ring-inset ring-gray-500/10">PNG</span>
         <span className="inline-flex items-center rounded-md bg-muted px-2 py-1 text-xs font-medium text-muted-foreground ring-1 ring-inset ring-gray-500/10">WEBP</span>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </motion.div>
  );
}
