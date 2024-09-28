import { Document } from 'mongoose';

export interface Message extends Document {
  //USUARIOS
  id_user_emisor: string;
  id_user_receptor: string;
  type_message: string;
  content: string;
  fe_creacion: Date;
  readBy:string[]
}