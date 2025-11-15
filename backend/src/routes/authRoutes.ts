import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { passwordResetController } from '../controllers/passwordResetController';
import { authenticateToken } from '../middleware/auth';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();
const controller = new AuthController();

// Public routes (no auth required)
router.post('/register', asyncHandler((req, res) => controller.register(req, res)));
router.post('/login', asyncHandler((req, res) => controller.login(req, res)));
router.post('/refresh', asyncHandler((req, res) => controller.refresh(req, res)));

// Password reset routes (public)
router.post('/password-reset/request', asyncHandler((req, res) => passwordResetController.requestReset(req, res)));
router.post('/password-reset/confirm', asyncHandler((req, res) => passwordResetController.resetPassword(req, res)));

// Protected routes (auth required)
router.post('/logout', authenticateToken, asyncHandler((req, res) => controller.logout(req, res)));
router.post('/password/change', authenticateToken, asyncHandler((req, res) => passwordResetController.changePassword(req, res)));

export default router;
