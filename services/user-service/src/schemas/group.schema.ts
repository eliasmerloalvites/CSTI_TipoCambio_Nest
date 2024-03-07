import * as mongoose from 'mongoose';

export const GroupSchema = new mongoose.Schema({

    nombre_grupo: { type: String, required: true },
    administradores: [
        {
            _id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', require: false },
            tipo_administrador: { type: String, required: true }
        }
    ],
    colaboradores: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'User', require: false },
    ],
    id_empresa: { type: mongoose.Schema.Types.ObjectId, ref: 'Empresa', require: true },
    fe_creacion: { type: Date, default: Date.now() },
    fe_modificacion: { type: Date, require: false, default: null },
    id_user_creador: { type: mongoose.Schema.Types.ObjectId, ref: 'User', require: true },
    id_user_modificador: { type: mongoose.Schema.Types.ObjectId, ref: 'User', require: false, default: null },
    status: { type: String, require: true, default: "ACT" },

});

