import { Injectable, ConflictException, BadRequestException, NotFoundException, HttpException, UnauthorizedException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User, UserDocument } from "../users/schemas/user.schema";
import { RegisterDto } from "./dto/register.dto";
import * as bcrypt from 'bcryptjs';
import { Types } from "mongoose";
import { LoginDto } from "./dto/login.dto";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";

export interface JwtPayload {
    sub: string,
    username: string,
    roles?: string[]
}

@Injectable()
export class AuthService{
    constructor(@InjectModel(User.name) private userModel: Model <UserDocument>,  private jwtService: JwtService, private configService: ConfigService) {
        console.log('JWT_SECRET desde constructor AuthService:', this.configService.get('JWT_SECRET'));
    }

    async register(registerDto: RegisterDto, imagenPerfilUrl?:string) : Promise<any> {
        try {
            const { username, email, password } = registerDto

            // Verificar si ya existe un usuario con el mismo username o mail

            const existeUser = await this.userModel.findOne({
                $or: [
                    { username: username.toLowerCase()},
                    { email: email.toLowerCase()}
                ]
            });

            if (existeUser) {
                if (existeUser.username === username.toLowerCase()){
                    return new ConflictException('El nombre de usuario ya esta en uso')
                }

                if (existeUser.email === email.toLowerCase()){
                    return new ConflictException('El mail ya esta en uso')
                }
            }

            // encriptar las contrañeas con un salt de 12 rounds
            const saltRounds = 12
            const hashedPassword = await bcrypt.hash(password, saltRounds)

            // imagen estandar
            if (!imagenPerfilUrl) {
                imagenPerfilUrl = "/uploads/default-avatar.png"
            }

            // crear un usuario
            const newUser = new this.userModel({
                username: username.toLowerCase(),
                email: email.toLowerCase(),
                password: hashedPassword,
                nombre: registerDto.nombre,
                apellido: registerDto.apellido,
                imagenPerfil: imagenPerfilUrl,
                tipoPerfil: registerDto.tipoPerfil,
                fechaNacimiento: registerDto.fechaNacimiento,
                descripcion: registerDto.descripcion
            })

            // guardar en bd

            const savedUser = await newUser.save();

            //  // Crear payload para el token JWT
            const payload = {
                sub: savedUser._id,
                username: savedUser.username,
                roles: [savedUser.tipoPerfil], // "usuario" o "administrador"
            };

            // Firmar el token JWT con expiración de 15 minutos
            const token = this.jwtService.sign(payload);

            // convertir a objetos y eliminar la contraseña de la respuesta
            const userObject = savedUser.toObject()
            const {password: _, ...userWithoutPassword} = userObject;

            return {
                succes: true,
                message: 'Usuario registrado exitosamente',
                accessToken: token,
                expiresIn: 15 * 60,
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
                return new BadRequestException({
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

    async login(loginDto : LoginDto) : Promise<any> {

        //  Por POST: debe recibir el usuario / correo y contraseña sin encriptar.
        // ■ Debe encriptar la contraseña recibida para confirmar el login.
        // ■ Debe devolver todos los datos del usuario.

        try {

            const { login, password } = loginDto;

            const user = await this.userModel.findOne({
                $or: [
                    { username: login.toLowerCase()},
                    { email: login.toLowerCase()}
                ]
            });

            if (!user) {
                throw new NotFoundException({ 
                    sucess: false,
                    message: "Usuario o mail no encontrado."
                })
            }

            if (!user.isActive) {
                throw new UnauthorizedException('Tu cuenta está deshabilitada. Contactá al administrador.');
            }

            const sonIguales = await bcrypt.compare(password, user.password)

            if (!sonIguales) {
                throw new BadRequestException({
                    success: false,
                    message: 'Contraseña incorrecta'
                })
            }

            const payload = {
                sub: user._id,
                username: user.username,
                roles: [user.tipoPerfil], // puede ser "usuario" o "administrador"
            };

            const token = this.jwtService.sign(payload);

            const { password: userPassword, ...userWithoutPassword } = user.toObject();
            

            return {
                success: true,
                message: 'Login exitoso',
                accessToken: token,
                expiresIn: 15 * 60,
                user: userWithoutPassword,
            };
            
            
        } catch (error) {
            if (error instanceof HttpException) throw error;
            throw new Error('Error interno en el login');
        }
    }

    async findById(id: string) : Promise<any> {
        const user = await this.userModel.find( {_id: id}).lean()
        console.log(user)
        if (!user)
            throw new NotFoundException('Usuario no encontrado')
        return user 
    }
}
