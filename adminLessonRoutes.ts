import express from "express"
import { AdminIsLoggedIn } from "./guard"
import { client } from "./app"



export const adminLessonRoutes = express.Router()

adminLessonRoutes.post('/', AdminIsLoggedIn, addNewLesson)
adminLessonRoutes.put('/', AdminIsLoggedIn, saveEditLesson)
adminLessonRoutes.delete('/', AdminIsLoggedIn, deleteLesson)

export async function addNewLesson(req: express.Request, res: express.Response) {

    try {
        await client.query(
            `INSERT INTO lessons (name,date,start_time,end_time, venue) values ($1,$2,$3,$4,$5)`,
            [req.body.name, req.body.date, req.body.start_time, req.body.end_time, req.body.venue]
        );
        res.redirect('/lesson-list.html')
    } catch (err) {
        console.log(err)
        res.status(500).json({ msg: "cannot not add data" })
    }

}

export async function saveEditLesson(req: express.Request, res: express.Response) {

    try {
        const lessonID = req.body.id
        const lessonDate = req.body.date
        const lessonStart = req.body.start_time
        const lessonEnd = req.body.end_time
        const lessonVenue = req.body.venue

        await client.query(
            `UPDATE lessons 
                SET date = $1, start_time = $2, end_time = $3, venue = $4, updated_at = NOW()
                WHERE id = $5 ; `,
            [lessonDate, lessonStart, lessonEnd, lessonVenue, lessonID]
        )
        res.json({ state: 'Update success' })
    } catch (err) {
        console.log(err)
        res.status(500).json({ msg: "cannot not update data" })
    }


}

export async function deleteLesson(req: express.Request, res: express.Response) {

    try {
        const lessonID = req.body.id

        await client.query(
            `DELETE FROM lessons WHERE id = $1;`,
            [lessonID]
        )
        res.json({ state: 'Update success' })
    } catch (err) {
        console.log(err)
        res.status(500).json({ msg: "cannot not delete data" })
    }

}