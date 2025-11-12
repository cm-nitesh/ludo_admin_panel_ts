import type { NextFunction } from "express";
import { UserDao } from "../dao/userDao.js";
import { APIError } from "../common/error.js";
import { generateToken } from "../utils/helpers.js";

export class AuthService {
    private dao: UserDao;


    constructor(dao: UserDao) {
        this.dao = dao;
    }

    async login(email: string, password: string): Promise<any> {
        try {
            const admin = await this.dao.findAdminByEmailAndPassword(email, password);
            if (!admin) {
                throw new APIError('admin is not exist', 400)
            }
            const token = await generateToken(admin);
            return {
                id: admin.id,
                name: admin.name,
                email:admin.email,
                token
            }

        } catch (error: any) {
            throw new APIError("Failed to login", 500);
        }
    }

    async getDashboardStats(): Promise<any> {
        try {
            const totalUsers = await this.dao.getTotalUserCount();
            const txStats = await this.dao.getTransactionStats();
            const total_gamePlayed = 0

            return {
                total_users: totalUsers,
                total_recharge: txStats.total_recharge,
                total_winning: txStats.total_winning,
                total_profit: txStats.total_profit

            };

        } catch (error: any) {
            throw new APIError("Failed to fetch dashboard stats", 500);
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
            throw new APIError("Failed to fetch in all users", 500);
        }

    }

    async getUserById(userId: number) {

        try {
            const users = await this.dao.getUserById(userId);
            if (!users) {
                throw new APIError("User not found", 404);
            }
            return users;
        } catch (error) {
            console.log(`error in get all users ${error}`)
            throw new APIError("Failed to fetch in users by id", 500);
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


  async getFilteredTransactions(fromDate: string, toDate: string, type?: "recharge" | "winning"): Promise<any[]> {
    try {
         const rows = await this.dao.getFilteredTransactions(fromDate, toDate, type);

    return rows.map((tx: any) => ({
      userId: tx.user.id,
      username: tx.user.name,
      date: tx.created_at,
      transaction_type: tx.request_type,
      amount: tx.amount
    }));
    } catch (error) {
        throw new APIError(`failed in get filter transcation`, 500)
    }
   
  };

  async getWithdrawalList() {

    try {
          const rows = await this.dao.getWithdrawalList();

  const result = [];

  for (const tx of rows) {
    const walletAmount = await this.dao.calculateWallet(tx.user_id);

    result.push({
      userId: tx.user.id,
      username: tx.user.name,
      contact: tx.user.contact,
      current_wallet_amount: walletAmount,
      withdrawal_amount: tx.amount,
      status: tx.status
    });
  }

  return result;
    } catch (error) {
        console.log(error)
        throw new APIError('Failed get withdrawal list amount', 500)
    }

}

async updateTransactionStatus(id: number, status: "success" | "failed") {

    try {
         if (!["success", "failed"].includes(status)) {
    throw new APIError("Invalid status value", 400);
  }

  const updated = await this.dao.updateTransactionStatus(id, status);
  return updated;
    } catch (error) {
        throw new APIError('failed in update of transaction status', 500)
    }
 
}


}