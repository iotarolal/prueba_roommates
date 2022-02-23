const enviar_email = require('./email.js');
//const newroommate = require('./funciones.js');
const express = require('express');
const axios = require('axios');
const uuid = require('uuid');
const fs = require('fs').promises;

const app = express();

app.use(express.static('static'));
app.use(express.urlencoded({extended:true}));


async function newroommate() {

    let randomuser = await axios.get("https://randomuser.me/api/");
    randomuser = randomuser.data.results[0];

    const newuser = {
        //crea un identificador
        id : uuid.v4().slice(10),
        nombre : randomuser.name.first + + randomuser.name.last,
        debe:0,
        recibe:0,
}
return newuser;
}


// agregar roommate con post
app.post('/roommate', async(req, res) => {

    const roommate = await newroommate();
    let db = await fs.readFile("db.json", 'utf-8');
    db = JSON.parse(db);

    db.roommates.push(roommate);

    await fs.writeFile('db.json', JSON.stringify(db), 'utf-8');

    res.send("registro grabado")
})


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

        res.send(db);

    });
});



// obtengo datos de roommeantes 

app.get('/roommates', async(req, res) => {

    // Leer informacion del archivo db
    let db = await fs.readFile("db.json", 'utf-8');
    db = JSON.parse(db);

    // retorno  datos al index.html
    res.send({roommates:db.roommates});
});

// obtengo datos de gastos
app.get('/gastos', async(req, res) => {

    // Leer informacion del archivo db
    let db = await fs.readFile("db.json", 'utf-8');
    db = JSON.parse(db);

    // retorno  datos al index.html
    res.send({gastos:db.gastos});
//    res.send(db);
});

// Put Update Gasto
app.put('/gasto', async (req, res) => {

    const id = req.query.id;
    let body;
    req.on('data', (payload) => {
        body = JSON.parse(payload);
    });
    

    req.on('end', async() => {
    
        const datosgasto = { 
            id : req.query.id,
            roommate: body.roommate, 
            descripcion: body.descripcion, 
            monto: body.monto
        }
        // Leer informacion del archivo db
        let db = await fs.readFile("db.json", 'utf-8');
        db = JSON.parse(db);

        // Actualizo  datos de datosgasto a Gastos     

        // elimino el registro modificado
        const arrayroommate =  db.roommates.filter(x => x.id !== id);
        const arraygastos =  db.gastos.filter(x => x.id !== id);
        db = arrayroommate.concat(arraygastos);

        // agrego datos modificados
        db.gastos.push(datosgasto);

        // grabo registros
        await fs.writeFile('db.json', JSON.stringify(db), 'utf-8');

        res.send(db);

    });
});


// Put eliminados

app.delete('/gasto', async (req, res) => {

    let body;
    req.on('data', (payload) => {
        body = JSON.parse(payload);
    });

    req.on('end', async() => {

        const id = req.query.id;
        console.log(id);

        // Leer informacion del archivo db
        let db = await fs.readFile("db.json", 'utf-8');
        db = JSON.parse(db);

        const arrayroommate =  db.roommates.filter(x => x.id !== id);
        const arraygastos =  db.gastos.filter(x => x.id !== id);
        db = arrayroommate.concat(arraygastos);
//        const db1 =  db.filter(x => x.id !== id);

        await fs.writeFile('db.json', JSON.stringify(db), 'utf-8');

        res.send(db);

    });
});


app.listen(3000, function() {
    console.log("Servidor andando en el puerto numero 3000");
});

