import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCommentDto {
  @IsNotEmpty()
  @IsString()
  texto: string;

  @IsOptional()
  @IsString()
  imagenUrl?: string;
}
