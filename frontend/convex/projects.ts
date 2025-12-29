import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

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
          thumbnailUrl = await ctx.storage.getUrl(
            project.thumbnailId as string,
          );
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
      thumbnailUrl = await ctx.storage.getUrl(project.thumbnailId as string);
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
    const insertData: Record<string, unknown> = {
      userId,
      name: args.name,
      createdAt: now,
      updatedAt: now,
    };

    if (args.description !== undefined) {
      insertData.description = args.description;
    }

    const projectId = await ctx.db.insert("projects", insertData as never);

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
      await ctx.storage.delete(image.storageId as string);
      await ctx.db.delete(image._id as never);
    }

    // Delete all edits associated with the project
    const edits = await ctx.db
      .query("edits")
      .withIndex("by_project", (q) => q.eq("projectId", args.projectId))
      .collect();

    for (const edit of edits) {
      if (edit.maskStorageId) {
        await ctx.storage.delete(edit.maskStorageId as string);
      }
      await ctx.db.delete(edit._id as never);
    }

    // Delete the project thumbnail if exists
    if (project.thumbnailId) {
      await ctx.storage.delete(project.thumbnailId as string);
    }

    // Delete the project
    await ctx.db.delete(args.projectId);
    return args.projectId;
  },
});
