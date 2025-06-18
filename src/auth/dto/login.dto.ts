import { 
    IsNotEmpty,
    IsString,
    MinLength,
    Matches
 } from "class-validator";


 export class LoginDto {
    @IsNotEmpty({message: 'El nombre de usuario es obligatorio'})
    @IsString({message: 'El nombre de usuario debe ser texto'})
    login: string

    @IsNotEmpty({message: 'La contraseña es obligatoria'})
    @IsString({message: 'La contraseña debe ser texto'})
    @MinLength(8, {message: 'La contraseña debe tener al menos 8 caracteres'})
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {message: 'La contraseña debe contener al menos una minuscula, una mayuscula y un número'})
    password: string
 }