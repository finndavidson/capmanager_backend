import express from 'express';
import cors from 'cors';
import team from './routes/team.js';
import player from './routes/player.js';
import contract from './routes/contract.js';
import deadmoney from './routes/deadmoney.js';
import draft from './routes/draft.js';
import trade from './routes/trade.js';

const app = express();
const PORT = process.env.PORT;
app.use(cors());
app.use(express.json());
app.use('/api/team', team);
app.use('/api/player', player);
app.use('/api/contract', contract);
app.use('/api/deadmoney', deadmoney);
app.use('/api/picks', draft);
app.use('/api/trade',trade);

app.listen(8000, () => {
    console.log(`listening at ${PORT}`);
})