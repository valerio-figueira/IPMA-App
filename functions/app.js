const express = require("express");
const app = express();
const serverless = require("serverless-http");
const path = require("path");
const cors = require("cors");
const Usuarios = require("./routes/usuarios");
const Parcelamentos = require("./routes/parcelamentos");
const session = require("express-session");
const flash = require('connect-flash');
require("dotenv").config();



    // MIDDLEWARE TO ENABLE CORS (Cross Origin Resource Sharing)
    app.use(cors({
        origin: "*",
        methods: ["GET"]
    }));


    // JSON CONFIG IN MIDDLEWARES
    app.use(express.urlencoded({extended: true}));
    app.use(express.json());

    // Session
    app.use(session({
        secret: 'applicationserver',
        resave: false,
        saveUninitialized: true,
        cookie: {
            sameSite: "None",
            maxAge: 1000 * 60 * 60 * 24,
        }
    }))

    app.use(flash());

    app.use((req, res, next) => {
        // GLOBAL VARIABLES
        res.locals.success_msg = req.flash("success_msg");
        res.locals.error_msg = req.flash("error_msg");
        res.locals.alert_msg = req.flash("alert_msg");
        res.locals.warning_msg = req.flash("warning_msg");
        next();
    });




    // ENGINE EJS
    app.set('views', __dirname + '/views')
    app.set('view engine', 'ejs');



    // MIDDLEWARE TO REDIRECT ALL ROUTES
    app.use("/usuarios", Usuarios);
    app.use("/parcelamentos", Parcelamentos);

    // MIDDLEWARE FOR STATIC FILES
    app.use(express.static(path.join("public")));



    // NECESSARY TO RUN SERVELESS
    const router = express.Router();



router.get("/", (req, res) => {
    req.flash("success_msg", "O Flash funcionou!");
    
    req.session.regenerate((err) => {
        if (err) next(err);
        req.session.msg = "Hello, world!"

        req.session.save((err) => {
            if(err) next(err);
            res.redirect("/message");
        })
    })
})

router.get("/message", (req, res) => {
    if(req.session.msg){
        res.render("pages/index", {
            alert_msg: req.session.msg
        })
    } else{
        res.render("pages/index")
    }
});





app.use("/", router);

app.listen(3000, () => {
    console.log("Server is up...")
})

//module.exports.handler = serverless(app);