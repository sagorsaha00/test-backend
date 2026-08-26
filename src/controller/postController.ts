import { dataSave } from "../schema/index";
import { Request, Response } from "express";
function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
export class PostController {
  constructor() {
    console.log("PostController initialized");
  }

  createPost = async (req: Request, res: Response) => {
    console.log("try to create post");
    try {
      const {
        title,
        categoryKey,
        itemKey,
        slug,
        summary,
        readTime,
        status,
        blocks,
        nextArticle,
      } = req.body;
      console.log("Received request body:", req.body);

      if (!title?.trim()) {
        return res.status(400).json({ error: "Title is required." });
      }
      if (!categoryKey || !itemKey) {
        return res
          .status(400)
          .json({ error: "Category and section are required." });
      }

      const finalSlug = slug?.trim() ? slugify(slug) : slugify(title);

      const existing = await dataSave.findOne({ slug: finalSlug });
      if (existing) {
        return res
          .status(409)
          .json({ error: "A post with this slug already exists." });
      }

      const post = await dataSave.create({
        title,
        categoryKey,
        itemKey,
        slug: finalSlug,
        summary,
        readTime,
        status,
        blocks,
        nextArticle,
      });

      return res.status(201).json({ post });
    } catch (error: unknown) {
      return res
        .status(500)
        .json({ error: (error as Error).message || "Failed to create post." });
    }
  };

  getPosts = async (req: Request, res: Response): Promise<void> => {
    try {
      // Extract route path values safely as single strings
      const categoryKey = Array.isArray(req.params.categoryKey)
        ? req.params.categoryKey[0]
        : req.params.categoryKey || (req.query.categoryKey as string);

      const itemKey = Array.isArray(req.params.itemKey)
        ? req.params.itemKey[0]
        : req.params.itemKey || (req.query.itemKey as string);

      // Query published articles by categoryKey & itemKey
      const post = await dataSave.find({
        categoryKey,
        itemKey,
        status: "published",
      });

      if (!post) {
        res.status(404).json({
          success: false,
          message: `No published guide found for category '${categoryKey}' and item '${itemKey}'`,
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: post,
      });
    } catch (error) {
      console.error("Error fetching help article:", error);
      res.status(500).json({
        success: false,
        message: "Server error while fetching help content",
      });
    }
  };
}
