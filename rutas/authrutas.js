const express = require('express');
const rutas = express.Router();
const Usuario = require('../models/usuario');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

//Registro 
rutas.post('/registro', async (req, res) => {
    try {
        const { nombreusuario, correo, contrasenia } = req.body;
        const usuario = new Usuario({ nombreusuario, correo, contrasenia});
        await usuario.save();
        res.status(201).json({mensaje: 'Usuario registrado'});
    }
    catch(error){
        res.status(500).json({mensaje: error.message});
    }
});

//Inicio de sesion
rutas.post('/iniciarsesion', async (req, res) => {
    try {
        const { correo, contrasenia } = req.body;
        const usuario = await Usuario.findOne({ correo });
        if (!usuario)
            return res.status(401).json({ error : 'Correo invalido!!!!!'});
        const validarContrasena = await usuario.compararContrasenia(contrasenia);
        if (!validarContrasena)
            return res.status(401).json({ error : 'Contrasenia invalido!!!!!'});
        //creacion de token 
        const token = jwt.sign({ usuarioId: usuario._id },'clave_secreta', {expiresIn: '8h'});
        res.json( {token});
    }
    catch(error){
        res.status(500).json({mensaje: error.message});
    }
});
// Cerrar sesion

const blacklist = require("../blacklist");

async function addTokenToBlacklist(token) {

  if (blacklist.includes(token)) {
    return; 
  }
  blacklist.push(token);
}
rutas.post('/cerrarSesion', async (req, res) => {
    try {
  
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        return res.status(401).json({ error: 'Token no proporcionado' });
      }

      const decodedToken = jwt.verify(token, 'clave_secreta');
      if (!decodedToken) {
        return res.status(401).json({ error: 'Token inválido' });
      } 
      
      await addTokenToBlacklist(token);  
      
      res.json({ message: 'Sesión cerrada con éxito' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al cerrar sesión' });
    }
  });


module.exports = rutas;