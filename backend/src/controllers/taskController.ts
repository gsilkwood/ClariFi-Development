import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { TaskService } from '../services/taskService';
import { ValidationError } from '../utils/errors';

export class TaskController {
  async createTask(req: Request, res: Response): Promise<void> {
    const { loanId, taskType, title, description, assignedToId, dueDate, priority } = req.body;

    if (!loanId || !taskType || !title) {
      throw new ValidationError('loanId, taskType, and title are required');
    }

    const task = await TaskService.createTask({
      loanId,
      taskType,
      title,
      description,
      assignedToId,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      priority,
    });

    res.status(201).json(task);
  }

  async getLoanTasks(req: Request, res: Response): Promise<void> {
    const { loanId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;

    if (!loanId) {
      throw new ValidationError('Loan ID required');
    }

    if (page < 1 || limit < 1 || limit > 100) {
      throw new ValidationError('Invalid pagination parameters');
    }

    const skip = (page - 1) * limit;
    const result = await TaskService.getLoanTasks(loanId, skip, limit);
    res.json(result);
  }

  async getUserTasks(req: Request, res: Response): Promise<void> {
    const authReq = req as AuthenticatedRequest;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;

    if (page < 1 || limit < 1 || limit > 100) {
      throw new ValidationError('Invalid pagination parameters');
    }

    const skip = (page - 1) * limit;
    const result = await TaskService.getUserTasks(authReq.user!.userId, skip, limit);
    res.json(result);
  }

  async updateTaskStatus(req: Request, res: Response): Promise<void> {
    const { taskId } = req.params;
    const { status } = req.body;

    if (!taskId || !status) {
      throw new ValidationError('taskId and status are required');
    }

    const task = await TaskService.updateTaskStatus(taskId, status);
    res.json(task);
  }

  async assignTask(req: Request, res: Response): Promise<void> {
    const { taskId } = req.params;
    const { userId } = req.body;

    if (!taskId || !userId) {
      throw new ValidationError('taskId and userId are required');
    }

    const task = await TaskService.assignTask(taskId, userId);
    res.json(task);
  }

  async deleteTask(req: Request, res: Response): Promise<void> {
    const { taskId } = req.params;

    if (!taskId) {
      throw new ValidationError('Task ID required');
    }

    await TaskService.deleteTask(taskId);
    res.status(204).send();
  }

  async getOverdueTasks(_req: Request, res: Response): Promise<void> {
    const tasks = await TaskService.getOverdueTasks();
    res.json(tasks);
  }

  async getTaskStats(_req: Request, res: Response): Promise<void> {
    const stats = await TaskService.getTaskStats();
    res.json(stats);
  }
}

export const taskController = new TaskController();
