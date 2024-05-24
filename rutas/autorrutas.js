const express = require('express');
const rutas = express.Router();
const AutorModel = require('../models/Autor');
const UsuarioModel = require('../models/usuario');
//endpoint traer todas las autor
rutas.get('/traerautor', async (req, res) => {
    try  {
        const autor = await  AutorModel.find();
        res.json(autor);
    } catch (error){
        res.status(500).json({mensaje: error.message});
    }
});

//endpoint 2. AÑADIR HISTORIA
rutas.post('/crear', async (req, res) => {
    const autor = new AutorModel({
        nombre: req.body.nombre,
        apellido: req.body.apellido,
    })
    try {
        const nuevaautor = await autor.save();
        res.status(201).json(nuevaautor);
    } catch (error) {
        res.status(400).json({ mensaje :  error.message})
    }
});

//endpoint 3. Editar
rutas.put('/editar/:id', async (req, res) => {
    try {
        const autorEditada = await AutorModel.findByIdAndUpdate(req.params.id, req.body, { new : true });
        if (!autorEditada)
            return res.status(404).json({ mensaje : 'Autor no encontrado!!!'});
        else
            return res.json(autorEditada);

    } catch (error) {
        res.status(400).json({ mensaje :  error.message})
    }
});
//ENDPOINT 4. eliminar

rutas.delete('/eliminar/:id',async (req, res) => {
    try {
       
       const autorEliminada = await AutorModel.findByIdAndDelete(req.params.id);
       if (!autorEliminada)
            return res.status(404).json({ mensaje : 'autor no encontrado!!!'});
       else 
            return res.json({mensaje :  'autor eliminado'});    
       } 
    catch (error) {
        res.status(500).json({ mensaje :  error.message})
    }
});

module.exports = rutas;