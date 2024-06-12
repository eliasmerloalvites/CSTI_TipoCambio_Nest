import { Document } from 'mongoose';

export interface User extends Document {
  //USUARIOS
  codigo_usuario: number;
  nombre_apellido: string;
  contraseña?: string;
  email: string;
  roles: Array<string>;
  empresas: Array<string>;
  latitud: number;
  longitud: number;
  fe_creacion: Date;
  fe_modificacion: Date;
  id_user_creador: string;
  id_user_modificador: string;
  status: string;
  online: boolean;
  avatar: string;
  campania: boolean;
  fe_conexion: Date;
  ul_latitud: number;
  ul_longitud: number;
  bateria: number;
  id_pais: string;
}


export type PaginationState = {
  to:number
  from:number
  total:number
  prev_page_url:string|null
  first_page_url:string
  next_page_url:string|null
  page: number
  last_page:number
  items_per_page: number,  
  links?: Array<{label: string; active: boolean; url: string | null; page: number | null}>
}

export interface UserData extends Partial<User> {
  ultima_conexion?:string;
  fecha_creacion?:string;
}


export interface ResUser<T> {
  data: T;
  payload?: {
      message?: string | undefined;
      errors?: {
          [key: string]: string[];
      } | undefined;
      pagination?: PaginationState | undefined;
  } | undefined;
  success: boolean;
}
