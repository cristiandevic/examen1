const express = require('express');
const rutas = express.Router();
const HistoriaModel = require('../models/historia');
const UsuarioModel = require('../models/usuario');
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
        puntuacion: req.body.puntuacion,
        usuario: req.body.usuario // asignar el id del usuario
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
//ENDPOINT 5 filtrado por tipo de historia

rutas.get('/filtrotipo/:dato', async (req, res) => {
    try  {
        const tipobuscado= req.params.dato;
        const historia = await HistoriaModel.find({ tipo:  tipobuscado}).exec();
        
        res.json(historia);
    } catch (error){
        res.status(500).json({mensaje: error.message});
    }
});
//ENDPOINT 6 agregar puntuacion
rutas.put('/agregarPuntuacion/:id', async (req, res) => {
    try {   

        const agregar=req.body;  
        const historiaEditada = await HistoriaModel.findByIdAndUpdate(req.params.id, agregar, { new : true });
        if (!historiaEditada)
            return res.status(404).json({ mensaje : 'no se pudo modificar!!!'});
        else
            return res.json(historiaEditada);

    } catch (error) {
        res.status(400).json({ mensaje :  error.message})
    }
});
//ENDPOINT 7 filtrado por puntuacion

rutas.get('/filtroPuntuacion/:puntuacion', async (req, res) => {
    try  {
        
        const historia = await HistoriaModel.find({ puntuacion :  req.params.puntuacion }).exec();
        
        
        res.json(historia);
    } catch (error){
        res.status(500).json({mensaje: error.message});
    }
});
//ENDPOINT 7 encontrar uno de acuerdo a la puntuacion enviada 
rutas.get('/encontrarUno/:puntuacion', async (req, res) => {
    try  {
        
        const historia = await HistoriaModel.findOne({ puntuacion :  req.params.puntuacion }).exec();
        
        res.json(historia);
    } catch (error){
        res.status(500).json({mensaje: error.message});
    }
});

// Endpoint 8: seleccionar una historia aleatoria
rutas.get('/historiaAleatoria', async (req, res) => {
    try {
      const count = await HistoriaModel.countDocuments();
      const randomIndex = Math.floor(Math.random() * count);
  
      const historiaAleatoria = await HistoriaModel.findOne().skip(randomIndex).exec();
  
      if (!historiaAleatoria) {
        return res.status(404).json({ mensaje: 'No se encontraron historias' });
      }
  
      res.json(historiaAleatoria);
    } catch (error) {
      res.status(500).json({ mensaje: error.message });
    }
  });

  // Endpoint 9: historias por autor
rutas.get('/historiasAutor/:autor', async (req, res) => {
    try {
      const autor = req.params.autor;
  
      const historiasAutor = await HistoriaModel.find({ autor: autor }).exec();
  
      if (!historiasAutor || historiasAutor.length === 0) {
        return res.status(404).json({ mensaje: `No se encontraron historias del autor ${autor}` });
      }
  
      res.json(historiasAutor);
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
      }
    });

    //REPORTES 1
rutas.get('/historiaPorUsuario/:usuarioId', async (peticion, respuesta) =>{
    const {usuarioId} = peticion.params;
    //console.log(usuarioId);
    try{
        const usuario = await UsuarioModel.findById(usuarioId);
        if (!usuario)
            return respuesta.status(404).json({mensaje: 'usuario no encontrado'});
        const historias = await HistoriaModel.find({ usuario: usuarioId}).populate('usuario');
        respuesta.json(historias);

    } catch(error){
        respuesta.status(500).json({ mensaje :  error.message})
    }
});




module.exports = rutas;