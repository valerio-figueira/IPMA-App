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
                    const data = result;
                    console.log(data)

                    data.forEach(select => {
                      
                      // CONVERT BOOLEAN NUMBER TO STRING
                      if(select.aposentado == 1){
                        select.aposentado = "Sim";
                      } else{
                        select.aposentado = "Não";
                      }

                    })

                    con.end();
                    res.render("pages/usuarios/listar-usuarios", {data});
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
                    const userDetails = result[0];
                    

                    // CONVERT BOOLEAN NUMBER TO STRING
                    if(userDetails.aposentado == 1){
                        userDetails.aposentado = "Sim";
                    } else{
                        userDetails.aposentado = "Não";
                    }

                    // INSERTING DOTS AND DASH INTO CPF NUMBERS
                    const cpf = userDetails.cpf.split("");
                    cpf.splice(3, 0, ".");
                    cpf.splice(7, 0, ".");
                    cpf.splice(11, 0, "-");
                    userDetails.cpf = cpf.join("");

                    console.log(userDetails)

                    con.end();
                    res.render("pages/usuarios/detalhes-usuario", {userDetails});
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