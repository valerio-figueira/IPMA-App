import PaymentService from "../services/PaymentService";
import { Request, Response } from "express";

export default class PaymentController {
    paymentService: PaymentService;

    constructor() {
        this.paymentService = new PaymentService();
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
            res.status(200).json(await this.paymentService.ReadAll(req.params.holder))
        } catch(error: any) {
            res.status(500).json(error.message)
        }
    }

    async ReadOne(req: Request, res: Response) { 
        try {
            res.status(200).json(await this.paymentService.ReadOne(req.params.holder, req.params.payment))
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
            res.status(204).json(await this.paymentService.Delete(req.body.payment_id))
        } catch(error: any) {
            res.status(500).json(error.message)
        }
    }

}