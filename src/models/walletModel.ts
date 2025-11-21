import { Model, DataTypes, Optional } from "sequelize";
import sequelize from "../common/config.js";

export interface WalletAttributes {
  id: number;
  user_id: number;
  balance: number;
  created_at?: Date;
  updated_at?: Date;
}

export type WalletCreationAttributes = Optional<
  WalletAttributes,
  "id" | "created_at" | "updated_at"
>;

export class Wallet
  extends Model<WalletAttributes, WalletCreationAttributes>
  implements WalletAttributes
{
  public id!: number;
  public user_id!: number;
  public balance!: number;
  public created_at!: Date;
  public updated_at!: Date;
}

Wallet.init(
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
  },
  {
    sequelize,
    tableName: "wallets",
    timestamps: false,
  }
);
