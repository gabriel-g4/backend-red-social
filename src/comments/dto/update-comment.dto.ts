import { IsOptional, IsString } from 'class-validator';

export class UpdateCommentDto {
  @IsOptional()
  @IsString()
  texto?: string;
}
