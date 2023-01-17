const express = require("express");
const app = express();
const serverless = require("serverless-http");
const path = require("path");
const cors = require("cors");
const Usuarios = require("./routes/usuarios");
const Parcelamentos = require("./routes/parcelamentos");
const flash = require("connect-flash");
const session = require("express-session");
var bodyParser = require('body-parser');
require("dotenv").config();



    // MIDDLEWARE TO ENABLE CORS (Cross Origin Resource Sharing)
    app.use(cors({
        origin: "*",
        methods: ["GET"]
    }));

    // MIDDLEWARE FOR STATIC FILES
    app.use(express.static(path.join(__dirname, "public")));


    // Session
    app.use(session({
        secret: 'ipmaserver',
        resave: true,
        saveUninitialized: true
    }))
    // TO DISPLAY MESSAGES
    app.use(flash());


    // Middleware
    app.use((req, res, next) => {
        // res.locals used to create global variables
        res.locals.success_msg = req.flash("success_msg");
        res.locals.error_msg = req.flash("error_msg");
        next();
    });


    // JSON CONFIG IN MIDDLEWARES
    // Body Parser
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(bodyParser.json());



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