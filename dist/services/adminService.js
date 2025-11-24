import { AdminDao } from "../dao/adminDao.js";
import { APIError } from "../common/error.js";
export class AdminService {
    constructor() {
        this.dao = new AdminDao();
    }
    async getProfile(id) {
        try {
            const admin = await this.dao.findAdminById(id);
            if (!admin) {
                throw new APIError("Admin not found", 404);
            }
            return admin;
        }
        catch (error) {
            throw new APIError("Failed to fetch admin details", 500);
        }
    }
}
