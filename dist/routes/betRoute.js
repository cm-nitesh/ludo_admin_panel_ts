import { Router } from 'express';
import { AuthController } from '../controller/authController.js';
import { AuthService } from '../services/authService.js';
import { UserDao } from '../dao/userDao.js';
import { verifyAdmin } from '../utils/helpers.js';
import { getBetById } from '../controllers/betController.js';
const router = Router();
// It's good practice to keep related controllers and services together.
const controller = new AuthController(new AuthService(new UserDao()));
// This route will handle requests like GET /api/bets/15, GET /api/bets/123, etc.
router.get('/:id', verifyAdmin, getBetById);
// TODO: Implement the controller logic for these routes
router.patch('/:id', verifyAdmin, (req, res) => res.status(501).json({ message: 'Update bet not implemented' }));
router.delete('/:id', verifyAdmin, (req, res) => res.status(501).json({ message: 'Delete bet not implemented' }));
export default router;
