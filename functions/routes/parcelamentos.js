const router = require("express").Router();
const mysql = require("mysql");
require("dotenv").config();


const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_NAME = process.env.DB_NAME;
const HOST_NAME = process.env.HOST_NAME;




// CREATE
router.post("/", async (req, res) => {})

// CREATE PAGAMENTO
router.get("/novo-pagamento", async (req, res) => {
    const con = mysql.createConnection({
      host: HOST_NAME,
      database: DB_NAME,
      user: DB_USER,
      password: DB_PASSWORD
    });


})



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
              if(req.query.nome) {
                con.query(`SELECT USUARIOS.id, USUARIOS.matricula, USUARIOS.nome, USUARIOS.aposentado, PARCELAMENTOS.valor_total, PARCELAMENTOS.qtd_parcelas, PARCELAMENTOS.valor_parcela, COUNT(*) as qtd_parcelas_pagas, DATE_FORMAT(PARCELAMENTOS.data_inicio, '%m/%d/%Y') as data_inicio, CONVENIOS.nome_convenio FROM USUARIOS, PARCELAMENTOS, PAGAMENTOS, CONVENIOS WHERE USUARIOS.id = PARCELAMENTOS.id_usuario AND PAGAMENTOS.id_parcelamento = PARCELAMENTOS.id AND USUARIOS.nome LIKE '${req.query.nome}%' AND CONVENIOS.id = PARCELAMENTOS.id_convenio GROUP BY USUARIOS.nome;`, (error, result, fields) => {
                  if(error){
                    res.render("pages/parcelamentos", {error_msg: error});
                  } else {
                      const data = result;
                      console.log(data)

                      // SUM ALL ROW PRICES
                      let totalPrice = 0;

                      data.forEach(select => {
                        
                        // CONVERT BOOLEAN NUMBER TO STRING
                        if(select.aposentado == 1){
                          select.aposentado = "Sim";
                        } else{
                          select.aposentado = "Não";
                        }

                        totalPrice += select.valor_parcela;

                        // ADD DECIMAL POINTS
                        select.valor_total = Number(select.valor_total).toFixed(2);
                        select.valor_parcela = Number(select.valor_parcela).toFixed(2);
                      })

                      totalPrice = Number(totalPrice).toFixed(2);

                      con.end();
                      res.render("pages/parcelamentos/listar-parcelamentos", {data, totalPrice});
                  };
              });
            } else {
                con.query(`SELECT USUARIOS.id, USUARIOS.matricula, USUARIOS.nome, USUARIOS.aposentado, PARCELAMENTOS.valor_total, PARCELAMENTOS.qtd_parcelas, PARCELAMENTOS.valor_parcela, COUNT(*) as qtd_parcelas_pagas, DATE_FORMAT(PARCELAMENTOS.data_inicio, '%m/%d/%Y') as data_inicio, CONVENIOS.nome_convenio FROM USUARIOS, PARCELAMENTOS, PAGAMENTOS, CONVENIOS WHERE USUARIOS.id = PARCELAMENTOS.id_usuario AND PAGAMENTOS.id_parcelamento = PARCELAMENTOS.id AND CONVENIOS.id = PARCELAMENTOS.id_convenio GROUP BY USUARIOS.nome;`, (error, result, fields) => {
                  if(error){
                      throw error;
                  } else{
                      const data = result;
                      console.log(data)

                      // SUM ALL ROW PRICES
                      let totalPrice = 0;

                      data.forEach(select => {
                        
                        // CONVERT BOOLEAN NUMBER TO STRING
                        if(select.aposentado == 1){
                          select.aposentado = "Sim";
                        } else {
                          select.aposentado = "Não";
                        }

                        totalPrice += select.valor_parcela;

                        // ADD DECIMAL POINTS
                        select.valor_total = Number(select.valor_total).toFixed(2);
                        select.valor_parcela = Number(select.valor_parcela).toFixed(2);
                      })

                      totalPrice = Number(totalPrice).toFixed(2);

                      con.end();
                      res.render("pages/parcelamentos/listar-parcelamentos", {data, totalPrice});
                  };
              });
            };
        };
    });
});

// READ PAYMENTS
router.get("/pagamentos", async (req, res) => {
  const con = mysql.createConnection({
      host: HOST_NAME,
      database: DB_NAME,
      user: DB_USER,
      password: DB_PASSWORD
  });

  con.connect((error) => {
      if(error){
          throw error
      } else {
          con.query(`SELECT USUARIOS.id, USUARIOS.matricula, USUARIOS.nome, PARCELAMENTOS.valor_total, PARCELAMENTOS.qtd_parcelas, PARCELAMENTOS.valor_parcela, PAGAMENTOS.pago, DATE_FORMAT(PAGAMENTOS.data_pagamento, '%m/%d/%Y') as data_pagamento, CONVENIOS.nome_convenio, DATE_FORMAT(PARCELAMENTOS.data_inicio, '%m/%d/%Y') as data_inicio FROM USUARIOS, PARCELAMENTOS, PAGAMENTOS, CONVENIOS WHERE USUARIOS.id = PARCELAMENTOS.id_usuario AND PAGAMENTOS.id_parcelamento = PARCELAMENTOS.id AND CONVENIOS.id = PARCELAMENTOS.id_convenio AND USUARIOS.nome LIKE '${req.query.nome}%' ORDER BY PAGAMENTOS.data_pagamento`, (error, result, fields) => {
              if(error){
                  throw error;
              } else {
                  const data = result;

                  data.forEach(select => {

                    if(select.pago == 1){
                      select.pago = "Sim";
                    } else{
                      select.pago = "Não";
                    }

                    // ADD DECIMAL POINTS
                    select.valor_total = Number(select.valor_total).toFixed(2);
                    select.valor_parcela = Number(select.valor_parcela).toFixed(2);
                  })

                  console.log(data)
                  con.end();
                  res.render("pages/pagamentos/listar-pagamentos", {data});
              };
          });
      };
  });
})

router.get("/pagamentos/:id", async (req, res) => {
  const con = mysql.createConnection({
      host: HOST_NAME,
      database: DB_NAME,
      user: DB_USER,
      password: DB_PASSWORD
  });

  con.connect((error) => {
      if(error){
          throw error
      } else {
          con.query(`SELECT USUARIOS.id, USUARIOS.matricula, USUARIOS.nome, PARCELAMENTOS.valor_total, PARCELAMENTOS.qtd_parcelas, PARCELAMENTOS.valor_parcela, PAGAMENTOS.pago, DATE_FORMAT(PAGAMENTOS.data_pagamento, '%m/%d/%Y') as data_pagamento, CONVENIOS.nome_convenio, DATE_FORMAT(PARCELAMENTOS.data_inicio, '%m/%d/%Y') as data_inicio FROM USUARIOS, PARCELAMENTOS, PAGAMENTOS, CONVENIOS WHERE USUARIOS.id = PARCELAMENTOS.id_usuario AND PAGAMENTOS.id_parcelamento = PARCELAMENTOS.id AND CONVENIOS.id = PARCELAMENTOS.id_convenio AND USUARIOS.id = ${req.params.id} ORDER BY PAGAMENTOS.data_pagamento`, (error, result, fields) => {
              if(error){
                  throw error;
              } else {
                  const data = result;

                  data.forEach(select => {

                    if(select.pago == 1){
                      select.pago = "Sim";
                    } else{
                      select.pago = "Não";
                    }

                    // ADD DECIMAL POINTS
                    select.valor_total = Number(select.valor_total).toFixed(2);
                    select.valor_parcela = Number(select.valor_parcela).toFixed(2);
                  })

                  console.log(data)
                  con.end();
                  res.render("pages/pagamentos/listar-pagamentos", {data});
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
  res.render("pages/parcelamentos/atualizar-parcelamento")
})



// DELETE
router.delete("/:id", async (req, res) => {})


module.exports = router;