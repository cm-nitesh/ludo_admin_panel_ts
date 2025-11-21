import express from 'express';
import dotenv from 'dotenv';
import authRoute from './routes/authRoute.js'
dotenv.config()
const app = express();


app.use(express.json());

app.get('/',(req,res)=>{
    res.send('helo')
})

app.use('/api', authRoute)


export default app;
