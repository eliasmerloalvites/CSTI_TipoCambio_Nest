import { Document } from 'mongoose';

export interface Empresa extends Document {
  //EMPRESAS

  nombre: string;
  descripcion: string;
  email: string;
  imagen: string;
  fe_creacion: Date;
  fe_modificacion: Date;
  status: string;
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

export interface EmpresaData extends Partial<Empresa> {
}


export interface ResEmpresa<T> {
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
