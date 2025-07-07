import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Comment, CommentSchema } from './schemas/comments.schema';
import { CommentService } from './comments.service';
import { CommentController } from './comments.controller';
import { CommentsGeneralController } from './comments-general.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }]),
    AuthModule
  ],
  controllers: [CommentController, CommentsGeneralController],
  providers: [CommentService],
})
export class CommentsModule {}
