import { prisma } from '../lib/prisma';
import logger from '../lib/logger';
import { NotFoundError } from '../utils/errors';

export class NotificationService {
  /**
   * Create a new notification
   */
  static async createNotification(data: {
    loanId: string;
    userId: string;
    notificationType: string;
    subject: string;
    body: string;
  }) {
    try {
      const notification = await prisma.notification.create({
        data,
      });

      logger.info('Notification created', {
        id: notification.id,
        userId: data.userId,
        type: data.notificationType,
      });

      return notification;
    } catch (error: any) {
      logger.error('Error creating notification', { error: error.message });
      throw error;
    }
  }

  /**
   * Get all notifications for a user
   */
  static async getUserNotifications(
    userId: string,
    skip: number = 0,
    take: number = 20
  ) {
    try {
      const total = await prisma.notification.count({
        where: { userId },
      });

      const notifications = await prisma.notification.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        skip,
        take,
      });

      return {
        data: notifications,
        pagination: {
          total,
          skip,
          take,
          pages: Math.ceil(total / take),
        },
      };
    } catch (error: any) {
      logger.error('Error retrieving user notifications', { userId, error: error.message });
      throw error;
    }
  }

  /**
   * Get unread notifications for a user
   */
  static async getUnreadNotifications(userId: string) {
    try {
      const notifications = await prisma.notification.findMany({
        where: {
          userId,
          status: 'PENDING',
        },
        orderBy: { createdAt: 'desc' },
      });

      return notifications;
    } catch (error: any) {
      logger.error('Error retrieving unread notifications', { userId, error: error.message });
      throw error;
    }
  }

  /**
   * Mark notification as read/opened
   */
  static async markAsOpened(notificationId: string) {
    try {
      const notification = await prisma.notification.update({
        where: { id: notificationId },
        data: {
          status: 'OPENED',
          openedAt: new Date(),
        },
      });

      logger.info('Notification marked as opened', { id: notificationId });
      return notification;
    } catch (error: any) {
      if (error.code === 'P2025') {
        throw new NotFoundError('Notification');
      }
      logger.error('Error marking notification as opened', { notificationId, error: error.message });
      throw error;
    }
  }

  /**
   * Delete a notification
   */
  static async deleteNotification(notificationId: string) {
    try {
      await prisma.notification.delete({
        where: { id: notificationId },
      });

      logger.info('Notification deleted', { id: notificationId });
    } catch (error: any) {
      if (error.code === 'P2025') {
        throw new NotFoundError('Notification');
      }
      logger.error('Error deleting notification', { notificationId, error: error.message });
      throw error;
    }
  }

  /**
   * Clear all notifications for a user
   */
  static async clearUserNotifications(userId: string) {
    try {
      const result = await prisma.notification.deleteMany({
        where: { userId },
      });

      logger.info('User notifications cleared', { userId, count: result.count });
      return result;
    } catch (error: any) {
      logger.error('Error clearing user notifications', { userId, error: error.message });
      throw error;
    }
  }

  /**
   * Get notifications for a specific loan
   */
  static async getLoanNotifications(loanId: string) {
    try {
      const notifications = await prisma.notification.findMany({
        where: { loanId },
        orderBy: { createdAt: 'desc' },
      });

      return notifications;
    } catch (error: any) {
      logger.error('Error retrieving loan notifications', { loanId, error: error.message });
      throw error;
    }
  }
}
