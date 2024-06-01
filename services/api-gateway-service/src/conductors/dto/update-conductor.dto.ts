import { ArrayMinSize, IsArray, IsEmail, IsString, MinLength,  IsNumber, MaxLength, IsOptional } from "class-validator"

export class EditarConductorDto {  
  
    @IsString()
    _id: string;

    @IsNumber()
    codigo_usuario: string;

    @IsString()
    usuario: string;

    @IsString()
    @MinLength(4)
    nombre_apellido: string;

    @IsEmail()
    email: string;

    @IsString()
    @IsOptional()
    contraseña?: string;

    @IsString()
    @IsOptional()
    changecontraseña? : string;

    @IsArray()
    @ArrayMinSize(1, { message: 'Debe proporcionar al menos un rol.' })
    @IsString({ each: true, message: 'Cada elemento del array debe ser una cadena.' })
    roles: string[];

    @IsString()
    avatar?: string;
  }