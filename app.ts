import express from 'express'
// import { Request, Response } from 'express'
import expressSession from 'express-session'
import {Client} from 'pg';
import dotenv from 'dotenv';
import path from 'path';

const app = express()

app.use(express.urlencoded({extended:true}));
app.use(express.json());

// Add this line
app.use(
  expressSession({
    secret: 'southteen fc leavesys',
    resave: true,
    saveUninitialized: true,
  }),
)

dotenv.config();

export const client = new Client({
    database: process.env.DB_NAME,
    user: process.env.DB_USERNAME,
});


client.connect();

declare module 'express-session' {
  interface SessionData {
    name?: string
  }
}

interface Detail {
	email: string
	password: string
    roles?:string 
}

declare module 'express-session' {
	interface SessionData {
		counter?: number
		user?: string
        admin?: string
	}
}

app.post('/login', async (req, res) => {

	const result = await client.query('select users.email, users.password, users.roles from users');
	const userList: Detail[] = result.rows
    console.log(result.rows)
    console.log(req.body.email)
    console.log(req.body.password)

	if (
		userList.some(
			(user) =>
				user.email === req.body.email &&
				user.password === req.body.password &&
                user.roles === 'ADMIN'
		)
	) {
		req.session.admin = req.body.email
		console.log(`Admin ${req.session?.admin} is Logged in`)
        res.redirect('/admin')
	}else if (
		userList.some(
			(user) =>
				user.email === req.body.email &&
				user.password === req.body.password &&
                user.roles === 'PARENT'
		)
	) {
		req.session.user = req.body.email
		console.log(`${req.session?.user} is Logged in`)
        res.redirect('/loggedIn.html')
	}else{
        res.redirect('/')
    }
})

app.use(express.static('login'))

export const AdminIsLoggedIn = (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
) => {
    if (req.session?.admin) {
        next()
    } else {
        res.redirect('/')
    }
}

export const isLoggedIn = (
	req: express.Request,
	res: express.Response,
	next: express.NextFunction
) => {
	if (req.session?.user) {
        next()
	
	} else {
		res.redirect('/')
	}
}
app.get('/admin',AdminIsLoggedIn, function (req,res){
    if (req.session.admin) {
        res.sendFile(path.resolve('./admin/admin-index.html'))
    }else{
        res.json({msg:"You have no permission!!"})
    }
})
app.get('/lesson-list', AdminIsLoggedIn, function(req,res){
    if (req.session.admin){
        res.sendFile(path.resolve('./admin/lesson-list.html'))
    }else{
        res.json({msg:"You have no permission!!"})
    }
})
app.get('/attendant', AdminIsLoggedIn, function(req,res){
    res.sendFile(path.resolve('./admin/attendant.html'))
})
// app.use(AdminIsLoggedIn, express.static('admin'))
app.use(isLoggedIn,express.static('loggedIn'))

app.get('/logout', function(req, res){
    // destroy the user's session to log them out
    // will be re-created next request
    req.session.destroy(function(){
      res.redirect('/');
    });
});


const PORT = 8080

app.listen(PORT, () => {
  console.log(`Listening at http://localhost:${PORT}/`)
})