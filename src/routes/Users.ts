import { Router } from "express";

// IMPORT FUNCTIONS
import { convertCPF, convertDATE, convertISODATE, createSQLConnection, convertBooleanToString } from '../Utils/Functions';
import UserSchema from "../model/UserSchema";

const router = Router();


// CREATE
router.post("/", async (req, res) => {})

router.post("/cadastrar-usuario", async (req, res) => {
    const errors: { text: string }[] = [];
    const regex = /[0-9]/;
    const alphabeth = /[A-z]/;
    const alphnumeric = /[A-z-0-9]/;


    if(!(typeof req.body.matricula == undefined || req.body.matricula == null || req.body.matricula == "")){
        if(!regex.test(req.body.matricula)){
            errors.push({text: "A matrícula deve conter apenas números"})
        }
    }

    if(typeof req.body.nome == undefined || req.body.nome == null || req.body.nome == ""){
        errors.push({text: "Preencha o nome"})
    }
    if(req.body.nome.length < 10){
        errors.push({text: "O nome digitado é muito pequeno"})
    }
    if(!alphabeth.test(req.body.nome) || regex.test(req.body.nome)){
        errors.push({text: "O nome não pode conter números ou caracteres especiais"})
    }

    if(typeof req.body.cpf == undefined || req.body.cpf == null || req.body.cpf == ""){
        errors.push({text: "Preencha o CPF"})
    }

    if(typeof req.body.sexo == undefined){
        errors.push({text: "Selecione o sexo"})
    }

    if(!(typeof req.body.orgaoEmissor == 'string' || req.body.orgaoEmissor == undefined || req.body.orgaoEmissor == null)){
        if(!alphabeth.test(req.body.orgaoEmissor)){
            errors.push({text: "Orgão emissor deve conter apenas letras"})
        }
    }



    if(!regex.test(req.body.cartaoSUS)){
        errors.push({text: "O cartão SUS deve conter apenas números"})
    }

    if(!(req.body.bairro == "" || typeof req.body.bairro == undefined || req.body.bairro == null)){
        if(!(alphnumeric.test(req.body.bairro))){
            errors.push({text: "O bairro não deve conter caracteres especiais"})
        }
    }


    if(!(typeof req.body.numeroEnd == "string" || req.body.numeroEnd == undefined || req.body.numeroEnd == null)){
        if(!regex.test(req.body.numeroEnd)){
            errors.push({text: "Somente números são permitidos para o número do endereço"})
        }
    }

    if(errors.length > 0){
        res.render("pages/usuarios/novo-usuario", {errors})
    } else{

        if(req.body.sexo.match("FEMININO")){
            if(req.body.estadoCivil){
                // UPDATE FIRST AND LAST LETTER OF 'ESTADOCIVIL'
                const array = req.body.estadoCivil.split("");
                array.pop();
                array.push("A");
                req.body.estadoCivil = array.toString().replaceAll(",", "");
            }
        }

        if(req.body.numeroEnd == 0 || req.body.numeroEnd == ''){
            req.body.numeroEnd = null;
        }

        if(req.body.dataExp == 0 || req.body.dataExp == '' || req.body.dataExp.match("00-00-0000")){
            req.body.dataExp = null;
        }

        if(req.body.dataNasc == 0 || req.body.dataNasc == '' || req.body.dataNasc.match("00-00-0000")){
            req.body.dataNasc = null;
        }


        // REMOVING DASH AND DOTS FROM CPF INPUT
        req.body.cpf = req.body.cpf.replaceAll(".", "");
        req.body.cpf = req.body.cpf.replace("-", "");
        
        const newUser = new UserSchema(req.body);

        console.log(newUser);
        

        

        const con = createSQLConnection();

        con.connect((error) => {
            if(error){
                res.render("pages/usuarios/novo-usuario", {
                    error_msg: `Ocorreu um erro: ${error}`
                })
            } else{
                const userData = `INSERT INTO USUARIOS VALUES ('DEFAULT', '${newUser.matricula}', '${newUser.nome}', '${newUser.identidade}', ${newUser.data_exp != null ? "'" + newUser.data_exp + "'" : null}, '${newUser.orgao_emissor}', '${newUser.cpf}', '${newUser.sexo}', '${newUser.estado_civil}', ${newUser.data_nasc != null ? "'" + newUser.data_nasc + "'" : null}, '${newUser.cartao_sus}', '${newUser.endereco}', ${newUser.numero_endereco != null ? "'" + newUser.numero_endereco + "'" : null}, '${newUser.bairro}', '${newUser.cidade}', '${newUser.nome_pai}', '${newUser.nome_mae}', DEFAULT, '${newUser.aposentado}', DEFAULT, NULL)`;


                con.query(userData, function (error, result) {
                    if(error){
                        res.render("pages/usuarios/novo-usuario", {error_msg: "Não foi possível cadastrar o novo usuário no sistema: " + error});
                        con.end();
                    } else {
                        newUser.cpf = convertCPF(newUser.cpf);

                        //[newUser.data_exp, newUser.data_nasc, newUser.data_cadastro] = convertDATE([newUser.data_exp, newUser.data_nasc, newUser.data_cadastro]);
                        
                        res.render(`pages/usuarios/detalhes-usuario`, {
                            success_msg: "Usuário cadastrado com sucesso!",
                            userDetails: newUser
                        });
                    };
                    con.end();
                });
            };
        });
    };
});



router.post("/cadastrar-dependente", async (req, res) => {
    
});

// FORM TO CREATE NEW
router.get("/cadastrar-usuario", async (req, res) => {
    res.render("pages/usuarios/novo-usuario");
});

router.get("/cadastrar-dependente/:id", async (req, res) => {
    const con = createSQLConnection();

    con.query(`SELECT * FROM USUARIOS WHERE id=${req.params.id}`, (error, result, fields) => {
        if(error){
            res.render("pages/dependentes/novo-dependente", {error_msg: `Ocorreu um erro: ${error}`});
            con.end();
        } else{
            const usuario = result[0];
            console.log(usuario);

                // INSERTING DOTS AND DASH INTO CPF NUMBERS
                usuario.cpf = convertCPF(usuario.cpf);

            res.render("pages/dependentes/novo-dependente", {usuario});
            con.end();
        };
    });
});



// READ
router.get("/", async (req, res) => {
    const con = createSQLConnection();

    con.connect((error) => {
        if(error){
            res.render("pages/usuarios/listar-usuarios", {
                error_msg: `Ocorreu um erro: ${error}`
            });
        } else{
            con.query(`SELECT *, DATE_FORMAT(data_nasc, '%d/%m/%Y') as data_nasc, DATE_FORMAT(data_exp, '%d/%m/%Y') as data_exp, DATE_FORMAT(data_cadastro, '%d/%m/%Y') as data_cadastro FROM USUARIOS ${req.query.nome ? "WHERE nome LIKE " + "'" + req.query.nome + "%'": ""} ${req.query.tipo == "ativos" ? "WHERE aposentado=0" : ""} ${req.query.tipo == "aposentados" ? "WHERE aposentado=1" : ""}`, (error, result) => {
                if(error){
                    res.render("pages/usuarios/listar-usuarios", {
                        error_msg: `Ocorreu um erro: ${error}`
                    });
                    con.end();
                } else{
                    const usuarios = result;
                    console.log(usuarios)

                    usuarios.forEach(usuario => {
                        // CONVERT BOOLEAN NUMBER TO STRING
                        usuario.aposentado = convertBooleanToString(usuario.aposentado);
                        /*
                        usuario.data_cadastro = new Date(usuario.data_cadastro)
                        .toLocaleString();

                        if(usuario.data_exp != null){
                        usuario.data_exp = new Date(usuario.data_exp)
                        .toLocaleDateString();
                        }
                        if(usuario.data_nasc != null){
                        usuario.data_nasc = new Date(usuario.data_nasc)
                        .toLocaleDateString();
                        }
                        */
                    })

                    res.render("pages/usuarios/listar-usuarios", {
                        usuarios
                    });
                    con.end();
                };
            });
        };
    });
});


// READ ONLY
router.get("/consultar/:id", async (req, res) => {
    const con = createSQLConnection();

    con.connect((error) => {
        if(error){
            res.render("pages/usuarios/detalhes-usuario", {
                error_msg: `Ocorreu um erro: ${error}`
            });
        } else{
            con.query(`SELECT * FROM USUARIOS WHERE id=${req.params.id}`, (error, result) => {
                if(error){
                    res.render("pages/usuarios/detalhes-usuario", {
                        error_msg: `Ocorreu um erro: ${error}`
                    });
                    con.end();
                } else{
                    const usuario = result[0];


                    // CONVERT BOOLEAN NUMBER TO STRING
                    usuario.aposentado = convertBooleanToString(usuario.aposentado);

                    usuario.data_nasc = new Date(usuario.data_nasc).toLocaleDateString();
                    usuario.data_exp = new Date(usuario.data_exp).toLocaleDateString();
                    usuario.data_cadastro = new Date(usuario.data_cadastro).toLocaleDateString();

                    // INSERTING DOTS AND DASH INTO CPF NUMBERS
                    usuario.cpf = convertCPF(usuario.cpf);

                    console.log(usuario);

                    con.query(`SELECT * FROM DEPENDENTES WHERE id_titular=${req.params.id}`, (error, result) => {
                        if(error){
                            res.render("pages/usuarios/detalhes-usuario", {
                                error_msg: `Houve uma falha: ${error}`
                            });
                            con.end();
                        } else{
                            const dependentes = result;

                            dependentes.forEach(dependente => {
                                dependente.data_nasc = new Date(dependente.data_nasc).toLocaleDateString();
                                dependente.data_exp = new Date(dependente.data_exp).toLocaleDateString();
                                dependente.data_cadastro = new Date(dependente.data_cadastro).toLocaleDateString();
                                dependente.data_exclusao = new Date(dependente.data_exclusao).toLocaleDateString();

                                // INSERTING DOTS AND DASH INTO CPF NUMBERS
                                dependente.cpf = convertCPF(dependente.cpf);
                            })

                            res.render("pages/usuarios/detalhes-usuario", {
                                userDetails: usuario, 
                                dependentes
                            });
                            con.end();
                        };
                    });
                };
            });
        };
    });
});



// UPDATE
// PATCH ATUALIZA UM CAMPO INDIVIDUAL
router.patch("/:id", async (req, res) => {})


// DELETE
router.delete("/:id", async (req, res) => {})


export default router