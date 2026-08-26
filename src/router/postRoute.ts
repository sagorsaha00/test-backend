import express from "express";
import { PostController } from "../controller/postController";

const router = express.Router();

const postController = new PostController();

router.post("/posts", postController.createPost);
router.get("/help/:categoryKey/:itemKey", postController.getPosts);
router.get("/search", postController.searchHelpArticles);
router.get("/article/:article", postController.getSingleData);
router.get("/allData", postController.getAllData);
router.delete("/delete/:id", postController.deleteData);
router.patch("/update-articles/:id", postController.deleteData);

export default router;
