import { Request, Response } from "express";
import RelativeService from "../services/RelativeService";


export default class RelativeController {
    relativeService: RelativeService;

    constructor() {
        this.relativeService = new RelativeService();
    }

    async Create(req: Request, res: Response) {
        try {
            await this.relativeService.Create(req.body);
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    }

    async ReadAll(req: Request, res: Response) {
        try {
            await this.relativeService.ReadAll(req.params.holder)
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    }

    async ReadOne(req: Request, res: Response) {
        try {
            await this.relativeService.ReadOne(req.params.holder, req.params.relative)
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    }

    async Update(req: Request, res: Response) { }

    async Delete(req: Request, res: Response) { }

}