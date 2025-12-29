import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

// List all edits for a project
export const listEdits = query({
  args: { projectId: v.id("projects") },
  handler: async (ctx, args) => {
    const edits = await ctx.db
      .query("edits")
      .withIndex("by_project", (q) => q.eq("projectId", args.projectId))
      .order("desc")
      .collect();

    return edits;
  },
});

// Create a new edit request
export const createEdit = mutation({
  args: {
    imageId: v.id("images"),
    projectId: v.id("projects"),
    prompt: v.string(),
    maskStorageId: v.optional(v.id("_storage")),
    aiModel: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    // Build insert object with only defined values
    const insertData: Record<string, unknown> = {
      imageId: args.imageId,
      projectId: args.projectId,
      userId,
      prompt: args.prompt,
      aiModel: args.aiModel,
      status: "pending",
      createdAt: Date.now(),
    };

    if (args.maskStorageId !== undefined) {
      insertData.maskStorageId = args.maskStorageId;
    }

    const editId = await ctx.db.insert("edits", insertData as never);

    return editId;
  },
});

// Update edit status (called by backend after processing)
export const updateEditStatus = mutation({
  args: {
    editId: v.id("edits"),
    status: v.union(
      v.literal("pending"),
      v.literal("processing"),
      v.literal("completed"),
      v.literal("failed"),
    ),
    resultImageId: v.optional(v.id("images")),
    errorMessage: v.optional(v.string()),
    tokenUsage: v.optional(
      v.object({
        input: v.number(),
        output: v.number(),
      }),
    ),
  },
  handler: async (ctx, args) => {
    const edit = await ctx.db.get(args.editId);
    if (!edit) {
      throw new Error("Edit not found");
    }

    const updates: Record<string, unknown> = {
      status: args.status,
    };

    if (args.resultImageId !== undefined) {
      updates.resultImageId = args.resultImageId;
    }
    if (args.errorMessage !== undefined) {
      updates.errorMessage = args.errorMessage;
    }
    if (args.tokenUsage !== undefined) {
      updates.tokenUsage = args.tokenUsage;
    }
    if (args.status === "completed" || args.status === "failed") {
      updates.completedAt = Date.now();
    }

    await ctx.db.patch(args.editId, updates as never);
    return args.editId;
  },
});

// Get pending edits (for backend processing)
export const getPendingEdits = query({
  args: {},
  handler: async (ctx) => {
    const pendingEdits = await ctx.db
      .query("edits")
      .withIndex("by_status", (q) => q.eq("status", "pending"))
      .collect();

    // Get image URLs for each edit
    const editsWithUrls = await Promise.all(
      pendingEdits.map(async (edit) => {
        const image = edit.imageId
          ? await ctx.db.get(edit.imageId as never)
          : null;
        let imageUrl = null;
        let maskUrl = null;

        if (image && (image as { storageId?: string }).storageId) {
          imageUrl = await ctx.storage.getUrl(
            (image as { storageId: string }).storageId,
          );
        }
        if (edit.maskStorageId) {
          maskUrl = await ctx.storage.getUrl(edit.maskStorageId as string);
        }

        return { ...edit, imageUrl, maskUrl };
      }),
    );

    return editsWithUrls;
  },
});
