import { DataType, DataTypes, Model } from "sequelize";
import  sequelize from '../common/config.js';


export class Admin extends Model {
    id!: number;
    name!: string;
    email!: string;
    password!: string;
    created_at!:Date;

} 


Admin.init({
    id:{
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true
    },
    name:{
        type: DataTypes.STRING,
        allowNull: false
    },
    email:{
        type: DataTypes.STRING,
        allowNull: false,
        unique: true

    },
    password:{
        type: DataTypes.STRING,
        allowNull: false,

    },
    created_at:{
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },

},{sequelize, tableName: "admin", timestamps: true})
