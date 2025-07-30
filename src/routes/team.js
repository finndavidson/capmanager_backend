import express from 'express';
import database from '../database/sqlConnection.js';

const router = express.Router();
const db = database;

//get all teams
router.get('/', (req,res) => {
    const sql = "SELECT t.*, SUM(c.cap_hit) AS cap_hit, COUNT(p.player_id) AS roster_size FROM team t LEFT JOIN player p ON t.team_id = p.team_id LEFT JOIN contract c ON p.player_id = c.player_id AND c.year = 2025 GROUP BY t.team_id;";
    db.query(sql, (err,data) => {
        if(err) return res.json(err);
    return res.json(data);
    })
})

//get a team
router.get('/team', (req, res) => {
    const sql = `SELECT t.*, SUM(c.cap_hit) AS cap_hit, COUNT(p.player_id) AS roster_size FROM team t LEFT JOIN player p ON t.team_id = p.team_id LEFT JOIN contract c ON p.player_id = c.player_id AND c.year = 2025 WHERE t.team_id=${req.query.teamID};`;
    db.query(sql, (err,data) => {
        if(err) return res.json(err);
        return res.json(data);
    })
})

export default router;