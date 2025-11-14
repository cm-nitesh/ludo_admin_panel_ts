import { Request, Response, NextFunction } from "express";
import { AdminService } from "../services/adminService.js";
import { sendApiResponse } from "../utils/helpers.js";

export class AdminController {
    private service: AdminService;

    constructor() {
        this.service = new AdminService();
    }

    async getProfile(req: Request, res: Response, next: NextFunction): Promise<any> {
        try {
            const adminId = req.admin.id;
            const admin = await this.service.getProfile(adminId);

            return sendApiResponse(res, 200, admin, "Admin details fetched");
        } catch (error) {
            next(error);
        }
    }
}
