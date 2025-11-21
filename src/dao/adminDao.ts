import sequelize from "../common/config.js";
import { QueryTypes } from "sequelize";

export class AdminDao {
    async findAdminById(id: number): Promise<any> {
        try {
            const result = await sequelize.query(
                `SELECT id, email FROM admin_users WHERE id = :id LIMIT 1`,
                {
                    replacements: { id },
                    type: QueryTypes.SELECT
                }
            );

            return result[0] || null;
        } catch (error) {
            console.log(`Error fetching admin by ID${error}`, error);
            throw error;
        }
    }
}
