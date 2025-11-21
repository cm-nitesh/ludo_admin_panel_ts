// models/walletTransactionRequest.ts
import { Model, DataTypes, Optional } from "sequelize";
import sequelize from "../common/config.js";
import { WalletTransaction } from "./walletTransactionModel.js";

export interface WalletTransactionRequestAttributes {
  id: number;
  amount: number;
  request_type: "success" | "failure" | "processing" | "pending";
  request_status: "approved" | "rejected" | null;
  upi_id: string;
  requested_by_id: number;
  created_at?: Date;
  updated_at?: Date;
}

export type WalletTransactionRequestCreationAttributes = Optional<
  WalletTransactionRequestAttributes,
  "id" | "request_status" | "created_at" | "updated_at"
>;

export class WalletTransactionRequest
  extends Model<
    WalletTransactionRequestAttributes,
    WalletTransactionRequestCreationAttributes
  >
  implements WalletTransactionRequestAttributes
{
  public id!: number;
  public amount!: number;
  public request_type!: "success" | "failure" | "processing" | "pending";
  public request_status!: "approved" | "rejected" | null;
  public upi_id!: string;
  public requested_by_id!: number;
  public created_at!: Date;
  public updated_at!: Date;
}

WalletTransactionRequest.init(
  {
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
  },
  {
    sequelize,
    tableName: "wallet_transaction_requests",
    timestamps: false,
  }
);

// WalletTransactionRequest.hasOne(WalletTransaction, {
//   foreignKey: "requested_by_id",
//   as: "transaction",
// });