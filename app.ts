import express from 'express'
import expressSession from 'express-session'
import { Client } from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { AdminIsLoggedIn, isLoggedIn } from './guard';
import { adminGetRequest, adminGetRequestOriginLesson, approveRequest, 
     getAttendant, rejectRequest, updateAttendant } from './admin';
import { applyLesson, changePassWord, deleteRequest,
     getHomeDetail, getHomeRequestDetail, getLesson,
     getRequestLesson, joinLesson, requestLeave, selectLesson } from './user';
import { playerRoutes } from './playerRoutes';
import { parentRoutes } from './parentRoutes';
import { adminLessonRoutes } from './adminLessonRoutes';
import grant from 'grant';
import { loginRoutes } from './loginRoutes';
     
const app = express()

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

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

declare module 'express-session' {
    export interface SessionData {
        counter?: number
        user?: string
        admin?: string
        username: string
        name?: string
        lessonName: string
        lessonTime: string
        grant?: any
    }
}

const grantExpress = grant.express({
    "defaults":{
        "origin": "http://localhost:8080",
        "transport": "session",
        "state": true,
    },
    "google":{
        "key": process.env.GOOGLE_CLIENT_ID || "",
        "secret": process.env.GOOGLE_CLIENT_SECRET || "",
        "scope": ["profile","email"],
        "callback": "/login/google"
    }
});

app.use(grantExpress);


app.use('/', loginRoutes)
app.use(express.static('login'))


app.use('/parent', parentRoutes)
app.use(isLoggedIn, express.static('logged_in'))

app.use('/player', playerRoutes)

app.put('/password', isLoggedIn, changePassWord)
app.get('/getLesson', isLoggedIn, getLesson)
app.use('/selectLesson', isLoggedIn, selectLesson)
app.get('/applyLesson', isLoggedIn, applyLesson)
app.post('/joinLesson', isLoggedIn, joinLesson)
app.get('/getHomeDetail', isLoggedIn, getHomeDetail)
app.put('/requestLeave', isLoggedIn, requestLeave)
app.put('/deleteRequest', isLoggedIn, deleteRequest)
app.get('/getHomeRequestDetail', isLoggedIn, getHomeRequestDetail)
app.get('/getRequestLesson', isLoggedIn, getRequestLesson)

// /admin/**
app.use("/admin", AdminIsLoggedIn, express.static('admin'))

app.use('/adminLesson', adminLessonRoutes)

app.get('/adminGetRequest', AdminIsLoggedIn, adminGetRequest)
app.get('/adminGetRequestOriginLesson', AdminIsLoggedIn, adminGetRequestOriginLesson)
app.put('/approveRequest', AdminIsLoggedIn, approveRequest)
app.put('/rejectRequest', AdminIsLoggedIn, rejectRequest)
app.get('/getAttendant', AdminIsLoggedIn, getAttendant)
app.put('/updateAttendant', AdminIsLoggedIn, updateAttendant)

app.use((req, res) => {
	res.status(404)
	res.sendFile(path.resolve('./login/404.html'))
})

const PORT = 8080

app.listen(PORT, () => {
    console.log(`Listening at http://localhost:${PORT}/`)
})