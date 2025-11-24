import { User } from "./userModel.js";
import { Wallet } from "./walletModel.js";
import { WalletTransaction } from "./walletTransactionModel.js";
import { WalletTransactionRequest } from "./walletTransactionRequest.js";
import { Bet } from "./betModel.js";
import { Contest } from "./contestModel.js";
export function applyAssociations() {
    // User → Wallet (1:1)
    User.hasOne(Wallet, { foreignKey: "user_id", as: "wallet" });
    Wallet.belongsTo(User, { foreignKey: "user_id", as: "user" });
    // Wallet → WalletTransactions (1:N)
    Wallet.hasMany(WalletTransaction, { foreignKey: "wallet_id", as: "transactions" });
    WalletTransaction.belongsTo(Wallet, { foreignKey: "wallet_id", as: "wallet" });
    // WalletTransactionRequest → WalletTransaction (1:1)
    WalletTransactionRequest.hasOne(WalletTransaction, {
        foreignKey: "wallet_transaction_request_id",
        as: "transaction",
    });
    WalletTransaction.belongsTo(WalletTransactionRequest, {
        foreignKey: "wallet_transaction_request_id",
        as: "request",
    });
    // User → WalletTransactionRequests (1:N)
    User.hasMany(WalletTransactionRequest, {
        foreignKey: "requested_by_id",
        as: "requests",
    });
    WalletTransactionRequest.belongsTo(User, {
        foreignKey: "requested_by_id",
        as: "requestedBy",
    });
    // Contest 1 --- M Bet
    Contest.hasMany(Bet, {
        foreignKey: "contest_id"
    });
    Bet.belongsTo(Contest, {
        foreignKey: "contest_id"
    });
    // User 1 --- M Bet (player_1)
    User.hasMany(Bet, { foreignKey: "player_1_id" });
    Bet.belongsTo(User, { foreignKey: "player_1_id", as: "player1" });
    // User 1 --- M Bet (player_2)
    User.hasMany(Bet, { foreignKey: "player_2_id" });
    Bet.belongsTo(User, { foreignKey: "player_2_id", as: "player2" });
    // User 1 --- M Bet (partially_cancelled_by_id)
    User.hasMany(Bet, { foreignKey: "partially_cancelled_by_id" });
    Bet.belongsTo(User, { foreignKey: "partially_cancelled_by_id", as: "cancelledBy" });
}
