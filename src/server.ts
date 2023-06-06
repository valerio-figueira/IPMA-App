import express, { Application } from "express";
import path from "path";
import cors from 'cors';
import BodyParser, { json } from 'body-parser';

// ROUTES
import Users from './routes/Users';
import Installments from './routes/Installments';
import Payments from './routes/Payments';

require("dotenv").config();

export default class Server {
    APP: Application;
    PORT: number;

    constructor(PORT: number) {
        this.APP = express();
        this.PORT = PORT;
        this.setupMiddleware();
        this.setupRoutes();
    }

    public start() {
        this.APP.listen(this.PORT, () => {
            console.log("Server running on port " + this.PORT)
        });
    }

    private setupMiddleware() {
        this.APP.use(cors({
            origin: "*",
            methods: ["GET", "POST", "PUT", "DELETE"]
        }));

        this.APP.use(BodyParser.urlencoded({ extended: true }));
        this.APP.use(json());

        this.APP.use(express.static(path.join("public")));
    }

    private setupRoutes() {
        this.APP.use("/api/v1/users", Users);
        this.APP.use("/api/v1/installments", Installments);
        this.APP.use("/api/v1/payments", Payments);
    }
}