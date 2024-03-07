import { IsEmail, IsString, MinLength } from "class-validator"

export class LoginDto {

    @IsEmail()
    email: string;

    @IsString()
    @MinLength(6)
    contraseña: string;
  }