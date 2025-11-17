import { User } from '../models/userModel.js';
import sequelize from '../common/config.js';
import { QueryTypes, Op, Sequelize } from 'sequelize';
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

                 attributes: [
        "id",
        [Sequelize.col("name"), "username"], 
        "email",
        "phone",
        "provider",
        "uid",
        "status",
        "referral_code",
        "referred_by_id",
        "upi_id",
        "created_at",
        "updated_at"
      ],
                order: [["created_at", "DESC"]]
            });
        } catch (error) {
            console.error('Error in getting in fetching users from dao', error);
            throw error;
        }

    }
  async getUserById(userId: number) {
  try {
   const [user] = await sequelize.query(
  `
  SELECT 
    "User"."id",
    "User"."name" AS "username",
    "User"."phone" As "contact",
    "User"."email",
    "User"."created_at" AS "registered_at",
    (
      SELECT COALESCE(SUM(amount), 0)
      FROM transactions AS t
      WHERE t."user_id" = "User"."id"   
      AND t.request_type = 'recharge'
    ) AS "total_transaction_recharge",
    (
      SELECT COALESCE(SUM(amount), 0)
      FROM transactions AS t
      WHERE t."user_id" = "User"."id"   
      AND t.request_type = 'winning'
    ) AS "total_winning"
  FROM "users" AS "User"
  WHERE "User"."id" = :userId
  `,
  {
    replacements: { userId },
    type: QueryTypes.SELECT,
  }
);


    return user;
  } catch (error) {
    console.error("Error in getUserById:", error);
    throw new Error("Failed to fetch in users by id");
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

async storeRefreshToken(adminId:number, token: string, expiry: Date): Promise<any>{
    try {
        const result = await sequelize.query(`update admin Set refresh_token =:token, refresh_token_expiry =:expiry where id =:adminId`,{
            replacements:{adminId,token,expiry},
            type: QueryTypes.UPDATE
        });
        return result;
    } catch (error) {
        console.log(`error in storing refresh token ${error}`);
        throw error;
    }
}

async findAdminByRefreshToken(refreshToken: string) {
    const result = await sequelize.query(
        `SELECT * FROM admin WHERE refresh_token = :token LIMIT 1`,
        {
            replacements: { token: refreshToken },
            type: QueryTypes.SELECT
        }
    );
    return result[0] || null;
}
async clearRefreshToken(refreshToken: string) {
    try {
          await sequelize.query(
        `UPDATE admin 
         SET refresh_token = NULL,
             refresh_token_expiry = NULL
         WHERE refresh_token = :token`,
        {
            replacements: { token: refreshToken },
            type: QueryTypes.UPDATE
        }
    );
    } catch (error) {
        throw error;
    }
  
}

}

