import { IHolder } from "../interfaces/IHolder";

export default class HolderSchema {
    matricula: number;
    nome: string;
    identidade: string;
    data_exp: string;
    orgao_emissor: string;
    cpf: string;
    sexo: string;
    estado_civil: string;
    data_nasc: string;
    cartao_sus: string;
    endereco: string;
    numero_endereco: string;
    bairro: string;
    cidade: string;
    nome_mae: string;
    nome_pai: string;
    aposentado: boolean;

    constructor (body: IHolder) {
        this.matricula = body.matricula;
        this.nome = body.nome;
        this.identidade = body.identidade;
        this.data_exp = body.data_exp;
        this.orgao_emissor = body.orgao_emissor;
        this.cpf = body.cpf;
        this.sexo = body.sexo;
        this.estado_civil = body.estado_civil;
        this.data_nasc = body.data_nasc;
        this.cartao_sus = body.cartao_sus;
        this.endereco = body.endereco;
        this.numero_endereco = body.numero_endereco;
        this.bairro = body.bairro;
        this.cidade = body.cidade;
        this.nome_mae = body.nome_mae;
        this.nome_pai = body.nome_pai;
        this.aposentado = body.aposentado;
    }
}