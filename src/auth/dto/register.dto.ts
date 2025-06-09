import { 
    IsEmail,
    IsNotEmpty,
    IsString,
    MinLength,
    MaxLength,
    Matches
 } from "class-validator";


 export class RegisterDto {
    @IsNotEmpty({message: 'El nombre de usuario es obligatorio'})
    @IsString({message: 'El nombre de usuario debe ser texto'})
    @MinLength(3, {message: 'El nombre de usuario debe tener al menos 3 caracteres'})
    @MaxLength(20, {message:'El nombre de usuario debe tener como maximo 20 caracteres'})
    @Matches(/^[a-zA-Z0-9_]+$/, {message: 'El nombre de usuario solo puede contener letras, números y guiones bajos'})
    username: string

    @IsNotEmpty({message: 'La contraseña es obligatoria'})
    @IsString({message: 'La contraseña debe ser texto'})
    @MinLength(8, {message: 'La contraseña debe tener al menos 8 caracteres'})
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {message: 'La contraseña debe contener al menos una minuscula, una mayuscula y un número'})
    password: string


    @IsNotEmpty({message: 'El nombre es obligatorio'})
    @IsString({message: 'El nombre debe ser texto'})
    @MaxLength(50, {message:'El nombre debe tener como maximo 20 caracteres'})
    nombre: string


    @IsNotEmpty({message: 'El apellido es obligatorio'})
    @IsString({message: 'El apellido debe ser texto'})
    @MaxLength(50, {message:'El apellido debe tener como maximo 20 caracteres'})
    apellido: string

    @IsNotEmpty({message: 'El email es obligatorio'})
    @IsString({message: 'El email debe ser texto'})
    email: string;


 }