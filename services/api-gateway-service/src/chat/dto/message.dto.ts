import { IsString } from "class-validator"

export class MessageDto {

    @IsString()
    id_user_emisor: string;

    @IsString()
    id_user_receptor: string;

    @IsString()
    type_message: string;

    @IsString()
    content: string;

  }