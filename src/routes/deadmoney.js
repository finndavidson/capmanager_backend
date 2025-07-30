import express from 'express';
import database from '../database/sqlConnection.js';

const router = express.Router();
const db = database;

//get dead money based on player
router.get('/player', (req, res) => {
    const sql = "Select * From dead_money WHERE player_id = " + req.query.player + ";";
    db.query(sql, (err,data) => {
        if(err) return res.json(err);
        return res.json(data);
    })
})

//get dead money based on team
router.get('/team', (req, res) => {
    const sql = "Select * From dead_money WHERE team_id = " + req.query.team + ";";
    db.query(sql, (err,data) => {
        if(err) return res.json(err);
        return res.json(data);
    })
})

export default router;