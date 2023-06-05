import ManageDB from "../db/ManageDB";

export default class InstallmentRepository {
    manageDB: ManageDB;

    constructor() {
        this.manageDB = new ManageDB();
    }

    async Create() { }

    async ReadAll(holder: string | undefined = undefined) {
        return this.manageDB.createQuery(`SELECT USUARIOS.id, USUARIOS.matricula, USUARIOS.nome, USUARIOS.aposentado, PARCELAMENTOS.valor_total, PARCELAMENTOS.id as id_parcelamento, PARCELAMENTOS.qtd_parcelas, PARCELAMENTOS.valor_parcela, COUNT(*) as qtd_parcelas_pagas, DATE_FORMAT(PARCELAMENTOS.data_inicio, '%d/%m/%Y') as data_inicio, CONVENIOS.nome_convenio FROM USUARIOS, PARCELAMENTOS, PAGAMENTOS, CONVENIOS WHERE USUARIOS.id = PARCELAMENTOS.id_usuario AND PAGAMENTOS.id_parcelamento = PARCELAMENTOS.id AND CONVENIOS.id = PARCELAMENTOS.id_convenio ${holder ? "AND USUARIOS.nome LIKE " + "'" + holder + "%'" : ""} GROUP BY PAGAMENTOS.id_parcelamento ORDER BY USUARIOS.nome;`);
    }

    async ReadOne(installment_id: string) {
        return this.manageDB.createQuery(`SELECT * FROM PARCELAMENTOS WHERE id=${installment_id}`);
    }

    async Update() { }

    async Delete() { }

}