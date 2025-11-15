import { Router } from 'express';
import { taskController } from '../controllers/taskController';
import { authenticateToken } from '../middleware/auth';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

// All task routes require authentication
router.use(authenticateToken);

// Create a new task
router.post('/', asyncHandler((req, res) => taskController.createTask(req, res)));

// Get tasks assigned to current user
router.get('/my-tasks', asyncHandler((req, res) => taskController.getUserTasks(req, res)));

// Get overdue tasks
router.get('/overdue', asyncHandler((req, res) => taskController.getOverdueTasks(req, res)));

// Get task statistics
router.get('/stats', asyncHandler((req, res) => taskController.getTaskStats(req, res)));

// Get tasks for a specific loan
router.get('/loans/:loanId', asyncHandler((req, res) => taskController.getLoanTasks(req, res)));

// Update task status
router.patch('/:taskId/status', asyncHandler((req, res) => taskController.updateTaskStatus(req, res)));

// Assign task to user
router.patch('/:taskId/assign', asyncHandler((req, res) => taskController.assignTask(req, res)));

// Delete task
router.delete('/:taskId', asyncHandler((req, res) => taskController.deleteTask(req, res)));

export default router;
