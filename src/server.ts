import {config} from 'dotenv';
import { dbConnection,dbMigrate } from './common/config.js';
import app from "./app.js";
config();
const port = process.env.PORT
console.log('port', port)

async function startServer(){

    try {
        app.listen(port, async()=>{
            await dbConnection();
            //await dbMigrate();
            console.log(`server is  running on port: ${port}`);


        })
    } catch (error:any) {
        console.log(`error in starting express server ${error.message}`)
        
    }

}

startServer()