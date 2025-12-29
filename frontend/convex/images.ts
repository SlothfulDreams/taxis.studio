import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

// List all images for a project
export const listImages = query({
  args: { projectId: v.id("projects") },
  handler: async (ctx, args) => {
    const images = await ctx.db
      .query("images")
      .withIndex("by_project", (q) => q.eq("projectId", args.projectId))
      .order("desc")
      .collect();

    // Get URLs for each image
    const imagesWithUrls = await Promise.all(
      images.map(async (image) => {
        const url = await ctx.storage.getUrl(image.storageId as string);
        return { ...image, url };
      }),
    );

    return imagesWithUrls;
  },
});

// Generate upload URL for a new image
export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }
    return await ctx.storage.generateUploadUrl();
  },
});

// Save an uploaded image
export const saveImage = mutation({
  args: {
    projectId: v.id("projects"),
    storageId: v.id("_storage"),
    type: v.union(
      v.literal("original"),
      v.literal("generated"),
      v.literal("mask"),
    ),
    parentImageId: v.optional(v.id("images")),
    prompt: v.optional(v.string()),
    aiModel: v.optional(v.string()),
    metadata: v.optional(
      v.object({
        width: v.number(),
        height: v.number(),
        format: v.string(),
      }),
    ),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    // Build insert object with only defined values
    const insertData: Record<string, unknown> = {
      projectId: args.projectId,
      userId,
      storageId: args.storageId,
      type: args.type,
      createdAt: Date.now(),
    };

    if (args.parentImageId !== undefined) {
      insertData.parentImageId = args.parentImageId;
    }
    if (args.prompt !== undefined) {
      insertData.prompt = args.prompt;
    }
    if (args.aiModel !== undefined) {
      insertData.aiModel = args.aiModel;
    }
    if (args.metadata !== undefined) {
      insertData.metadata = args.metadata;
    }

    const imageId = await ctx.db.insert("images", insertData as never);

    // If this is the first original image, set it as project thumbnail
    if (args.type === "original") {
      const project = await ctx.db.get(args.projectId);
      if (project && !project.thumbnailId) {
        await ctx.db.patch(args.projectId, {
          thumbnailId: args.storageId,
          updatedAt: Date.now(),
        } as never);
      }
    }

    return imageId;
  },
});
