import express from "express";
import { client } from "./app";
import { PlayerDetail } from "./interface";
import { isLoggedIn } from "./guard";

export const playerRoutes = express.Router()

playerRoutes.get('/', isLoggedIn, getPlayerDetail)
playerRoutes.post('/', isLoggedIn, addNewPlayer)
playerRoutes.put('/:id', isLoggedIn, editPlayer)


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

export async function addNewPlayer (req: express.Request, res: express.Response){

    try{
        await client.query(
                `INSERT INTO players (english_name,
                                    nick_name,
                                    chinese_name,
                                    date_of_birth,
                                    gender,
                                    parent_id) 
                    values ($1,$2,$3,$4,$5,(SELECT id FROM users WHERE users.email = $6))`,
                [req.body.englishFullName, req.body.nickName, req.body.chineseFullName, req.body.dateOfBirth, req.body.gender, req.session.user]
            );
            res.redirect('/apply-lesson.html')
    } catch (err) {
        console.log(err)
        res.status(500).json({ msg: "cannot not add data" })
    }
    
}

export async function editPlayer(req: express.Request, res: express.Response) {
    try{
        const playerID: any = req.params.id
	const updateEnglishName = req.body.english_name
	const updateNickName = req.body.nick_name
	const updateChineseName = req.body.chinese_name
	const updateDob = req.body.date_of_birth
	const updateGender = req.body.gender

	await client.query('UPDATE players SET english_name = $1, nick_name = $2, chinese_name = $3, date_of_birth = $4, gender = $5, updated_at = NOW() WHERE id = $6 ',
    [updateEnglishName, updateNickName, updateChineseName, updateDob, updateGender, playerID])

	res.json({ state: 'complete' })
    } catch (err) {
        console.log(err)
        res.status(500).json({ msg: "cannot not update data" })
    }
	

}
