const router = require("express").Router();

// IMPORT FUNCTIONS
const { convertCPF, convertDATE, convertISODATE, createSQLConnection, convertBooleanToString } = require('./functions.js');




// CREATE
router.post("/", async (req, res) => {})

router.post("/cadastrar-usuario", async (req, res) => {
    const errors = [];
    const regex = /[0-9]/;
    const alphabeth = /[A-z]/;
    const alphnumeric = /[A-z-0-9]/;


    if(!(typeof req.body.matricula == undefined || req.body.matricula == null || req.body.matricula == "")){
        if(!regex.test(req.body.matricula) && !req.body.matricula == ""){
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

    if(typeof req.body.sexo == undefined || req.body.sexo == null | req.body.sexo == ""){
        errors.push({text: "Selecione o sexo"})
    }

    if(!(typeof req.body.orgaoEmissor == 'string' || req.body.orgaoEmissor == undefined || req.body.orgaoEmissor == null)){
        if(!alphabeth.test(req.body.orgaoEmissor)){
            errors.push({text: "Orgão emissor deve conter apenas letras"})
        }
    }



    if(!regex.test(req.body.cartaoSUS) && !req.body.cartaoSUS == ""){
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

        if(req.body.sexo.match("Feminino")){
            if(req.body.estadoCivil){
                // UPDATE FIRST AND LAST LETTER OF 'ESTADOCIVIL'
                const array = req.body.estadoCivil.split("");
                array.pop();
                array.push("a");
                const letter = array.shift();
                array.unshift(letter.toUpperCase());
                req.body.estadoCivil = array.toString().replaceAll(",", "");
            }
        } else if(req.body.sexo.match("Masculino")){
            if(req.body.estadoCivil){
                // UPDATE FIRST LETTER OF 'ESTADOCIVIL'
                const array = req.body.estadoCivil.split("");
                const letter = array.shift();
                array.unshift(letter.toUpperCase());
                req.body.estadoCivil = array.toString().replaceAll(",", "");
            }
        }

        if(req.body.numeroEnd == 0){
            req.body.numeroEnd = null;
        }


        // REMOVING DASH AND DOTS FROM CPF INPUT
        req.body.cpf = req.body.cpf.replaceAll(".", "");
        req.body.cpf = req.body.cpf.replace("-", "");


        // TO UPPERCASE
        req.body.nome = req.body.nome.toUpperCase();
        req.body.identidade = req.body.identidade.toUpperCase();
        req.body.orgaoEmissor = req.body.orgaoEmissor.toUpperCase();
        req.body.endereco = req.body.endereco.toUpperCase();
        req.body.estadoCivil = req.body.estadoCivil.toUpperCase();
        req.body.bairro = req.body.bairro.toUpperCase();
        req.body.cidade = req.body.cidade.toUpperCase();
        req.body.sexo = req.body.sexo.toUpperCase();
        req.body.nomeMae = req.body.nomeMae.toUpperCase();
        req.body.nomePai = req.body.nomePai.toUpperCase();

        
        const newUser = {
            matricula: req.body.matricula,
            nome: req.body.nome,
            identidade: req.body.identidade,
            data_exp: req.body.dataExp,
            orgao_emissor: req.body.orgaoEmissor,
            cpf: req.body.cpf,
            sexo: req.body.sexo,
            estado_civil: req.body.estadoCivil,
            data_nasc: req.body.dataNasc,
            cartao_sus: req.body.cartaoSUS,
            endereco: req.body.endereco,
            numero_endereco: req.body.numeroEnd,
            bairro: req.body.bairro,
            cidade: req.body.cidade,
            nome_mae: req.body.nomeMae,
            nome_pai: req.body.nomePai,
            data_cadastro: convertISODATE(),
            aposentado: req.body.aposentado
        }

        console.log(newUser);
        

        

        const con = createSQLConnection();

        con.connect((error) => {
            if(error){
                res.render("pages/usuarios/novo-usuario", {error_msg: error})
            } else{
                const userData = `INSERT INTO USUARIOS VALUES ('DEFAULT', '${newUser.matricula}', '${newUser.nome}', '${newUser.identidade}', '${newUser.data_exp}', '${newUser.orgao_emissor}', '${newUser.cpf}', '${newUser.sexo}', '${newUser.estado_civil}', '${newUser.data_nasc}', '${newUser.cartao_sus}', '${newUser.endereco}', '${newUser.numero_endereco}', '${newUser.bairro}', '${newUser.cidade}', '${newUser.nome_pai}', '${newUser.nome_mae}', '${newUser.data_cadastro}', '${newUser.aposentado}', NULL, NULL)`;

                con.query(userData, function (error, result) {
                    if(error){
                        res.render("pages/usuarios/novo-usuario", {error_msg: "Não foi possível cadastrar o novo usuário no sistema: " + error})
                    } else {
                        newUser.cpf = convertCPF(newUser.cpf);

                        [newUser.data_exp, newUser.data_nasc, newUser.data_cadastro] = convertDATE([newUser.data_exp, newUser.data_nasc, newUser.data_cadastro]);
                        
                        res.render(`pages/usuarios/detalhes-usuario`, {
                            success_msg: "Usuário cadastrado com sucesso!",
                            userDetails: newUser
                        })
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
            res.render("pages/dependentes/novo-dependente", {error_msg: error});
        } else{
            const usuario = result[0];
            console.log(usuario);

                // INSERTING DOTS AND DASH INTO CPF NUMBERS
                usuario.cpf = convertCPF(usuario.cpf);

            con.end();
            res.render("pages/dependentes/novo-dependente", {usuario});
        };
    });
});



// READ
router.get("/", async (req, res) => {
    const con = createSQLConnection();

    if(req.query.nome){
        con.query(`SELECT * FROM USUARIOS WHERE nome LIKE '${req.query.nome}%'`, (error, result, fields) => {
            if(error){
                res.render("pages/usuarios/listar-usuarios", {error_msg: error});
            } else{
                const usuarios = result;
                

                // CONVERT BOOLEAN NUMBER TO STRING
                usuarios.forEach(usuario => {
                    usuario.aposentado = convertBooleanToString(usuario.aposentado)
                    usuario.data_cadastro = new Date(usuario.data_cadastro)
                    .toLocaleDateString();
                    usuario.data_nasc = new Date(usuario.data_nasc)
                    .toLocaleDateString();                    
                })

                console.log(usuarios)

                con.end();
                res.render("pages/usuarios/listar-usuarios", {usuarios});
            };
        });
    } else {
        con.connect((error) => {
            if(error){
                res.render("pages/usuarios/listar-usuarios", {
                    error_msg: error
                });
            } else{
                con.query("SELECT * FROM USUARIOS", (error, result, fields) => {
                    if(error){
                        res.render("pages/usuarios/listar-usuarios", {
                            error_msg: error
                        });
                    } else{
                        const usuarios = result;
                        console.log(usuarios)
    
                        usuarios.forEach(usuario => {
                          // CONVERT BOOLEAN NUMBER TO STRING
                          usuario.aposentado = convertBooleanToString(usuario.aposentado);
    
                          usuario.data_cadastro = new Date(usuario.data_cadastro)
                          .toLocaleDateString();
                          usuario.data_nasc = new Date(usuario.data_nasc)
                          .toLocaleDateString();
    
                        })
    
                        con.end();
                        res.render("pages/usuarios/listar-usuarios", {
                            usuarios
                        });
                    };
                });
            };
        });
    };
});


// READ ONLY
router.get("/consultar/:id", async (req, res) => {
    const con = createSQLConnection();

    con.connect((error) => {
        if(error){
            res.render("pages/usuarios/detalhes-usuario", {
                error_msg: error
            });
        } else{
            con.query(`SELECT * FROM USUARIOS WHERE id=${req.params.id}`, (error, result, fields) => {
                if(error){
                    res.render("pages/usuarios/detalhes-usuario", {
                        error_msg: `Houve uma falha: ${error}`
                    });
                } else{
                    const usuario = result[0];


                    // CONVERT BOOLEAN NUMBER TO STRING
                    usuario.aposentado = convertBooleanToString(usuario.aposentado);

                    usuario.data_nasc = new Date(usuario.data_nasc).toLocaleDateString();
                    usuario.data_exp = new Date(usuario.data_exp).toLocaleDateString();
                    usuario.data_cadastro = new Date(usuario.data_cadastro).toLocaleDateString();

                    // INSERTING DOTS AND DASH INTO CPF NUMBERS
                    usuario.cpf = convertCPF(usuario.cpf);

                    console.log(usuario)

                    con.query(`SELECT * FROM DEPENDENTES WHERE id_titular=${req.params.id}`, (error, result, fields) => {
                        if(error){
                            con.end();
                            res.render("pages/usuarios/detalhes-usuario", {
                                error_msg: `Houve uma falha: ${error}`
                            });
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

                            con.end();
                            res.render("pages/usuarios/detalhes-usuario", {
                                userDetails: usuario, 
                                dependentes
                            });
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


module.exports = router;