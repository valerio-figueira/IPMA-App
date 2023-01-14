const express = require("express");
const app = express();
const serverless = require("serverless-http");
const mysql = require('mysql');
const path = require("path");
const cors = require("cors");
const Usuarios = require("./routes/usuarios");
const Parcelamentos = require("./routes/parcelamentos");
require("dotenv").config();



    // MIDDLEWARE TO ENABLE CORS (Cross Origin Resource Sharing)
    app.use(cors({
        origin: "*",
        methods: ["GET"]
    }));

    // MIDDLEWARE FOR STATIC FILES
    app.use(express.static(path.join(__dirname, "public")));


    // JSON CONFIG IN MIDDLEWARES
    app.use(
        express.urlencoded({
            extended: true
        })
    )
    app.use(express.json());



    // ENGINE EJS
    app.set('views', __dirname + '/views')
    app.set('view engine', 'ejs');



    // MIDDLEWARE TO REDIRECT ALL ROUTES
    app.use("/usuarios", Usuarios);
    app.use("/parcelamentos", Parcelamentos);



    // NECESSARY TO RUN SERVELESS
    const router = express.Router();




router.get("/", cors(), (req, res) => {
    res.render("pages/index");
})

router.get("/painel", cors(), (req, res) => {
    res.render("pages/painel");
});





app.use("/", router);

module.exports.handler = serverless(app);