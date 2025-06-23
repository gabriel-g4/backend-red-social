import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { ApiProperty } from "@nestjs/swagger";

export type UserDocument = User & Document;

@Schema({timestamps:true})
export class User {
    @ApiProperty({example: "JuanPerez123"})
    @Prop ({required: true, unique:true, trim:true})
    username: string;

    @ApiProperty({example: "email@example.com"})
    @Prop ({required: true, unique:true, trim:true, lowercase:true})
    email: string;

    @ApiProperty({example: "password"})
    @Prop ({required: true})
    password: string;

    @ApiProperty({example: "Juan"})
    @Prop ({required: true, trim:true})
    nombre: string;

    @ApiProperty({example: "Perez"})
    @Prop ({required: true, trim:true})
    apellido: string;

    @ApiProperty({example: "https://example.com/image.jpg"})
    @Prop ({default: null})
    imagenPerfil: string;

    @ApiProperty({example: "user"})
    @Prop ({default: 'user'})
    tipoPerfil: string;

    @ApiProperty({example: true})
    @Prop ({default: true})
    isActive: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User)

// Indices para optimizar

UserSchema.index({username: 1})
UserSchema.index({email: 1})