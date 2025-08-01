import express from 'express';
import database from '../database/sqlConnection.js';

const router = express.Router();
const db = database;

//get all draft picks for a team for a given year
router.get('/team/year', (req, res) => {
    const teamId = req.query.team;
    const year = req.query.year;

    if (!teamId || isNaN(teamId)) {
        return res.status(400).json({ error: 'Valid player ID required' });
    }

    if (!year || isNaN(year)) {
        return res.status(400).json({ error: 'Valid year required' });
    }
    const sql = `Select * From draft_picks WHERE pick_owner = ? AND year = ?;`;
    db.query(sql, [teamId, year], (err,data) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        return res.json(data);
    })
})

//get all draft picks owned by a team
router.get('/team', (req, res) => {
    const teamId = req.query.team;

    if (!teamId || isNaN(teamId)) {
        return res.status(400).json({ error: 'Valid player ID required' });
    }

    const sql = "Select * From draft_picks WHERE pick_owner = ?;";
    db.query(sql, [teamId], (err,data) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        return res.json(data);
    })
})
export default router