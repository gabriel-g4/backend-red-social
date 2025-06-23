import { Body, Controller, Delete, Headers, Param, Get } from "@nestjs/common";
import { PostService } from "./posts.service";
import { CreatePostDto } from "./dto/create-post.dto";
import { Post } from "@nestjs/common";
import { GetPostsDto } from "./dto/get-posts.dto";

@Controller('posts')
export class PostsController {

    constructor(private readonly postService: PostService) {}
    
    @Get()
    findAll(@Body() getPostDto: GetPostsDto) {
        return this.postService.findAll(getPostDto)
    }

    @Post()
    create(
        @Body() createPostDto: CreatePostDto, 
        @Headers('userId') userId: string,
        @Headers('imagenPath') imagenPath?: string
    ) {
        return this.postService.create(createPostDto, userId, imagenPath);
    }

    @Post(':postId/like')
    addLike(
        @Param('postId') postId: string,
        @Headers('userId') userId: string
    ) {
        return this.postService.addLike(postId, userId);
    }

    @Delete(':postId/like')
    removeLike(
        @Param('postId') postId: string,
        @Headers('userId') userId: string
    ) {
        return this.postService.removeLike(postId, userId);
    }

    @Delete(':postId')
    softDelete(
        @Param('postId') postId: string,
        @Headers('userId') userId: string
    ) {
        return this.postService.softDelete(postId, userId);
    }

}

