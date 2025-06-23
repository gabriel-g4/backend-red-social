import { IsNotEmpty, IsOptional, IsString } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreatePostDto {
    @ApiProperty({ example: "Titulo del post"})
    @IsNotEmpty({ message: 'El titulo es obligatorio'})
    @IsString( {message: "El titulo debe ser una cadena de texto"})
    titulo: string;

    @ApiProperty({ example: "Descripcion del post"})
    @IsNotEmpty({ message: 'La descripcion es obligatoria'})
    @IsString( {message: "La descripcion debe ser una cadena de texto"})
    descripcion: string;

    @ApiPropertyOptional({ example: "https://example.com/image.jpg"})
    @IsOptional({ message: "La imagen es opcional"})
    @IsString( {message: "La imagen debe ser una cadena de texto"})
    imagenUrl: string;
}