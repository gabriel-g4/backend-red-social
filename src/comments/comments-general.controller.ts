
import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { CommentService } from './comments.service';
import { GetStatsDto } from 'src/posts/dto/get-stats.dto';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('comments')
export class CommentsGeneralController {
  constructor(private readonly commentService: CommentService) {}

  @Post('stats/by-user')
  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  getCommentCountByUser(@Body() dto: GetStatsDto) {
    return this.commentService.countCommentsByUser(dto.startDate, dto.endDate);
  }

  @Post('/stats/by-post')
    @UseGuards(RolesGuard)
    @ApiBearerAuth()
    getCommentCountByPost(@Body() dto: GetStatsDto) {
      return this.commentService.countCommentsByPost(dto.startDate, dto.endDate);
    }
}
