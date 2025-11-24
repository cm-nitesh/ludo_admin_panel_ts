import { Model, DataTypes } from "sequelize";
import sequelize from "../common/config.js";
export class Contest extends Model {
}
Contest.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    amount: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
}, {
    sequelize,
    modelName: "Contest",
    tableName: "contests",
    timestamps: true,
    underscored: true,
});
