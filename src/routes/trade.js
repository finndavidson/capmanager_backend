import express from 'express';
import database from '../database/sqlConnection.js';

const router = express.Router();
const db = database;

//get most recent trade
router.get('/recent', (req, res) => {
    const sql = `
    WITH recent_trades AS (
        SELECT trade_id 
        FROM trade 
        ORDER BY timestamp DESC 
        LIMIT ${req.query.limiter}
    )
    SELECT 
        'draft_pick' as item_type,
        t.trade_id,
        dp.team_id,
        dp.round_id,
        dp.year,
        pt.team_giving,
        pt.team_receiving,
        t.timestamp,
        NULL as player_id,
        NULL as first_name,
        NULL as last_name,
        NULL as position,
        NULL as team_sent,
        NULL as team_received
    FROM draft_picks dp
    JOIN picks_trades pt ON dp.pick_id = pt.pick_id
    JOIN trade t ON pt.trade_id = t.trade_id
    WHERE t.trade_id IN (SELECT trade_id FROM recent_trades)
    
    UNION ALL
    
    SELECT 
        'player' as item_type,
        t.trade_id,
        NULL as team_id,
        NULL as round_id,
        NULL as year,
        NULL as team_giving,
        NULL as team_receiving,
        t.timestamp,
        p.player_id,
        p.first_name,
        p.last_name,
        p.position,
        pt.team_sent,
        pt.team_received
    FROM player p
    JOIN players_trades pt ON p.player_id = pt.player_id
    JOIN trade t ON pt.trade_id = t.trade_id
    WHERE t.trade_id IN (SELECT trade_id FROM recent_trades)
    
    ORDER BY trade_id DESC, item_type, timestamp;`
    
    db.query(sql, (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    })
})


//get all draft picks and players for a specific trade
router.get('/', (req, res) => {
    const sql = `
    SELECT 
        'draft_pick' as item_type,
        dp.team_id,
        dp.round_id,
        dp.year,
        pt.team_giving,
        pt.team_receiving,
        t.timestamp,
        NULL as player_id,
        NULL as first_name,
        NULL as last_name,
        NULL as position,
        NULL as team_sent
    FROM draft_picks dp
    JOIN picks_trades pt ON dp.pick_id = pt.pick_id
    JOIN trade t ON pt.trade_id = t.trade_id
    WHERE pt.trade_id = ${req.query.tradeID}

    UNION ALL

    SELECT 
        'player' as item_type,
        NULL as team_id,
        NULL as round_id,
        NULL as year,
        NULL as team_giving,
        NULL as team_receiving,
        t.timestamp,
        p.player_id,
        p.first_name,
        p.last_name,
        p.position,
        pt.team_sent
    FROM player p
    JOIN players_trades pt ON p.player_id = pt.player_id
    JOIN trade t ON pt.trade_id = t.trade_id
    WHERE pt.trade_id = ${req.query.tradeID}
    `;
    db.query(sql, (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    })
})

//get players associated with a specific trade
router.get('/players', (req, res) => {
    const sql = `
    SELECT 
        p.player_id,
        p.first_name,
        p.last_name,
        p.position,
        pt.team_sent
    FROM player p
    JOIN players_trades pt ON p.player_id = pt.player_id
    JOIN trade t ON pt.trade_id = t.trade_id
    WHERE pt.trade_id = ${req.query.tradeID}
    `;
    db.query(sql, (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    })
})


//get draft picks associated with a specific trade
router.get('/draftpicks', (req, res) => {
    const sql = `
    SELECT 
	    dp.team_id,
        dp.round_id,
        dp.year,
        pt.team_giving,
        pt.team_receiving,
        t.timestamp
    FROM draft_picks dp
    JOIN picks_trades pt ON dp.pick_id = pt.pick_id
    JOIN trade t ON pt.trade_id = t.trade_id
    WHERE pt.trade_id = ${req.query.tradeID}
    `;
    db.query(sql, (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    })
})

//set a trade update player and trades;
router.post('/update', async (req, res) => {
    try {
        const { players, picks, teams } = req.body;
        const timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');
        const addTrade = `INSERT INTO trade (timestamp, teams) VALUES (?,?)`;
        const tradeResult = await new Promise((resolve, reject) => {
            db.query(addTrade, [timestamp, teams.join(',')], (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });
        const tradeID = tradeResult.insertId;
        players.forEach(player => {
            const updatePlayer = `UPDATE player SET team_id = ${player[2]} WHERE player_id = ${player[0]}`;
            const playerTrade = `INSERT INTO players_trades(player_id,trade_id,team_sent,team_received) VALUES(?,?,?,?)`;
            db.query(updatePlayer);
            db.query(playerTrade, [player[0], tradeID, player[1], player[2]]);
        });

        picks.forEach(pick => {
            const updatePick = `UPDATE draft_picks SET pick_owner = ${pick[1]} WHERE pick_id = ${pick[0]}`;
            const pickTrade = `INSERT INTO picks_trades(pick_id,trade_id,team_giving,team_receiving) VALUES(?,?,?,?)`;
            db.query(updatePick);
            db.query(pickTrade, [pick[0], tradeID, pick[1], pick[2]]);
        });
        console.log('trade')
        db.commit();
    }
    catch (err) {
        console.error('Error in trade/update:', err);
        res.status(500).json({ error: 'Database error', details: err.message });
    }
});

export default router;