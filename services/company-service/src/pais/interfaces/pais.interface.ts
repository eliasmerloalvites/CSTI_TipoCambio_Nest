import { Document } from 'mongoose';

export interface Pais extends Document {
  codigo_pais: number;
  nombre_pais: string;
  status: string;
  fe_creacion: Date;
}

export type PaisDto = Pick<Pais, 'nombre_pais'>;

export interface PaisOptions extends Partial<PaisDto> {
  codigo_pais?: number;
  status?: string;
  fe_creacion?: Date;
}



export interface ResPais<T> {
  success: boolean;
  data: T;
  message: string;
}
