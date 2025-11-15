import { Router } from 'express';
import { notificationController } from '../controllers/notificationController';
import { authenticateToken } from '../middleware/auth';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

// All notification routes require authentication
router.use(authenticateToken);

// Get user's notifications
router.get('/', asyncHandler((req, res) => notificationController.getUserNotifications(req, res)));

// Get unread notifications
router.get('/unread', asyncHandler((req, res) => notificationController.getUnreadNotifications(req, res)));

// Get notifications for a loan
router.get('/loans/:loanId', asyncHandler((req, res) => notificationController.getLoanNotifications(req, res)));

// Mark notification as opened
router.post('/:id/mark-opened', asyncHandler((req, res) => notificationController.markAsOpened(req, res)));

// Delete a notification
router.delete('/:id', asyncHandler((req, res) => notificationController.deleteNotification(req, res)));

// Clear all notifications
router.post('/clear-all', asyncHandler((req, res) => notificationController.clearAllNotifications(req, res)));

export default router;
