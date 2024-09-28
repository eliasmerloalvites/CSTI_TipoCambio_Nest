export class CreateMessageDto {
    readonly id_user_emisor: string;
    readonly id_user_receptor: string;
    readonly type_message: string;
    readonly content: string;
    fe_creacion: Date;
    readBy:string[]    
  }
  