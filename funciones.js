const express = require('express');
const axios = require('axios');
const fs = require('fs').promises;
const uuid = require('uuid');

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
        recibe:0
    }
return newuser;
}


async function validonewroommate(){
// valido que no se repina el mismo nombre


}

module.exports = newroommate;

