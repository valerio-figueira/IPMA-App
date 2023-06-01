import { IRelative } from "../interfaces/IRelative";

export default class RelativeSchema {
    nome_dependente: string;
    identidade: string;
    data_exp: string;
    orgao_emissor: string;
    cpf: string;
    estado_civil: string;
    data_nasc: string;
    cartao_sus: string;
    endereco: string;
    bairro: string;
    numero_end: number;
    cidade: string;
    grau_parentesco: string;
    nome_mae: string;

    constructor (body: IRelative) {
        this.nome_dependente = body.nome_dependente;
        this.identidade = body.identidade;
        this.data_exp = body.data_exp;
        this.orgao_emissor = body.orgao_emissor;
        this.cpf = body.cpf;
        this.estado_civil = body.estado_civil;
        this.data_nasc = body.data_nasc;
        this.cartao_sus = body.cartao_sus;
        this.endereco = body.endereco;
        this.bairro = body.bairro;
        this.numero_end = body.numero_end;
        this.cidade = body.cidade;
        this.nome_mae = body.nome_mae;
        this.grau_parentesco = body.grau_parentesco;
    }
}