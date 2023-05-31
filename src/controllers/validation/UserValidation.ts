import { IUser } from "../../interfaces/IUser";

export default class UserValidation {
    regex = /[0-9]/;
    alphabeth = /[A-z]/;
    alphnumeric = /[A-z-0-9]/;

    static validateUserBody(body: IUser) {

    }

    static validateMatricula(matricula: string) {
        if (!(typeof matricula == undefined || matricula == null || matricula == "")) {
            if (!regex.test(matricula)) {
                { text: "A matrícula deve conter apenas números" }
            }
        }
    }

    static validateNome(nome: string) {
        if (nome.length < 10) {
            { text: "O nome digitado é muito pequeno" }
        }
        if (typeof nome == undefined || nome == null || nome == "") {
            { text: "Preencha o nome" }
        }
        if (!alphabeth.test(nome) || regex.test(nome)) {
            { text: "O nome não pode conter números ou caracteres especiais" }
        }
    }

    static validateCPF(cpf: string) {
        if (typeof cpf == undefined || cpf == null || cpf == "") {
            { text: "Preencha o CPF" }
        }
    }

    static validateSexo(sexo: string) {
        if (typeof sexo == undefined) {
            { text: "Selecione o sexo" }
        }
    }

    static validateOrgaoEmissor(orgaoEmissor: string) {
        if (!(typeof orgaoEmissor == 'string' || orgaoEmissor == undefined || orgaoEmissor == null)) {
            if (!alphabeth.test(orgaoEmissor)) {
                { text: "Orgão emissor deve conter apenas letras" }
            }
        }
    }

    static validateCartaoSUS(cartaoSUS: string) {
        if (!regex.test(cartaoSUS)) {
            { text: "O cartão SUS deve conter apenas números" }
        }
    }

    static validateBairro(bairro: string) {
        if (!(bairro == "" || typeof bairro == undefined || bairro == null)) {
            if (!(alphnumeric.test(bairro))) {
                { text: "O bairro não deve conter caracteres especiais" }
            }
        }
    }

    static validateNumEnd(numeroEnd: string) {
        if (!(typeof numeroEnd == "string" || numeroEnd == undefined || numeroEnd == null)) {
            if (!regex.test(numeroEnd)) {
                { text: "Somente números são permitidos para o número do endereço" }
            }
        }
    }

}