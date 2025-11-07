
import type { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/authService.js";
import { sendApiResponse } from "../utils/helpers.js";



export class AuthController {
    private service: AuthService;

    constructor(service: AuthService) {
        this.service = service;
    }

    async login(req: Request, res: Response, next: NextFunction): Promise<any> {
       const{ password,email  } = req.body;
       try {
        if(!password || !email) {
          return sendApiResponse(res, 400, {}, 'email and password required')
        }
          
        const result = await this.service.login(email, password);
       return sendApiResponse(res, 201, result, 'Admin login successfully')
        
       } catch (error) {
         console.log('error in admin-login', error);
         next(error);
        
       }

    } 
}
