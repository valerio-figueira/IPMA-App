import { Request, Response } from "express";
import UserService from "../services/UserService";

export default class UserController {
    userService: UserService;

    constructor() {
        this.userService = new UserService();
    }

    async Create(req: Request, res: Response) {
        try {
            await this.userService.Create(req.body);

        } catch (error) {
            res.status(500).json({error: error.message})
        }
    }

    async ReadAll(req: Request, res: Response) { }

    async ReadOne(req: Request, res: Response) { }

    async Update(req: Request, res: Response) { }

    async Delete(req: Request, res: Response) { }

}