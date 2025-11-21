import { Model, DataTypes, Optional } from "sequelize";
import sequelize from "../common/config.js";

export interface ContestAttributes {
  id: number;
  amount: number;
  created_at?: Date;
  updated_at?: Date;
}

export interface ContestCreationAttributes extends Optional<ContestAttributes, "id"> {}

export class Contest
  extends Model<ContestAttributes, ContestCreationAttributes>
  implements ContestAttributes
{
  public id!: number;
  public amount!: number;

  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

Contest.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    amount: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "Contest",
    tableName: "contests",
    timestamps: true,
    underscored: true,
  }
);
