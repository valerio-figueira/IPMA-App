import { Request, Response } from "express";
import UserService from "../services/UserService";

export default class UserController {
    userController: object;

    constructor() {
        this.userController = new UserService();
    }

    async Create(req: Request, res: Response) {
        try {

        } catch (error) {
            res.status(500).json({error: error.message})
        }
    }

    async ReadAll(req: Request, res: Response) { }

    async ReadOne(req: Request, res: Response) { }

    async Update(req: Request, res: Response) { }

    async Delete(req: Request, res: Response) { }

}