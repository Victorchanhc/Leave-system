import express from "express"
import { isLoggedIn } from "./guard"
import { client } from "./app"
import { Detail } from "./interface"


export const parentRoutes = express.Router()

parentRoutes.get('/', isLoggedIn, getParentDetail)
parentRoutes.post('/', addNewParent)
parentRoutes.put('/', isLoggedIn, editParent)

export async function getParentDetail(req: express.Request, res: express.Response) {
    try {

        // SELECT * FROM  users where users.email = $1
        const result = await client.query(
            'select users.name, users.email, users.phone from users WHERE users.email = $1',
            [req.session.user]
        );
        const parentList: Detail[] = result.rows
        res.json(parentList)

    } catch (err) {
        console.log(err)
        res.status(500).json({ msg: "cannot not get file" })
    }
}

export async function addNewParent (req:express.Request, res:express.Response){

    console.log(req.body)
    // if you are using ajax, no need to pass ConfirmPassword
    if (req.body.password === req.body.confirmPassword) {

        await client.query('INSERT INTO users (name,phone,email,password) values ($1,$2,$3,$4)',
            [req.body.name, req.body.phone, req.body.email, req.body.password]
        );
        res.redirect('/')
        return;
    }

    res.redirect('/?error=Password+not+the+same')

}

export async function editParent(req: express.Request, res: express.Response) {
    try {
        const updateName = req.body.name
        const updateEmail = req.body.email
        const updatePhone = req.body.phone
        await client.query(
            'UPDATE users SET name = $1 , phone = $2 ,email = $3, updated_at = NOW() WHERE users.email = $4',
            [updateName, updatePhone, updateEmail, req.session.user]
        );
        req.session.user = updateEmail // Good
        res.json({ state: 'complete' })

    } catch (err) {
        console.log(err)
        res.status(500).json({ msg: "cannot not update data" })
    }
}