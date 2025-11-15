import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { ActivityService } from '../services/activityService';
import { ValidationError } from '../utils/errors';

export class ActivityController {
  async getLoanActivities(req: Request, res: Response): Promise<void> {
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
    const result = await ActivityService.getLoanActivities(loanId, skip, limit);

    res.json(result);
  }

  async getUserActivities(req: Request, res: Response): Promise<void> {
    const authReq = req as AuthenticatedRequest;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;

    if (page < 1 || limit < 1 || limit > 100) {
      throw new ValidationError('Invalid pagination parameters');
    }

    const skip = (page - 1) * limit;
    const result = await ActivityService.getUserActivities(authReq.user!.userId, skip, limit);

    res.json(result);
  }

  async getActivitiesByAction(req: Request, res: Response): Promise<void> {
    const { action } = req.query;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;

    if (!action || typeof action !== 'string') {
      throw new ValidationError('Action parameter is required');
    }

    if (page < 1 || limit < 1 || limit > 100) {
      throw new ValidationError('Invalid pagination parameters');
    }

    const skip = (page - 1) * limit;
    const result = await ActivityService.getActivitiesByAction(action, skip, limit);

    res.json(result);
  }

  async getRecentActivities(req: Request, res: Response): Promise<void> {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 100;

    if (page < 1 || limit < 1 || limit > 100) {
      throw new ValidationError('Invalid pagination parameters');
    }

    const skip = (page - 1) * limit;
    const activities = await ActivityService.getRecentActivities(skip, limit);

    res.json(activities);
  }
}

export const activityController = new ActivityController();
