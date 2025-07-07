import { Body, Controller, Delete, Headers, Param, Get, Query, Post, UseInterceptors, UploadedFile, UseGuards } from "@nestjs/common";
import { PostService } from "./posts.service";
import { CreatePostDto } from "./dto/create-post.dto";
import { GetPostsDto } from "./dto/get-posts.dto";
import { diskStorage } from "multer";
import { FileInterceptor } from "@nestjs/platform-express";
import { extname } from "path";
import { ApiBearerAuth } from "@nestjs/swagger";
import { GetStatsDto } from "./dto/get-stats.dto";
import { RolesGuard } from "src/auth/guards/roles.guard";

@Controller('posts')
export class PostsController {

    constructor(private readonly postService: PostService) {}
    
    @Get()
    @ApiBearerAuth()
    findAll(@Query() getPostDto: GetPostsDto) {
        return this.postService.findAll(getPostDto)
    }

    @Get(':id')
    @ApiBearerAuth()
    async findOne(@Param('id') id: string) {
        return this.postService.findOne(id);
    }

    @Post()
    @ApiBearerAuth()
    @UseInterceptors(
        FileInterceptor('imagen', {
        storage: diskStorage({
            destination: './uploads',
            filename: (req, file, cb) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                const ext = extname(file.originalname);
                cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
            },
        }),
        }),
    )
    async create(
        @Body() createPostDto: CreatePostDto,
        @Headers('userId') userId: string,
        @UploadedFile() file?: Express.Multer.File,
    ) {
        const imagenPath = file ? `/uploads/${file.filename}` : undefined;

        return this.postService.create(createPostDto, userId, imagenPath);
  }

    @Post(':postId/like')
    @ApiBearerAuth()
    addLike(
        @Param('postId') postId: string,
        @Headers('userId') userId: string
    ) {
        console.log(postId)
        console.log(userId)
        return this.postService.addLike(postId, userId);
    }

    @Delete(':postId/like')
    @ApiBearerAuth()
    removeLike(
        @Param('postId') postId: string,
        @Headers('userId') userId: string
    ) {
        return this.postService.removeLike(postId, userId);
    }

    @Delete(':postId')
    @ApiBearerAuth()
    softDelete(
        @Param('postId') postId: string,
        @Headers('userId') userId: string
    ) {
        return this.postService.softDelete(postId, userId);
    }

    @Post('stats/by-user')
    @UseGuards(RolesGuard)
    @ApiBearerAuth()
        getPostCountByUser(@Body() dto: GetStatsDto) {
        return this.postService.countPostsByUser(dto.startDate, dto.endDate);
    }

}

