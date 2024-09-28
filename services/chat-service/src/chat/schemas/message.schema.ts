import * as mongoose from 'mongoose';

export const MessageSchema = new mongoose.Schema({
  id_user_emisor: { type: mongoose.Schema.Types.ObjectId, ref: 'User',require: true},
  id_user_receptor: { type: mongoose.Schema.Types.ObjectId, ref: 'User',require: true},
  type_message: { type: String, required: true },
  content: { type: String, required: true, default: null },
  fe_creacion: { type: Date, require: false },
  readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] 
});
