import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

export default defineSchema({
  // Auth tables from @convex-dev/auth
  ...authTables,

  // users - extended with custom fields
  users: defineTable({
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    emailVerificationTime: v.optional(v.number()),
    image: v.optional(v.string()),
    isAnonymous: v.optional(v.boolean()),
    createdAt: v.optional(v.number()),
  }).index("email", ["email"]),

  // projects - user's design projects
  projects: defineTable({
    userId: v.id("users"),
    name: v.string(),
    description: v.optional(v.string()),
    thumbnailId: v.optional(v.id("_storage")),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_user", ["userId"]),

  // images - original uploads and generated results
  images: defineTable({
    projectId: v.id("projects"),
    userId: v.id("users"),
    storageId: v.id("_storage"),
    type: v.union(
      v.literal("original"),
      v.literal("generated"),
      v.literal("mask"),
    ),
    parentImageId: v.optional(v.id("images")), // for generated images, reference to source
    prompt: v.optional(v.string()),
    aiModel: v.optional(v.string()), // "gpt-image-1.5" or "gemini-flash"
    metadata: v.optional(
      v.object({
        width: v.number(),
        height: v.number(),
        format: v.string(),
      }),
    ),
    createdAt: v.number(),
  })
    .index("by_project", ["projectId"])
    .index("by_user", ["userId"]),

  // edits - history of edit operations
  edits: defineTable({
    imageId: v.id("images"),
    projectId: v.id("projects"),
    userId: v.id("users"),
    prompt: v.string(),
    maskStorageId: v.optional(v.id("_storage")),
    resultImageId: v.optional(v.id("images")),
    aiModel: v.string(),
    status: v.union(
      v.literal("pending"),
      v.literal("processing"),
      v.literal("completed"),
      v.literal("failed"),
    ),
    errorMessage: v.optional(v.string()),
    tokenUsage: v.optional(
      v.object({
        input: v.number(),
        output: v.number(),
      }),
    ),
    createdAt: v.number(),
    completedAt: v.optional(v.number()),
  })
    .index("by_image", ["imageId"])
    .index("by_project", ["projectId"])
    .index("by_status", ["status"]),
});
