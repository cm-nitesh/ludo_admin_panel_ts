// models/walletTransactionModel.ts
import { Model, DataTypes } from "sequelize";
import sequelize from "../common/config.js";
export class WalletTransaction extends Model {
}
WalletTransaction.init({
    id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
    },
    wallet_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
    },
    wallet_transaction_request_id: {
        type: DataTypes.BIGINT,
        allowNull: true,
    },
    amount: {
        type: DataTypes.DOUBLE,
        allowNull: false,
    },
    transaction_type: {
        type: DataTypes.ENUM("credit", "debit"),
        allowNull: false,
    },
    transaction_for: {
        type: DataTypes.ENUM("wallet_recharge", "game_play", "bonus_reward", "withdraw"),
        allowNull: false,
    },
    closing_balance: {
        type: DataTypes.DOUBLE,
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
    tableName: "wallet_transactions",
    timestamps: false,
});
// // Transaction belongs to user
// WalletTransaction.belongsTo(User, {
//   foreignKey: "user_id",
//   as: "user",
// });
// // Transaction belongs to transaction request
// WalletTransaction.belongsTo(WalletTransactionRequest, {
//   foreignKey: "request_id",
//   as: "request",
// });
