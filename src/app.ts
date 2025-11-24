import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoute from './routes/authRoute.js'
import betRoute from './routes/betRoute.js';
dotenv.config()
const app = express();

// --- CORS Configuration ---
// Define the allowed origin for your frontend application.
const corsOptions = {
  origin: 'https://ludoking-admin.cubemoons.com',
  optionsSuccessStatus: 200 // For legacy browser support
};

// Enable CORS with the specified options. This should come before your routes.
app.use(cors(corsOptions));

app.use(express.json());

app.use('/api', authRoute);
app.use('/api/bets', betRoute);


export default app;
