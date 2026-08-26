import express from "express";
import { PostController } from "../controller/postController";

const router = express.Router();

const postController = new PostController();

router.post("/posts", postController.createPost);
router.get("/help/:categoryKey/:itemKey", postController.getPosts);

export default router;
