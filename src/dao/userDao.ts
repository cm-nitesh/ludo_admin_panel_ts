import { User } from '../models/userModel.js';
import sequelize from '../common/config.js';
import { QueryTypes } from 'sequelize';

export class UserDao {
    async findAdminByEmailAndPassword(email: string, password: string): Promise<any> {
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

    async getTotalUserCount(): Promise<number> {
        try {
            const result = await sequelize.query<{ total_users: string }>(
                `select count(*) as total_users from users`,
                { type: QueryTypes.SELECT }
            );
            return Number(result[0]?.total_users ?? 0);
        } catch (error) {
            console.error('Error in getting total user count', error);
            throw error;
        }
    }

    async getTransactionStats() {

        try {
            const result = await sequelize.query<{ total_recharge: string; total_winning: string }>(

                `SELECT
            COALESCE(SUM(CASE WHEN request_type = 'recharge' THEN amount END), 0) AS total_recharge,
            COALESCE(SUM(CASE WHEN request_type = 'winning' THEN amount END), 0) AS total_winning
            FROM transactions`,
                { type: QueryTypes.SELECT }
            );
            const row = result[0] ?? { total_recharge: '0', total_winning: '0' };
            return {
                total_recharge: Number(row.total_recharge),
                total_winning: Number(row.total_winning),
                total_profit: Number(row.total_recharge) - Number(row.total_winning),
               
            };

        } catch (error) {
            console.error('Error in getting in transaction stats', error);
            throw error;
        }

    };

    async getAllUser() {
        try {
              return await User.findAll({
            // attributes: ["id", "name", "email", "created_at"], // jo fields dikhane ho
            order: [["created_at", "DESC"]]
        });
        } catch (error) {
            console.error('Error in getting in fetching users from dao', error);
            throw error;
        }
      
    }

}