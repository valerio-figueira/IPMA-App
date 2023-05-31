import { IUser } from "../interfaces/IUser";
import { convertISODATE } from "../Utils/Functions";

export default class UserSchema {
    matricula: string;
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
    aposentado: string;
    data_cadastro: string;

    constructor (body: IUser) {
        this.matricula = body.matricula;
        this.nome = body.nome.toUpperCase();
        this.identidade = body.identidade.toUpperCase();
        this.data_exp = body.data_exp.toUpperCase();
        this.orgao_emissor = body.orgao_emissor.toUpperCase();
        this.cpf = body.cpf;
        this.sexo = body.sexo.toUpperCase();
        this.estado_civil = body.estado_civil.toUpperCase();
        this.data_nasc = body.data_nasc.toUpperCase();
        this.cartao_sus = body.cartao_sus.toUpperCase();
        this.endereco = body.endereco.toUpperCase();
        this.numero_endereco = body.numero_endereco.toUpperCase();
        this.bairro = body.bairro.toUpperCase();
        this.cidade = body.cidade.toUpperCase();
        this.nome_mae = body.nome_mae.toUpperCase();
        this.nome_pai = body.nome_pai.toUpperCase();
        this.aposentado = body.aposentado.toUpperCase();
        this.data_cadastro = convertISODATE();
    }
}