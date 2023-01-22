const router = require("express").Router();
const fs = require('fs');
require("dotenv").config();


// IMPORT FUNCTIONS
const { convertISODATE, createSQLConnection, convertBooleanToString, convertCPF } = require('./functions.js');




// CREATE
router.post("/novo-pagamento", async (req, res) => {
    const con = createSQLConnection();

    con.connect((error) => {
        if(error){
            res.render("pages/pagamentos/listar-pagamentos", {error_msg: error});
        } else{
            const createNewDate = convertISODATE();
            console.log("CURRENT DATE: " + createNewDate)

            con.query(`INSERT INTO PAGAMENTOS VALUES (DEFAULT, ${req.body.id_parcelamento}, DEFAULT, '${createNewDate}')`, (error, result, field) => {
                if(error){
                  res.render("pages/pagamentos/listar-pagamentos", {error_msg: error});
                } else{
                  con.end();
                  //res.render("pages/pagamentos/listar-pagamentos", {success_msg: result});
                  req.flash("success_msg", "Novo pagamento realizado!")
                  res.redirect(req.get("referer"))
                }
            })
        }
    })
})

// CREATE PAGAMENTO
router.get("/novo-pagamento/:id", async (req, res) => {
    const con = createSQLConnection();

    con.connect((error) => {
        if(error){
          res.render("pages/parcelamentos/listar-parcelamentos", {
            error_msg: `Não foi possível se conectar ao banco de dados: ${error}`
          })
        } else{
            con.query(`SELECT * FROM PARCELAMENTOS WHERE id=${req.params.id}`, (error, result, field) => {
                if(error){
                  res.render("pages/parcelamentos/listar-parcelamentos", {
                    error_msg: `Não foi possível se conectar ao banco de dados: ${error}`
                  })
                } else{
                const parcelamento = result[0];

                    con.query(`SELECT nome_convenio FROM CONVENIOS WHERE id=${parcelamento.id_convenio}`, (error, result, field) => {
                        if(error){
                          res.render("pages/parcelamentos/listar-parcelamentos", {
                            error_msg: `Não foi possível se conectar ao banco de dados: ${error}`
                          })
                        } else{
                            const convenio = result[0];
                            con.query(`SELECT matricula, nome, cpf FROM USUARIOS WHERE id=${parcelamento.id_usuario}`, (error, result, field) => {
                                if(error){
                                  res.render("pages/parcelamentos/listar-parcelamentos", {
                                    error_msg: `Não foi possível se conectar ao banco de dados: ${error}`
                                  })
                                } else{
                                    const usuario = result[0];
                                    usuario.cpf = convertCPF(usuario.cpf);
                                    parcelamento.data_inicio = new Date(parcelamento.data_inicio).toLocaleDateString();
                                    parcelamento.valor_total = Number(parcelamento.valor_total).toFixed(2);
                                    parcelamento.valor_parcela = Number(parcelamento.valor_parcela).toFixed(2);
                                    parcelamento.valor_total = "R$ " + String(parcelamento.valor_total).replace(".", ",");
                                    parcelamento.valor_parcela = "R$ " + String(parcelamento.valor_parcela).replace(".", ",");
                                    

                                    console.log(parcelamento, usuario, convenio)
                                    con.end();
                                    res.render("pages/pagamentos/novo-pagamento", {
                                      parcelamento,
                                      usuario,
                                      convenio
                                    });
                                };
                            });
                        };
                    });
                };
            });
        };
    });
});



// READ
router.get("/", (req, res) => {
    const con = createSQLConnection();

    con.connect((error) => {
        if(error){
            res.render("pages/parcelamentos", {error_msg: error});
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
                        select.aposentado = convertBooleanToString(select.aposentado);

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
                con.query(`SELECT USUARIOS.id, USUARIOS.matricula, USUARIOS.nome, USUARIOS.aposentado, PARCELAMENTOS.valor_total, PARCELAMENTOS.qtd_parcelas, PARCELAMENTOS.valor_parcela, COUNT(*) as qtd_parcelas_pagas, DATE_FORMAT(PARCELAMENTOS.data_inicio, '%m/%d/%Y') as data_inicio, CONVENIOS.nome_convenio FROM USUARIOS, PARCELAMENTOS, PAGAMENTOS, CONVENIOS WHERE USUARIOS.id = PARCELAMENTOS.id_usuario AND PAGAMENTOS.id_parcelamento = PARCELAMENTOS.id AND CONVENIOS.id = PARCELAMENTOS.id_convenio GROUP BY PAGAMENTOS.id_parcelamento ORDER BY USUARIOS.nome;`, (error, result, fields) => {
                  if(error){
                      res.render("pages/parcelamentos", {error_msg: error});
                  } else{
                      const data = result;
                      

                      // SUM ALL ROW PRICES
                      let totalPrice = 0;

                      data.forEach(select => {
                        
                        // CONVERT BOOLEAN NUMBER TO STRING
                        select.aposentado = convertBooleanToString(select.aposentado);

                        totalPrice += select.valor_parcela;

                        // ADD DECIMAL POINTS
                        select.valor_total = Number(select.valor_total).toFixed(2);
                        select.valor_parcela = Number(select.valor_parcela).toFixed(2);
                      })

                      totalPrice = Number(totalPrice).toFixed(2);

                      console.log(data)

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
  const con = createSQLConnection();

  con.connect((error) => {
      if(error){
        res.render("pages/pagamentos/listar-pagamentos", {error_msg: error});
      } else {
          con.query(`SELECT USUARIOS.id, USUARIOS.matricula, USUARIOS.nome, PARCELAMENTOS.valor_total, PARCELAMENTOS.id AS id_parcelamento, PARCELAMENTOS.qtd_parcelas, PARCELAMENTOS.valor_parcela, PAGAMENTOS.pago, DATE_FORMAT(PAGAMENTOS.data_pagamento, '%m/%d/%Y') as data_pagamento, PAGAMENTOS.id AS id_pagamento, CONVENIOS.nome_convenio, DATE_FORMAT(PARCELAMENTOS.data_inicio, '%m/%d/%Y') as data_inicio FROM USUARIOS, PARCELAMENTOS, PAGAMENTOS, CONVENIOS WHERE USUARIOS.id = PARCELAMENTOS.id_usuario AND PAGAMENTOS.id_parcelamento = PARCELAMENTOS.id AND CONVENIOS.id = PARCELAMENTOS.id_convenio AND USUARIOS.nome LIKE '${req.query.nome}%' AND PAGAMENTOS.remocao == 0 ORDER BY PAGAMENTOS.data_pagamento DESC`, (error, result, fields) => {
              if(error){
                  res.render("pages/pagamentos/listar-pagamentos", {error_msg: error});
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
  const con = createSQLConnection();

  con.connect((error) => {
      if(error){
          res.render("pages/pagamentos/listar-pagamentos", {error_msg: error});
      } else {
          con.query(`SELECT USUARIOS.id, USUARIOS.matricula, USUARIOS.nome, PARCELAMENTOS.valor_total, PARCELAMENTOS.id AS id_parcelamento , PARCELAMENTOS.qtd_parcelas, PARCELAMENTOS.valor_parcela, PAGAMENTOS.id AS id_pagamento, PAGAMENTOS.pago, DATE_FORMAT(PAGAMENTOS.data_pagamento, '%m/%d/%Y') as data_pagamento, CONVENIOS.nome_convenio, DATE_FORMAT(PARCELAMENTOS.data_inicio, '%m/%d/%Y') as data_inicio FROM USUARIOS, PARCELAMENTOS, PAGAMENTOS, CONVENIOS WHERE USUARIOS.id = PARCELAMENTOS.id_usuario AND PAGAMENTOS.id_parcelamento = PARCELAMENTOS.id AND CONVENIOS.id = PARCELAMENTOS.id_convenio AND USUARIOS.id = ${req.params.id} ORDER BY PAGAMENTOS.data_pagamento DESC`, (error, result, fields) => {
              if(error){
                  res.render("pages/pagamentos/listar-pagamentos", {error_msg: error});
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

const stream = require('stream');

router.get("/relatorio", (req, res) => {
  const con = createSQLConnection();

  con.query(`SELECT USUARIOS.id, USUARIOS.matricula, USUARIOS.nome, USUARIOS.aposentado, PARCELAMENTOS.valor_total, PARCELAMENTOS.qtd_parcelas, PARCELAMENTOS.valor_parcela, COUNT(*) as qtd_parcelas_pagas, DATE_FORMAT(PARCELAMENTOS.data_inicio, '%m/%d/%Y') as data_inicio, CONVENIOS.nome_convenio FROM USUARIOS, PARCELAMENTOS, PAGAMENTOS, CONVENIOS WHERE USUARIOS.id = PARCELAMENTOS.id_usuario AND PAGAMENTOS.id_parcelamento = PARCELAMENTOS.id AND CONVENIOS.id = PARCELAMENTOS.id_convenio GROUP BY PAGAMENTOS.id_parcelamento ORDER BY USUARIOS.nome;`, (error, result, fields) => {
      if(error){
          res.render("pages/parcelamentos", {error_msg: error});
      } else{
          const data = result;
          

          // SUM ALL ROW PRICES
          let totalPrice = 0;

          data.forEach(select => {
            
            // CONVERT BOOLEAN NUMBER TO STRING
            select.aposentado = convertBooleanToString(select.aposentado);

            totalPrice += select.valor_parcela;

            // ADD DECIMAL POINTS
            select.valor_total = Number(select.valor_total).toFixed(2);
            select.valor_parcela = Number(select.valor_parcela).toFixed(2);
          })

          totalPrice = Number(totalPrice).toFixed(2);

          console.log(data)

          con.end();

          const currentDATE = new Date().toLocaleString();

          const fileName = `Relatório-Parcelamentos-${currentDATE}.txt`; 
        
          const fileContents = Buffer.from(data);

          const readStream = new stream.PassThrough();
          readStream.end(fileContents);
        
          res.set('Content-disposition', 'attachment; filename=' + fileName);
          res.set('Content-Type', 'text/plain');
        
          readStream.pipe(res);
      };
  });
});


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

// DELETE PAYMENTS
router.post("/remover-pagamento", async (req, res) => {
    const con = createSQLConnection();

    con.connect(error => {
        if(error){
          res.render("pages/pagamentos/listar-pagamentos", {
            error_msg: error
          })
        } else{
            con.query(`DELETE FROM PAGAMENTOS WHERE id=${req.body.id}`, (error, result) => {
                if(error){
                  res.render("pages/pagamentos/listar-pagamentos", {
                    error_msg: error
                  })
                } else{
                  res.redirect(req.get("referer"))
                };
                con.end();
            });
        };
    });
});


module.exports = router;