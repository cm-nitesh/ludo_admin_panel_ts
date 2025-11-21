import { Model, DataTypes, Optional } from "sequelize";
import sequelize from "../common/config.js";
import { Contest } from "./contestModel.js";
import { User } from "./userModel.js";

export interface BetAttributes {
  id: number;
  contest_id: number;
  player_1_id: number;
  player_2_id: number | null;
  bet_status: "waiting" | "matched" | "completed" | "cancelled" | "partially_cancelled";
  player_1_result: "win" | "loss" | "NA";
  player_2_result: "win" | "loss" | "NA";
  roomcode?: string | null;
  partially_cancelled_by_id: number | null;
  created_at?: Date;
  updated_at?: Date;
}

export interface BetCreationAttributes extends Optional<BetAttributes, "id"> {}

export class Bet extends Model<BetAttributes, BetCreationAttributes> implements BetAttributes {
  public id!: number;
  public contest_id!: number;
  public player_1_id!: number;
  public player_2_id!: number | null;

  public bet_status!: any;
  public player_1_result!: any;
  public player_2_result!: any;
  public roomcode!: string | null;
  public partially_cancelled_by_id!: number | null;

  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

Bet.init(
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    contest_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    player_1_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    player_2_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },

    bet_status: {
      type: DataTypes.ENUM("waiting", "matched", "completed", "cancelled", "partially_cancelled"),
      defaultValue: "waiting",
    },

    player_1_result: {
      type: DataTypes.ENUM("win", "loss", "NA"),
      defaultValue: "NA",
    },
    player_2_result: {
      type: DataTypes.ENUM("win", "loss", "NA"),
      defaultValue: "NA",
    },

    roomcode: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    partially_cancelled_by_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "Bet",
    tableName: "bets",
    timestamps: true,
    underscored: true,
  }
);

// Associations
// Bet.belongsTo(Contest, { foreignKey: "contest_id" });

// Bet.belongsTo(User, { as: "player1", foreignKey: "player_1_id" });
// Bet.belongsTo(User, { as: "player2", foreignKey: "player_2_id" });

// Bet.belongsTo(User, { as: "cancelledBy", foreignKey: "partially_cancelled_by_id" });