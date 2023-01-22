const express = require("express");
const app = express();
const serverless = require("serverless-http");
const path = require("path");
const cors = require("cors");
const Usuarios = require("./routes/usuarios");
const Parcelamentos = require("./routes/parcelamentos");
const session = require("express-session");
const bodyParser = require('body-parser');
const flash = require('connect-flash');
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
        cookie: {
            sameSite: "None",
            secure: true,
            maxAge: 24 * 60 * 60 * 1000 // 24 hours
        }
    }))


    app.use(flash());
    app.use((req, res, next) => {
        // res.locals serve para criar variáveis globais
        res.locals.success_msg = req.flash("success_msg");
        res.locals.error_msg = req.flash("error_msg");
        next();
    });

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