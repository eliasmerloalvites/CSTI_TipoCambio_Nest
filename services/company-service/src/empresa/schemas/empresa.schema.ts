import * as mongoose from 'mongoose';

export const EmpresaSchema = new mongoose.Schema({
  nombre: { type: String, required: true, index: true },
  descripcion: { type: String, required: false },
  email: { type: String, required: false },
  imagen: { type: String, required: false, default: null },
  fe_creacion: { type: Date, required: true },
  fe_modificacion: { type: Date, require: false, default: null },
  status: { type: String, require: true, default: 'PEN', index: true }

});
