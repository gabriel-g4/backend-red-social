import { IsDateString } from 'class-validator';

export class GetStatsDto {
  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;
}