import * as mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema({
  codigo_usuario: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  usuario: { type: String, required: true, maxlength: 8 },
  nombre_apellido: { type: String, required: true },
  contraseña: { type: String, required: true },
  email: { type: String, required: false },
  roles: { type: Array, require: true },
  empresas: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'Empresa', require: true },
  ],
  fe_creacion: { type: Date, default: Date.now() },
  fe_modificacion: { type: Date, require: false, default: null },
  id_user_creador: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    require: true,
  },
  id_user_modificador: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    require: false,
    default: null,
  },
  status: { type: String, require: true, default: 'PEN' },
  fe_conexion: { type: Date, require: false, default: null },
  ul_latitud: { type: Number, required: false, default: null },
  ul_longitud: { type: Number, required: false, default: null }
});
