import { Router } from "express";
import ManageDB from "../db/ManageDB";
import { BaseURL } from "../classes/BaseURL";

const router = Router();
const manageDB = new ManageDB();

router.post('/', async (req, res, next) => {
    const superUser = await manageDB.createQuery(`SELECT * FROM SUPERUSUARIOS WHERE username='${req.body.username}' AND password='${req.body.password}'`);
    console.log(req.body)

    if (superUser.length > 0) {
        req.session.regenerate(function (err) {
            if (err) next(err)

            req.session.user = superUser[0].username;
            // save the session before redirection to ensure page
            // load does not happen before session is saved
            req.session.save(function (err) {
                if (err) return next(err)
                res.status(200).json({ auth: true });
            })
        })
    } else {
        res.status(400).json({ message: 'Credenciais Inválidas' })
    }
})

router.get('/check-session', (req, res, next) => {
    console.log(req.session)
    if (req.session.user) res.status(200).json({ auth: true })
    else res.status(400).json({ auth: false })
})


export default router;