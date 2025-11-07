import type { NextFunction } from "express";
import { UserDao } from "../dao/userDao.js";
import { APIError } from "../common/error.js";
import { generateToken } from "../utils/helpers.js";

export class AuthService{
 private dao: UserDao;


 constructor(dao: UserDao){
    this.dao = dao;
 }

    async login(email:string, password: string): Promise<any>{
        try {
            const admin = await this.dao.findAdminByEmailAndPassword(email, password);
            if(!admin){
                throw new APIError('admin is not exist', 400)
            }
            const accessToken  = await generateToken(admin);
            return{
                id: admin.id,
                name: admin.name,
                accessToken
            }

        } catch (error:any) {
            throw error
        }
    }


}