const mongoose = require('mongoose');
//definir el esquema
const historiaSchema = new mongoose.Schema({
    // nombre: { type: String, require: true}
    autor : String,
    tipo : String,
    contenido : String,
    puntuacion : Number,
    usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' }
});

const HistoriaModel = mongoose.model('Historia',historiaSchema, 'historia');
module.exports = HistoriaModel;