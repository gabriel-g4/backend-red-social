import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Schema as MoongoseSchema } from "mongoose";
import { User } from "src/users/schemas/user.schema";
import { ApiProperty } from '@nestjs/swagger'

export type PostDocument = Post & Document;

@Schema({timestamps:true})
export class Post {
    @ApiProperty({example: "Titulo del post"})
    @Prop({required: true})
    titulo: string;

    @ApiProperty({example: "Descripcion del post"})
    @Prop({required: true})
    descripcion: string;

    @ApiProperty({example: "https://example.com/image.jpg"})
    @Prop()
    imagenUrl: string;

    @ApiProperty({example: "6858854856ebb720c84f7992"})
    @Prop({required: true, type:MoongoseSchema.Types.ObjectId, ref: 'User'})
    autor: string;

    @ApiProperty({example: "[6858854856ebb720c84f7992, 6858854856ebb720c84f7992]"})
    @Prop([{type: MoongoseSchema.Types.ObjectId, ref: 'User'}])
    likes: User[];

    @ApiProperty({example: false})
    @Prop({default: false})
    eliminado: boolean;

    @ApiProperty({example: "2025-06-18T16:32:45.000Z"})
    @Prop()
    fechaCreacion: Date;

    @ApiProperty({example: "2025-06-18T16:32:45.000Z"})
    @Prop()
    fechaActualizacion: Date;
}

export const PostSchema = SchemaFactory.createForClass(Post);