import { Router } from "express";
import UserController from "../controllers/UserController";
import RelativeController from "../controllers/RelativeController";


const userController = new UserController();
const relativeController = new RelativeController();

const router = Router();


// FORM TO CREATE NEW
router.get("/cadastrar-usuario", async (req, res) => {
    res.render("pages/usuarios/novo-usuario");
});


// HOLDERS ROUTES

// CREATE
router.post("/", async (req, res) => {
    userController.Create(req, res);
});

// READ
router.get("/", async (req, res) => {
    userController.ReadAll(req, res);
});

// READ ONE
router.get("/:id", async (req, res) => {
    userController.ReadOne(req, res);
});

// UPDATE
router.put("/:id", async (req, res) => {
    userController.Update(req, res);
})

// PATCH ATUALIZA UM CAMPO INDIVIDUAL
router.patch("/:id", async (req, res) => {

})

// DELETE
router.delete("/:id", async (req, res) => {
    userController.Delete(req, res);
})



// RELATIVES ROUTES

// CREATE
router.post("/:holder", async (req, res) => {
    relativeController.Create(req, res);
});

// READ ALL
router.get("/:holder/relatives", async (req, res) => {
    relativeController.ReadAll(req, res);
});

// READ ONE
router.get("/:holder/:relative", async (req, res) => {
    relativeController.ReadAll(req, res);
});

// UPDATE
router.put("/:holder/:relative", async (req, res) => {
    relativeController.Update(req, res);
});

// DELETE
router.delete("/:holder/:relative", async (req, res) => {
    relativeController.Delete(req, res);
});


export default router