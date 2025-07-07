import { CommentService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Controller, Post, Param, UseInterceptors, UploadedFile, Body, UseGuards, Req, Put, BadRequestException, Get, Query } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { GetStatsDto } from 'src/posts/dto/get-stats.dto';
import { RolesGuard } from 'src/auth/guards/roles.guard';


@Controller('posts/:postId/comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post()
  @UseInterceptors(
    FileInterceptor('imagen', {
      storage: diskStorage({
        destination: './uploads/comentarios',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(null, `comentario-${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  async createComment(
    @Param('postId') postId: string,
    @Body() createCommentDto: CreateCommentDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: any,
  ) {
    const imagenUrl = file ? `/uploads/comentarios/${file.filename}` : undefined;
    const userId = req.user.id;

    return this.commentService.create(postId, userId, createCommentDto, imagenUrl);
  }

  @Put(':commentId')
  @ApiBearerAuth()
  async update(
    @Param('postId') postId: string,
    @Param('commentId') commentId: string,
    @Body() dto: UpdateCommentDto
  ) {

    if ('imagenUrl' in dto) {
        throw new BadRequestException('No está permitido modificar la imagen del comentario.');
    }

    return this.commentService.update(postId, commentId, dto);
  }

  @Get()
  @ApiBearerAuth()
  async getAll(
    @Param('postId') postId: string,
    @Query('page') page = '1',
    @Query('limit') limit = '10'
  ) {
    return this.commentService.findByPost(postId, parseInt(page), parseInt(limit));
  }


  @Post('stats/by-user')
      @UseGuards(RolesGuard)
      @ApiBearerAuth()
          getCommentCountByUser(@Body() dto: GetStatsDto) {
          return this.commentService.countCommentsByUser(dto.startDate, dto.endDate);
      }
}
