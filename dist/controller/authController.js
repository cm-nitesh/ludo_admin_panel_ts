import { sendApiResponse, processBetLogic } from "../utils/helpers.js";
export class AuthController {
    constructor(service) {
        this.service = service;
    }
    async login(req, res, next) {
        const { password, email } = req.body;
        try {
            // Provide more specific validation feedback
            if (!email) {
                return sendApiResponse(res, 400, {}, 'Email is required.');
            }
            if (!password) {
                return sendApiResponse(res, 400, {}, 'Password is required.');
            }
            const result = await this.service.login(email, password);
            //  return sendApiResponse(res, 201, result, 'Admin login successfully')
            return res.json(result);
        }
        catch (error) {
            console.log('error in admin-login', error);
            next(error);
        }
    }
    async getStats(req, res, next) {
        try {
            const result = await this.service.getDashboardStats();
            // return sendApiResponse(res, 200, result, "Dashboard stats fetched successfully");
            res.json(result);
        }
        catch (error) {
            console.log("error in dashboard-stats", error);
            next(error);
        }
    }
    async getAllUser(req, res, next) {
        try {
            const data = await this.service.getAllUser();
            // return sendApiResponse(res, 200, data, "Users fetched successfully");
            return res.json(data);
        }
        catch (error) {
            next(error);
        }
    }
    async getUserById(req, res, next) {
        const userId = Number(req.params.id);
        try {
            const data = await this.service.getUserById(userId);
            // return sendApiResponse(res, 200, data, "Users fetched successfully");
            return res.json(data);
        }
        catch (error) {
            next(error);
        }
    }
    async updateUserStatus(req, res, next) {
        try {
            const userId = Number(req.params.id);
            const { status, description } = req.body;
            const result = await this.service.updateUserStatus(userId, status, description);
            // return sendApiResponse(res, 200, result, "User status updated");
            return res.json(result);
        }
        catch (err) {
            next(err);
        }
    }
    async getFilteredTransactions(req, res, next) {
        try {
            const { fromDate, toDate, type } = req.query;
            if (typeof fromDate !== "string" || typeof toDate !== "string") {
                return sendApiResponse(res, 400, {}, "fromDate and toDate must be provided as strings");
            }
            const txType = type === "credit" || type === "debit" ? type : undefined;
            const result = await this.service.getFilteredTransactions(fromDate, toDate, txType);
            return res.json(result);
        }
        catch (error) {
            next(error);
        }
    }
    // async getWithdrawalList(req: Request, res: Response, next: NextFunction) {
    //   try {
    //     const rows = await this.service.getWithdrawalList();
    //     // return sendApiResponse(res, 200, rows, "Withdrawal list fetched");
    //     return res.json(rows)
    //   } catch (err) {
    //     next(err);
    //   }
    // }
    // async updateTransactionStatus(req: Request, res: Response, next: NextFunction) {
    //   try {
    //     const id = Number(req.params.id);
    //     const { status } = req.body;
    //     if (!id || !status) {
    //       return sendApiResponse(res, 400, {}, "Transaction id and status required");
    //     }
    //     const result = await this.service.updateTransactionStatus(id, status);
    //     // return sendApiResponse(res, 200, result, "Transaction status updated");
    //     return res.json(result)
    //   } catch (error) {
    //     next(error);
    //   }
    // }
    async refresh(req, res, next) {
        try {
            const { refresh_token } = req.body;
            if (!refresh_token)
                return sendApiResponse(res, 400, {}, "Refresh token required");
            const newTokens = await this.service.refreshToken(refresh_token);
            return res.json(newTokens);
        }
        catch (error) {
            next(error);
        }
    }
    async logout(req, res, next) {
        try {
            const { refresh_token } = req.body;
            if (!refresh_token)
                return sendApiResponse(res, 400, {}, "Refresh token required");
            await this.service.logout(refresh_token);
            return res.json({ message: "Logged out successfully" });
        }
        catch (error) {
            next(error);
        }
    }
    async getAllUserTransactionDetail(req, res, next) {
        const userId = Number(req.params.id);
        try {
            const data = await this.service.getAllUserTransactionDetail(userId);
            // return sendApiResponse(res, 200, data, "Users fetched successfully");
            return res.json(data);
        }
        catch (error) {
            next(error);
        }
    }
    async getAllBets(req, res, next) {
        try {
            const data = await this.service.getAllBets();
            return res.json({
                success: true,
                message: "Bets fetched successfully",
                data,
            });
        }
        catch (err) {
            next(err);
        }
    }
    async createBet(req, res, next) {
        try {
            const { contest_id, player_1_id, player_2_id, player_1_result, player_2_result, partially_cancelled_by_id } = req.body;
            // Validate essential fields
            if (!contest_id || !player_1_id) {
                return res.status(400).json({
                    success: false,
                    message: "contest_id and player_1_id are required"
                });
            }
            // Prepare cleaned payload (optional values allowed)
            const cleanPayload = processBetLogic({
                contest_id,
                player_1_id,
                player_2_id,
                player_1_result,
                player_2_result,
                partially_cancelled_by_id,
            });
            const result = await this.service.createBet(cleanPayload);
            return res.json({
                success: true,
                message: "Bet created successfully",
                data: result,
            });
        }
        catch (err) {
            next(err);
        }
    }
}
