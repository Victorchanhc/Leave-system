import express from 'express'
import { client } from './app'

export async function adminGetRequest(req: express.Request, res: express.Response) {

    try {
        const result = await client.query(
            `SELECT participants.id, participants.request_lesson_id, participants.reason, lessons.name, lessons.date, lessons.start_time, 
                lessons.end_time, lessons.venue, participants.player_id, 
                    players.english_name, players.nick_name, participants.status FROM lessons 
                INNER JOIN participants 
                    ON lessons.id = participants.request_lesson_id
                INNER JOIN players 
                    ON players.id = participants.player_id
                WHERE participants.status = 'PENDING'
                ORDER BY player_id,date ;`
        )
        const loadRequestList = result.rows
        res.json(loadRequestList)

    } catch (err) {
        console.log(err)
        res.status(500).json({ msg: "cannot not get data" })
    }

}

export async function adminGetRequestOriginLesson(req: express.Request, res: express.Response) {

    // Can combine this and adminGetRequest
    try {
        const result = await client.query(
            `SELECT participants.id, participants.lesson_id, lessons.name, lessons.date, lessons.start_time, 
                lessons.end_time, lessons.venue, participants.player_id, 
                    players.english_name, players.nick_name, participants.status FROM lessons 
                INNER JOIN participants 
                    ON lessons.id = participants.lesson_id
                INNER JOIN players 
                    ON players.id = participants.player_id
                WHERE participants.status = 'PENDING'
                ORDER BY player_id,date ;`
        )
        const loadRequestOriginLessonList = result.rows
        res.json(loadRequestOriginLessonList)

    } catch (err) {
        console.log(err)
        res.status(500).json({ msg: "cannot not get data" })
    }

}

export async function approveRequest(req: express.Request, res: express.Response) {

    try {
        const ParticipantID = req.body.participant_id
        // const status = req.body.status

        await client.query(
            `UPDATE participants 
                SET status = 'APPROVED', updated_at = NOW()
                WHERE id = $1 ;`,
            [ParticipantID]
        )
        res.json({ state: 'Approved' })
    } catch (err) {
        console.log(err)
        res.status(500).json({ msg: "cannot not update data" })
    }

}

export async function rejectRequest(req: express.Request, res: express.Response) {

    try {
        const ParticipantID = req.body.participant_id
        const reason = req.body.text

        await client.query(
            `UPDATE participants 
                SET status = 'REJECTED', reason = $1, updated_at = NOW()
                WHERE id = $2 ;`,
            [reason, ParticipantID]
        )
        res.json({ state: 'Rejected' })
    } catch (err) {
        console.log(err)
        res.status(500).json({ msg: "cannot not update data" })
    }

}

export async function getAttendant(req: express.Request, res: express.Response) {
    // attendance
    try {
        const result = await client.query(
            `SELECT participants.id, participants.lesson_id, lessons.name, lessons.date, lessons.start_time, 
                        lessons.end_time, lessons.venue, participants.player_id, 
                            players.english_name, players.nick_name, participants.status, participants.attendant FROM lessons 
                INNER JOIN participants 
                    ON lessons.id = participants.lesson_id
                INNER JOIN players 
                    ON players.id = participants.player_id
                ORDER BY name,date,start_time,status,player_id`
        )

        const attendantList = result.rows
        res.json(attendantList)
    } catch (err) {
        console.log(err)
        res.status(500).json({ msg: "cannot not get data" })
    }

}

export async function updateAttendant(req: express.Request, res: express.Response) {

    try {
        const participantID = req.body.id
        const attendant = req.body.attendant

        await client.query(
            `UPDATE participants SET attendant = $1 WHERE id = $2;`,
            [attendant, participantID]
        )
        res.json({ state: 'Update success' })
    } catch (err) {
        console.log(err)
        res.status(500).json({ msg: "cannot not update data" })
    }

}


