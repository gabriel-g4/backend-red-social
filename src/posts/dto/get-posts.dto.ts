import { IsEnum, IsNumber, IsOptional, IsString, Min } from "class-validator";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";

export enum SortBy{
    DATE = 'date',
    LIKES = 'likes'
}

export class GetPostsDto {
    @ApiPropertyOptional({ enum: SortBy, default: SortBy.DATE, description: "Ordenamiento por fecha o likes"})
    @IsOptional({ message: "El ordenamiento es opcional"})
    @IsString({ message: 'El ordenamiento debe ser una cadena de texto'})
    @IsEnum(SortBy)
    sortBy?: SortBy;

    @ApiPropertyOptional({description: "Filtrar por id de usuario"})
    @IsString({ message: 'El id del usuario debe ser una cadena de texto'})
    @IsOptional({ message: "El id de usuario es opcional"})
    usuarioId?: string;

    @ApiPropertyOptional({ description: "Offset para paginacion", default:0})
    @IsOptional({ message: "El offset es opcional"})
    @Type(() => Number)
    @IsNumber()
    @Min(0, { message: 'El offsert debe ser mayor o igual a 0'})
    offset?: number = 0;

    @ApiPropertyOptional({ description: "Limit para paginacion", default:10})
    @IsOptional({ message: "El limit es opcional"})
    @Type(()=> Number)
    @IsNumber()
    @Min(1, { message: 'El limit debe ser mayor o igual a 1'})
    limit?: number = 10;

}