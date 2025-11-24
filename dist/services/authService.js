import { APIError } from "../common/error.js";
import { generateToken, generateRefreshToken, verifyTokenValidity } from "../utils/helpers.js";
import { secret } from '../common/config.js';
import { Bet } from "../models/betModel.js";
const JWT_REFRESH_TOKEN_EXP = secret.JWT_REFRESH_TOKEN_EXP;
JWT_REFRESH_TOKEN_EXP;
export class AuthService {
    constructor(dao) {
        this.dao = dao;
    }
    async login(email, encrypted_password) {
        try {
            const admin = await this.dao.findAdminByEmailAndPassword(email, encrypted_password);
            if (!admin) {
                throw new APIError('admin is not exist', 400);
            }
            const token = await generateToken(admin);
            const refreshToken = await generateRefreshToken(admin);
            const expSeconds = Number(JWT_REFRESH_TOKEN_EXP.replace("d", "")) * 24 * 60 * 60;
            const expiryDate = new Date(Date.now() + expSeconds * 1000);
            await this.dao.storeRefreshToken(admin.id, refreshToken, expiryDate);
            return {
                id: admin.id,
                // name: admin.name,
                email: admin.email,
                token,
                refreshToken,
            };
        }
        catch (error) {
            throw new APIError(`Failed to login ${error}`, 500);
        }
    }
    async getDashboardStats() {
        try {
            const totalUsers = await this.dao.getTotalUserCount();
            const txStats = await this.dao.getTransactionStats();
            return {
                total_users: totalUsers,
                total_recharge: txStats.total_recharge,
                // total_winning: txStats.total_winning,
                // total_profit: txStats.total_profit
            };
        }
        catch (error) {
            throw new APIError(`Failed to fetch dashboard stats${error}`, 500);
        }
    }
    ;
    async getAllUser() {
        try {
            const users = await this.dao.getAllUser();
            console.log(users);
            return {
                total_users: users.length,
                users
            };
        }
        catch (error) {
            console.log(`error in get all users ${error}`);
            throw new APIError(`Failed to fetch in all users${error}`, 500);
        }
    }
    async getUserById(userId) {
        try {
            const users = await this.dao.getUserById(userId);
            if (!users) {
                throw new APIError("User not found", 404);
            }
            return users;
        }
        catch (error) {
            console.log(`error in get all users ${error}`);
            throw new APIError(`Failed to fetch in users by id${error}`, 500);
        }
    }
    async updateUserStatus(userId, status, description) {
        try {
            const allowStatus = ['blocked', 'unblocked'];
            if (!allowStatus.includes(status)) {
                throw new APIError('Invalid status. Allowed blocked | unblocked', 400);
            }
            const user = await this.dao.findUserById(userId);
            if (!user) {
                throw new APIError('User not found', 404);
            }
            const currentStatus = user.status;
            if (currentStatus === status) {
                return {
                    message: `user already ${status}`,
                    userId,
                    currentStatus
                };
            }
            await this.dao.updateUserStatus(userId, status, description);
            return {
                userId,
                status,
                description
            };
        }
        catch (error) {
            throw new APIError("Failed to update user status", 500);
        }
    }
    async getFilteredTransactions(fromDate, toDate, type) {
        try {
            const rows = await this.dao.getFilteredTransactions(fromDate, toDate, type);
            return rows.map((tx) => ({
                userId: tx.wallet.user.id,
                username: tx.wallet.user.name,
                date: tx.created_at,
                transaction_type: tx.transaction_type,
                request_type: tx.request?.request_type || null,
                request_status: tx.request?.request_status || null,
                amount: tx.amount,
                closing_balance: tx.closing_balance,
            }));
        }
        catch (error) {
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
    async refreshToken(refreshToken) {
        try {
            const admin = await this.dao.findAdminByRefreshToken(refreshToken);
            if (!admin)
                throw new APIError("Invalid refresh token", 401);
            await verifyTokenValidity(refreshToken);
            const newAccess = await generateToken(admin);
            return { accessToken: newAccess };
        }
        catch (error) {
            throw new APIError('falied to find refresh token', 500);
        }
    }
    async logout(refreshToken) {
        try {
            await this.dao.clearRefreshToken(refreshToken);
        }
        catch (error) {
            throw new APIError('falied to logout', 500);
        }
    }
    async getAllUserTransactionDetail(userId) {
        try {
            const users = await this.dao.getAllUserTransactionDetail(userId);
            if (!users) {
                throw new APIError("User not found", 404);
            }
            return users;
        }
        catch (error) {
            console.log(`error in get all users's transaction details  ${error}`);
            throw new APIError("Failed to fetch in users by id", 500);
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
        }
        catch (error) {
            throw new APIError(`Failed to fetch bets: ${error}`, 500);
        }
    }
    async createBet(data) {
        try {
            return await this.dao.createBet(data);
        }
        catch (error) {
            throw new APIError(`Failed to create bet: ${error}`, 500);
        }
    }
}
