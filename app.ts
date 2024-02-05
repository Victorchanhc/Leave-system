import express from 'express'
// import { Request, Response } from 'express'
import expressSession from 'express-session'
import { Client } from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { AdminIsLoggedIn, isLoggedIn } from './guard';

const app = express()

app.use(express.urlencoded({ extended: true }));
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

interface Detail {
    id?: number
    name: string
    email: string
    password: string
    roles?: string
}

interface PlayerDetail {
    id : number
    english_name: string
    nick_name: string
    chinese_name: string
    date_of_birth: Date
    gender: string
}

declare module 'express-session' {
    interface SessionData {
        counter?: number
        user?: string
        admin?: string
        username: string
        name?: string
    }
}

app.post('/login', async (req, res) => {

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
                // user.email === req.body.email &&
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
                // user.email === req.body.email &&
                user.password === req.body.password &&
                user.roles === 'PARENT'

        )
    ) {
        req.session.user = req.body.email
        console.log(`${req.session?.user} is Logged in`)
        res.redirect('/loggedIn.html')
    } else {
        res.redirect('/')
    }
})

app.post('/register', async (req, res) => {

    if (req.body.password === req.body.confirmPassword) {
        await client.query('INSERT INTO users (name,phone,email,password) values ($1,$2,$3,$4)',
            [req.body.name, req.body.phone, req.body.email, req.body.password]
        );

        // window.alert("Registration Success");
        // io.emit("new-memo", "New memo created !!")
        res.redirect('/')
    }

})

app.use(express.static('login'))

app.get('/admin', AdminIsLoggedIn, function (req, res) {
    if (req.session.admin) {
        res.sendFile(path.resolve('./admin/admin-index.html'))
    } else {
        res.json({ msg: "You have no permission!!" })
    }
})
app.get('/lesson-list', AdminIsLoggedIn, function (req, res) {
    if (req.session.admin) {
        res.sendFile(path.resolve('./admin/lesson-list.html'))
    } else {
        res.json({ msg: "You have no permission!!" })
    }
})
app.get('/attendant', AdminIsLoggedIn, function (req, res) {
    res.sendFile(path.resolve('./admin/attendant.html'))
})

app.use(isLoggedIn, express.static('loggedIn'))

export async function getParentDetail(req: express.Request, res: express.Response) {
    try {

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
export async function getPlayerDetail(req: express.Request, res: express.Response) {
    try {

        const result = await client.query(
            'select players.id, players.english_name, players.nick_name, players.chinese_name, players.date_of_birth, players.gender from players WHERE parent_id = (SELECT users.id FROM users WHERE users.email = $1)',
            [req.session.user]
        );
        const playerList: PlayerDetail[] = result.rows
        res.json(playerList)

    } catch (err) {
        console.log(err)
        res.status(500).json({ msg: "cannot not get file" })
    }
}

async function editParent(req: express.Request, res: express.Response) {
    try {
        const updateName = req.body.name
        const updateEmail = req.body.email
        const updatePhone = req.body.phone
        await client.query(
            'UPDATE users SET name = $1 , phone = $2 ,email = $3, updated_at = NOW() WHERE users.email = $4',
            [updateName, updatePhone, updateEmail, req.session.user]
        );
        req.session.user = updateEmail
        res.redirect('/myAccount.html')

    } catch (err) {
        console.log(err)
        res.status(500).json({ msg: "cannot not update data" })
    }
}
async function editPlayer(req: express.Request, res: express.Response) {
	const playerID: any = req.params.id
	const updateEnglishName = req.body.english_name
	const updateNickName = req.body.nick_name
	const updateChineseName = req.body.chinese_name
	const updateDob = req.body.date_of_birth
	const updateGender = req.body.gender

	await client.query('UPDATE players SET english_name = $1, nick_name = $2, chinese_name = $3, date_of_birth = $4, gender = $5, updated_at = NOW() WHERE id = $6 ',
    [updateEnglishName, updateNickName, updateChineseName, updateDob, updateGender, playerID])

	res.json({ state: 'complete' })

}

async function changePW(req: express.Request, res: express.Response) {
    try {
        const currentPW = req.body.currentPW
        const newPW = req.body.newPW
        const confirmPW = req.body.confirmPW
        const result = await client.query('select users.password from users WHERE users.email = $1',
            [req.session.user]);
        const password: Detail[] = result.rows

        if (
            password.some(
                (user) =>
                    // user.email === req.body.email &&
                    user.password === currentPW &&
                    newPW === confirmPW
            )
        ) {
            await client.query(
                'UPDATE users SET password = $1 ,updated_at = NOW() WHERE users.email = $2',
                [newPW, req.session.user]);
            console.log("Change password sussecful")
            res.redirect("/myAccount.html")

        } else {
            res.json({ msg: "Password not match !" })
        }

    } catch (err) {
        console.log(err)
        res.status(500).json({ msg: "cannot not update data" })
    }
}

app.post('/addNewPlayer', isLoggedIn, async (req, res) => {

    await client.query(
        'INSERT INTO players (english_name,nick_name,chinese_name,date_of_birth,gender,parent_id) values ($1,$2,$3,$4,$5,(SELECT id FROM users WHERE users.email = $6))',
        [req.body.englishFullName, req.body.nickName, req.body.chineseFullName, req.body.dateOfBirth, req.body.gender, req.session.user]
    );

    // window.alert("Registration Success");
    // io.emit("new-memo", "New memo created !!")
    res.redirect('/lesson.html')
})

app.use('/getParent', isLoggedIn, getParentDetail)
app.use('/getPlayer', isLoggedIn, getPlayerDetail)
app.put('/editParent', isLoggedIn, editParent)
app.put('/editPlayer/:id', isLoggedIn, editPlayer)
app.use('/changePassword', isLoggedIn, changePW)

app.get('/logout', function (req, res) {
    // destroy the user's session to log them out
    // will be re-created next request
    req.session.destroy(function () {
        res.redirect('/');
    });
});
const PORT = 8080

app.listen(PORT, () => {
    console.log(`Listening at http://localhost:${PORT}/`)
})