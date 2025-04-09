// src/presentation/services/post.service.ts
import { getIO } from "../../config/socket";
import { Post } from "../../data";
import { CreateDTO, CustomError } from "../../domain";
import { UpdateDTO } from "../../domain/dtos/post/update.dto";

export class PostService {
  constructor() {}

  async findAllPost() {
    try {
      return await Post.find({
        order: {
          createdAt: "DESC", // Ordenar por fecha de creación, más reciente primero
        },
      });
    } catch (error) {
      throw CustomError.internalServer("Error obteniendo datos")
    }
  }
  

  async findOnePost(id: string) {
    const post = await Post.findOne({ where: { id } });
    if (!post) throw CustomError.notFound("Post no encontrado")
    return post;
  }

  async createPost(postData: CreateDTO) {
    const post = new Post();
    post.title = postData.title.toLowerCase().trim();
    post.subtitle = postData.subtitle.toLowerCase().trim();
    post.content = postData.content.trim();
    post.imgpost = postData.imgpost;

    try {
      const nuevoPost = await post.save();
      getIO().emit("postChanged", nuevoPost); // 🔥 Emitimos evento
      return nuevoPost;
    } catch {
      throw CustomError.internalServer("Error creando el Post")
    }
  }

  async updatePost(id: string, postData: UpdateDTO) {
    const post = await this.findOnePost(id);
    post.title = postData.title.toLowerCase().trim();
    post.subtitle = postData.subtitle.toLowerCase().trim();
    post.content = postData.content.trim();
    post.imgpost = postData.imgpost;

    try {
      const postActualizado = await post.save();
      getIO().emit("postChanged", postActualizado); // 🔥 Emitimos evento
      return postActualizado;
    } catch {
      throw CustomError.internalServer("Error actualizando el Post")
    }
  }

  async deletePost(id: string) {
    const post = await this.findOnePost(id);
    post.status = false;
    try {
      await post.remove();
      getIO().emit("postChanged", post); // 🔥 Emitimos evento
    } catch {
      throw CustomError.internalServer("Error eliminando el Post")
    }
  }
}
