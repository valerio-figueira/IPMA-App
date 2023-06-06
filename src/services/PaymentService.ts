import PaymentRepository from "../repositories/PaymentRepository";

export default class PaymentService {
    paymentRepository: PaymentRepository;

    constructor() {
        this.paymentRepository = new PaymentRepository();
    }

    async Create() {
        // MAKE USER REQUEST TO SQL
        /*
        const usuario = result[0];

        if (++usuario.qtd_parcelas_pagas > usuario.qtd_parcelas) {
            con.end();
            req.flash("error_msg", "Não foi possível registrar o pagamento, limite máximo de parcelas atingido");
            res.redirect(301, req.get("referer"));
        } else { // SUCCESS };
        */
    }

    async ReadAll(holder: string) {
        return this.paymentRepository.ReadAll(holder);
    }

    async ReadOne(holder: string, installment_id: string) {
        return this.paymentRepository.ReadOne(holder, installment_id);
    }

    async Update() { }

    async Delete(payment_id: string) {
        return this.paymentRepository.Delete(payment_id);
    }

}