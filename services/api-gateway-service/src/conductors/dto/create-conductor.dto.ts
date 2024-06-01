import { ArrayMinSize, IsArray, IsEmail, IsString, MinLength,  IsNumber, MaxLength } from "class-validator"

export class CreateConductorDto {

    @IsNumber()
    codigo_usuario: number;

    @IsString()
    usuario: string;

    @IsString()
    @MinLength(4)
    nombre_apellido: string;

    @IsEmail()
    email: string;

    @IsString()
    @MinLength(6)
    contraseña: string;

    @IsString()
    @MinLength(6)
    changecontraseña : string;

    @IsArray()
    @ArrayMinSize(1, { message: 'Debe proporcionar al menos un rol.' })
    @IsString({ each: true, message: 'Cada elemento del array debe ser una cadena.' })
    roles: string[];

    @IsString()
    avatar: string;
  }