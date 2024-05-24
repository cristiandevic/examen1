const express = require('express');
const request = require('supertest');
const historiaRuta = require('../../rutas/rutahistoria');
const HistoriaModel = require('../../models/historia');
const mongoose  = require('mongoose');
const app = express();
app.use(express.json());

app.use('/historia', historiaRuta);

describe('Pruebas Unitarias para hitoria', () => {
    //se ejecuta antes de iniciar las pruebas
    beforeEach(async () => {
        await mongoose.connect('mongodb://127.0.0.1:27017/appproyecto',{
            useNewUrlParser : true,            
        });
        await HistoriaModel.deleteMany({});
    });
    // al finalziar las pruebas
    afterAll(() => {
        return mongoose.connection.close();
      });

    //1er test : GET
    test('Deberia Traer todas las historias metodo: GET: traerhistoria', async() =>{
        await HistoriaModel.create({ autor: 'felipe', tipo: 'alegre', contenido: 'la noche mas fria de mi vida', puntuacion: 5 });
        await HistoriaModel.create({ autor: 'luis', tipo: 'triste', contenido: 'la noche mas calida de mi vida', puntuacion: 5 });
        // solicitud - request
        const res =  await request(app).get('/historia/traerhistoria');
        //verificar la respuesta
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveLength(2);
    }, 10000);
    

});