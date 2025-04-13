import { Router } from "express";
import { PostController } from "./controller";
import { PostService } from "../services/post.service";

export class PostRoutes {
  static get routes(): Router {
    const router = Router();
    const postService = new PostService();
    const postController = new PostController(postService);

    router.get("/", postController.findAllPost);
    router.post("/", postController.createPost);
    router.get("/:id", postController.findOnePost);
    router.patch("/:id", postController.updatePost);
    router.delete("/:id", postController.deletePost);
   
    return router;
  }
}
