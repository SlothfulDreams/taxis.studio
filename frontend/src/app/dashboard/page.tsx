"use client";

import { useMutation, useQuery } from "convex/react";
import type { GenericId } from "convex/values";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Clock,
  FileText,
  Plus,
  Sparkles,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/motion";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { api } from "../../../convex/_generated/api";

export default function DashboardPage() {
  const projects = useQuery(api.projects.listProjects);
  const createProject = useMutation(api.projects.createProject);
  const deleteProject = useMutation(api.projects.deleteProject);

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [deletingId, setDeletingId] = useState<GenericId<"projects"> | null>(
    null,
  );

  const handleCreateProject = async () => {
    if (!newProjectName.trim()) {
      toast.error("Please enter a project name");
      return;
    }

    setIsCreating(true);
    try {
      await createProject({ name: newProjectName.trim() });
      toast.success("Project created");
      setIsCreateDialogOpen(false);
      setNewProjectName("");
    } catch (error) {
      toast.error("Failed to create project");
      console.error(error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteProject = async (
    projectId: GenericId<"projects">,
    e: React.MouseEvent,
  ) => {
    e.preventDefault();
    e.stopPropagation();

    if (
      !confirm(
        "Are you sure you want to delete this project? This action cannot be undone.",
      )
    ) {
      return;
    }

    setDeletingId(projectId);
    try {
      await deleteProject({ projectId });
      toast.success("Project deleted");
    } catch (error) {
      toast.error("Failed to delete project");
      console.error(error);
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffDays = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  // Loading state
  if (projects === undefined) {
    return (
      <div className="flex items-center justify-center py-24">
        <motion.div
          className="size-8 rounded-full border-2 border-primary/20 border-t-primary"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      {/* Background Decoration */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-0 -translate-x-1/2 w-full max-w-7xl h-96 bg-primary/5 blur-[100px] rounded-full" />
      </div>

      <div className="container relative mx-auto max-w-7xl px-6 py-12 md:py-20">
        {/* Header */}
        <FadeIn>
          <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <h1 className="font-display text-3xl font-light tracking-tight text-foreground sm:text-4xl">
                Projects
              </h1>
              <p className="mt-2 text-muted-foreground/80 max-w-md antialiased">
                Manage your interior design spaces.
              </p>
            </div>

            <Dialog
              open={isCreateDialogOpen}
              onOpenChange={setIsCreateDialogOpen}
            >
              <DialogTrigger asChild>
                <Button size="lg" className="rounded-full px-6">
                  <Plus className="mr-2 size-4" />
                  New Project
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Create new project</DialogTitle>
                  <DialogDescription>
                    Give your project a name to get started.
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  <Input
                    placeholder="Project name"
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleCreateProject();
                    }}
                  />
                </div>
                <DialogFooter>
                  <Button
                    variant="ghost"
                    onClick={() => setIsCreateDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleCreateProject} disabled={isCreating}>
                    {isCreating ? (
                      <>
                        <motion.div
                          className="mr-2 size-4 rounded-full border-2 border-white/30 border-t-white"
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                        />
                        Creating...
                      </>
                    ) : (
                      "Create"
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </FadeIn>

        {/* Projects Grid */}
        {projects.length === 0 ? (
          <FadeIn delay={0.1}>
            <div className="relative overflow-hidden rounded-3xl border border-white/5 bg-white/[0.02] px-6 py-24 text-center shadow-2xl backdrop-blur-sm sm:px-12">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-50" />
              <div className="relative flex flex-col items-center">
                <div className="mb-6 flex size-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 shadow-lg">
                  <Sparkles className="size-8 text-primary" />
                </div>
                <h3 className="mb-2 text-xl font-medium tracking-tight text-foreground">
                  No projects yet
                </h3>
                <p className="mb-8 max-w-sm text-muted-foreground">
                  Start by creating your first project. You can generate new
                  interiors or edit existing photos.
                </p>
                <Button
                  onClick={() => setIsCreateDialogOpen(true)}
                  variant="outline"
                  className="border-primary/20 hover:bg-primary/5"
                >
                  Create Project
                </Button>
              </div>
            </div>
          </FadeIn>
        ) : (
          <StaggerContainer className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map(
              (project: {
                _id: GenericId<"projects">;
                name: string;
                description?: string;
                thumbnailUrl: string | null;
                updatedAt: number;
              }) => (
                <StaggerItem key={project._id}>
                  <Link
                    href={`/project/${project._id}`}
                    className="group block relative"
                  >
                    <div className="relative overflow-hidden rounded-2xl border border-white/5 bg-card/50 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/20 hover:shadow-2xl hover:shadow-primary/5">
                      {/* Delete Button */}
                      <button
                        type="button"
                        onClick={(e) => handleDeleteProject(project._id, e)}
                        disabled={deletingId === project._id}
                        className="absolute right-3 top-3 z-20 rounded-full bg-black/40 p-2 text-white/70 backdrop-blur-md opacity-0 transition-all hover:bg-destructive hover:text-white group-hover:opacity-100"
                        title="Delete project"
                      >
                        {deletingId === project._id ? (
                          <motion.div
                            className="size-4 rounded-full border-2 border-white/30 border-t-white"
                            animate={{ rotate: 360 }}
                            transition={{
                              duration: 1,
                              repeat: Infinity,
                              ease: "linear",
                            }}
                          />
                        ) : (
                          <Trash2 className="size-4" />
                        )}
                      </button>

                      {/* Thumbnail */}
                      <div className="aspect-[4/3] bg-muted/50 w-full overflow-hidden relative">
                        {project.thumbnailUrl ? (
                          // biome-ignore lint/performance/noImgElement: Dynamic Convex storage URLs
                          <img
                            src={project.thumbnailUrl}
                            alt={project.name}
                            className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex size-full items-center justify-center bg-zinc-900/50">
                            <FileText className="size-12 text-zinc-800" />
                          </div>
                        )}

                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                      </div>

                      {/* Info */}
                      <div className="p-5">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3 className="font-medium text-lg tracking-tight text-foreground transition-colors group-hover:text-primary">
                              {project.name}
                            </h3>
                            {project.description && (
                              <p className="mt-1 line-clamp-1 text-xs text-muted-foreground/80">
                                {project.description}
                              </p>
                            )}
                          </div>
                          <ArrowUpRight className="size-5 text-muted-foreground opacity-0 -translate-x-2 translate-y-2 transition-all duration-300 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100 group-hover:text-primary" />
                        </div>

                        <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground/60">
                          <Clock className="size-3.5" />
                          <span>
                            Last updated {formatDate(project.updatedAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </StaggerItem>
              ),
            )}
          </StaggerContainer>
        )}
      </div>
    </div>
  );
}
