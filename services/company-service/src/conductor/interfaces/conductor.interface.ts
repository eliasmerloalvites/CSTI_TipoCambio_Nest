import { Document } from 'mongoose';

export interface Conductor extends Document {
  //CONDUCTOR
  account_type: string;
  id_empresa: string;
  tip_documento: string;
  num_documento: string;
  nombres: string;
  apellidos: string;
  genero: string;
  email: string;
  celular: number;
  vehiculo: Array<Vehiculo>;
  licencia: Array<Licencia>;
  exp_calificacion?: Array<ExperienciaCalificacion>;
  id_user_responsable: string;
  id_user_creador: string;
  id_user_modificador: string;
  fe_creacion: Date;
  fe_modificacion: Date;
  status: string;
}

export interface Vehiculo {
  tipo_vehiculo: string;
  marca: string;
  modelo: string;
  año: number;
  placa: string;  
  descripcion_vehiculo: string;
  mantenimiento_vehiculo: string;
  documento_inspeccion: string;
  documento_seguro: string;
  fecha_vencimiento_soat:Date;
  imagen: Array<string>;
  servicio: Servicio;
}

export interface Licencia {
  numero: string;
  fec_vencimiento: string;
  categoria: string;
  file: string;
}

export interface Servicio {
  rutas: Array<string>;
  num_pasajeros: string;
  experiencia: string;
}

export interface ExperienciaCalificacion {
  id_user_creador: string;
  descripcion: string;
  estrellas: string;
  estrefecha_creacionllas: string;
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

export interface ConductorData extends Partial<Conductor> {
}


export interface ResConductor<T> {
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
