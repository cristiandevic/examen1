//importacion de libs
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const authRutas = require('./rutas/authrutas');
const Usuario = require('./models/usuario');
const blacklist=require('./blacklist')

require('dotenv').config();
const app = express();
// ruta
const rutahistoria = require('./rutas/rutahistoria');
const autorrutas = require('./rutas/autorrutas');

// configuraciones de environment
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;
//manejo de JSON
app.use(express.json());
//uso de cors
const corsOptions = {
    origin : ['http://localhost:4200','http://localhost:4200/'],
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
//CONEXION CON MONGODB\
mongoose.connect(MONGO_URI)
.then(() => {
        console.log('Conexion exitosa');
        app.listen(PORT, () => {console.log("Servidor express corriendo en el puerto: "+PORT)})
    }
).catch( error => console.log('error de conexion', error));

const autenticar = async (req, res, next)=>{
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token)
            res.status(401).json({mensaje: 'No existe el token de autenticacion'});
        if (blacklist.includes(token)) {
                return res.json({mensaje:"el token no es válido"});
            }
        const decodificar = jwt.verify(token, 'clave_secreta');

        req.usuario = await  Usuario.findById(decodificar.usuarioId);
        next();
    }
    catch(error){
        res.status(400).json({ error: error.message});
    }
};


app.use('/auth', authRutas);
//app.use('/autor', autenticar, autorrutas);
//app.use('/historia', autenticar, rutahistoria);
app.use('/autor', autorrutas);
app.use('/historia', rutahistoria);