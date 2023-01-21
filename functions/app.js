const express = require("express");
const app = express();
const serverless = require("serverless-http");
const path = require("path");
const cors = require("cors");
const Usuarios = require("./routes/usuarios");
const Parcelamentos = require("./routes/parcelamentos");
const session = require("express-session");
const bodyParser = require('body-parser');
require("dotenv").config();



    // MIDDLEWARE TO ENABLE CORS (Cross Origin Resource Sharing)
    app.use(cors({
        origin: "*",
        methods: ["GET"]
    }));

    // Session
    app.use(session({
        secret: 'ipmaserver',
        resave: true,
        saveUninitialized: true,
    }))

    // JSON CONFIG IN MIDDLEWARES
    // Body Parser
    app.use(bodyParser.urlencoded({
        extended: true,
    }));
    app.use(bodyParser.json());



    // ENGINE EJS
    app.set('views', __dirname + '/views')
    app.set('view engine', 'ejs');



    // MIDDLEWARE TO REDIRECT ALL ROUTES
    app.use("/usuarios", Usuarios);
    app.use("/parcelamentos", Parcelamentos);

    // MIDDLEWARE FOR STATIC FILES
    app.use(express.static(path.join(__dirname, "public")));



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