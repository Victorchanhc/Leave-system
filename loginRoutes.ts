import express from "express";
import { client } from "./app";
import { Detail } from "./interface";
import { Session } from 'express-session';
import fetch from 'cross-fetch';
import crypto from 'crypto';

export const loginRoutes = express.Router()

// declare module 'express-session' {
//     export interface SessionData {
//         counter?: number
//         user?: string
//         admin?: string
//         username: string
//         name?: string
//         lessonName: string
//         lessonTime: string
//         }
// }
export interface ExpressSession extends Session {
    grant? :{[key:string]:any}
}

loginRoutes.post('/login', login)
loginRoutes.get('/logout', logout)

loginRoutes.get('/login/google', async (req,res) => {

    const session:ExpressSession = req.session;
    if (session != null ) {
        const accessResponse = req.session.grant.response
        const accessToken = accessResponse.access_token
        console.log(accessToken)
    
        const fetchRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo',{
            method:"get",
            headers:{
                "Authorization":`Bearer ${accessToken}`
            }
        });
        const result = await fetchRes.json();
        let [ user ]= (await client.query(`SELECT * FROM users WHERE users.email = $1`,[result.email])).rows;
        
        if(!user){
            // Create the user when the user does not exist

            user = {
                email: result.email,
                password: crypto.randomBytes(20).toString('hex')
            }
            await client.query(`INSERT INTO users (email,password) VALUES ($1,$2)`,
                [user.email,user.password])
        }
        req.session.user = user.email
        return res.redirect('/home.html')
    }
})

async function login(req:express.Request, res:express.Response) {

    const result = await client.query(
        'select users.id, users.name, users.email, users.password, users.roles from users WHERE users.email = $1',
        [req.body.email]
    );
    const userList: Detail[] = result.rows
    console.log(result.rows)
    console.log(req.body.email)
    console.log(req.body.password)

    if (
        userList.some(
            (user) =>
                user.password === req.body.password &&
                user.roles === 'ADMIN'
        )
    ) {
        req.session.admin = req.body.email
        console.log(`Admin ${req.session?.admin} is Logged in`)
        res.redirect('/admin')
    } else if (
        userList.some(
            (user) =>
                user.password === req.body.password &&
                user.roles === 'PARENT'
        )
    ) {
        req.session.user = req.body.email
        console.log(`${req.session?.user} is Logged in`)
        res.redirect('/home.html')
    } else {
        res.redirect('/')
    }
}


function logout(req:express.Request, res:express.Response) {
    req.session.destroy(function () {
        res.redirect('/');
    });
};