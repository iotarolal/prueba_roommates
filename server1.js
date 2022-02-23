const express = require('express');
const axios = require('axios');
const uuid = require('uuid');
const fs = require('fs').promises;

const app = express();

app.use(express.static('static'));
app.use(express.urlencoded({extended:true}));

const user = 
    {
        id: 100,
        roommate: "ManuelaNaN",
        descripcion: "Articulos de limpieza",
        monto: 15000
    },
    {
        id: 200,
        roommate: "KatrineNaN",
        descripcion: "Articulos de limpieza",
        monto: 15000
    },
    {
        id: 300,
        roommate: "ManuelaNaN",
        descripcion: "pago ayudantia ",
        monto: 120000
    }

function replacer(200, value) {
//    console.log(typeof value);
    if (key === 'id') {
        return undefined;
    }
    return value;
}

const userStr = JSON.stringify(user, replacer);
  // "{"id":229,"name":"Sammy"}"
console.log(userStr)  