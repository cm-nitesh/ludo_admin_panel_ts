import { Sequelize } from "sequelize";
import { config } from "dotenv";

config()

export const secret = {
     JWT_SECRET :process.env.JWT_SECRET,
     JWT_EXPIRES_IN : process.env.JWT_EXPIRES_IN,
     JWT_ACCESS_TOKEN_EXP: process.env.JWT_ACCESS_TOKEN_EXP,
     JWT_REFRESH_TOKEN_EXP:  process.env.JWT_REFRESH_TOKEN_EXP,
     REFRESH_JWT_SECRET: process.env.REFRESH_JWT_SECRET
}

const sequelize = new Sequelize({
  username:process.env.DB_USER!,
  database:process.env.DATABASE!,
  password:process.env.PASSWORD!,
  host:process.env.HOST!,
  port:parseInt(process.env.DB_PORT ||""),
  dialect:'postgres',
  //logging:console.log, // it will show query of sql 
  logging:process.env.NODE_ENV === "development" ? false : false,
  // this will stop the sql query message once we get during dbMigtaion 
 
});


export async function dbConnection(): Promise<any>{

    try {
        await sequelize.authenticate();
        console.log(`db connection setup`)
    } catch (error:any) {
        console.log(`error in db connection ${error}`)
    }

}

export const dbMigrate = async()=>{
    try {
        await sequelize.sync({alter:true}); // sync use in developemnet , for prod use 
        console.log('dbMigrated')

    } catch (error:any) {
        console.log(`error in dbMigrate ${error.message}`)
         process.exit(1);
    }
   
}

export default  sequelize;