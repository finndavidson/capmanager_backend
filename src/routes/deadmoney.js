import express from 'express';
import database from '../database/sqlConnection.js';

const router = express.Router();
const db = database;

//get dead money based on player
router.get('/player', (req, res) => {
    const playerId = req.query.player;

    if (!playerId || isNaN(playerId)) {
        return res.status(400).json({ error: 'Valid player ID required' });
    }
    
    const sql = "Select * From dead_money WHERE player_id = ?;";
    db.query(sql, [playerId], (err,data) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database error' });
        }

        return res.json(data);
    })
})

//get dead money based on team
router.get('/team', (req, res) => {
    const teamId = req.query.team;

    if (!teamId || isNaN(teamId)) {
        return res.status(400).json({ error: 'Valid player ID required' });
    }

    const sql = "Select * From dead_money WHERE team_id = ?;";
    db.query(sql, [teamId], (err,data) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        
        return res.json(data);
    })
})

export default router;