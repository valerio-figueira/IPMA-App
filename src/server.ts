import express, { Application, Request, Response, NextFunction } from "express";
import path from "path";
import cors from 'cors';
import BodyParser, { json } from 'body-parser';
import session from "express-session";

// ROUTES
import Users from './routes/Users';
import Installments from './routes/Installments';
import Payments from './routes/Payments';
import Login from './routes/Login';
import SuperUser from './routes/SuperUser';

declare module 'express-session' {
    interface SessionData { user: string; }
}

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
            origin: ["http://localhost:5500"],
            methods: ["GET", "POST", "PUT", "DELETE"],
            allowedHeaders: ['Content-Type', 'Authorization'],
            credentials: true
        }));

        this.APP.use(BodyParser.urlencoded({ extended: true }));
        this.APP.use(json());

        this.APP.use(session({
            secret: 'mystery key',
            resave: false,
            saveUninitialized: false,
            cookie: { sameSite: 'none' }
        }))

        this.APP.use(express.static(path.join("public")));

        this.APP.use("/api/v1/users", this.isAuthenticated, Users);
        this.APP.use("/api/v1/installments", this.isAuthenticated, Installments);
        this.APP.use("/api/v1/payments", this.isAuthenticated, Payments);
        this.APP.use('/api/v1/user', this.isAuthenticated, SuperUser);
        this.APP.use("/login", Login);
    }

    private isAuthenticated(req: Request, res: Response, next: NextFunction) {
        console.log(req.session.user)
        if (req.session.user) next()
        else res.redirect('/')
    }

    private setupRoutes() {
        this.APP.get("/", this.rootHandler);
    }

    private rootHandler(req: Request, res: Response) {
        res.status(200).json({ message: 'Hello world!' })
    }
}