import { Model, DataTypes } from "sequelize";
import sequelize from "../common/config.js";
export class Bet extends Model {
}
Bet.init({
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
}, {
    sequelize,
    modelName: "Bet",
    tableName: "bets",
    timestamps: true,
    underscored: true,
});
// Associations
// Bet.belongsTo(Contest, { foreignKey: "contest_id" });
// Bet.belongsTo(User, { as: "player1", foreignKey: "player_1_id" });
// Bet.belongsTo(User, { as: "player2", foreignKey: "player_2_id" });
// Bet.belongsTo(User, { as: "cancelledBy", foreignKey: "partially_cancelled_by_id" });
