import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// List all projects for the current user
export const listProjects = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }

    const projects = await ctx.db
      .query("projects")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();

    // Get thumbnail URLs for each project
    const projectsWithThumbnails = await Promise.all(
      projects.map(async (project) => {
        let thumbnailUrl = null;
        if (project.thumbnailId) {
          thumbnailUrl = await ctx.storage.getUrl(project.thumbnailId);
        }
        return { ...project, thumbnailUrl };
      }),
    );

    return projectsWithThumbnails;
  },
});

// Get a single project by ID
export const getProject = query({
  args: { projectId: v.id("projects") },
  handler: async (ctx, args) => {
    const project = await ctx.db.get(args.projectId);
    if (!project) {
      return null;
    }

    let thumbnailUrl = null;
    if (project.thumbnailId) {
      thumbnailUrl = await ctx.storage.getUrl(project.thumbnailId);
    }

    return { ...project, thumbnailUrl };
  },
});

// Create a new project
export const createProject = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const now = Date.now();
    const projectId = await ctx.db.insert("projects", {
      userId,
      name: args.name,
      description: args.description,
      createdAt: now,
      updatedAt: now,
    });

    return projectId;
  },
});

// Delete a project
export const deleteProject = mutation({
  args: { projectId: v.id("projects") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const project = await ctx.db.get(args.projectId);
    if (!project) {
      throw new Error("Project not found");
    }

    // Verify ownership
    if (project.userId !== userId) {
      throw new Error("Not authorized");
    }

    // Delete all images associated with the project
    const images = await ctx.db
      .query("images")
      .withIndex("by_project", (q) => q.eq("projectId", args.projectId))
      .collect();

    for (const image of images) {
      try {
        await ctx.storage.delete(image.storageId);
      } catch {
        // Storage file may not exist, continue
      }
      await ctx.db.delete(image._id);
    }

    // Delete all edits associated with the project
    const edits = await ctx.db
      .query("edits")
      .withIndex("by_project", (q) => q.eq("projectId", args.projectId))
      .collect();

    for (const edit of edits) {
      if (edit.maskStorageId) {
        try {
          await ctx.storage.delete(edit.maskStorageId);
        } catch {
          // Storage file may not exist, continue
        }
      }
      await ctx.db.delete(edit._id);
    }

    // Delete the project thumbnail if exists
    if (project.thumbnailId) {
      try {
        await ctx.storage.delete(project.thumbnailId);
      } catch {
        // Storage file may not exist, continue
      }
    }

    // Delete the project
    await ctx.db.delete(args.projectId);
    return args.projectId;
  },
});
