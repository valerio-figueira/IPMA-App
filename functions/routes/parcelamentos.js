const router = require("express").Router();
const mysql = require("mysql");
require("dotenv").config();


const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_NAME = process.env.DB_NAME;
const HOST_NAME = process.env.HOST_NAME;




// CREATE
router.post("/", async (req, res) => {})



// READ
router.get("/", (req, res) => {
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
            con.query("SELECT USUARIOS.id, USUARIOS.matricula, USUARIOS.nome, USUARIOS.ativo, PARCELAMENTOS.valor_total, PARCELAMENTOS.qtd_parcelas, PARCELAMENTOS.valor_parcela, COUNT(*) as qtd_parcelas_pagas, PARCELAMENTOS.clinica, DATE_FORMAT(PARCELAMENTOS.data_inicio, '%m/%d/%Y') as data_inicio FROM USUARIOS, PARCELAMENTOS, PAGAMENTOS WHERE USUARIOS.id = PARCELAMENTOS.id_usuario AND PAGAMENTOS.id_parcelamento = PARCELAMENTOS.id GROUP BY USUARIOS.nome;", (error, result, fields) => {
                if(error){
                    throw error;
                } else{
                    const data = result;
                    console.log(data)

                    // SUM ALL ROW PRICES
                    let totalPrice = 0;

                    data.forEach(select => {
                      
                      // CONVERT BOOLEAN NUMBER TO STRING
                      if(select.ativo == 1){
                        select.ativo = "Não";
                      } else{
                        select.ativo = "Sim";
                      }

                      totalPrice += select.valor_parcela;

                      // ADD DECIMAL POINTS
                      select.valor_total = Number(select.valor_total).toFixed(2);
                      select.valor_parcela = Number(select.valor_parcela).toFixed(2);
                    })

                    totalPrice = Number(totalPrice).toFixed(2);

                    con.end();
                    res.render("pages/listar-parcelamentos", {data, totalPrice});
                };
            });
        };
    });
})


// READ ONLY
//router.get("/:id", async (req, res) => {})



// UPDATE
// PATCH ATUALIZA UM CAMPO INDIVIDUAL
//router.patch("/:id", async (req, res) => {})

router.get("/atualizar", async (req, res) => {
  res.render("pages/atualizar-parcelamento")
})



// DELETE
router.delete("/:id", async (req, res) => {})


module.exports = router;