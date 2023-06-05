import InstallmentService from "../services/InstallmentService";
import { Request, Response } from "express";

export default class InstallmentController {
    installmentService: InstallmentService;

    constructor() {
        this.installmentService = new InstallmentService();
    }

    async Create(req: Request, res: Response) {
        try {
            res.status(201).json()
        } catch(error: any) {
            res.status(500).json(error.message)
        }
    }

    async ReadAll(req: Request, res: Response) {
        try {
            res.status(200).json(await this.installmentService.ReadAll((req.query.name as string)))
        } catch(error: any) {
            res.status(500).json(error.message)
        }
    }

    async ReadOne(req: Request, res: Response) {
        try {
            res.status(200).json(await this.installmentService.ReadOne(req.params.id))
        } catch(error: any) {
            res.status(500).json(error.message)
        }
    }

    async Update(req: Request, res: Response) {
        try {
            res.status(200).json()
        } catch(error: any) {
            res.status(500).json(error.message)
        }
    }

    async Delete(req: Request, res: Response) {
        try {
            res.status(204).json()
        } catch(error: any) {
            res.status(500).json(error.message)
        }
    }

}