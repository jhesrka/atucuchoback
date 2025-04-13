import { Request, Response } from "express";
import { PostService } from "../services/post.service";
import { CreateDTO, CustomError, UpdateDTO } from "../../domain";

export class PostController {
  constructor(private readonly postService: PostService) {}

  private handleError = (error: unknown, res: Response) => {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ message: error.message });
    }

    console.error("Unhandled error:", error);
    return res.status(500).json({ message: "Something went very wrong" });
  };

  createPost = (req: Request, res: Response) => {
    const [error, createPostDto] = CreateDTO.create(req.body);
    if (error) {
      return res.status(422).json({ message: error });
    }

    this.postService
      .createPost(createPostDto!)
      .then((data) => {
        res.status(201).json(data);
      })
      .catch((error: unknown) => this.handleError(error, res));
  };

  findAllPost = (req: Request, res: Response) => {
    this.postService
      .findAllPost()
      .then((data) => {
        res.status(201).json(data);
      })
      .catch((error:unknown) => this.handleError(error,res));
  };

  findOnePost = (req: Request, res: Response) => {
    const { id } = req.params;
    this.postService
      .findOnePost(id)
      .then((data) => {
        res.status(201).json(data);
      })
      .catch((error: unknown) => this.handleError(error, res));
  };

  updatePost = (req: Request, res: Response) => {
    const { id } = req.params;

    const [error, updateProductDto] = UpdateDTO.create(req.body);
    if (error) return res.status(422).json({ message: error });
    this.postService
      .updatePost(id, updateProductDto!)
      .then((data) => {
        res.status(200).json(data);
      })
      .catch((error: unknown) => this.handleError(error, res));
  };
  deletePost = (req: Request, res: Response) => {
    const { id } = req.params;
    this.postService
      .deletePost(id)
      .then(() => {
        res.status(204).json(null);
      })
      .catch((error: unknown) => this.handleError(error, res));
  };
}
