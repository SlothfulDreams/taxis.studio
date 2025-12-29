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
      className="relative cursor-pointer group"
    >
      {/* Animated gradient border */}
      <div className="absolute -inset-px rounded-2xl bg-gradient-to-r from-violet-600 via-fuchsia-500 to-violet-600 opacity-50 blur-sm transition-opacity duration-300 group-hover:opacity-75" />
      <div
        className={`absolute -inset-px rounded-2xl transition-all duration-300 ${
          isDragging
            ? "bg-gradient-to-r from-violet-500 via-fuchsia-400 to-violet-500 opacity-100"
            : "bg-gradient-to-r from-violet-600/50 via-fuchsia-500/50 to-violet-600/50 opacity-70"
        }`}
        style={{
          backgroundSize: "200% 100%",
          animation: "shimmer 3s linear infinite",
        }}
      />

      {/* Main content area */}
      <div
        className={`relative rounded-2xl border-2 border-dashed p-16 text-center transition-all duration-300 ${
          isDragging
            ? "border-transparent bg-gradient-to-br from-violet-600/20 to-fuchsia-600/20"
            : "border-white/[0.1] bg-slate-900/80 hover:bg-slate-900/60"
        }`}
      >
        {/* Floating icon with pulse animation */}
        <motion.div
          className="mx-auto mb-6 flex size-20 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600/20 to-fuchsia-600/20 border border-white/[0.08] shadow-[0_0_30px_rgba(139,92,246,0.2)]"
          animate={isDragging ? { scale: [1, 1.1, 1] } : { y: [0, -5, 0] }}
          transition={isDragging
            ? { duration: 0.5, repeat: Infinity }
            : { duration: 3, repeat: Infinity, ease: "easeInOut" }
          }
        >
          <svg
            className="size-10 text-violet-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {isDragging ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            )}
          </svg>
        </motion.div>

        <motion.h3
          className="mb-2 text-xl font-semibold text-white"
          animate={isDragging ? { scale: 1.05 } : { scale: 1 }}
        >
          {isDragging ? "Drop to upload" : "Upload an image"}
        </motion.h3>

        <p className="mb-4 text-slate-400">
          {isDragging ? "Release to start editing" : "Drag and drop or click to upload"}
        </p>

        {/* Format badges */}
        <div className="flex items-center justify-center gap-2">
          {["PNG", "JPG", "WEBP"].map((format) => (
            <span
              key={format}
              className="rounded-full bg-slate-800/80 px-3 py-1 text-xs font-medium text-slate-400 border border-white/[0.06]"
            >
              {format}
            </span>
          ))}
          <span className="text-xs text-slate-500">up to 50MB</span>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
    </motion.div>
  );
}
