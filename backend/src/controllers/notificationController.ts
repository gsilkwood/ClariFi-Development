import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { NotificationService } from '../services/notificationService';
import { ValidationError } from '../utils/errors';

export class NotificationController {
  async getUserNotifications(req: Request, res: Response): Promise<void> {
    const authReq = req as AuthenticatedRequest;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;

    if (page < 1 || limit < 1 || limit > 100) {
      throw new ValidationError('Invalid pagination parameters');
    }

    const skip = (page - 1) * limit;
    const result = await NotificationService.getUserNotifications(
      authReq.user!.userId,
      skip,
      limit
    );

    res.json(result);
  }

  async getUnreadNotifications(req: Request, res: Response): Promise<void> {
    const authReq = req as AuthenticatedRequest;
    const notifications = await NotificationService.getUnreadNotifications(
      authReq.user!.userId
    );

    res.json(notifications);
  }

  async markAsOpened(req: Request, res: Response): Promise<void> {
    const { id } = req.params;

    if (!id) {
      throw new ValidationError('Notification ID required');
    }

    const notification = await NotificationService.markAsOpened(id);
    res.json(notification);
  }

  async deleteNotification(req: Request, res: Response): Promise<void> {
    const { id } = req.params;

    if (!id) {
      throw new ValidationError('Notification ID required');
    }

    await NotificationService.deleteNotification(id);
    res.status(204).send();
  }

  async clearAllNotifications(req: Request, res: Response): Promise<void> {
    const authReq = req as AuthenticatedRequest;
    await NotificationService.clearUserNotifications(authReq.user!.userId);
    res.json({ message: 'All notifications cleared' });
  }

  async getLoanNotifications(req: Request, res: Response): Promise<void> {
    const { loanId } = req.params;

    if (!loanId) {
      throw new ValidationError('Loan ID required');
    }

    const notifications = await NotificationService.getLoanNotifications(loanId);
    res.json(notifications);
  }
}

export const notificationController = new NotificationController();
