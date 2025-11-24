import express from 'express';
import dotenv from 'dotenv';
import authRoute from './routes/authRoute.js'
import betRoute from './routes/betRoute.js';
dotenv.config()
const app = express();


app.use(express.json());

app.use('/api', authRoute);
app.use('/api/bets', betRoute);


export default app;
