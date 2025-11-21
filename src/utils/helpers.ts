import { Request, Response, NextFunction } from 'express';
import jwt, { SignOptions, Secret } from 'jsonwebtoken';
import { config } from 'dotenv';
import { secret } from '../common/config.js';
import { APIError } from '../common/error.js';

export interface BetPayload {
  contest_id: number;
  player_1_id: number;
  player_2_id?: number | null;
  player_1_result?: string | null;
  player_2_result?: string | null;
  partially_cancelled_by_id?: number | null;
}

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

export async function generateRefreshToken(admin: any): Promise<string> {
    const payload = {
        id: admin.id,
        // email: admin.email,
        // name: admin.name
    };

    const options: SignOptions = {
        expiresIn: secret.JWT_REFRESH_TOKEN_EXP as unknown as SignOptions['expiresIn']
    };

    return jwt.sign(payload, REFRESH_JWT_SECRET as Secret, options);
}


export async function verifyAdmin(req: Request, res: Response, next: NextFunction) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            throw new APIError("Access token missing", 401);
        }
        const token = authHeader.split(" ")[1];
        if (!token) {
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

export async function verifyTokenValidity(refreshToken: string): Promise<any> {
    try {
        return jwt.verify(refreshToken, REFRESH_JWT_SECRET)
    } catch (error) {
      console.log(`errror in validating the token ${error}`)
    }
}

export function processBetLogic(payload: BetPayload) {
  let {
    contest_id,
    player_1_id,
    player_2_id = null,
    player_1_result = null,
    player_2_result = null,
    partially_cancelled_by_id = null
  } = payload;

  let bet_status = "waiting";

  // Partial cancellation
  if (partially_cancelled_by_id) {
    bet_status = "partially_cancelled";
  }

  // Matched
  else if (player_1_id && player_2_id && !player_1_result && !player_2_result) {
    bet_status = "matched";
  }

  // Completed logic
  if (player_1_result) {
    bet_status = "completed";

    if (player_1_result === "win") player_2_result = "loss";
    if (player_1_result === "loss") player_2_result = "win";
  }

  return {
    contest_id,
    player_1_id,
    player_2_id,
    player_1_result,
    player_2_result,
    partially_cancelled_by_id,
    bet_status
  };
}