import { IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class TokenDto {
    @ApiProperty({
        description: 'Token JWT para operaciones de autenticacion o refresco',
        example: 'token',
        required: true
    })
    @IsNotEmpty({ message: 'El token es obligatorio'})
    @IsString({ message: 'El token debe ser una cadena de texto'})
    token: string
}