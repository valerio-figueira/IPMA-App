const express = require("express");
const app = express();
const serverless = require("serverless-http");
const path = require("path");
const cors = require("cors");
const Usuarios = require("./routes/usuarios");
const Parcelamentos = require("./routes/parcelamentos");
const flash = require("connect-flash");
const session = require("express-session");
const handlebars = require("express-handlebars");
const bodyParser = require("body-parser");
require("dotenv").config();



    // MIDDLEWARE TO ENABLE CORS (Cross Origin Resource Sharing)
    app.use(cors({
        origin: "*",
        methods: ["GET"]
    }));

    // MIDDLEWARE FOR STATIC FILES
    app.use(express.static(path.join(__dirname, "public")));

    // TO DISPLAY MESSAGES
    app.use(flash());


    // Session
    app.use(session({
        secret: 'blogapp',
        resave: true,
        saveUninitialized: true
    }))

    // Middleware
    app.use((req, res, next) => {
        // res.locals used to create global variables
        res.locals.success_msg = req.flash("success_msg");
        res.locals.error_msg = req.flash("error_msg");
        next();
    });





    // Body Parser
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(bodyParser.json());



    // ENGINE HANDLEBARS
    app.engine('handlebars', handlebars.engine({defaultLayout: 'main'}));
    app.set('views', __dirname + '/views')
    app.set('view engine', 'handlebars');



    // MIDDLEWARE TO REDIRECT ALL ROUTES
    app.use("/usuarios", Usuarios);
    app.use("/parcelamentos", Parcelamentos);



    // NECESSARY TO RUN SERVELESS
    const router = express.Router();




router.get("/", (req, res) => {
    res.render("index");
})

router.get("/painel", cors(), (req, res) => {
    res.render("painel");
});





app.use("/", router);

module.exports.handler = serverless(app);