import {Admin} from '../models/userModel.js';
import sequelize from '../common/config.js';
import  { QueryTypes } from 'sequelize';

export class UserDao{
    async findAdminByEmailAndPassword(email: string, password: string): Promise<any>{
        try {
            const result = await sequelize.query(
                `select * from admin where email = :email and password = crypt(:password, password) limit 1`,
                {
                    replacements: { email, password },
                    type: QueryTypes.SELECT,
                }
            )
             return result[0] || null;
        } catch (error) {
            console.log(`Error in finding admin`, error)
            throw error;
        }
    }

}