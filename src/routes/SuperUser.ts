import { Router } from "express";
import ManageDB from "../db/ManageDB";
import { BaseURL } from "../classes/BaseURL";


const router = Router();
const manageDB = new ManageDB();

router.get("/", async (req, res) => {
    const authenticatedUser = req.session.user;

    if(authenticatedUser) {
        const superUser = await manageDB.createQuery(`SELECT * FROM SUPERUSUARIOS WHERE username='${authenticatedUser}'`);

        if(superUser.length > 0) {
            delete superUser[0].password;
            delete superUser[0].exclusao;
    
            res.status(200).json(superUser[0]);
        }
    }
});

router.get("/logout", async (req, res) => {
    const authenticatedUser = req.session.user;

    if(authenticatedUser) {
        req.session.user = undefined;
        res.redirect(`${BaseURL.CLIENTSIDE}/dist`);
    }
});


export default router;