import { Document } from 'mongoose';

export interface User extends Document {
  //USUARIOS
  codigo_usuario: string;
  usuario: string;
  nombre_apellido: string;
  contraseña: string;
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
  campania: boolean;
  fe_conexion: Date;
  ul_latitud: number;
  ul_longitud: number;
  bateria: number;
  id_pais: string;
}
