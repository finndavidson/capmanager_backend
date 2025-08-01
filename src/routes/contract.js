import express from 'express';
import database from '../database/sqlConnection.js';

const router = express.Router();
const db = database;

//get all contracts for a specific player
router.get('/', (req, res) => {
    const playerId = req.query.player;
    
    if (!playerId || isNaN(playerId)) {
        return res.status(400).json({ error: 'Valid player ID required' });
    }
    
    const sql = "SELECT * FROM contract WHERE player_id = ?";
    
    db.query(sql, [playerId], (err, data) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        return res.json(data);
    });
});

//get the contract for a specific player in a specific year
router.get('/year', (req, res) => {

    const playerId = req.query.player;
    const year = req.query.year;

    if (!playerId || isNaN(playerId)) {
        return res.status(400).json({ error: 'Valid player ID required' });
    }
    
    if (!year || isNaN(year)) {
        return res.status(400).json({ error: 'Valid year required' });
    }

    const sql = "SELECT * FROM contract where player_id = ? AND year = ?;";
    db.query(sql, [playerId,year], (err,data) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        
        return res.json(data);
    })
})

//get contracts based on the most recently altered
router.get('/recent', (req, res) => {
    let limit = req.query.limit;

    if(!limit || isNaN(limit)){
        return res.status(400).json({ error: 'Valid limit required'})
    }

    limit = parseInt(limit);

    const sql = "SELECT * FROM contract Order By last_altered DESC LIMIT ?;";
    db.query(sql, [limit], (err,data) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        return res.json(data);
    })
})

//get the contract for a specific player after a specefic year
router.get('/year/after', (req, res) => {
    const playerId = req.query.player;
    const year = req.query.year;

    if (!playerId || isNaN(playerId)) {
        return res.status(400).json({ error: 'Valid player ID required' });
    }
    
    if (!year || isNaN(year)) {
        return res.status(400).json({ error: 'Valid year required' });
    }

    const sql = "SELECT * FROM contract where player_id = ? AND year >= ?;";
    db.query(sql, [playerId,year], (err,data) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        return res.json(data);
    })
})


export default router;