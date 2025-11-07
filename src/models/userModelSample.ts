

// // models/User.js
// module.exports = (sequelize, DataTypes) => {
//   const User = sequelize.define(
//     "User",
//     {
//       id: {
//         type: DataTypes.BIGINT,
//         primaryKey: true,
//         autoIncrement: true,
//       },

//       provider: {
//         type: DataTypes.STRING,
//         allowNull: false,
//         defaultValue: "phone",
//       },

//       uid: {
//         type: DataTypes.STRING,
//         allowNull: false,
//         defaultValue: "",
//       },

//       encrypted_password: {
//         type: DataTypes.STRING,
//         allowNull: false,
//         defaultValue: "",
//       },

//       reset_password_token: {
//         type: DataTypes.STRING,
//         allowNull: true,
//       },

//       reset_password_sent_at: {
//         type: DataTypes.DATE,
//         allowNull: true,
//       },

//       allow_password_change: {
//         type: DataTypes.BOOLEAN,
//         defaultValue: false,
//       },

//       remember_created_at: {
//         type: DataTypes.DATE,
//         allowNull: true,
//       },

//       confirmation_token: {
//         type: DataTypes.STRING,
//         allowNull: true,
//       },

//       confirmed_at: {
//         type: DataTypes.DATE,
//         allowNull: true,
//       },

//       confirmation_sent_at: {
//         type: DataTypes.DATE,
//         allowNull: true,
//       },

//       unconfirmed_email: {
//         type: DataTypes.STRING,
//         allowNull: true,
//       },

//       name: {
//         type: DataTypes.STRING,
//         allowNull: true,
//       },

//       email: {
//         type: DataTypes.STRING,
//         allowNull: true,
//         validate: { isEmail: true },
//       },

//       phone: {
//         type: DataTypes.STRING,
//         allowNull: true,
//       },

//       tokens: {
//         type: DataTypes.TEXT,
//         allowNull: true,
//       },

//       referral_code: {
//         type: DataTypes.STRING,
//         allowNull: true,
//       },

//       referred_by_id: {
//         type: DataTypes.BIGINT,
//         allowNull: true,
//       },

//       upi_id: {
//         type: DataTypes.STRING,
//         allowNull: true,
//       },
//     },
//     {
//       tableName: "users",
//       timestamps: true, // created_at & updated_at
//       underscored: true, // created_at instead of createdAt
//     }
//   );

//   return User;
// };

// //////////////////

// import sequelize from "../common/dbConfig.js";
// import { DataTypes, Model } from "sequelize";

// export class User extends Model {}

// User.init(
//   {
//     id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },

//     provider: { type: DataTypes.STRING, defaultValue: "phone", allowNull: false },

//     uid: { type: DataTypes.STRING, defaultValue: "", allowNull: false },

//     encrypted_password: { type: DataTypes.STRING, defaultValue: "", allowNull: false },

//     reset_password_token: { type: DataTypes.STRING, allowNull: true },

//     reset_password_sent_at: { type: DataTypes.DATE, allowNull: true },

//     allow_password_change: { type: DataTypes.BOOLEAN, defaultValue: false },

//     remember_created_at: { type: DataTypes.DATE, allowNull: true },

//     confirmation_token: { type: DataTypes.STRING, allowNull: true },

//     confirmed_at: { type: DataTypes.DATE, allowNull: true },

//     confirmation_sent_at: { type: DataTypes.DATE, allowNull: true },

//     unconfirmed_email: { type: DataTypes.STRING, allowNull: true },

//     name: { type: DataTypes.STRING },

//     email: { type: DataTypes.STRING },

//     phone: { type: DataTypes.STRING },

//     tokens: { type: DataTypes.TEXT },

//     referral_code: { type: DataTypes.STRING },

//     referred_by_id: { type: DataTypes.BIGINT },

//     upi_id: { type: DataTypes.STRING },
//   },
//   {
//     sequelize,
//     modelName: "User",
//     tableName: "users",
//     timestamps: true,
//     underscored: true,
//   }
// );

