import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Comment, CommentDocument } from './schemas/comments.schema';
import { Model, Types } from 'mongoose';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentService {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>
  ) {}

  async create(postId: string, userId: string, dto: CreateCommentDto, imagenUrl?: string): Promise<Comment> {
    const comment = new this.commentModel({
      post: new Types.ObjectId(postId),
      autor: new Types.ObjectId(userId),
      texto: dto.texto,
      imagenUrl,
      modificado: false,
    });

    return comment.save();
  }

  async update(postId: string, commentId: string, dto: UpdateCommentDto): Promise<Comment> {
    const comment = await this.commentModel.findOne({
      _id: commentId,
      post: postId,
    });

    if (!comment) {
      throw new NotFoundException('Comentario no encontrado');
    }


    if (dto.texto !== undefined) {
      comment.texto = dto.texto;
      comment.modificado = true;

      return comment.save();
    }

    return comment; // si no hay cambios, devolvemos el mismo comentario
  }

  async findByPost(postId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [comments, total] = await Promise.all([
      this.commentModel
        .find({ post: postId })
        .populate('autor', '-password') // opcional
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.commentModel.countDocuments({ post: postId }),
    ]);

    return {
      total,
      page,
      limit,
      comments,
    };
  }
}
