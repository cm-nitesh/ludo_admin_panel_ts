import { User } from '../models/userModel.js';
import sequelize from '../common/config.js';
import { QueryTypes, Op, Sequelize } from 'sequelize';
import { WalletTransaction,} from '../models/walletTransactionModel.js';
import { WalletTransactionRequest } from '../models/walletTransactionRequest.js';
import { Wallet } from '../models/walletModel.js';
import { Bet } from '../models/betModel.js';

export class UserDao {
  async findAdminByEmailAndPassword(email: string, encrypted_password: string): Promise<any> {
  try {
    const result = await sequelize.query(
      `
      SELECT * FROM admin_users
      WHERE email = :email
      AND encrypted_password = crypt(:encrypted_password, encrypted_password)
      LIMIT 1
      `,
      {
        replacements: { email, encrypted_password },
        type: QueryTypes.SELECT,
      }
    );

    return result[0] || null;
  } catch (error) {
    console.log(`Error in finding admin`, error);
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
            COALESCE(SUM(CASE WHEN transaction_type = 'credit' THEN amount END), 0) AS total_recharge
            
            FROM wallet_transactions`,
                { type: QueryTypes.SELECT }
            );
            const row = result[0] ?? { total_recharge: '0', total_winning: '0' };
            return {
                total_recharge: Number(row.total_recharge),
                // total_winning: Number(row.total_winning),
                // total_profit: Number(row.total_recharge) - Number(row.total_winning),

            };

        } catch (error) {
            console.error('Error in getting in transaction stats', error);
            throw error;
        }

    };

    async getAllUser() {
      try {
        return await User.findAll({
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
            [
              sequelize.literal(`(
                SELECT COUNT(*)
                FROM bets AS b
                WHERE
                  (b.player_1_id = "User".id OR b.player_2_id = "User".id)
                  AND b.bet_status IN ('completed', 'partially_cancelled')
              )`),
              "total_game_played"
            ],
            [sequelize.col("created_at"), "registered_at"],
            "updated_at",
    
            [
              sequelize.literal(`(
                SELECT COALESCE(SUM(wt.amount), 0)
                FROM wallet_transactions AS wt
                INNER JOIN wallets w ON w.id = wt.wallet_id
                WHERE w.user_id = "User".id AND wt.transaction_for = 'wallet_recharge'
              )`),
              "total_transaction_recharge"
            ],
    
            [
              sequelize.literal(`(
                SELECT COALESCE(SUM(wt.amount), 0)
                FROM wallet_transactions AS wt
                INNER JOIN wallets w ON w.id = wt.wallet_id
                WHERE w.user_id = "User".id AND wt.transaction_for = 'winning'
              )`),
              "total_winning"
            ],
          ],
    
          order: [["created_at", "DESC"]],
        });
    
      } catch (error) {
        console.error("Error in fetching users:", error);
        throw error;
      }
    }

async getUserById(userId: number) {
  try {
    const [user] = await sequelize.query(
      `
      SELECT 
        u.id,
        u.name AS username,
        u.phone AS contact,
        u.email,
        u.created_at AS registered_at,

        (
          SELECT COALESCE(SUM(wt.amount), 0)
          FROM wallet_transactions wt
          INNER JOIN wallets w ON w.id = wt.wallet_id
          WHERE w.user_id = u.id
          AND wt.transaction_type = 'credit'
        ) AS total_transaction_recharge,


        (
          SELECT json_agg(
            json_build_object(
              'id', wt.id,
              'amount', wt.amount,
              'transaction_type', wt.transaction_type,
              'transaction_for', wt.transaction_for,
              'closing_balance', wt.closing_balance,
              'created_at', wt.created_at
            )
            ORDER BY wt.created_at DESC
          )
          FROM wallet_transactions wt
          INNER JOIN wallets w ON w.id = wt.wallet_id
          WHERE w.user_id = u.id
        ) AS wallet_transactions,

        (
          SELECT COUNT(*)
          FROM bets b
          WHERE 
            (b.player_1_id = u.id OR b.player_2_id = u.id)
            AND b.bet_status IN ('completed', 'partially_cancelled')
        ) AS total_game_played,


        -- ⭐ Game / Bet History JSON
        (
          SELECT json_agg(
            json_build_object(
              'bet_id', b.id,
              'contest_id', b.contest_id,
              'contest_amount',
                (SELECT amount FROM contests c WHERE c.id = b.contest_id),
              'player_1_id', b.player_1_id,
              'player_2_id', b.player_2_id,
              'bet_status', b.bet_status,
              'player_1_result', b.player_1_result,
              'player_2_result', b.player_2_result,
              'roomcode', b.roomcode,
              'partially_cancelled_by_id', b.partially_cancelled_by_id,
              'played_at', b.created_at
            )
            ORDER BY b.created_at DESC
          )
          FROM bets b
          WHERE b.player_1_id = u.id OR b.player_2_id = u.id
        ) AS game_history


      FROM users u
      WHERE u.id = :userId
      `,
      {
        replacements: { userId },
        type: QueryTypes.SELECT,
      }
    );

    return user;
  } catch (error) {
    console.error("Error in getUserById:", error);
    throw new Error("Failed to fetch user by id");
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


  async getFilteredTransactions(
    fromDate?: string,
    toDate?: string,
    type?: "credit" | "debit"
  ): Promise<any> {
    try {
      const whereClause: any = {};
      if (type) {
        whereClause.transaction_type = type;
      }
      if (fromDate && toDate) {
        whereClause.created_at = {
          [Op.between]: [new Date(fromDate), new Date(toDate)],
        };
      }

      return await WalletTransaction.findAll({
        where: whereClause,
        attributes: [
          "id",
          "amount",
          "transaction_type",
          "transaction_for",
          "closing_balance",
          "created_at",
        ],
        include: [
  {
    model: Wallet,
    as: "wallet",
    include: [
      {
        model: User,
        as: "user",
        attributes: ["id", "name", "email"]
      }
    ]
  },
  {
    model: WalletTransactionRequest,
    as: "request",
    attributes: ["request_type", "request_status"]
  }
],

        order: [["created_at", "DESC"]],
      });
    } catch (error) {
      throw error;
    }
  }

    // async getWithdrawalList(): Promise<any> {

    //     try {
    //         return await Transaction.findAll({
    //             where: { request_type: "withdrawal" },
    //             attributes: ["id","user_id", "amount", "status", "created_at"],
    //             include: [
    //                 {
    //                     model: User,
    //                     as: "user",
    //                     attributes: ["id", "name", "phone", "email"],
    //                 },
    //             ],
    //             order: [["created_at", "DESC"]],
    //         });
    //     } catch (error) {
    //         throw error;
    //     }

    // };

//     async calculateWallet(userId: number): Promise<number> {
//   const rows = await Transaction.findAll({
//     where: { user_id: userId, status: "success" },
//     attributes: ["amount", "request_type"]
//   });

//   let wallet = 0;

//   rows.forEach(tx => {
   
//     if (["recharge", "winning"].includes(tx.request_type as string)) {
//       wallet += Number(tx.amount);
//     }
//     if (["withdrawal", "loss"].includes(tx.request_type as string)) {
//       wallet -= Number(tx.amount);
//     }
//   });

//   return Math.max(wallet,0)
// }

// async updateTransactionStatus(id: number, status: "success" | "failed") {

//     try {
//          const tx = await Transaction.findByPk(id);

//   if (!tx) {
//     throw new Error("Transaction not found");
//   }

//   tx.status = status;
//   await tx.save();

//   return tx;
//     } catch (error) {
//         throw error
//     }
 
// }

async storeRefreshToken(adminId: number, token: string, expiry: Date): Promise<any> {
  try {
    const result = await sequelize.query(
      `
      UPDATE admin_users
      SET refresh_token = :token,
          refresh_token_expiry = :expiry
      WHERE id = :adminId
      `,
      {
        replacements: { adminId, token, expiry },
        type: QueryTypes.UPDATE,
      }
    );

    return result;
  } catch (error) {
    console.log(`error in storing refresh token ${error}`);
    throw error;
  }
}



async findAdminByRefreshToken(refreshToken: string) {
  try {
    const result = await sequelize.query(
      `SELECT * FROM admin WHERE refresh_token = :token LIMIT 1`,
      {
        replacements: { token: refreshToken },
        type: QueryTypes.SELECT,
      }
    );
    return result[0] || null;
  } catch (error) {
    console.error(`DAO Error: Failed to find admin by refresh token.`, error);
    throw error;
  }
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
        type: QueryTypes.UPDATE,
      }
    );
  } catch (error) {
    console.error(
      `DAO Error: Failed to clear refresh token for admin.`,
      error
    );
    throw error;
  }
}

async getAllUserTransactionDetail(userId: number) {
  try {
    const [user] = await sequelize.query(
      `
      SELECT 
        u.id,
        u.name AS username,
        u.phone AS contact,
        u.email,
        u.created_at AS registered_at,

        (
          SELECT COALESCE(SUM(wt.amount), 0)
          FROM wallet_transactions wt
          INNER JOIN wallets w ON w.id = wt.wallet_id
          WHERE w.user_id = u.id
          AND wt.transaction_type = 'credit'
        ) AS total_transaction_recharge,


        (
          SELECT json_agg(
            json_build_object(
              'id', wt.id,
              'amount', wt.amount,
              'transaction_type', wt.transaction_type,
              'transaction_for', wt.transaction_for,
              'closing_balance', wt.closing_balance,
              'created_at', wt.created_at
            )
            ORDER BY wt.created_at DESC
          )
          FROM wallet_transactions wt
          INNER JOIN wallets w ON w.id = wt.wallet_id
          WHERE w.user_id = u.id
        ) AS wallet_transactions,

        (
          SELECT COUNT(*)
          FROM bets b
          WHERE 
            (b.player_1_id = u.id OR b.player_2_id = u.id)
            AND b.bet_status IN ('completed', 'partially_cancelled')
        ) AS total_game_played,


        -- ⭐ Game / Bet History JSON
        (
          SELECT json_agg(
            json_build_object(
              'bet_id', b.id,
              'contest_id', b.contest_id,
              'contest_amount',
                (SELECT amount FROM contests c WHERE c.id = b.contest_id),
              'player_1_id', b.player_1_id,
              'player_2_id', b.player_2_id,
              'bet_status', b.bet_status,
              'player_1_result', b.player_1_result,
              'player_2_result', b.player_2_result,
              'roomcode', b.roomcode,
              'partially_cancelled_by_id', b.partially_cancelled_by_id,
              'played_at', b.created_at
            )
            ORDER BY b.created_at DESC
          )
          FROM bets b
          WHERE b.player_1_id = u.id OR b.player_2_id = u.id
        ) AS game_history


      FROM users u
      WHERE u.id = :userId
      `,
      {
        replacements: { userId },
        type: QueryTypes.SELECT,
      }
    );

    return user;
  } catch (error) {
    console.error("Error in getUserById:", error);
    throw new Error("Failed to fetch user by id");
  }
}

async getAllBets() {
  try {
    return await Bet.findAll({
      attributes: [
        "id",
        "contest_id",
        "player_1_id",
        "player_2_id",
        "bet_status",
        "player_1_result",
        "player_2_result",
        "roomcode",
        "partially_cancelled_by_id",
        "created_at",
      ],
      order: [["id", "DESC"]],
    });
  } catch (error) {
    throw new Error('failed to fetch bet ')
  }
    
}

  async createBet(data: any) {
    try {
      return await Bet.create(data);
    } catch (error) {
      throw new Error(`failed in creat bet${error}`)
    }
    
  }
}
