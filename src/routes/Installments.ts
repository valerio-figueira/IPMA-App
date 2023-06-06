import { Router } from "express";
import InstallmentController from "../controllers/InstallmentController";

const installmentController = new InstallmentController();
const router = Router();


// CREATE
router.post("/", async (req, res) => {
  installmentController.Create(req, res);
});

// READ ALL
router.get("/", async (req, res) => {
  installmentController.ReadAll(req, res);
});

// READ ONE
router.get("/:id", async (req, res) => {
  installmentController.ReadOne(req, res);
});

// UPDATE
router.put("/:id", async (req, res) => {
  installmentController.Update(req, res);
})

// DELETE
router.delete("/:id", async (req, res) => {
  installmentController.Delete(req, res);
})


export default router;



/*
`SELECT USUARIOS.id, USUARIOS.nome, PARCELAMENTOS.qtd_parcelas, COUNT(*) as qtd_parcelas_pagas FROM USUARIOS, PARCELAMENTOS, PAGAMENTOS WHERE USUARIOS.id = PARCELAMENTOS.id_usuario AND PAGAMENTOS.id_parcelamento = PARCELAMENTOS.id AND PARCELAMENTOS.id_usuario = ${req.body.id} GROUP BY PAGAMENTOS.id_parcelamento ORDER BY USUARIOS.nome;`
*/