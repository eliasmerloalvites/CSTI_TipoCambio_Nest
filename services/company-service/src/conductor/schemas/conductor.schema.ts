import * as mongoose from 'mongoose';

export const ConductorSchema = new mongoose.Schema({
  account_type: { type: String, required: true },
  id_empresa: { type: mongoose.Schema.Types.ObjectId, ref: 'Empresa', require: false},
  tip_documento: { type: String, required: true },
  num_documento: { type: String, required: true },
  nombres: { type: String, required: true, index: true },
  apellidos: { type: String, required: true, index: true },
  genero: { type: String, required: true },
  email: { type: String, required: false },
  celular: { type: String, required: true },
  vehiculo: [
      {
        tipo_vehiculo: { type: String, required: true },
        marca: { type: String, required: true },
        modelo: { type: String, required: true },
        año: { type: String, required: true },
        placa: { type: String, required: true },
        descripcion_vehiculo: { type: String, required: false },
        mantenimiento_vehiculo: { type: String, required: false },
        documento_inspeccion: { type: String, required: false },
        documento_seguro: { type: String, required: false },        
        fecha_vencimiento_soat: { type: Date, required: true },
        imagen: [{type: String, required: false}  ],
        servicio: 
          {
            rutas: [{type: String, required: false}  ],
            num_pasajeros: { type: String, required: true },
            experiencia: { type: String, required: true }
          }
      }
  ],
  licencia: [
    {
      numero: { type: String, required: false },
      fec_vencimiento: { type: String, required: false },
      categoria: { type: String, required: false },
      file: {type: String, required: false}
    }
  ],
  exp_calificacion: [
    {
      id_user_creador: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: false,
      },
      descripcion: { type: String, required: false },
      estrellas: { type: Number, required: false },
      fecha_creacion: { type: String, required: false }
    }
  ],
  id_user_creador: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    require: false,
  },
  id_user_modificador: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    require: false,
    default: null
  },
  id_user_responsable: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    require: false,
    default: null
  },
  
  fe_creacion: { type: Date, required: true },
  fe_modificacion: { type: Date, require: false, default: null },
  status: { type: String, require: true, default: 'PEN', index: true }

});
