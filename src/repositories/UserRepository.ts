import ManageDB from "../db/ManageDB";
import { IUser } from "../interfaces/IUser";

export default class UserRepository {
    manageDB: ManageDB;

    constructor() {
        this.manageDB = new ManageDB();
    }

    async Create(query: IUser) {
        return this.manageDB.createQuery(`INSERT INTO USUARIOS VALUES ('DEFAULT', '${query.matricula}', '${query.nome}', '${query.identidade}', ${query.data_exp != null ? "'" + query.data_exp + "'" : null}, '${query.orgao_emissor}', '${query.cpf}', '${query.sexo}', '${query.estado_civil}', ${query.data_nasc != null ? "'" + query.data_nasc + "'" : null}, '${query.cartao_sus}', '${query.endereco}', ${query.numero_endereco != null ? "'" + query.numero_endereco + "'" : null}, '${query.bairro}', '${query.cidade}', '${query.nome_pai}', '${query.nome_mae}', DEFAULT, '${query.aposentado}', DEFAULT, NULL)`);
    }

    async ReadAll(query: { nome: string, tipo: string }) {
        return this.manageDB.createQuery(`SELECT *, DATE_FORMAT(data_nasc, '%d/%m/%Y') as data_nasc, DATE_FORMAT(data_exp, '%d/%m/%Y') as data_exp, DATE_FORMAT(data_cadastro, '%d/%m/%Y') as data_cadastro FROM USUARIOS ${query.nome ? "WHERE nome LIKE " + "'" + query.nome + "%'" : ""} ${query.tipo == "ativos" ? "WHERE aposentado=0" : ""} ${query.tipo == "aposentados" ? "WHERE aposentado=1" : ""}`);
    }

    async ReadOne(holder_id: string) {
        return this.manageDB.createQuery(`SELECT * FROM USUARIOS WHERE id=${holder_id}`);
    }

    async Update() { }

    async Delete() { }

}