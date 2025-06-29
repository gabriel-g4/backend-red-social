import { 
    IsEmail,
    IsNotEmpty,
    IsString,
    MinLength,
    MaxLength,
    Matches,
    IsOptional,
    IsUrl,
    IsEnum,
    IsDate
 } from "class-validator";

 import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

 export enum TipoPerfil {
   USER = "usuario",
   ADMIN = "administrador"
 }


 export class RegisterDto {
   @ApiProperty()
   @IsNotEmpty({message: 'El nombre de usuario es obligatorio'})
   @IsString({message: 'El nombre de usuario debe ser texto'})
   @MinLength(3, {message: 'El nombre de usuario debe tener al menos 3 caracteres'})
   @MaxLength(20, {message:'El nombre de usuario debe tener como maximo 20 caracteres'})
   @Matches(/^[a-zA-Z0-9_]+$/, {message: 'El nombre de usuario solo puede contener letras, números y guiones bajos'})
   username: string

   @ApiProperty()
   @IsNotEmpty({message: 'La contraseña es obligatoria'})
   @IsString({message: 'La contraseña debe ser texto'})
   @MinLength(8, {message: 'La contraseña debe tener al menos 8 caracteres'})
   @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {message: 'La contraseña debe contener al menos una minuscula, una mayuscula y un número'})
   password: string

   @ApiProperty()
   @IsNotEmpty({message: 'El nombre es obligatorio'})
   @IsString({message: 'El nombre debe ser texto'})
   @MaxLength(50, {message:'El nombre debe tener como maximo 20 caracteres'})
   nombre: string

   @ApiProperty()
   @IsNotEmpty({message: 'El apellido es obligatorio'})
   @IsString({message: 'El apellido debe ser texto'})
   @MaxLength(50, {message:'El apellido debe tener como maximo 20 caracteres'})
   apellido: string

   @ApiProperty()
   @IsNotEmpty({message: 'El email es obligatorio'})
   @IsString({message: 'El email debe ser texto'})
   @IsEmail()
   email: string;

   @ApiPropertyOptional()
   @IsOptional()
   @Matches(/\.(jpg|png|gif|webp|jpeg)$/i, 
        {message: 'La URL de la imagen debe tener un fomato válido (jpg|png|gif|webp|jpeg)'})
   imagenPerfil: string;
   
   @ApiPropertyOptional({ enum: TipoPerfil, default: TipoPerfil.USER, description: "Tipo de usuario"})
   @IsNotEmpty({ message: "El tipo de usuario no debe estar vacio"})
   @IsString({ message: 'El tipo de usuario debe ser una cadena de texto'})
   @IsEnum(TipoPerfil)
   tipoPerfil: TipoPerfil;
   
   @ApiProperty()
   @IsNotEmpty({ message: "La fecha no debe estar vacia"})
   fechaNacimiento: Date;

   @ApiPropertyOptional()
   @IsOptional()
   @IsString({message: 'La descripcion debe ser texto'})
   @MaxLength(250, {message:'La descripcion debe tener como maximo 20 caracteres'})
   descripcion: string;


 }