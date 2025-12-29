"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useQuery, useMutation } from "convex/react";
import type { GenericId } from "convex/values";
import { api } from "../../../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  EditorProvider,
  useEditor,
  ImageCanvas,
  Toolbar,
  PromptPanel,
  ImageUpload,
} from "@/components/editor";

interface ProjectPageProps {
  params: Promise<{ projectId: string }>;
}

function EditorContent({ projectId }: { projectId: GenericId<"projects"> }) {
  const router = useRouter();
  const project = useQuery(api.projects.getProject, {
    projectId,
  });
  const images = useQuery(api.images.listImages, {
    projectId,
  });
  const generateUploadUrl = useMutation(api.images.generateUploadUrl);
  const saveImage = useMutation(api.images.saveImage);
  const createEdit = useMutation(api.edits.createEdit);

  const {
    currentImage,
    setCurrentImage,
    prompt,
    selectedModel,
    setIsGenerating,
    addToHistory,
    exportMask,
    clearHistory,
  } = useEditor();

  const [currentImageId, setCurrentImageId] =
    useState<GenericId<"images"> | null>(null);

  // Load the most recent image when images are loaded
  useEffect(() => {
    if (images && images.length > 0 && !currentImage) {
      const latestImage = images[0]; // Most recent (ordered by desc)
      if (latestImage.url) {
        setCurrentImage(latestImage.url);
        setCurrentImageId(latestImage._id);
      }
    }
  }, [images, currentImage, setCurrentImage]);

  // Handle image upload to Convex storage
  const handleImageUpload = useCallback(
    async (file: File, dataUrl: string) => {
      try {
        // Get upload URL from Convex
        const uploadUrl = await generateUploadUrl();

        // Upload the file
        const response = await fetch(uploadUrl, {
          method: "POST",
          headers: { "Content-Type": file.type },
          body: file,
        });

        if (!response.ok) {
          throw new Error("Failed to upload image");
        }

        const { storageId } = await response.json();

        // Save image metadata to Convex
        const imageId = await saveImage({
          projectId,
          storageId,
          type: "original",
          metadata: {
            width: 0, // Will be set by backend if needed
            height: 0,
            format: file.type.split("/")[1] || "png",
          },
        });

        setCurrentImageId(imageId);
        clearHistory();
        toast.success("Image uploaded and saved!");
      } catch (error) {
        console.error("Upload error:", error);
        toast.error("Failed to save image to project");
      }
    },
    [generateUploadUrl, saveImage, projectId, clearHistory],
  );

  const handleGenerate = useCallback(async () => {
    if (!currentImage) {
      toast.error("Please upload an image first");
      return;
    }

    setIsGenerating(true);

    try {
      const backendUrl =
        process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

      // Get base64 from data URL or fetch from URL
      let imageBase64: string;
      if (currentImage.startsWith("data:")) {
        imageBase64 = currentImage.split(",")[1];
      } else {
        // Fetch image and convert to base64
        const response = await fetch(currentImage);
        const blob = await response.blob();
        const reader = new FileReader();
        imageBase64 = await new Promise((resolve) => {
          reader.onloadend = () => {
            const result = reader.result as string;
            resolve(result.split(",")[1]);
          };
          reader.readAsDataURL(blob);
        });
      }

      // Export mask if using GPT model
      let maskBase64: string | undefined;
      if (selectedModel === "gpt") {
        const maskDataUrl = exportMask();
        if (maskDataUrl) {
          maskBase64 = maskDataUrl.split(",")[1];
        }
      }

      // Create edit record in Convex if we have a current image ID
      if (currentImageId) {
        await createEdit({
          imageId: currentImageId,
          projectId,
          prompt,
          aiModel: selectedModel === "gpt" ? "gpt-image-1.5" : "gemini-flash",
        });
      }

      const endpoint =
        selectedModel === "gemini" && !maskBase64
          ? "/api/edit/semantic"
          : "/api/edit";

      const body =
        selectedModel === "gemini" && !maskBase64
          ? {
              image_base64: imageBase64,
              prompt,
              preserve_description:
                "Keep the overall room layout, lighting, and unmentioned elements unchanged.",
            }
          : {
              image_base64: imageBase64,
              mask_base64: maskBase64,
              prompt,
              model: selectedModel === "gpt" ? "gpt-image-1.5" : "gemini-flash",
              quality: "medium",
            };

      const response = await fetch(`${backendUrl}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Failed to generate image");
      }

      const result = await response.json();

      // Convert base64 to data URL
      const newImageDataUrl = `data:${result.mime_type};base64,${result.image_base64}`;

      // Add current image to history before updating
      addToHistory(currentImage);

      // Save generated image to Convex storage
      try {
        // Convert base64 to blob
        const binaryString = atob(result.image_base64);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        const blob = new Blob([bytes], { type: result.mime_type });

        // Upload to Convex
        const uploadUrl = await generateUploadUrl();
        const uploadResponse = await fetch(uploadUrl, {
          method: "POST",
          headers: { "Content-Type": result.mime_type },
          body: blob,
        });

        if (uploadResponse.ok) {
          const { storageId } = await uploadResponse.json();

          // Save image metadata
          const newImageId = await saveImage({
            projectId,
            storageId,
            type: "generated",
            parentImageId: currentImageId ?? undefined,
            prompt,
            aiModel: selectedModel === "gpt" ? "gpt-image-1.5" : "gemini-flash",
          });

          setCurrentImageId(newImageId);
        }
      } catch (saveError) {
        console.error("Failed to save generated image:", saveError);
        // Continue anyway - the image is still displayed
      }

      // Update current image
      setCurrentImage(newImageDataUrl);

      toast.success("Image generated successfully!");
    } catch (error) {
      console.error("Generation error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to generate image",
      );
    } finally {
      setIsGenerating(false);
    }
  }, [
    currentImage,
    currentImageId,
    prompt,
    selectedModel,
    exportMask,
    addToHistory,
    setCurrentImage,
    setIsGenerating,
    generateUploadUrl,
    saveImage,
    createEdit,
    projectId,
  ]);

  const handleExport = useCallback(() => {
    if (!currentImage) {
      toast.error("No image to export");
      return;
    }

    const link = document.createElement("a");
    link.href = currentImage;
    link.download = `interior-ai-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Image downloaded!");
  }, [currentImage]);

  // Loading state
  if (project === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(ellipse_at_top,_oklch(0.12_0.03_280)_0%,_oklch(0.08_0.02_280)_50%,_oklch(0.06_0.01_280)_100%)]">
        <motion.div
          className="size-10 rounded-full border-2 border-violet-500/30 border-t-violet-500"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </div>
    );
  }

  // Project not found
  if (project === null) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[radial-gradient(ellipse_at_top,_oklch(0.12_0.03_280)_0%,_oklch(0.08_0.02_280)_50%,_oklch(0.06_0.01_280)_100%)]">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="mb-6 flex size-20 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600/20 to-fuchsia-600/20 border border-white/[0.08] mx-auto">
            <svg
              className="size-10 text-slate-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h1 className="text-xl font-medium text-white mb-2">
            Project not found
          </h1>
          <p className="text-slate-400 mb-6">
            This project may have been deleted or doesn't exist.
          </p>
          <Button variant="premium" onClick={() => router.push("/dashboard")}>
            Back to Dashboard
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden">
      {/* Header */}
      <header className="relative z-20 flex h-14 items-center justify-between border-b border-border/40 bg-background/80 px-4 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard"
            className="group flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
          >
            <div className="flex size-8 items-center justify-center rounded-md border border-border/50 bg-muted/50 transition-colors group-hover:border-primary/20 group-hover:bg-primary/10 group-hover:text-primary">
              <svg
                className="size-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </div>
            <span className="hidden text-sm font-medium sm:inline">Back</span>
          </Link>

          <div className="h-4 w-px bg-border/60" />

          <div className="flex items-center gap-3">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <svg
                className="size-4"
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
            <div>
              <h1 className="text-sm font-medium tracking-tight">
                {project.name}
              </h1>
              {project.description && (
                <p className="max-w-[200px] truncate text-xs text-muted-foreground">
                  {project.description}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            disabled={!currentImage}
            className="h-8 gap-2 border-border/50 bg-background/50 hover:bg-accent hover:text-accent-foreground"
          >
            <svg
              className="size-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            <span className="hidden sm:inline">Export</span>
          </Button>
        </div>
      </header>

      <div className="relative flex flex-1 overflow-hidden">
        {/* Left Sidebar - Tools */}
        <Toolbar />

        {/* Main Canvas Area */}
        <main className="relative flex flex-1 items-center justify-center overflow-hidden bg-muted/20 p-6">
          {/* Dot Pattern Background */}
          <div
            className="absolute inset-0 z-0 opacity-20"
            style={{
              backgroundImage: "radial-gradient(#a1a1aa 1px, transparent 1px)",
              backgroundSize: "20px 20px",
            }}
          ></div>

          <div className="relative z-10 w-full max-w-5xl h-full flex items-center justify-center">
            {currentImage ? (
              <div className="relative shadow-2xl shadow-black/20 rounded-lg overflow-hidden border border-border/40">
                <ImageCanvas width={1024} height={768} />
              </div>
            ) : (
              <ImageUpload onImageUpload={handleImageUpload} />
            )}
          </div>
        </main>

        {/* Right Sidebar - AI Controls */}
        <PromptPanel
          onGenerate={handleGenerate}
          imageHistory={images?.map(
            (img: {
              _id: string;
              url: string | null;
              type: string;
              prompt?: string;
              aiModel?: string;
              createdAt: number;
            }) => ({
              _id: img._id,
              url: img.url,
              type: img.type,
              prompt: img.prompt,
              aiModel: img.aiModel,
              createdAt: img.createdAt,
            }),
          )}
          onSelectHistoryImage={(url: string) => {
            setCurrentImage(url);
            // Find and set the corresponding image ID
            const img = images?.find(
              (i: { url: string | null }) => i.url === url,
            );
            if (img) {
              setCurrentImageId(img._id);
            }
          }}
        />
      </div>
    </div>
  );
}

export default function ProjectPage({ params }: ProjectPageProps) {
  const [projectId, setProjectId] = useState<GenericId<"projects"> | null>(
    null,
  );

  useEffect(() => {
    params.then((p) => setProjectId(p.projectId as GenericId<"projects">));
  }, [params]);

  if (!projectId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(ellipse_at_top,_oklch(0.12_0.03_280)_0%,_oklch(0.08_0.02_280)_50%,_oklch(0.06_0.01_280)_100%)]">
        <motion.div
          className="size-10 rounded-full border-2 border-violet-500/30 border-t-violet-500"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </div>
    );
  }

  return (
    <EditorProvider>
      <EditorContent projectId={projectId} />
    </EditorProvider>
  );
}
