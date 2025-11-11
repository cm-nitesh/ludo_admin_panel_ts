import { Request, Response, NextFunction } from 'express';
import jwt, { SignOptions, Secret } from 'jsonwebtoken';
import { config } from 'dotenv';
import { secret } from '../common/config.js';
import { APIError } from '../common/error.js';

declare global {
    namespace Express {
        interface Request {
            admin?: any;
        }
    }
}

config();

const JWT_SECRET = secret.JWT_SECRET as string;
const REFRESH_JWT_SECRET = secret.REFRESH_JWT_SECRET as string;

export const sendApiResponse = (res: Response, statusCode: number, data: any, message: string = 'success'): Response => {
    return res.status(statusCode).json({
        status: statusCode,
        message,
        data,
    });
}


export async function generateToken(admin: any): Promise<string> {
    const payload = {
        id: admin.id,
        email: admin.email,
        name: admin.name
    };

    const options: SignOptions = {
        expiresIn: secret.JWT_ACCESS_TOKEN_EXP as unknown as SignOptions['expiresIn']
    };

    return jwt.sign(payload, JWT_SECRET as Secret, options);
}


export async function verifyAdmin(req: Request, res: Response, next: NextFunction){
    try {
        const authHeader= req.headers.authorization;
        if(!authHeader){
            throw new APIError("Access token missing", 401);
        }
        const token = authHeader.split(" ")[1];
        if(!token){
            throw new APIError("Access token missing", 401);
        }
        const decode = jwt.verify(token, JWT_SECRET as Secret);
        req.admin = decode;
        next();
    } catch (error) {
        console.log("verifyAdmin error:", error);
        next(new APIError("Invalid or expired token", 401));
        
    }
}
