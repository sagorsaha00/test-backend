import mongoose from "mongoose";

const blockSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["paragraph", "list", "steps", "tip", "image"],
      required: true,
    },
    // Shape depends on `type` (paragraph -> {text}, list -> {items: []},
    // steps -> {items: [{title, description}]}, tip -> {label, title, body},
    // image -> {url, caption}). Kept flexible with Mixed so the schema
    // doesn't have to change every time a new block type is added.
    data: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
  },
  { _id: false },
);

const nextArticleSchema = new mongoose.Schema(
  {
    label: { type: String, default: "Next guide" },
    title: { type: String, required: true },
    description: { type: String, default: "" },
    href: { type: String, required: true },
  },
  { _id: false },
);

const helpPostSchema = new mongoose.Schema(
  {
    categoryKey: { type: String, required: true, index: true },
    itemKey: { type: String, required: true },
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true },
    summary: { type: String, default: "" },
    readTime: { type: String, default: "5 min read" },
    blocks: { type: [blockSchema], default: [] },
    nextArticle: { type: nextArticleSchema, default: undefined },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
      index: true,
    },
  },
  { timestamps: true },
);

export const dataSave = mongoose.model("UserHelpPost", helpPostSchema);
