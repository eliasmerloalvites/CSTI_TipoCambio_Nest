import * as mongoose from 'mongoose';

const roles = [
  'ADMINISTRADOR',
  'SUPERVISOR',
  'CONDUCTOR',
  'USUARIO'
];

export const UserSchema = new mongoose.Schema({
  codigo_usuario: {
    type: Number,
    required: true,
    unique: true,
    index: true,
  },
  nombre_apellido: { type: String, required: true },
  contraseña: { type: String, required: true },
  email: { type: String, required: false },
  roles: { type: [String], require: true, enum: roles },
  empresas: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'Empresa', require: false },
  ],
  latitud: { type: Number, required: false, default: null },
  longitud: { type: Number, required: false, default: null },
  fe_creacion: { type: Date, require: false },
  fe_modificacion: { type: Date, require: false, default: null },
  id_user_creador: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    require: false,
  },
  id_user_modificador: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    require: false,
    default: null,
  },
  status: { type: String, require: false, default: 'PEN' },
  online: { type: Boolean, require: false, default:null},
  avatar: { type: String, required: false, default:null },
  campania: { type: Boolean, require: false, default: 'false' },
  fe_conexion: { type: Date, require: false, default: null },
  ul_latitud: { type: Number, required: false, default: null },
  ul_longitud: { type: Number, required: false, default: null },
  bateria: { type: Number, required: false, default: null },
  id_pais: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pais',
    required: false,
  },
});
