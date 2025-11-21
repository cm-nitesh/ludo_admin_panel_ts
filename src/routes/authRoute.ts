import express from 'express';
import {AuthController} from '../controller/authController.js';
import { AuthService } from '../services/authService.js';
import { AdminController } from '../controller/adminController.js';
import { AdminService } from '../services/adminService.js';
import { AdminDao } from '../dao/adminDao.js';
import { UserDao } from '../dao/userDao.js';
import { verifyAdmin } from '../utils/helpers.js';


const router = express.Router();
const controller = new AuthController(new AuthService(new UserDao()));
const controllerAdmin = new AdminController();
router.post('/admin-login',controller.login.bind(controller))
router.get('/admin-dashboard',verifyAdmin , controller.getStats.bind(controller));
router.get("/users", verifyAdmin, controller.getAllUser.bind(controller));
router.get("/users-details/:id", verifyAdmin, controller.getUserById.bind(controller));
router.patch("/users-status/:id", verifyAdmin, controller.updateUserStatus.bind(controller));
router.get("/transactions", verifyAdmin, controller.getFilteredTransactions.bind(controller));
// router.get('/withdrawals', verifyAdmin,controller.getWithdrawalList.bind(controller));
// router.patch('/transaction-status/:id', verifyAdmin, controller.updateTransactionStatus.bind(controller));
router.get("/user-transactions/:id", verifyAdmin, controller.getAllUserTransactionDetail.bind(controller));

router.get("/admin-profile", verifyAdmin, controllerAdmin.getProfile.bind(controllerAdmin));
router.post('/refresh-token', controller.refresh.bind(controller));
router.post('/logout', controller.logout.bind(controller));
router.get("/bets", verifyAdmin, controller.getAllBets.bind(controller));
router.post("/bets", verifyAdmin,controller.createBet.bind(controller));
router.get("/bets-status/:id", verifyAdmin,controller.betStatus.bind(controller));



export default router;
