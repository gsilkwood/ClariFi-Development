import { Router } from 'express';
import { activityController } from '../controllers/activityController';
import { authenticateToken } from '../middleware/auth';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

// All activity routes require authentication
router.use(authenticateToken);

// Get recent activities (global feed)
router.get('/', asyncHandler((req, res) => activityController.getRecentActivities(req, res)));

// Get activities by action type
router.get('/action', asyncHandler((req, res) => activityController.getActivitiesByAction(req, res)));

// Get user's activities
router.get('/user/my-activities', asyncHandler((req, res) => activityController.getUserActivities(req, res)));

// Get activities for a specific loan
router.get('/loans/:loanId', asyncHandler((req, res) => activityController.getLoanActivities(req, res)));

export default router;
