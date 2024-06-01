import * as mongoose from 'mongoose';

export const RutaSchema = new mongoose.Schema({
  tipo_vehiculo: { type: String, required: true },
  color: { type: String, required: true },
  descripcion: { type: String, required: true },
  rutas: [{ type: String, required: true, default: null }],
  pasajeros_max: [{ type: String, required: true, default: null }]
});
