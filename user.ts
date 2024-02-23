import express from 'express'
import { client } from './app'
import { Detail, Lesson, HomePageList } from './interface';

export async function changePassWord(req: express.Request, res: express.Response) {
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
                    user.password === currentPW &&
                    newPW === confirmPW
            )
        ) {
            await client.query(
                'UPDATE users SET password = $1 ,updated_at = NOW() WHERE users.email = $2',
                [newPW, req.session.user]);
            console.log("Change password successful")
            res.redirect("/myAccount.html")

        } else {
            res.json({ msg: "Password not match !" })
        }

    } catch (err) {
        console.log(err)
        res.status(500).json({ msg: "cannot not update data" })
    }
}

export async function getLesson(req: express.Request, res: express.Response) {
    try {

        const result = await client.query(
            'SELECT * FROM lessons WHERE date > NOW() ORDER BY name,date'
        );
        const lessonList: Detail[] = result.rows
        res.json(lessonList)

    } catch (err) {
        console.log(err)
        res.status(500).json({ msg: "cannot not get file" })
    }
}

export async function selectLesson (req: express.Request, res: express.Response) {
    req.session.lessonName = req.body.name
    req.session.lessonTime = req.body.start_time
    res.redirect('/apply-lesson.html')
}

export async function applyLesson(req: express.Request, res: express.Response) {
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

export async function joinLesson (req: express.Request, res: express.Response) {

    try{
        const player = req.body.player
            const lessons = req.body.lessons
            
            for (let lesson of lessons) {
                
                await client.query(
                'INSERT INTO participants (player_id, lesson_id) VALUES ($1,$2)',
                [player, lesson]
            );
            }
            res.redirect('/lesson.html')
    } catch (err) {
        console.log(err)
        res.status(500).json({ msg: "cannot not update data" })
    }
    
}

export async function getHomeDetail (req:express.Request, res:express.Response){
    
    try{
        const result = await client.query(
                `SELECT participants.id, participants.lesson_id, lessons.name, lessons.date, lessons.start_time, 
                    lessons.end_time, lessons.venue, participants.player_id, 
                        players.english_name, players.nick_name, participants.status FROM lessons 
                    INNER JOIN participants 
                        ON lessons.id = participants.lesson_id
                    INNER JOIN players 
                        ON players.id = participants.player_id
                WHERE players.parent_id = (SELECT users.id FROM users WHERE users.email = $1) AND lessons.date > NOW() AND participants.status = 'DEFAULT'
                    ORDER BY player_id, name, date ;`,[req.session.user]
            );

            const homePageInfo : HomePageList [] = result.rows
            res.json(homePageInfo)
    } catch (err) {
        console.log(err)
        res.status(500).json({ msg: "cannot not get data" })
    }
    
}

export async function requestLeave(req:express.Request, res:express.Response) {
    
    try{
        const originParticipantID = req.body.participant_id
            const requestLessonID = req.body.lesson_id
            const reason = req.body.reason

            await client.query(
                `UPDATE participants 
                SET request_lesson_id = $1, reason = $2, status = 'PENDING', updated_at = NOW()
                WHERE id = $3 ;`,
                [requestLessonID, reason, originParticipantID]
            )
            res.json({ state: 'complete' })
    } catch (err) {
        console.log(err)
        res.status(500).json({ msg: "cannot not update data" })
    }
    

}

export async function deleteRequest(req:express.Request, res:express.Response) {
    
    try{
        const ParticipantID = req.body.participant_id

        await client.query(
                `UPDATE participants 
                SET request_lesson_id = null, reason = null, status = 'DEFAULT', updated_at = NOW()
                WHERE id = $1 ;`,
                [ParticipantID]
            )
            res.json({ state: 'deleted' })
    } catch (err) {
        console.log(err)
        res.status(500).json({ msg: "cannot not update data" })
    }
}

export async function getHomeRequestDetail(req:express.Request,res:express.Response){
    
    try{
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
    } catch (err) {
        console.log(err)
        res.status(500).json({ msg: "cannot not get data" })
    }
    
}

export async function getRequestLesson(req:express.Request,res:express.Response){
    
    try{
        const result = await client.query(
        `SELECT participants.id, participants.request_lesson_id, lessons.name, lessons.date, lessons.start_time, 
            lessons.end_time, lessons.venue, participants.player_id, 
                players.english_name, players.nick_name, participants.status, participants.reason FROM lessons 
            INNER JOIN participants 
                ON lessons.id = participants.request_lesson_id
            INNER JOIN players 
                ON players.id = participants.player_id
        WHERE players.parent_id = (SELECT users.id FROM users WHERE users.email = $1) AND participants.status != 'DEFAULT'
            ORDER BY player_id,date ;`,[req.session.user]
    );

    const homeRequestInfo : HomePageList [] = result.rows
    res.json(homeRequestInfo)

    } catch (err) {
        console.log(err)
        res.status(500).json({ msg: "cannot not get data" })
    }
}