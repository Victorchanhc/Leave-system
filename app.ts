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
        secret: 'southteen fc leavesystem',
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
interface Lesson {
    name: string
    date: Date
    start_time: string
    end_time: string
    venus: string

}

interface PlayerDetail {
    id : number
    english_name: string
    nick_name: string
    chinese_name: string
    date_of_birth: Date
    gender: string
}

interface HomePageList {
    id: number
    name: string
    date: Date
    start_time: string
    end_time: string
    venue: string
    player_id: number
    english_name: string
    nick_name: string
    
}

declare module 'express-session' {
    interface SessionData {
        counter?: number
        user?: string
        admin?: string
        username: string
        name?: string
        lessonName: string
        lessonTime: string
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
        res.redirect('/home.html')
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
            
            'select players.id, players.english_name, players.nick_name, players.chinese_name, players.date_of_birth, players.gender from players WHERE parent_id = (SELECT users.id FROM users WHERE users.email = $1) ORDER BY id',
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
    res.redirect('/apply-lesson.html')
})

async function getLesson(req: express.Request, res: express.Response) {
    try {

        const result = await client.query(
            'SELECT * FROM lessons WHERE date > NOW() ORDER BY name'
        );
        const lessonList: Detail[] = result.rows
        res.json(lessonList)

    } catch (err) {
        console.log(err)
        res.status(500).json({ msg: "cannot not get file" })
    }
}

async function applyLesson(req: express.Request, res: express.Response) {
    req.session.lessonName = req.body.name
    req.session.lessonTime = req.body.start_time
    res.redirect('/apply-lesson.html')
}

async function getApplyLesson(req: express.Request, res: express.Response) {
    try {

        const result = await client.query(
            'SELECT * FROM lessons WHERE name = $1 AND start_time = $2 AND date > NOW() ',[req.session.lessonName, req.session.lessonTime]
        );
        const lessonList: Lesson[] = result.rows
        res.json(lessonList)

    } catch (err) {
        console.log(err)
        res.status(500).json({ msg: "cannot not get file" })
    }
}

app.post('/joinLesson', isLoggedIn, async function (req: express.Request, res: express.Response) {

    const player = req.body.player
    const lessons = req.body.lessons
    
    for (let lesson of lessons) {
        
        await client.query(
        'INSERT INTO participants (player_id, lesson_id) VALUES ($1,$2)',
        [player, lesson]
    );
    }
    // window.alert("Registration Success");
    // io.emit("new-memo", "New memo created !!")
    res.redirect('/lesson.html')
})

app.get('/getHomeDetail', isLoggedIn,async (req,res) => {
    
    const result = await client.query(
        `SELECT participants.id, participants.lesson_id, lessons.name, lessons.date, lessons.start_time, 
            lessons.end_time, lessons.venue, participants.player_id, 
                players.english_name, players.nick_name, participants.status FROM lessons 
            INNER JOIN participants 
                ON lessons.id = participants.lesson_id
            INNER JOIN players 
                ON players.id = participants.player_id
        WHERE players.parent_id = (SELECT users.id FROM users WHERE users.email = $1) AND lessons.date > NOW() AND participants.status = 'DEFAULT'
            ORDER BY player_id,date ;`,[req.session.user]
    );

    const homePageInfo : HomePageList [] = result.rows
    res.json(homePageInfo)
})

app.put('/requestLeave', isLoggedIn, async function requestLeave(req, res) {
    
    const originParticipantID = req.body.participant_id
    const requestLessonID = req.body.lesson_id
    const reason = req.body.reason
    console.log(req.body)

    await client.query(
        `UPDATE participants 
        SET request_lesson_id = $1, reason = $2, status = 'PENDING', updated_at = NOW()
        WHERE id = $3 ;`,
        [requestLessonID, reason, originParticipantID]
    )
    res.redirect('/home.html')
})
// Finish request leave lesson

app.put('/deleteRequest', isLoggedIn, async function requestLeave(req, res) {
    
    const ParticipantID = req.body.participant_id
    console.log(req.body)

    await client.query(
        `UPDATE participants 
        SET request_lesson_id = null, reason = null, status = 'DEFAULT', updated_at = NOW()
        WHERE id = $1 ;`,
        [ParticipantID]
    )
    res.redirect('/home.html')
})

app.get('/getHomeRequestDetail', isLoggedIn,async (req,res) => {
    
    const result = await client.query(
        `SELECT participants.id, participants.lesson_id, lessons.name, lessons.date, lessons.start_time, 
            lessons.end_time, lessons.venue, participants.player_id, 
                players.english_name, players.nick_name, participants.status FROM lessons 
            INNER JOIN participants 
                ON lessons.id = participants.lesson_id
            INNER JOIN players 
                ON players.id = participants.player_id
        WHERE players.parent_id = (SELECT users.id FROM users WHERE users.email = $1) AND lessons.date > NOW() AND participants.status != 'DEFAULT'
            ORDER BY player_id,date ;`,[req.session.user]
    );

    const homeRequestInfo : HomePageList [] = result.rows
    res.json(homeRequestInfo)
})

app.get('/getRequestLesson', isLoggedIn,async (req,res) => {
    
    const result = await client.query(
        `SELECT participants.id, participants.request_lesson_id, lessons.name, lessons.date, lessons.start_time, 
            lessons.end_time, lessons.venue, participants.player_id, 
                players.english_name, players.nick_name, participants.status FROM lessons 
            INNER JOIN participants 
                ON lessons.id = participants.request_lesson_id
            INNER JOIN players 
                ON players.id = participants.player_id
        WHERE players.parent_id = (SELECT users.id FROM users WHERE users.email = $1) AND participants.status != 'DEFAULT'
            ORDER BY player_id,date ;`,[req.session.user]
    );

    const homeRequestInfo : HomePageList [] = result.rows
    res.json(homeRequestInfo)
})



app.use('/getLesson', isLoggedIn, getLesson)
app.use('/getParent', isLoggedIn, getParentDetail)
app.use('/getPlayer', isLoggedIn, getPlayerDetail)
app.put('/editParent', isLoggedIn, editParent)
app.put('/editPlayer/:id', isLoggedIn, editPlayer)
app.use('/changePassword', isLoggedIn, changePW)
app.use('/selectLesson', isLoggedIn, applyLesson)
app.get('/applyLesson', isLoggedIn, getApplyLesson)

app.get('/logout', function (req, res) {
    // destroy the user's session to log them out
    // will be re-created next request
    req.session.destroy(function () {
        res.redirect('/');
    });
});

app.use((req, res) => {
	res.status(404)
	res.sendFile(path.resolve('./login/404.html'))
})

const PORT = 8080

app.listen(PORT, () => {
    console.log(`Listening at http://localhost:${PORT}/`)
})