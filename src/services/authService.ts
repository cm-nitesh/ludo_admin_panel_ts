import type { NextFunction } from "express";
import { UserDao } from "../dao/userDao.js";

export class AuthService{
 private dao: UserDao;


 constructor(dao: UserDao){
    this.dao = dao;
 }

    async login(userDetails:any): Promise<any>{
        try {
            
        } catch (error) {
            // throw new Api error 
            
        }
    }


}