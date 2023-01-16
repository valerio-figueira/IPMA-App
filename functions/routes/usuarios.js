const router = require("express").Router();
const mysql = require("mysql");
require("dotenv").config();

const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_NAME = process.env.DB_NAME;
const HOST_NAME = process.env.HOST_NAME;




// CREATE
router.post("/", async (req, res) => {})
router.post("/cadastrar-usuario", async (req, res) => {
    const errors = [];
    const regex = /[0-9]/;
    const alphabeth = /[A-z]/;


    if(typeof req.body.nome == undefined || req.body.nome == null || req.body.nome == ""){
        errors.push({text: "Preencha o nome"})
    }
    if(req.body.nome.length < 7){
        errors.push({text: "O nome digitado é muito pequeno."})
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



})
router.post("/cadastrar-dependente", async (req, res) => {
    
})

// FORM TO CREATE NEW
router.get("/cadastrar-usuario", async (req, res) => {
    res.render("pages/usuarios/novo-usuario")
})
router.get("/cadastrar-dependente", async (req, res) => {
    res.render("pages/dependentes/novo-dependente")
})



// READ
router.get("/", async (req, res) => {
    const con = mysql.createConnection({
        host: HOST_NAME,
        database: DB_NAME,
        user: DB_USER,
        password: DB_PASSWORD
    });

    con.connect((error) => {
        if(error){
            throw error
        } else{
            con.query("SELECT * FROM USUARIOS", (error, result, fields) => {
                if(error){
                    throw error;
                } else{
                    const usuarios = result;
                    console.log(usuarios)

                    usuarios.forEach(select => {
                      
                      // CONVERT BOOLEAN NUMBER TO STRING
                      if(select.aposentado == 1){
                        select.aposentado = "Sim";
                      } else{
                        select.aposentado = "Não";
                      }

                    })
                    const errors = ["Error-01", "Error-02", "Error-03"];

                    con.end();
                    res.render("pages/usuarios/listar-usuarios", {usuarios, success_msg: "Usuário cadastrado!"});
                };
            });
        };
    });
})


// READ ONLY
router.get("/consultar/:id", async (req, res) => {
    const con = mysql.createConnection({
        host: HOST_NAME,
        database: DB_NAME,
        user: DB_USER,
        password: DB_PASSWORD
    });

    con.connect((error) => {
        if(error){
            throw error
        } else{
            con.query(`SELECT * FROM USUARIOS WHERE id=${req.params.id}`, (error, result, fields) => {
                if(error){
                    throw error;
                } else{
                    const usuario = result[0];
                    

                    // CONVERT BOOLEAN NUMBER TO STRING
                    if(usuario.aposentado == 1){
                        usuario.aposentado = "Sim";
                    } else{
                        usuario.aposentado = "Não";
                    }

                    // INSERTING DOTS AND DASH INTO CPF NUMBERS
                    const cpf = usuario.cpf.split("");
                    cpf.splice(3, 0, ".");
                    cpf.splice(7, 0, ".");
                    cpf.splice(11, 0, "-");
                    usuario.cpf = cpf.join("");

                    console.log(usuario)

                    con.end();
                    res.render("pages/usuarios/detalhes-usuario", {userDetails: usuario});
                };
            });
        };
    });
})



// UPDATE
// PATCH ATUALIZA UM CAMPO INDIVIDUAL
router.patch("/:id", async (req, res) => {})


// DELETE
router.delete("/:id", async (req, res) => {})


module.exports = router;