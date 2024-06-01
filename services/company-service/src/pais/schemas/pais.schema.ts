import { Schema } from 'mongoose';

export const PaisSchema = new Schema({
  codigo_pais: { type: Number, required: true },
  nombre_pais: { type: String, required: true },
  status: { type: String, default: 'ACT' },
  fe_creacion: {
    type: Date,
    default: Date.now,
  },
});
