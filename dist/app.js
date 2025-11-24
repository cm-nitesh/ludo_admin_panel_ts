import express from 'express';
import dotenv from 'dotenv';
import authRoute from './routes/authRoute.js';
import cors from 'cors';
dotenv.config();
const app = express();
app.use(express.json());
app.use(cors({
    origin: [
        "http://localhost:5173",
        "https://ludoking-admin.cubemoons.com"
    ],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true
}));
app.get('/', (req, res) => {
    res.send('hello');
});
app.use('/api', authRoute);
export default app;
