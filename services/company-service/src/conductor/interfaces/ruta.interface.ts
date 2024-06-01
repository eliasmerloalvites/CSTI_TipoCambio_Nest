import { Document } from 'mongoose';

export interface Ruta extends Document {
  tipo_vehiculo: string;
  ruta: string;
  descripcion: string;
  rutas: Array<String>;
  pasajeros_max: Array<String>;
}
// RESPUESTA


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

export interface RutaData extends Partial<Ruta> {
}


export interface ResRuta<T> {
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
