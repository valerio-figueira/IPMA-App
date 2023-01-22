const mysql = require("mysql");
require("dotenv").config();


const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_NAME = process.env.DB_NAME;
const HOST_NAME = process.env.HOST_NAME;



// FUNCTIONS
function createSQLConnection(){
    const connection = mysql.createConnection({
        host: HOST_NAME,
        database: DB_NAME,
        user: DB_USER,
        password: DB_PASSWORD
    });

    return connection;
}

function convertCPF(cpf){
    const cpfArray = cpf.split("");
    cpfArray.splice(3, 0, ".");
    cpfArray.splice(7, 0, ".");
    cpfArray.splice(11, 0, "-");
    cpf = cpfArray.join("");

    return cpf;
}

function convertDATE(dates){
    for(let date of dates){
        date = new Date(date).toLocaleDateString();
    }

    return dates;
}

function convertISODATE(){
    const year = new Date().getFullYear();
    const month = new Date().getMonth() + 1;
    const day = new Date();

    const convertedDate = `${year}-${month}-${day.getDate()}`;

    console.log("Day: " + day)

    return convertedDate;
}

function convertBooleanToString(aposentado){
    if(aposentado == 1){
        aposentado = "Sim";
    } else{
        aposentado = "Não";
    }

    return aposentado;
}




module.exports = { convertCPF, convertDATE, convertISODATE, createSQLConnection, convertBooleanToString }