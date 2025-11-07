import express from 'express';
import {AuthController} from '../controller/authController.js';
import { AuthService } from '../services/authService.js';
import { UserDao } from '../dao/userDao.js';

const router = express.Router();
const controller = new AuthController(new AuthService(new UserDao()));


router.post('/admin-login',controller.login.bind(controller))



export default router;
