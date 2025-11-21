// models/walletTransactionModel.ts
import { Model, DataTypes, Optional } from "sequelize";
import sequelize from "../common/config.js";
import { User } from "./userModel.js";
import { WalletTransactionRequest } from "./walletTransactionRequest.js";

export interface WalletTransactionAttributes {
  id: number;
  wallet_id: number;
  wallet_transaction_request_id?: number | null;
  amount: number;
  transaction_type: "credit" | "debit";
  transaction_for: "wallet_recharge" | "game_play" | "bonus_reward" | "withdraw";
  closing_balance: number;
  created_at?: Date;
  updated_at?: Date;
}

export type WalletTransactionCreationAttributes = Optional<
  WalletTransactionAttributes,
  "id" | "wallet_transaction_request_id" | "created_at" | "updated_at"
>;

export class WalletTransaction
  extends Model<
    WalletTransactionAttributes,
    WalletTransactionCreationAttributes
  >
  implements WalletTransactionAttributes
{
  public id!: number;
  public wallet_id!: number;
  public wallet_transaction_request_id!: number | null;
  public amount!: number;
  public transaction_type!: "credit" | "debit";
  public transaction_for!: "wallet_recharge" | "game_play" | "bonus_reward" | "withdraw";
  public closing_balance!: number;
  public created_at!: Date;
  public updated_at!: Date;
}

WalletTransaction.init(
  {
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
      type: DataTypes.ENUM(
        "wallet_recharge",
        "game_play",
        "bonus_reward",
        "withdraw"
      ),
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
  },
  {
    sequelize,
    tableName: "wallet_transactions",
    timestamps: false,
  }
);

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