import { ArrayMinSize, IsArray, IsEmail, IsString, MinLength } from "class-validator"

export class CreateUserDto {

    @IsString()
    @MinLength(4)
    codigo_usuario: string;

    @IsString()
    @MinLength(4)
    usuario: string;

    @IsString()
    @MinLength(4)
    nombre_apellido: string;

    @IsEmail()
    email: string;

    @IsString()
    @MinLength(6)
    contraseña: string;

    @IsArray()
    @ArrayMinSize(1, { message: 'Debe proporcionar al menos un rol.' })
    @IsString({ each: true, message: 'Cada elemento del array debe ser una cadena.' })
    roles: string[];
  }