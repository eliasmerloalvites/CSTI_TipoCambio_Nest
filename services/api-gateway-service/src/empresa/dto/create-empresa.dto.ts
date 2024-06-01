import { IsOptional, IsEmail, IsString, MinLength } from "class-validator"

export class CreateEmpresaDto {

    @IsString()
    @MinLength(4)
    nombre: string;

    @IsEmail()
    @IsOptional()
    email?: string;

    @IsString()
    @IsOptional()
    descripcion?: string;

  }