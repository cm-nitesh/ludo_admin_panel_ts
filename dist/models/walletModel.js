import { Model, DataTypes } from "sequelize";
import sequelize from "../common/config.js";
export class Wallet extends Model {
}
Wallet.init({
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
    },
    user_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
    },
    balance: {
        type: DataTypes.DOUBLE,
        defaultValue: 0,
        allowNull: false,
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
}, {
    sequelize,
    tableName: "wallets",
    timestamps: false,
});
