
import type { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/authService.js";
import { sendApiResponse } from "../utils/helpers.js";



export class AuthController {
  private service: AuthService;

  constructor(service: AuthService) {
    this.service = service;
  }

  async login(req: Request, res: Response, next: NextFunction): Promise<any> {
    const { password, email } = req.body;
    try {
      if (!password || !email) {
        return sendApiResponse(res, 400, {}, 'email and password required')

      }

      const result = await this.service.login(email, password);
      //  return sendApiResponse(res, 201, result, 'Admin login successfully')
      return res.json(result)

    } catch (error) {
      console.log('error in admin-login', error);
      next(error);

    }

  }

  async getStats(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const result = await this.service.getDashboardStats();

      // return sendApiResponse(res, 200, result, "Dashboard stats fetched successfully");
      res.json(result)

    } catch (error) {
      console.log("error in dashboard-stats", error);
      next(error);
    }
  }

  async getAllUser(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await this.service.getAllUser();
      // return sendApiResponse(res, 200, data, "Users fetched successfully");
      return res.json(data)
    } catch (error) {
      next(error);
    }
  }

  async getUserById(req: Request, res: Response, next: NextFunction) {
    const userId = Number(req.params.id);
    try {
      const data = await this.service.getUserById(userId);
      // return sendApiResponse(res, 200, data, "Users fetched successfully");
      return res.json(data)
    } catch (error) {
      next(error);
    }
  }

  async updateUserStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = Number(req.params.id);
      const { status, description } = req.body;

      const result = await this.service.updateUserStatus(userId, status, description);

      // return sendApiResponse(res, 200, result, "User status updated");
      return res.json(result)
    } catch (err) {
      next(err);
    }
  }

  async getFilteredTransactions(req: Request, res: Response, next: NextFunction) {
    try {
      const fromDate = req.query.fromDate;
      const toDate = req.query.toDate;
      const type = req.query.type;

      if (typeof fromDate !== "string" || typeof toDate !== "string") {
        return sendApiResponse(res, 400, {}, "fromDate and toDate must be provided as strings");
      }

      const txType =
        typeof type === "string" && (type === "recharge" || type === "winning")
          ? (type as "recharge" | "winning")
          : undefined;

      const result = await this.service.getFilteredTransactions(
        fromDate,
        toDate,
        txType
      );

      // return sendApiResponse(res, 200, result, "Transaction list fetched");
      return res.json(result)
    } catch (error) {
      next(error);
    }
  }

  async getWithdrawalList(req: Request, res: Response, next: NextFunction) {
    try {
      const rows = await this.service.getWithdrawalList();
      // return sendApiResponse(res, 200, rows, "Withdrawal list fetched");
      return res.json(rows)
    } catch (err) {
      next(err);
    }
  }

  async updateTransactionStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const { status } = req.body;

      if (!id || !status) {
        return sendApiResponse(res, 400, {}, "Transaction id and status required");
      }

      const result = await this.service.updateTransactionStatus(id, status);

      // return sendApiResponse(res, 200, result, "Transaction status updated");
      return res.json(result)
    } catch (error) {
      next(error);
    }
  }

  async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const { refresh_token } = req.body;
      if (!refresh_token) return sendApiResponse(res, 400, {}, "Refresh token required");

      const newTokens = await this.service.refreshToken(refresh_token);

      return res.json(newTokens);
    } catch (error) {
      next(error);
    }
  }
  async logout(req: Request, res: Response, next:NextFunction) {

    try {
      const { refresh_token } = req.body;
    if (!refresh_token) return sendApiResponse(res, 400, {}, "Refresh token required");

    await this.service.logout(refresh_token);

    return res.json({ message: "Logged out successfully" });
    } catch (error) {
    next(error);
    }
   
  }

   async getAllUserTransactionDetail(req: Request, res: Response, next: NextFunction) {
    const userId = Number(req.params.id);
    try {
      const data = await this.service.getAllUserTransactionDetail(userId);
      // return sendApiResponse(res, 200, data, "Users fetched successfully");
      return res.json(data)
    } catch (error) {
      next(error);
    }
  }

}

