import PaymentRepository from "../repositories/PaymentRepository";

export default class PaymentService {
    paymentRepository: PaymentRepository;

    constructor() {
        this.paymentRepository = new PaymentRepository();
    }

    async Create() { }

    async ReadAll(holder: string | undefined = undefined) {
        return this.paymentRepository.ReadAll(holder);
    }

    async ReadOne(holder: string, installment_id: string | undefined) {
        return this.paymentRepository.ReadOne(holder, installment_id);
    }

    async Update() { }

    async Delete(payment_id: string) {
        return this.paymentRepository.Delete(payment_id);
    }

}