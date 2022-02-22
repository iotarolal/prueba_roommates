const enviar_email = require('./email.js');
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
            email: randomuser.email
    }
    return newuser;
}

// agregar roommate con post
app.post('/roommate', async(req, res) => {
//    console.log('voy a new roommate pst')

    const roommate = await newroommate();
    let bd = await fs.readFile("db.json", 'utf-8');
    bd = JSON.parse(bd);

    bd.roommates.push(roommate);

    await fs.writeFile('db.json', JSON.stringify(bd), 'utf-8');

    console.log({roommate})
 //   res.end({roommate})
    res.send({roommate})

//    res.send("registro grabado")
})


app.post('/gasto', async(req, res) => {

// obtengo datos    
    const datosgasto = {
        roommate: req.body.roommate,
        descripcion: req.body.descripcion,
        monto:req.body.monto
    }
    
// Leer informacion del archivo db
    let bd = await fs.readFile("db.json", 'utf-8');
    bd = JSON.parse(bd);

// agrego datos de datosgasto a Gastos     
    bd.gastos.push(datosgasto);

// Registro información en archivo db

    await fs.writeFile('db.json', JSON.stringify(db), 'UTF-8', function() {
        console.log('Gasto agregado');
    });

    console.log(bd);

    res.send("gasto grabado")

})


app.get('/roommates', async(req, res) => {

    // Leer informacion del archivo db
    let bd = await fs.readFile("db.json", 'utf-8');
    bd = JSON.parse(bd);

//    console.log(bd);

    // retorno  datos al index.html
    res.send(bd);
});


app.get('/gastos', async(req, res) => {

    // Leer informacion del archivo db
    let bd = await fs.readFile("db.json", 'utf-8');
    bd = JSON.parse(bd);

 //   console.log(bd);

    // retorno  datos al index.html
    return bd;

});



app.listen(3000, function() {
    console.log("Servidor andando en el puerto numero 3000");
});