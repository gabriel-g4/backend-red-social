import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';
import { User } from 'src/users/schemas/user.schema';
import { Post } from 'src/posts/schemas/post.schema';

export type CommentDocument = Comment & Document;

@Schema({ timestamps: true })
export class Comment {
  @Prop({ required: true })
  texto: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  autor: Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Post', required: true })
  post: Types.ObjectId;

  @Prop()
  imagenUrl?: string;

  @Prop({ default: false })
  modificado: boolean;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
