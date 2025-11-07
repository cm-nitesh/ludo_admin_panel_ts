
import type { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/authService.js";


export class AuthController {
    private service: AuthService;

    constructor(service: AuthService) {
        this.service = service;
    }

    async login(req: Request, res: Response, next: NextFunction): Promise<any> {
       try {

         const { user_name, phone,email  } = req.body;

        const result = await this.service.login({ user_name, email, phone,  });
        return result;
        
       } catch (error) {
         console.log('error in singUp', error);
         next();
        
       }

    } 
}
