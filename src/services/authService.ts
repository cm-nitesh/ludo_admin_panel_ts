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
            const accessToken = await generateToken(admin);
            return {
                id: admin.id,
                name: admin.name,
                accessToken
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

            return {
                total_users: users.length,
                users
            };
        } catch (error) {
            console.log(`error in get all users ${error}`)
            throw new APIError("Failed to fetch in all users", 500);
        }

    }
}