const router = require("express").Router();
const mysql = require("mysql");
require("dotenv").config();

const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_NAME = process.env.DB_NAME;
const HOST_NAME = process.env.HOST_NAME;


    // CONNECTION WITH THE DB SERVER
    const con = mysql.createConnection({
        host: HOST_NAME,
        database: DB_NAME,
        user: DB_USER,
        password: DB_PASSWORD
    });

    let connection;
    function handleDisconnect() {
        connection = mysql.createConnection(con);
        connection.connect(function(err) {
          if(err) {
            setTimeout(handleDisconnect, 2000);
          }
        });
        connection.on('error', function(err) {
          if(err.code === 'PROTOCOL_CONNECTION_LOST') {
            handleDisconnect();
          } else {
            throw err;
          }
        });
    }
      
    handleDisconnect();


// CREATE
router.post("/", async (req, res) => {})



// READ
router.get("/", async (req, res) => {
    res.render("pages/listar-usuarios");
})


// READ ONLY
router.get("/:id", async (req, res) => {})



// UPDATE
// PATCH ATUALIZA UM CAMPO INDIVIDUAL
router.patch("/:id", async (req, res) => {})


// DELETE
router.delete("/:id", async (req, res) => {})


module.exports = router;