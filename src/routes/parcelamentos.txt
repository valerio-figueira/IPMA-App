const router = require("express").Router();
require("dotenv").config();


// IMPORT FUNCTIONS
const { convertISODATE, createSQLConnection, convertBooleanToString, convertCPF } = require('./functions.js');


// CREATE
router.post("/novo-pagamento", async (req, res) => {
    const con = createSQLConnection();

    con.connect((error) => {
        if(error){
            res.render("pages/pagamentos/listar-pagamentos", {error_msg: `Ocorreu um erro: ${error}`});
        } else{
            const createNewDate = convertISODATE();

            con.query(`SELECT USUARIOS.id, USUARIOS.nome, PARCELAMENTOS.qtd_parcelas, COUNT(*) as qtd_parcelas_pagas FROM USUARIOS, PARCELAMENTOS, PAGAMENTOS WHERE USUARIOS.id = PARCELAMENTOS.id_usuario AND PAGAMENTOS.id_parcelamento = PARCELAMENTOS.id AND PARCELAMENTOS.id_usuario = ${req.body.id} GROUP BY PAGAMENTOS.id_parcelamento ORDER BY USUARIOS.nome;`, (error, result) => {
            
              if(error){
                con.end();
                req.flash("error_msg", "Ocorreu um erro: " + error);
                res.redirect(301, req.get("referer"));
              } else{
                  const usuario = result[0];

                  if(++usuario.qtd_parcelas_pagas > usuario.qtd_parcelas){
                    con.end();
                    req.flash("error_msg", "Não foi possível registrar o pagamento, limite máximo de parcelas atingido");
                    res.redirect(301, req.get("referer"));
                  } else{
                    con.query(`INSERT INTO PAGAMENTOS VALUES (DEFAULT, ${req.body.id_parcelamento}, DEFAULT, '${createNewDate}')`, (error, result) => {
                        if(error){
                          con.end();
                          req.flash("error_msg", "Ocorreu um erro: " + error);
                          res.redirect(301, req.get("referer"));
                        } else{
                          con.end();
                          req.flash("success_msg", "Novo pagamento realizado para " + req.body.nome);
                          res.redirect(301, req.get("referer"));
                        };
                    });
                  };
              };
          });
        };
    });
});

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
                                    

                                    console.log(parcelamento, usuario, convenio);

                                    res.render("pages/pagamentos/novo-pagamento", {
                                      parcelamento,
                                      usuario,
                                      convenio
                                    });
                                    con.end();
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
            res.render("pages/parcelamentos/listar-parcelamentos", {error_msg: error});
        } else {
            con.query(`SELECT USUARIOS.id, USUARIOS.matricula, USUARIOS.nome, USUARIOS.aposentado, PARCELAMENTOS.valor_total, PARCELAMENTOS.id as id_parcelamento, PARCELAMENTOS.qtd_parcelas, PARCELAMENTOS.valor_parcela, COUNT(*) as qtd_parcelas_pagas, DATE_FORMAT(PARCELAMENTOS.data_inicio, '%d/%m/%Y') as data_inicio, CONVENIOS.nome_convenio FROM USUARIOS, PARCELAMENTOS, PAGAMENTOS, CONVENIOS WHERE USUARIOS.id = PARCELAMENTOS.id_usuario AND PAGAMENTOS.id_parcelamento = PARCELAMENTOS.id AND CONVENIOS.id = PARCELAMENTOS.id_convenio ${req.query.nome ? "AND USUARIOS.nome LIKE " + "'" + req.query.nome + "%'" : ""} GROUP BY PAGAMENTOS.id_parcelamento ORDER BY USUARIOS.nome;`, (error, result) => {
              if(error){
                  res.render("pages/parcelamentos/listar-parcelamentos", {
                    error_msg: `Ocorreu um erro: ${error}`
                  });
                  con.end();
              } else{
                  const data = result;
                  

                  // SUM ALL ROW PRICES
                  let totalPrice: number | string  = 0;

                  data.forEach(select => {
                    
                    // CONVERT BOOLEAN NUMBER TO STRING
                    select.aposentado = convertBooleanToString(select.aposentado);

                    totalPrice += select.valor_parcela;

                    // ADD DECIMAL POINTS
                    select.valor_total = Number(select.valor_total).toFixed(2);
                    select.valor_parcela = Number(select.valor_parcela).toFixed(2);
                  })

                  totalPrice = Number(totalPrice).toFixed(2);

                  console.log(data);

                  res.render("pages/parcelamentos/listar-parcelamentos", {data, totalPrice});
                  con.end();
              };
          });
        };
    });
});

// READ PAYMENTS
router.get("/pagamentos", async (req, res) => {
  const con = createSQLConnection();

  con.connect((error) => {
      if(error){
        res.render("pages/pagamentos/listar-pagamentos", {error_msg: `Ocorreu um erro: ${error}`});
      } else {
        if(req.query.nome){
          con.query(`SELECT USUARIOS.id, USUARIOS.matricula, USUARIOS.nome, PARCELAMENTOS.valor_total, PARCELAMENTOS.id AS id_parcelamento, PARCELAMENTOS.qtd_parcelas, PARCELAMENTOS.valor_parcela, PAGAMENTOS.pago, DATE_FORMAT(PAGAMENTOS.data_pagamento, '%d/%m/%Y') as data_pagamento, PAGAMENTOS.id AS id_pagamento, CONVENIOS.nome_convenio, DATE_FORMAT(PARCELAMENTOS.data_inicio, '%d/%m/%Y') as data_inicio FROM USUARIOS, PARCELAMENTOS, PAGAMENTOS, CONVENIOS WHERE USUARIOS.id = PARCELAMENTOS.id_usuario AND PAGAMENTOS.id_parcelamento = PARCELAMENTOS.id AND CONVENIOS.id = PARCELAMENTOS.id_convenio ${req.query.nome ? "AND USUARIOS.nome LIKE " + "'" + req.query.nome + "%'" : ""} ORDER BY PAGAMENTOS.data_pagamento DESC`, (error, result, fields) => {
            if(error){
                res.render("pages/pagamentos/listar-pagamentos", {error_msg: `Ocorreu um erro: ${error}`});
                con.end();
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
                res.render("pages/pagamentos/listar-pagamentos", {data});
                con.end();
            };
          });
        } else{
          con.end();
          res.render("pages/pagamentos/listar-pagamentos");
        }
      };
  });
})

router.get("/pagamentos/:id", async (req, res) => {
  const con = createSQLConnection();

  con.connect((error) => {
      if(error){
          res.render("pages/pagamentos/listar-pagamentos", {error_msg: `Ocorreu um erro: ${error}`});
      } else {
          con.query(`SELECT USUARIOS.id, USUARIOS.matricula, USUARIOS.nome, PARCELAMENTOS.valor_total, PARCELAMENTOS.id AS id_parcelamento , PARCELAMENTOS.qtd_parcelas, PARCELAMENTOS.valor_parcela, PAGAMENTOS.id AS id_pagamento, PAGAMENTOS.pago, DATE_FORMAT(PAGAMENTOS.data_pagamento, '%d/%m/%Y') as data_pagamento, CONVENIOS.nome_convenio, DATE_FORMAT(PARCELAMENTOS.data_inicio, '%d/%m/%Y') as data_inicio FROM USUARIOS, PARCELAMENTOS, PAGAMENTOS, CONVENIOS WHERE USUARIOS.id = PARCELAMENTOS.id_usuario AND PAGAMENTOS.id_parcelamento = PARCELAMENTOS.id AND CONVENIOS.id = PARCELAMENTOS.id_convenio AND USUARIOS.id = ${req.params.id} ${req.query.id_parcelamento ? "AND id_parcelamento=" + req.query.id_parcelamento : ""} ORDER BY PAGAMENTOS.data_pagamento DESC`, (error, result) => {
              if(error){
                  res.render("pages/pagamentos/listar-pagamentos", {error_msg: `Ocorreu um erro: ${error}`});
                  con.end();
              } else {
                  const data = result;

                  data.forEach((userData, i) => {

                    if(userData.pago == 1){
                      userData.pago = "Sim";
                    } else{
                      userData.pago = "Não";
                    }

                    // ADD DECIMAL POINTS
                    userData.valor_total = Number(userData.valor_total).toFixed(2);
                    userData.valor_parcela = Number(userData.valor_parcela).toFixed(2);

                  })
/*
                  const userPayments = {};

                  data.forEach((userData, i) => {
                    console.log(i)
                    if(userPayments[`payment${0}`] == undefined){
                      // ADICIONA O PRIMEIRO ITEM NA CHAVE-1 DO OBJETO
                      userPayments[`payment${i}`] = [userData]
                    } else{

                      for(let key in userPayments){

                        if(userPayments[key][0].id_parcelamento == userData.id_parcelamento){
                          userPayments[key].push(userData);
                        } else{
                          userPayments[`payment${i}`] = [userData];
                          
                          break;
                        }
                        console.log(`${key} : ${userPayments[key]}`)
                      }
                    }
                  })
*/ 

                  const usuario = {
                    matricula: data[0].matricula,
                    nome: data[0].nome,
                    nome_convenio: data[0].nome_convenio
                  }


                  // BRING BACK THE FLASH MESSAGES TO DISPLAY ON THE PAGE
                  const success_msg = res.locals.success_msg;
                  const error_msg = res.locals.error_msg;
                  const warning_msg = res.locals.warning_msg;

                  
                  res.render("pages/pagamentos/listar-pagamentos", {
                    usuario,
                    data,
                    success_msg,
                    error_msg,
                    warning_msg
                  });
                  con.end();
              };
          });
      };
  });
})

const stream = require('stream');

router.get("/relatorio", (req, res) => {
  const con = createSQLConnection();

  con.query(`SELECT USUARIOS.id, USUARIOS.matricula, USUARIOS.nome, USUARIOS.aposentado, PARCELAMENTOS.valor_total, PARCELAMENTOS.qtd_parcelas, PARCELAMENTOS.valor_parcela, COUNT(*) as qtd_parcelas_pagas, DATE_FORMAT(PARCELAMENTOS.data_inicio, '%d/%m/%Y') as data_inicio, CONVENIOS.nome_convenio FROM USUARIOS, PARCELAMENTOS, PAGAMENTOS, CONVENIOS WHERE USUARIOS.id = PARCELAMENTOS.id_usuario AND PAGAMENTOS.id_parcelamento = PARCELAMENTOS.id AND CONVENIOS.id = PARCELAMENTOS.id_convenio GROUP BY PAGAMENTOS.id_parcelamento ORDER BY USUARIOS.nome;`, (error, result) => {
      if(error){
          res.render("pages/parcelamentos", {error_msg: `Ocorreu um erro: ${error}`});
          con.end();
      } else{
          const data = result;
          

          // SUM ALL ROW PRICES
          let totalPrice: number | string = 0;

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
            error_msg: `Ocorreu um erro: ${error}`
          })
        } else{
            con.query(`DELETE FROM PAGAMENTOS WHERE id=${req.body.id}`, (error, result) => {
                if(error){
                  res.render("pages/pagamentos/listar-pagamentos", {
                    error_msg: `Ocorreu um erro: ${error}`
                  })
                } else{
                  req.flash("warning_msg", `Você removeu um pagamento de ${req.body.nome}`)
                  res.redirect(req.get("referer"))
                };
                con.end();
            });
        };
    });
});


export default router;