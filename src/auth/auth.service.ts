import { Injectable, ConflictException, BadRequestException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User, UserDocument } from "./schemas/user.schema";
import { RegisterDto } from "./dto/register.dto";
import * as bcrypt from 'bcryptjs';
import { Types } from "mongoose";

@Injectable()
export class AuthService{
    constructor(@InjectModel(User.name) private userModel: Model <UserDocument>) {}

    async register(registerDto: RegisterDto, imagenPerfilUrl?:string) : Promise<any> {
        try {
            const { username, email, password } = registerDto

            // Verigicar si ya existe un usuario con el mismo username o mail

            const existeUser = await this.userModel.findOne({
                $or: [
                    { username: username.toLowerCase()},
                    { email: email.toLowerCase()}
                ]
            });

            if (existeUser) {
                if (existeUser.username === username.toLowerCase()){
                    throw new ConflictException('El nombre de usuario ya esta en uso')
                }

                if (existeUser.email === email.toLowerCase()){
                    throw new ConflictException('El mail ya esta en uso')
                }
            }

            // encriptar las contrañeas con un salt de 12 rounds
            const saltRounds = 12
            const hashedPassword = await bcrypt.hash(password, saltRounds)

            // crear un usuario
            const newUser = new this.userModel({
                username: username.toLowerCase(),
                email: email.toLowerCase(),
                password: hashedPassword,
                nombre: registerDto.nombre,
                apellido: registerDto.apellido,
                imagenPerfil: imagenPerfilUrl
            })

            // guardar en bd

            const savedUser = await newUser.save();

            // convertir a objetos y eliminar la contraseña de la respuesta
            const userObject = savedUser.toObject()
            const {password: _, ...userWithoutPassword} = userObject;

            return {
                succes: true,
                message: 'Usuario registrado exitosamente',
                data: {
                    user: userWithoutPassword,
                    userId: (savedUser._id as Types.ObjectId).toString()
                }
            }

        } catch (error) {
            // error de validacion de mongoose

            if (error.name === 'ValidationError') {
                const validationError = Object.values(error.errors).map(
                    (err:any) => err.message
                );
                throw new BadRequestException({
                    success: false,
                    message: 'Error de validacion',
                    errors: validationError
                })
            }

            // si es un error de duplicado (codigo 11000)

            if (error.code === 11000) {
                const field = Object.keys(error.keyPattern)[0];
                const message = field === 'username' ? 'El nombre de usuario ya esta en uso' : 'El correo electronico ya esta registrado'
            }

        }
    }
}
