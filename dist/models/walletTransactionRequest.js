// models/walletTransactionRequest.ts
import { Model, DataTypes } from "sequelize";
import sequelize from "../common/config.js";
export class WalletTransactionRequest extends Model {
}
WalletTransactionRequest.init({
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
    },
    amount: {
        type: DataTypes.DOUBLE,
        allowNull: false,
    },
    request_type: {
        type: DataTypes.ENUM("success", "failure", "processing", "pending"),
        allowNull: false,
    },
    request_status: {
        type: DataTypes.ENUM("approved", "rejected"),
        allowNull: true,
    },
    upi_id: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    requested_by_id: {
        type: DataTypes.BIGINT,
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
    tableName: "wallet_transaction_requests",
    timestamps: false,
});
// WalletTransactionRequest.hasOne(WalletTransaction, {
//   foreignKey: "requested_by_id",
//   as: "transaction",
// });
