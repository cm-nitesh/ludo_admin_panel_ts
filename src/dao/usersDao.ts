
import { Model, DataTypes } from "sequelize";
import sequelize from "../common/config.js";

export class User extends Model {}

User.init(
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
    },
    provider: DataTypes.STRING,
    uid: DataTypes.STRING,
    encrypted_password: DataTypes.STRING,
    reset_password_token: DataTypes.STRING,
    reset_password_sent_at: DataTypes.DATE,
    allow_password_change: DataTypes.BOOLEAN,
    remember_created_at: DataTypes.DATE,
    confirmation_token: DataTypes.STRING,
    confirmed_at: DataTypes.DATE,
    confirmation_sent_at: DataTypes.DATE,
    unconfirmed_email: DataTypes.STRING,
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    phone: DataTypes.STRING,
    tokens: DataTypes.TEXT,
    referral_code: DataTypes.STRING,
    referred_by_id: DataTypes.BIGINT,
    upi_id: DataTypes.STRING,
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: "users",
    timestamps: false, // already provided manually
  }
);
