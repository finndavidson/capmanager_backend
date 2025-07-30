import express from 'express';
import database from '../database/sqlConnection.js';

const router = express.Router();
const db = database;

//get all draft picks for a team for a given year
router.get('/team/year', (req, res) => {
    const sql = `Select * From draft_picks WHERE pick_owner = ${req.query.team} AND year = ${req.query.year};`;
    db.query(sql, (err,data) => {
        if(err) return res.json(err);
        return res.json(data);
    })
})

//get all draft picks owned by a team
router.get('/team', (req, res) => {
    const sql = "Select * From draft_picks WHERE pick_owner = " + req.query.team + ";";
    db.query(sql, (err,data) => {
        if(err) return res.json(err);
        return res.json(data);
    })
})
export default router