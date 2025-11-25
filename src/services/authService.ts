import type { NextFunction } from "express";
import { UserDao } from "../dao/userDao.js";
import { APIError } from "../common/error.js";
import { generateToken , generateRefreshToken, verifyTokenValidity} from "../utils/helpers.js";
import { secret } from '../common/config.js';
import { BetPayload } from "../utils/helpers.js";
import { Bet } from "../models/betModel.js";

const  JWT_REFRESH_TOKEN_EXP = secret.JWT_REFRESH_TOKEN_EXP as string;
 JWT_REFRESH_TOKEN_EXP
export class AuthService {
    private dao: UserDao;


    constructor(dao: UserDao) {
        this.dao = dao;
    }

    async login(email: string, password: string): Promise<any> {
        try {
            const admin = await this.dao.findAdminByEmailAndPassword(email, password);
            if (!admin) {
                // Use a 401 status and a vague message for better security
                throw new APIError('Invalid email or password.', 401);
            }
            const token = await generateToken(admin);
            const refreshToken = await generateRefreshToken(admin);
            const days = parseInt(JWT_REFRESH_TOKEN_EXP || '7', 10);
            const expSeconds = (isNaN(days) ? 7 : days) * 24 * 60 * 60;
            const expiryDate = new Date(Date.now() + expSeconds * 1000);
            await this.dao.storeRefreshToken(admin.id, refreshToken,expiryDate)
            return {
                id: admin.id,
                // name: admin.name,
                email:admin.email,
                token,
                refreshToken,

                
            }

        } catch (error) {
            // If it's an APIError we threw, re-throw it to preserve the status and message.
            if (error instanceof APIError) throw error;
            // Otherwise, wrap it in a generic server error.
            throw new APIError(`Login failed due to a server error.`, 500);
        }
    }

    async getDashboardStats(): Promise<any> {
        try {
            const totalUsers = await this.dao.getTotalUserCount();
            const txStats = await this.dao.getTransactionStats();


            return {
                total_users: totalUsers,
                total_recharge: txStats.total_recharge,
                total_winning: txStats.total_winning ?? 0,
                total_profit: txStats.total_profit ?? 0

            };

        } catch (error: any) {
            throw new APIError(`Failed to fetch dashboard stats${error}`, 500);
        }
    };

    async getAllUser() {

        try {
            const users = await this.dao.getAllUser();
            console.log(users)
            return {
                total_users: users.length,
                users
            };
        } catch (error) {
            console.log(`error in get all users ${error}`)
            throw new APIError(`Failed to fetch in all users${error}`, 500);
        }

    }

    async getUserById(userId: number) {
        try {
            const userData = await this.dao.getUserById(userId);
            if (!userData) {
                throw new APIError("User not found", 404);
            }
    
            const { wallet_transactions, game_history, ...userObj } = userData as any;
    
            const user = {
                id: userObj.id,
                username: userObj.username,
                email: userObj.email,
                phone: userObj.contact, // rename
                status: userObj.status,
                registeredAt: userObj.registered_at, // rename
                total_game_played: userObj.total_game_played,
                total_transaction_recharge: userObj.total_transaction_recharge,
                // total_winning is missing from DAO query for this specific user
            };
    
            const transactions = (wallet_transactions || []).map((tx: any) => ({
                id: tx.id,
                created_at: tx.created_at,
                amount: tx.amount,
                transaction_type: tx.transaction_type,
                method: tx.transaction_for, // Mapped from transaction_for
            }));
    
            const gameHistory = (game_history || []).map((game: any) => {
                let result = "N/A";
                let type: "winning" | undefined = undefined;
    
                if (game.player_1_id === userId) {
                    if (game.player_1_result === 'win') {
                        result = 'win';
                        type = 'winning';
                    } else if (game.player_1_result === 'loss') {
                        result = 'loss';
                    } else if (game.player_1_result === 'draw') {
                        result = 'draw';
                    }
                } else if (game.player_2_id === userId) {
                    if (game.player_2_result === 'win') {
                        result = 'win';
                        type = 'winning';
                    } else if (game.player_2_result === 'loss') {
                        result = 'loss';
                    } else if (game.player_2_result === 'draw') {
                        result = 'draw';
                    }
                }
                
                if (game.bet_status === 'cancelled' || game.bet_status === 'partially_cancelled') {
                    result = game.bet_status;
                }
    
                const gameHistoryEntry: any = {
                    id: game.bet_id,
                    game_id: game.contest_id,
                    date: game.played_at,
                    result: result,
                    amount: game.contest_amount,
                    player1: game.player_1_id,
                    player2: game.player_2_id,
                };
    
                if (type) {
                    gameHistoryEntry.type = type;
                }
    
                return gameHistoryEntry;
            });
    
            return {
                user,
                transactions,
                gameHistory,
            };
        } catch (error) {
            console.log(`error in get user by id ${error}`);
            if (error instanceof APIError) {
                throw error;
            }
            throw new APIError(`Failed to fetch user by id`, 500);
        }
    }

    async updateUserStatus(userId: number, status: string, description:string):Promise<any>{
        try {
            const allowStatus = ['blocked', 'unblocked'];
            if(!allowStatus.includes(status)){
                throw new APIError('Invalid status. Allowed blocked | unblocked', 400);

            }

            const user = await this.dao.findUserById(userId);
            if(!user){
                throw new APIError('User not found', 404)

            }

            const currentStatus = (user as any).status;
            if (currentStatus === status) {
                return {
                    message: `user already ${status}`,
                    userId,
                    currentStatus
                };
            }

            await this.dao.updateUserStatus(userId, status, description);
            return{
                userId,
                status,
                description
            }
        } catch (error) {
            throw new APIError("Failed to update user status", 500);
        }
    }


async getFilteredTransactions(
  fromDate: string,
  toDate: string,
  type?: "credit" | "debit"
): Promise<any[]> {
  try {
    const rows = await this.dao.getFilteredTransactions(fromDate, toDate, type);

   return rows.map((tx: any) => ({
  userId: tx.wallet.user.id,
  username: tx.wallet.user.name,
  date: tx.created_at,
  transaction_type: tx.transaction_type,
  request_type: tx.request?.request_type || null,
  request_status: tx.request?.request_status || null,
  amount: tx.amount,
  closing_balance: tx.closing_balance,
}));

  } catch (error) {
    throw new APIError(`failed in get filter transaction${error}`, 500);
  }
}


//   async getWithdrawalList() {

//     try {
//           const rows = await this.dao.getWithdrawalList();

//   const result = [];

//   for (const tx of rows) {
//     const walletAmount = await this.dao.calculateWallet(tx.user_id);

//     result.push({
//       userId: tx.user.id,
//       username: tx.user.name,
//       contact: tx.user.contact,
//       current_wallet_amount: walletAmount,
//       withdrawal_amount: tx.amount,
//       status: tx.status
//     });
//   }

//   return result;
//     } catch (error) {
//         console.log(error)
//         throw new APIError('Failed get withdrawal list amount', 500)
//     }

// }

// async updateTransactionStatus(id: number, status: "success" | "failed") {

//     try {
//          if (!["success", "failed"].includes(status)) {
//     throw new APIError("Invalid status value", 400);
//   }

//   const updated = await this.dao.updateTransactionStatus(id, status);
//   return updated;
//     } catch (error) {
//         throw new APIError('failed in update of transaction status', 500)
//     }
 
// }

async refreshToken(refreshToken: string) {

    try {
         const admin = await this.dao.findAdminByRefreshToken(refreshToken);
    if (!admin) throw new APIError("Invalid refresh token", 401);
    await verifyTokenValidity(refreshToken)
    const newAccess = await generateToken(admin);

    return { accessToken: newAccess };
    } catch (error) {
        throw new APIError('falied to find refresh token', 500)
    }
   
}

async logout(refreshToken: string) {
    try {
        await this.dao.clearRefreshToken(refreshToken);
    } catch (error) {
         throw new APIError('falied to logout', 500)
    }
    
}

 async getAllUserTransactionDetail(userId: number) {

        try {
            const users = await this.dao.getAllUserTransactionDetail(userId);
            if (!users) {
                throw new APIError("User not found", 404);
            }
            return users;
        } catch (error) {
            console.log(`error in get all users's transaction details  ${error}`)
            throw new APIError("Failed to fetch in users by id", 500)

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
        "created_at"
      ],
      order: [["created_at", "DESC"]],
    });
    } catch (error) {
      throw new APIError(`Failed to fetch bets: ${error}`, 500);
    }
  }


  async createBet(data: BetPayload) {
    try {
      // Sanitize player_2_id: If it's falsy (e.g., 0, '', undefined, null),
      // explicitly set it to null. Otherwise, use the provided value.
      const sanitizedData = {
        ...data,
        player_2_id: data.player_2_id ? data.player_2_id : null,
      };

      return await this.dao.createBet(sanitizedData);
    } catch (error) {
      throw new APIError(`Failed to create bet: ${error}`, 500);
    }
  }

}