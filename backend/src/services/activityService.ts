import { prisma } from '../lib/prisma';
import logger from '../lib/logger';

export class ActivityService {
  /**
   * Create an activity log entry
   */
  static async logActivity(data: {
    userId: string;
    action: string;
    description?: string;
    resourceType?: string;
    resourceId?: string;
    loanId?: string;
    oldValues?: Record<string, any>;
    newValues?: Record<string, any>;
    ipAddress?: string;
    userAgent?: string;
  }) {
    try {
      const activity = await prisma.activity.create({
        data,
      });

      logger.debug('Activity logged', {
        id: activity.id,
        userId: data.userId,
        action: data.action,
      });

      return activity;
    } catch (error: any) {
      logger.error('Error logging activity', { error: error.message });
      throw error;
    }
  }

  /**
   * Get all activities for a loan
   */
  static async getLoanActivities(loanId: string, skip: number = 0, take: number = 50) {
    try {
      const total = await prisma.activity.count({
        where: { loanId },
      });

      const activities = await prisma.activity.findMany({
        where: { loanId },
        orderBy: { createdAt: 'desc' },
        skip,
        take,
        include: {
          user: { select: { username: true, email: true } },
        },
      });

      return {
        data: activities,
        pagination: {
          total,
          skip,
          take,
          pages: Math.ceil(total / take),
        },
      };
    } catch (error: any) {
      logger.error('Error retrieving loan activities', { loanId, error: error.message });
      throw error;
    }
  }

  /**
   * Get all activities by a user
   */
  static async getUserActivities(userId: string, skip: number = 0, take: number = 50) {
    try {
      const total = await prisma.activity.count({
        where: { userId },
      });

      const activities = await prisma.activity.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        skip,
        take,
      });

      return {
        data: activities,
        pagination: {
          total,
          skip,
          take,
          pages: Math.ceil(total / take),
        },
      };
    } catch (error: any) {
      logger.error('Error retrieving user activities', { userId, error: error.message });
      throw error;
    }
  }

  /**
   * Get activities by action type
   */
  static async getActivitiesByAction(
    action: string,
    skip: number = 0,
    take: number = 50
  ) {
    try {
      const total = await prisma.activity.count({
        where: { action },
      });

      const activities = await prisma.activity.findMany({
        where: { action },
        orderBy: { createdAt: 'desc' },
        skip,
        take,
        include: {
          user: { select: { username: true, email: true } },
          loan: { select: { id: true, loanNumber: true } },
        },
      });

      return {
        data: activities,
        pagination: {
          total,
          skip,
          take,
          pages: Math.ceil(total / take),
        },
      };
    } catch (error: any) {
      logger.error('Error retrieving activities by action', { action, error: error.message });
      throw error;
    }
  }

  /**
   * Get recent activities (global feed)
   */
  static async getRecentActivities(skip: number = 0, take: number = 100) {
    try {
      const activities = await prisma.activity.findMany({
        orderBy: { createdAt: 'desc' },
        skip,
        take,
        include: {
          user: { select: { username: true, email: true } },
          loan: { select: { id: true, loanNumber: true } },
        },
      });

      return activities;
    } catch (error: any) {
      logger.error('Error retrieving recent activities', { error: error.message });
      throw error;
    }
  }

  /**
   * Delete activities older than specified date (archiving)
   */
  static async archiveOldActivities(beforeDate: Date) {
    try {
      const result = await prisma.activity.deleteMany({
        where: {
          createdAt: {
            lt: beforeDate,
          },
        },
      });

      logger.info('Old activities archived', { count: result.count, beforeDate });
      return result;
    } catch (error: any) {
      logger.error('Error archiving activities', { error: error.message });
      throw error;
    }
  }
}
