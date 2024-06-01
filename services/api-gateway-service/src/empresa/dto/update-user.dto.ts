import { ArrayMinSize, IsArray, IsEmail, IsString, MinLength,  IsNumber, MaxLength, IsOptional } from "class-validator"

export class EditarEmpresaDto {  
  
    @IsString()
    _id: string;

    @IsString()
    @MinLength(4)
    nombre: string;

    @IsEmail()
    @IsOptional()
    email?: string;

    @IsString()
    @IsOptional()
    descripcion?: string;

    @IsString()
    @IsOptional()
    status?: string;

    @IsString()
    @IsOptional()
    imagen?: string;

  }