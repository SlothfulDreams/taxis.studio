"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useQuery, useMutation } from "convex/react";
import type { GenericId } from "convex/values";
import { api } from "../../../convex/_generated/api";
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
import { toast } from "sonner";
import {
  FadeIn,
  StaggerContainer,
  StaggerItem,
  GlowCard,
} from "@/components/motion";

export default function DashboardPage() {
  const projects = useQuery(api.projects.listProjects);
  const createProject = useMutation(api.projects.createProject);
  const deleteProject = useMutation(api.projects.deleteProject);

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [deletingId, setDeletingId] = useState<GenericId<"projects"> | null>(null);

  const handleCreateProject = async () => {
    if (!newProjectName.trim()) {
      toast.error("Please enter a project name");
      return;
    }

    setIsCreating(true);
    try {
      await createProject({ name: newProjectName.trim() });
      toast.success("Project created!");
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
    return date.toLocaleDateString();
  };

  // Loading state
  if (projects === undefined) {
    return (
      <div className="flex items-center justify-center py-20">
        <motion.div
          className="size-10 rounded-full border-2 border-violet-500/30 border-t-violet-500"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <FadeIn>
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Your Projects</h1>
            <p className="mt-1 text-slate-400">
              Create and manage your interior design projects
            </p>
          </div>

          <Dialog
            open={isCreateDialogOpen}
            onOpenChange={setIsCreateDialogOpen}
          >
            <DialogTrigger asChild>
              <Button variant="premium">
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
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                New Project
              </Button>
            </DialogTrigger>
            <DialogContent>
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
                <Button
                  variant="premium"
                  onClick={handleCreateProject}
                  disabled={isCreating}
                >
                  {isCreating ? (
                    <>
                      <motion.div
                        className="size-4 rounded-full border-2 border-white/30 border-t-white"
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
          <div className="flex flex-col items-center justify-center py-20">
            <motion.div
              className="mb-6 flex size-20 items-center justify-center rounded-full bg-gradient-to-br from-violet-600/20 to-fuchsia-600/20"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <svg
                className="size-10 text-violet-400"
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
            </motion.div>
            <h3 className="mb-2 text-lg font-medium text-white">
              No projects yet
            </h3>
            <p className="mb-6 text-slate-400">
              Create your first project to start designing
            </p>
            <Button
              variant="premium"
              onClick={() => setIsCreateDialogOpen(true)}
            >
              Create your first project
            </Button>
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
                <Link href={`/project/${project._id}`} className="group block">
                  <GlowCard
                    className="relative overflow-hidden"
                    glowColor="violet"
                  >
                    {/* Delete Button */}
                    <button
                      onClick={(e) => handleDeleteProject(project._id, e)}
                      disabled={deletingId === project._id}
                      className="absolute right-2 top-2 z-10 rounded-lg bg-slate-900/80 p-1.5 text-slate-400 opacity-0 transition-all hover:bg-slate-900 hover:text-red-400 group-hover:opacity-100"
                      title="Delete project"
                    >
                      {deletingId === project._id ? (
                        <motion.div
                          className="size-4 rounded-full border-2 border-slate-400 border-t-transparent"
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                        />
                      ) : (
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
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      )}
                    </button>

                    {/* Thumbnail */}
                    <div className="relative aspect-video bg-slate-800/50">
                      {project.thumbnailUrl ? (
                        <img
                          src={project.thumbnailUrl}
                          alt={project.name}
                          className="size-full object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <svg
                            className="size-12 text-slate-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1}
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                      )}
                      {/* Hover overlay */}
                      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-slate-900/90 via-slate-900/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                        <Button variant="glass" size="sm">
                          Open Project
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
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </Button>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="p-4">
                      <h3 className="font-medium text-white transition-colors group-hover:text-violet-400">
                        {project.name}
                      </h3>
                      {project.description && (
                        <p className="mt-1 line-clamp-1 text-sm text-slate-400">
                          {project.description}
                        </p>
                      )}
                      <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
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
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        Updated {formatDate(project.updatedAt)}
                      </div>
                    </div>
                  </GlowCard>
                </Link>
              </StaggerItem>
            ),
          )}
        </StaggerContainer>
      )}
    </div>
  );
}
