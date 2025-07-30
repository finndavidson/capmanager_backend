import express from 'express';
import database from '../database/sqlConnection.js';

const router = express.Router();
const db = database;

//get all players for a specific team
router.get('/team', (req, res) => {
    const sql = "SELECT * FROM player where team_id =" + req.query.team + ";";
    db.query(sql, (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    })
})

//get all players
router.get('/', (req, res) => {
    const sql = "SELECT * FROM player;";
    db.query(sql, (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    })
})

//get players based on the most recently altered status 
router.get('/recent', (req, res) => {
    const sql = "SELECT * FROM player Order By last_altered DESC LIMIT " + req.query.limiter + ";";
    db.query(sql, (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    })
})

//get a player
router.get('/player', (req, res) => {
    const sql = "Select * From player WHERE player_id = " + req.query.player + ";";
    db.query(sql, (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    })
})

//get players on the practice squad
router.get('/practice', (req, res) => {
    const sql = "Select * From player WHERE status = 'practice' && team_id = " + req.query.team + ";";
    db.query(sql, (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    })
})

//get contracts based on the most recently altered
router.get('/recent', (req, res) => {
    const sql = "SELECT * FROM player Order By last_altered DESC LIMIT 1;";
    db.query(sql, (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    })
})

//get players sorted by cap hit
router.get('/caphit', (req, res) => {
    const sql = `
        SELECT 
            player.player_id,
            player.first_name,
            player.last_name,
            player.team_id,
            player.position,
            player.age,
            player.height,
            player.weight,
            player.status,
            contract.cap_hit
        FROM 
            player
        JOIN (
            SELECT
                player_id,
                cap_hit
            FROM
                contract
            WHERE
                year = ${req.query.year}
        ) contract ON player.player_id = contract.player_id
        ORDER BY 
            contract.cap_hit DESC LIMIT ${req.query.limiter};
    `;
    db.query(sql, (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    })
})

//add a player to the database
router.post('/add', (req,res) => {
    const {team_id,first_name,last_name,status,school,round_picked,picked,position,img_link,age,weight,height,draft_year,number,cap_hit} = req.body;
    const time = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const sql = "INSERT INTO player (team_id,first_name,last_name,status,last_altered,school,round_picked,picked,position,img_link,age,weight,height,draft_year,number,cap_hit) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
    db.query(sql,[team_id,first_name,last_name,status,time,school,round_picked,picked,position,img_link,age,weight,height,draft_year,number,cap_hit])
})

export default router;