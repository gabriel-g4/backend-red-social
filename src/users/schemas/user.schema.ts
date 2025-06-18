import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type UserDocument = User & Document;

@Schema({timestamps:true})
export class User {
    @Prop ({required: true, unique:true, trim:true})
    username: string;

    @Prop ({required: true, unique:true, trim:true, lowercase:true})
    email: string;

    @Prop ({required: true})
    password: string;

    @Prop ({required: true, trim:true})
    nombre: string;

    @Prop ({required: true, trim:true})
    apellido: string;

    @Prop ({default: null})
    imagenPerfil: string;

    @Prop ({defualt: 'user'})
    tipoPerfil: string;

    @Prop ({default: true})
    isActive: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User)

// Indices para optimizar

UserSchema.index({username: 1})
UserSchema.index({email: 1})