import mongoose from "mongoose";
import { dataSave } from "../schema/index.js";
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
  searchHelpArticles = async (req: Request, res: Response): Promise<void> => {
    try {
      const search = String(req.query.search || "").trim();

      if (!search) {
        res.status(200).json({
          success: true,
          count: 0,
          data: [],
        });
        return;
      }

      // Escape regex special characters
      const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

      const articles = await dataSave
        .find({
          status: "published",
          title: {
            $regex: escapedSearch,
            $options: "i",
          },
        })
        .select("_id title slug summary readTime categoryKey itemKey")
        .sort({
          createdAt: -1,
        })
        .limit(20)
        .lean();

      res.status(200).json({
        success: true,
        count: articles.length,
        data: articles,
      });
    } catch (error) {
      console.error("Error searching help articles:", error);
      res.status(500).json({
        success: false,
        message: "Server error while searching help articles",
      });
    }
  };
  getSingleData = async (req: Request, res: Response): Promise<void> => {
    console.log("get Single Data");
    try {
      const { article } = req.params;
      console.log("articleData", article);

      if (!article) {
        res.status(400).json({
          success: false,
          message: "Article ID is required",
        });
        return;
      }

      const post = await dataSave.findOne({
        _id: article,
        status: "published",
      });

      if (!post) {
        res.status(404).json({
          success: false,
          message: "Help article not found",
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
        message: "Server error while fetching help article",
      });
    }
  };
  getAllData = async (req: Request, res: Response): Promise<void> => {
    try {
      const posts = await dataSave
        .find({ status: "published" })
        .select(
          "_id title summary slug itemKey categoryKey  createdAt updatedAt",
        )
        .sort({ createdAt: -1 });

      res.status(200).json({
        success: true,
        data: posts,
      });
    } catch (error) {
      console.error("Error fetching updates:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch updates",
      });
    }
  };

  deleteData = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(400).json({
          success: false,
          message: "Post ID is required",
        });
        return;
      }

      const deletedPost = await dataSave.findByIdAndDelete(id);

      if (!deletedPost) {
        res.status(404).json({
          success: false,
          message: "Post not found",
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: "Post deleted successfully",
        data: deletedPost,
      });
    } catch (error) {
      console.error("Delete post error:", error);

      res.status(500).json({
        success: false,
        message: "Server error while deleting post",
      });
    }
  };
  // updateHelpPostById = async (req: Request, res: Response): Promise<void> => {
  //   try {
  //     const { id } = req.params as string | string[];

  //     // Validate ID
  //     if (!mongoose.Types.ObjectId.isValid(id)) {
  //       res.status(400).json({
  //         success: false,
  //         message: "Invalid article ID",
  //       });
  //       return;
  //     }

  //     // Find existing article first
  //     const existingArticle = await dataSave.findById(id);

  //     if (!existingArticle) {
  //       res.status(404).json({
  //         success: false,
  //         message: "Article not found",
  //       });
  //       return;
  //     }

  //     /**
  //      * Only allow fields from your schema.
  //      * MongoDB internal fields are NOT allowed.
  //      */
  //     const allowedFields = [
  //       "categoryKey",
  //       "itemKey",
  //       "title",
  //       "slug",
  //       "summary",
  //       "readTime",
  //       "blocks",
  //       "nextArticle",
  //       "status",
  //     ];

  //     const updateData: Record<string, any> = {};

  //     for (const field of allowedFields) {
  //       if (req.body[field] !== undefined) {
  //         updateData[field] = req.body[field];
  //       }
  //     }

  //     // Nothing to update
  //     if (Object.keys(updateData).length === 0) {
  //       res.status(400).json({
  //         success: false,
  //         message: "No valid fields provided for update",
  //       });
  //       return;
  //     }

  //     // Check duplicate slug
  //     if (updateData.slug && updateData.slug !== existingArticle.slug) {
  //       const slugExists = await dataSave.findOne({
  //         slug: updateData.slug,
  //         _id: { $ne: id },
  //       });

  //       if (slugExists) {
  //         res.status(409).json({
  //           success: false,
  //           message: "This slug already exists",
  //         });
  //         return;
  //       }
  //     }

  //     // Update
  //     const updatedArticle = await dataSave.findByIdAndUpdate(
  //       id,
  //       {
  //         $set: updateData,
  //       },
  //       {
  //         new: true,
  //         runValidators: true,
  //       },
  //     );

  //     res.status(200).json({
  //       success: true,
  //       message: "Article updated successfully",
  //       data: updatedArticle,
  //     });
  //   } catch (error: any) {
  //     console.error("UPDATE ARTICLE ERROR:", error);

  //     // Duplicate key error
  //     if (error.code === 11000) {
  //       res.status(409).json({
  //         success: false,
  //         message: "Slug already exists",
  //       });
  //       return;
  //     }

  //     res.status(500).json({
  //       success: false,
  //       message: error.message || "Failed to update article",
  //     });
  //   }
  // };
}
