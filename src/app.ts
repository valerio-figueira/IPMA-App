import express from "express";
import path from "path";
import Users from './routes/Users';
import cors from 'cors';
import BodyParser, { json } from 'body-parser';

require("dotenv").config();


const app = express();

    // MIDDLEWARE TO ENABLE CORS (Cross Origin Resource Sharing)
    app.use(cors({
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE"]
    }));

    // MIDDLEWARE FOR JSON
    app.use(BodyParser.urlencoded({ extended: true }));
    app.use(json());

    // MIDDLEWARE TO REDIRECT ALL ROUTES
    app.use("/api/v1/users", Users);
    // app.use("/parcelamentos", Parcelamentos);

    // MIDDLEWARE FOR STATIC FILES
    app.use(express.static(path.join("public")));


app.listen(3000, () => {
    console.log("Server running on port " + 3000)
});