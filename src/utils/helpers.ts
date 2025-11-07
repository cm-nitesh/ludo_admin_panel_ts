import { Response } from 'express';
import jwt, { SignOptions, Secret } from 'jsonwebtoken';
import { config } from 'dotenv';
import { secret } from '../common/config.js';
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