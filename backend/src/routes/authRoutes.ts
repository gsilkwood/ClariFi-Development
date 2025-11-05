import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { authenticateToken } from '../middleware/auth';

const router = Router();
const controller = new AuthController();

// Public routes (no auth required)
router.post('/register', (req, res) => controller.register(req, res));
router.post('/login', (req, res) => controller.login(req, res));
router.post('/refresh', (req, res) => controller.refresh(req, res));

// Protected routes (auth required)
router.post('/logout', authenticateToken, (req, res) => controller.logout(req, res));

export default router;
