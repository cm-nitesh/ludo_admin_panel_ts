// models/Transaction.ts
import { Model, DataTypes, Optional } from "sequelize";
import sequelize from "../common/config.js";

export interface TransactionAttributes {
  id: number;
  user_id: number;
  amount: number;
  request_type: "recharge" | "winning" | "withdrawal" | "loss";
  status: "pending" | "success" | "failed";
  created_at?: Date;
  updated_at?: Date;
}

export type TransactionCreationAttributes = Optional<
  TransactionAttributes,
  "id" | "status" | "created_at" | "updated_at"
>;

export class Transaction
  extends Model<TransactionAttributes, TransactionCreationAttributes>
  implements TransactionAttributes
{
  public id!: number;
  public user_id!: number;
  public amount!: number;

  public request_type!: "recharge" | "winning" | "withdrawal" | "loss";

  public status!: "pending" | "success" | "failed";

  public created_at!: Date;
  public updated_at!: Date;
}

Transaction.init(
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },

    user_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },

    amount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },

    request_type: {
      type: DataTypes.ENUM("recharge", "winning", "withdrawal", "loss"),
      allowNull: false,
    },

    status: {
      type: DataTypes.ENUM("pending", "success", "failed"),
      defaultValue: "pending",
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
    tableName: "transactions",
    timestamps: false,
  }
);
