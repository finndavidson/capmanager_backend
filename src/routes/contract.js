import express from 'express';
import database from '../database/sqlConnection.js';

const router = express.Router();
const db = database;

//get all contracts for a specific player
router.get('/', (req, res) => {
    const sql = "SELECT * FROM contract where player_id = " + req.query.player + ";";
    db.query(sql, (err,data) => {
        if(err) return res.json(err);
        return res.json(data);
    })
})

//get the contract for a specific player in a specific year
router.get('/year', (req, res) => {
    const sql = "SELECT * FROM contract where player_id = " + req.query.player +" AND year = "+ req.query.year + ";";
    db.query(sql, (err,data) => {
        if(err) return res.json(err);
        return res.json(data);
    })
})

//get contracts based on the most recently altered
router.get('/recent', (req, res) => {
    const sql = "SELECT * FROM contract Order By last_altered DESC LIMIT 10;";
    db.query(sql, (err,data) => {
        if(err) return res.json(err);
        return res.json(data);
    })
})

//get the contract for a specific player after a specefic year
router.get('/year/after', (req, res) => {
    const sql = "SELECT * FROM contract where player_id = " + req.query.player +" AND year >= "+ req.query.year + ";";
    db.query(sql, (err,data) => {
        if(err) return res.json(err);
        return res.json(data);
    })
})


export default router;