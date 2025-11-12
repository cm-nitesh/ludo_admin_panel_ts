import { User } from '../models/userModel.js';
import sequelize from '../common/config.js';
import { QueryTypes, Op } from 'sequelize';
import { Transaction } from '../models/transactionModel.js';

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
    async getUserById(userId: number) {
        try {
            return await User.findOne({
                where: { id: userId },
                attributes: ["id", "name", "email", "created_at"], // jo fields dikhane ho
            });
        } catch (error) {
            console.error('Error in getting in fetching users by id', error);
            throw error;
        }

    }

    async findUserById(id: number) {
        try {
            return await User.findOne({ where: { id } });
        } catch (error) {
            throw error;
        }

    }

    async updateUserStatus(id: number, status: string, description: string) {
        try {
            return await User.update(
                { status, status_description: description } as any,
                { where: { id } }
            );
        } catch (error) {
            throw error;
        }

    }

    async getFilteredTransactions(fromDate?: string, toDate?: string, type?: "recharge" | "winning"): Promise<any> {
        try {
            const whereClause: any = {}
            if (type) {
                whereClause.request_type = type;
            }
            if (fromDate && toDate) {
                whereClause.created_at = {
                    [Op.between]: [new Date(fromDate), new Date(toDate)]
                };
            }
            return await Transaction.findAll({
                where: whereClause,
                attributes: ["id", "amount", "request_type", "created_at"],
                include: [
                    {
                        model: User,
                        as: "user",
                        attributes: ["id", "name", "email"],
                    }
                ],
                order: [["created_at", "DESC"]],
            });
        } catch (error) {
            throw error;
        }
    }

    async getWithdrawalList(): Promise<any> {

        try {
            return await Transaction.findAll({
                where: { request_type: "withdrawal" },
                attributes: ["id","user_id", "amount", "status", "created_at"],
                include: [
                    {
                        model: User,
                        as: "user",
                        attributes: ["id", "name", "phone", "email"],
                    },
                ],
                order: [["created_at", "DESC"]],
            });
        } catch (error) {
            throw error;
        }

    };

    async calculateWallet(userId: number): Promise<number> {
  const rows = await Transaction.findAll({
    where: { user_id: userId, status: "success" },
    attributes: ["amount", "request_type"]
  });

  let wallet = 0;

  rows.forEach(tx => {
   
    if (["recharge", "winning"].includes(tx.request_type as string)) {
      wallet += Number(tx.amount);
    }
    if (["withdrawal", "loss"].includes(tx.request_type as string)) {
      wallet -= Number(tx.amount);
    }
  });

  return Math.max(wallet,0)
}

async updateTransactionStatus(id: number, status: "success" | "failed") {

    try {
         const tx = await Transaction.findByPk(id);

  if (!tx) {
    throw new Error("Transaction not found");
  }

  tx.status = status;
  await tx.save();

  return tx;
    } catch (error) {
        throw error
    }
 
}


}

