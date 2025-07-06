import { IsDateString } from 'class-validator';

export class GetPostsStatsDto {
  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;
}