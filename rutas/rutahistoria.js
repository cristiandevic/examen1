const express = require('express');
const rutas = express.Router();
const HistoriaModel = require('../models/historia');
//endpoint traer todas las historia
rutas.get('/traerhistoria', async (req, res) => {
    try  {
        const historia = await  HistoriaModel.find();
        res.json(historia);
    } catch (error){
        res.status(500).json({mensaje: error.message});
    }
});

//endpoint 2. AÑADIR HISTORIA
rutas.post('/crear', async (req, res) => {
    const historia = new HistoriaModel({
        autor: req.body.autor,
        tipo: req.body.tipo,
        contenido: req.body.contenido,
        puntuacion: req.body.puntuacion
    })
    try {
        const nuevahistoria = await historia.save();
        res.status(201).json(nuevahistoria);
    } catch (error) {
        res.status(400).json({ mensaje :  error.message})
    }
});

//endpoint 3. Editar
rutas.put('/editar/:id', async (req, res) => {
    try {
        const historiaEditada = await HistoriaModel.findByIdAndUpdate(req.params.id, req.body, { new : true });
        if (!historiaEditada)
            return res.status(404).json({ mensaje : 'Historia no encontrada!!!'});
        else
            return res.json(historiaEditada);

    } catch (error) {
        res.status(400).json({ mensaje :  error.message})
    }
});
//ENDPOINT 4. eliminar
//ENDPOINT 4. eliminar
rutas.delete('/eliminar/:id',async (req, res) => {
    try {
       
       const historiaEliminada = await HistoriaModel.findByIdAndDelete(req.params.id);
       if (!historiaEliminada)
            return res.status(404).json({ mensaje : 'historia no encontrada!!!'});
       else 
            return res.json({mensaje :  'historia eliminada'});    
       } 
    catch (error) {
        res.status(500).json({ mensaje :  error.message})
    }
});




module.exports = rutas;