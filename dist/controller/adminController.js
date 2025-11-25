import { AdminService } from "../services/adminService.js";
import { sendApiResponse } from "../utils/helpers.js";
export class AdminController {
    constructor() {
        this.service = new AdminService();
    }
    async getProfile(req, res, next) {
        try {
            const adminId = req.admin.id;
            const admin = await this.service.getProfile(adminId);
            return sendApiResponse(res, 200, admin, "Admin details fetched");
        }
        catch (error) {
            next(error);
        }
    }
}
