const mongoose = require('mongoose');
//definir el esquema
const autorSchema = new mongoose.Schema({
    nombre : String,
    apellido : String,
});

const AutorModel = mongoose.model('Autor',autorSchema, 'autor');
module.exports = AutorModel;