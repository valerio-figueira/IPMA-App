import { Request, Response } from "express";
import UserService from "../services/UserService";

export default class UserController {
    userService: UserService;

    constructor() {
        this.userService = new UserService();
    }

    async Create(req: Request, res: Response) {
        try {
            res.status(201).json(await this.userService.Create(req.body))
        } catch (error: any) {
            res.status(500).json({ error: error.message })
        }
    }

    async ReadAll(req: Request, res: Response) {
        try {
            res.status(200).json(await this.userService.ReadAll(req.query))
        } catch (error: any) {
            res.status(500).json({ error: error.message })
        }
    }

    async ReadOne(req: Request, res: Response) {
        try {
            res.status(200).json(await this.userService.ReadOne(req.params.id))
        } catch (error: any) {
            res.status(500).json({ error: error.message })
        }
    }

    async Update(req: Request, res: Response) {
        try {
            res.status(200).json(await this.userService.Update(req.params.id, req.body))
        } catch (error: any) {
            res.status(500).json({ error: error.message })
        }
    }

    async Delete(req: Request, res: Response) {
        try {
            res.status(200).json(await this.userService.Delete(req.params.id))
        } catch (error: any) {
            res.status(500).json({ error: error.message })
        }
    }

}