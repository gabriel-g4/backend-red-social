import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostService } from './posts.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Post } from './schemas/post.schema';
import { PostSchema } from './schemas/post.schema';
import { AuthModule } from 'src/auth/auth.module';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
        AuthModule
    ],
    controllers: [PostsController],
    providers: [PostService]
})
export class PostsModule {}
