// models/User.ts
import { Model, DataTypes, Optional } from "sequelize";
import sequelize from "../common/config.js";
import {Transaction} from "./transactionModel.js";


export interface UserAttributes {
  id: number;
  provider: string | null;
  uid: string | null;
  encrypted_password: string | null;
  reset_password_token: string | null;
  reset_password_sent_at: Date | null;
  allow_password_change: boolean | null;
  remember_created_at: Date | null;
  confirmation_token: string | null;
  confirmed_at: Date | null;
  confirmation_sent_at: Date | null;
  unconfirmed_email: string | null;
  name: string | null;
  email: string | null;
  phone: string | null;
  tokens: string | null;
  referral_code: string | null;
  referred_by_id: number | null;
  upi_id: string | null;
  created_at: Date | null;
  updated_at: Date | null;
}

export type UserCreationAttributes = Optional<UserAttributes, "id">;

export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes
   {
  public id!: number;
  public provider!: string | null;
  public uid!: string | null;
  public encrypted_password!: string | null;
  public reset_password_token!: string | null;
  public reset_password_sent_at!: Date | null;
  public allow_password_change!: boolean | null;
  public remember_created_at!: Date | null;
  public confirmation_token!: string | null;
  public confirmed_at!: Date | null;
  public confirmation_sent_at!: Date | null;
  public unconfirmed_email!: string | null;
  public name!: string | null;
  public email!: string | null;
  public phone!: string | null;
  public tokens!: string | null;
  public referral_code!: string | null;
  public referred_by_id!: number | null;
  public upi_id!: string | null;
  public created_at!: Date | null;
  public updated_at!: Date | null;
}

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



User.hasMany(Transaction,{
    foreignKey: "user_id",
    as :"transactions"
});

Transaction.belongsTo(User, {
  foreignKey: "user_id",
  as: "user",
});


