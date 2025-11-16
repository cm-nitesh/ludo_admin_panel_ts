import express from 'express';
import dotenv from 'dotenv';
import authRoute from './routes/authRoute.js'
import cors from "cors";
dotenv.config()
const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', authRoute)


export default app;
