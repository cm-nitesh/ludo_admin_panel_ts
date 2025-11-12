import express from 'express';
import {AuthController} from '../controller/authController.js';
import { AuthService } from '../services/authService.js';
import { UserDao } from '../dao/userDao.js';
import { verifyAdmin } from '../utils/helpers.js';


const router = express.Router();
const controller = new AuthController(new AuthService(new UserDao()));


router.post('/admin-login',controller.login.bind(controller))
router.get('/admin-dashboard',verifyAdmin , controller.getStats.bind(controller));
router.get("/users", verifyAdmin, controller.getAllUser.bind(controller));
router.get("/users-details/:id", verifyAdmin, controller.getUserById.bind(controller));
router.patch("/users-status/:id", verifyAdmin, controller.updateUserStatus.bind(controller));
router.get("/transactions", verifyAdmin, controller.getFilteredTransactions.bind(controller));
router.get('/withdrawals', verifyAdmin,controller.getWithdrawalList.bind(controller));
router.patch('/transaction-status/:id', verifyAdmin, controller.updateTransactionStatus.bind(controller))


export default router;
