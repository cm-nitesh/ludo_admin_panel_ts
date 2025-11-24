import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { APIError } from './common/error.js';
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

// --- Global Error Handling Middleware ---
// This should be the LAST middleware added.
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('[Global Error Handler]:', err);

  if (err instanceof APIError) {
    // If it's a custom APIError, use its status and message
    return res.status(err.status).json({
      success: false,
      message: err.message,
    });
  }

  // For all other errors, send a generic 500 Internal Server Error
  return res.status(500).json({
    success: false,
    message: 'An unexpected internal server error occurred.',
  });
});

export default app;
