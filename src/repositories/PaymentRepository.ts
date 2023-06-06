import ManageDB from "../db/ManageDB";

export default class PaymentRepository {
    manageDB: ManageDB;

    constructor() {
        this.manageDB = new ManageDB();
    }

    async Create(installment_id: string) { 
        return this.manageDB.createQuery(`INSERT INTO PAGAMENTOS VALUES (DEFAULT, ${installment_id}, DEFAULT, '${new Date().toISOString()}')`);
    }

    async ReadAll(holder: string) {
        return this.manageDB.createQuery(`SELECT USUARIOS.id, USUARIOS.matricula, USUARIOS.nome, PARCELAMENTOS.valor_total, PARCELAMENTOS.id AS id_parcelamento, PARCELAMENTOS.qtd_parcelas, PARCELAMENTOS.valor_parcela, PAGAMENTOS.pago, DATE_FORMAT(PAGAMENTOS.data_pagamento, '%d/%m/%Y') as data_pagamento, PAGAMENTOS.id AS id_pagamento, CONVENIOS.nome_convenio, DATE_FORMAT(PARCELAMENTOS.data_inicio, '%d/%m/%Y') as data_inicio FROM USUARIOS, PARCELAMENTOS, PAGAMENTOS, CONVENIOS WHERE USUARIOS.id = PARCELAMENTOS.id_usuario AND PAGAMENTOS.id_parcelamento = PARCELAMENTOS.id AND CONVENIOS.id = PARCELAMENTOS.id_convenio AND USUARIOS.id = ${holder} ORDER BY PAGAMENTOS.data_pagamento DESC`);
    }

    async ReadOne(holder: string, installment_id: string) {
        return this.manageDB.createQuery(`SELECT USUARIOS.id, USUARIOS.matricula, USUARIOS.nome, PARCELAMENTOS.valor_total, PARCELAMENTOS.id AS id_parcelamento , PARCELAMENTOS.qtd_parcelas, PARCELAMENTOS.valor_parcela, PAGAMENTOS.id AS id_pagamento, PAGAMENTOS.pago, DATE_FORMAT(PAGAMENTOS.data_pagamento, '%d/%m/%Y') as data_pagamento, CONVENIOS.nome_convenio, DATE_FORMAT(PARCELAMENTOS.data_inicio, '%d/%m/%Y') as data_inicio FROM USUARIOS, PARCELAMENTOS, PAGAMENTOS, CONVENIOS WHERE USUARIOS.id = PARCELAMENTOS.id_usuario AND PAGAMENTOS.id_parcelamento = PARCELAMENTOS.id AND CONVENIOS.id = PARCELAMENTOS.id_convenio AND USUARIOS.id = ${holder} AND id_parcelamento = ${installment_id} ORDER BY PAGAMENTOS.data_pagamento DESC`);
    }

    async Update() { }

    async Delete(payment_id: string) {
        return this.manageDB.createQuery(`DELETE FROM PAGAMENTOS WHERE id=${payment_id}`);
    }

}