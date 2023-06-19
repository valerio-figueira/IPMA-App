import ManageDB from "../db/ManageDB";
import { IHolder } from "../interfaces/IHolder";

export default class UserRepository {
    manageDB: ManageDB;

    constructor() {
        this.manageDB = new ManageDB();
    }

    async Create(query: IHolder) {
        return this.manageDB.createQuery(`INSERT INTO USUARIOS VALUES ('DEFAULT', '${query.matricula}', '${query.nome}', '${query.identidade}', ${query.data_exp !== null ? "'" + query.data_exp + "'" : null}, '${query.orgao_emissor}', '${query.cpf}', '${query.sexo}', '${query.estado_civil}', ${query.data_nasc !== null ? "'" + query.data_nasc + "'" : null}, '${query.cartao_sus}', '${query.endereco}', ${query.numero_endereco !== null ? "'" + query.numero_endereco + "'" : null}, '${query.bairro}', '${query.cidade}', '${query.nome_pai}', '${query.nome_mae}', DEFAULT, '${query.aposentado}', DEFAULT, NULL)`);
    }

    async ReadAll(query: { nome: string, tipo: string }) {
        return this.manageDB.createQuery(`SELECT *, DATE_FORMAT(data_nasc, '%d/%m/%Y') as data_nasc, DATE_FORMAT(data_exp, '%d/%m/%Y') as data_exp, DATE_FORMAT(data_cadastro, '%d/%m/%Y') as data_cadastro FROM USUARIOS ${query.nome ? "WHERE nome LIKE " + "'%" + query.nome + "%'" : ""} ${query.tipo === "ativos" ? "WHERE aposentado=0" : ""} ${query.tipo === "aposentados" ? "WHERE aposentado=1" : ""}`);
    }

    async ReadOne(holder_id: string) {
        return this.manageDB.createQuery(`SELECT * FROM USUARIOS WHERE id=${holder_id}`);
    }

    async Update(holder_id: string, query: IHolder) { 
        return this.manageDB.createQuery(`UPDATE USUARIOS SET matricula=${query.matricula}, nome=${query.nome}, identidade=${query.identidade}, data_exp=${query.data_exp}, orgao_emissor=${query.orgao_emissor}, cpf=${query.cpf}, sexo=${query.sexo}, estado_civil=${query.estado_civil}, data_nasc=${query.data_nasc}, cartao_sus=${query.cartao_sus}, endereco=${query.cartao_sus}, numero_endereco=${query.numero_endereco}, bairro=${query.bairro}, cidade=${query.cidade}, nome_mae=${query.nome_mae}, nome_pai=${query.nome_pai}, aposentado=${query.aposentado} WHERE id=${holder_id}`);
    }

    async Delete(holder_id: string) {
        return this.manageDB.createQuery(`DELETE FROM USUARIOS WHERE id=${holder_id}`);
    }

}