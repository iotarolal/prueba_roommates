const enviar_email = require('./email.js');
const newroommate = require('./funciones.js');
const express = require('express');
const axios = require('axios');
const uuid = require('uuid');
const fs = require('fs').promises;

const app = express();

app.use(express.static('static'));
app.use(express.urlencoded({extended:true}));


// agregar roommate con post
app.post('/roommate', async(req, res) => {

    const roommate = await newroommate();
    let db = await fs.readFile("db.json", 'utf-8');
    db = JSON.parse(db);
    db.roommates.push(roommate);

    await fs.writeFile('db.json', JSON.stringify(db), 'utf-8');

    res.send({ todo: "OK" });
})

// agrega gastos con post
app.post('/gasto', async (req, res) => {
    let body;
    req.on('data', (payload) => {
        body = JSON.parse(payload);
    });

    req.on('end', async() => {

        const datosgasto = { 
            id : uuid.v4().slice(10),
            roommate: body.roommate, 
            descripcion: body.descripcion, 
            monto: body.monto
        }
        // Leer informacion del archivo db
        let db = await fs.readFile("db.json", 'utf-8');
        db = JSON.parse(db);

        // agrego datos de datosgasto a Gastos     
        db.gastos.push(datosgasto);

        // Registro información en archivo db
        await fs.writeFile('db.json', JSON.stringify(db), 'UTF-8', function() {
            console.log('Gasto agregado');
        });

        res.send({ gastos: db.gastos });

    });
});

// obtengo datos de roommeantes 
app.get('/roommates', async(req, res) => {

    let db = await fs.readFile("db.json", 'utf-8');
    db = JSON.parse(db);


    for (romme of db.roommates) {
        // filtrar los gastos DE ESE romme, y sumar sus valores
        for (gasto of db.gastos) {
            if (gasto.roommate == romme.nombre) {
                if (gasto.monto > 0) {
                    romme.recibe = romme.recibe + gasto.monto;
                } else {
                    romme.debe += gasto.monto;
                }
            }
        }
    }

    res.send({ roommates: db.roommates });

});

// obtengo datos de gastos
app.get('/gastos', async(req, res) => {

    // Leer informacion del archivo db
    let db = await fs.readFile("db.json", 'utf-8');
    db = JSON.parse(db);

    // retorno  datos al index.html
    res.send({ gastos: db.gastos });
});

// Put Update Gasto
app.put('/gasto', async(req, res) => {

    let body;
    req.on('data', (payload) => {
        body = JSON.parse(payload);
    });

    req.on('end', async() => {

        let db = await fs.readFile("db.json", 'utf-8');
        db = JSON.parse(db);

        db.gastos.map((gasto) => {
            if (gasto.id == req.query.id) {
                gasto.roommate = body.roommate
                gasto.monto = body.monto
                gasto.descripcion = body.descripcion
            }
        })    
            
        await fs.writeFile('db.json', JSON.stringify(db), 'utf-8');

        // retorno  datos al index.html
        res.send({ gastos: db.gastos });

    });
});


// delete gasto

app.delete('/gasto', async (req, res) => {

    // obtengo id 
    const id = req.query.id;
 
    // Leer informacion del archivo db
    let db = await fs.readFile("db.json", 'utf-8');
    db = JSON.parse(db);

    const arraygastos =  db.gastos.filter(x => x.id !== id);
    db.gastos=arraygastos

    await fs.writeFile('db.json', JSON.stringify(db), 'utf-8');

    res.send({ gastos: db.gastos });
});


app.listen(3000, function() {
    console.log("Servidor andando en el puerto numero 3000");
});

