import { prisma } from '../lib/prisma';
import logger from '../lib/logger';
import { NotFoundError, ValidationError } from '../utils/errors';

export class TaskService {
  /**
   * Create a new workflow task
   */
  static async createTask(data: {
    loanId: string;
    taskType: string;
    title: string;
    description?: string;
    assignedToId?: string;
    dueDate?: Date;
    priority?: string;
  }) {
    try {
      const createData: any = {
        loanId: data.loanId,
        taskType: data.taskType,
        title: data.title,
        description: data.description,
        assignedToId: data.assignedToId,
        priority: data.priority,
        status: 'PENDING',
      };

      if (data.dueDate) {
        createData.dueDate = data.dueDate;
      }

      const task = await prisma.workflowTask.create({
        data: createData,
        include: {
          assignedTo: { select: { username: true, email: true } },
          loan: { select: { id: true, loanNumber: true } },
        },
      });

      logger.info('Task created', { id: task.id, loanId: data.loanId });
      return task;
    } catch (error: any) {
      logger.error('Error creating task', { error: error.message });
      throw error;
    }
  }

  /**
   * Get tasks for a specific loan
   */
  static async getLoanTasks(loanId: string, skip: number = 0, take: number = 50) {
    try {
      const total = await prisma.workflowTask.count({
        where: { loanId },
      });

      const tasks = await prisma.workflowTask.findMany({
        where: { loanId },
        orderBy: { dueDate: 'asc' },
        skip,
        take,
        include: {
          assignedTo: { select: { username: true, email: true } },
        },
      });

      return {
        data: tasks,
        pagination: {
          total,
          skip,
          take,
          pages: Math.ceil(total / take),
        },
      };
    } catch (error: any) {
      logger.error('Error retrieving loan tasks', { loanId, error: error.message });
      throw error;
    }
  }

  /**
   * Get tasks assigned to a user
   */
  static async getUserTasks(userId: string, skip: number = 0, take: number = 50) {
    try {
      const total = await prisma.workflowTask.count({
        where: {
          assignedToId: userId,
          status: { not: 'COMPLETED' },
        },
      });

      const tasks = await prisma.workflowTask.findMany({
        where: {
          assignedToId: userId,
          status: { not: 'COMPLETED' },
        },
        orderBy: { dueDate: 'asc' },
        skip,
        take,
        include: {
          loan: { select: { id: true, loanNumber: true } },
        },
      });

      return {
        data: tasks,
        pagination: {
          total,
          skip,
          take,
          pages: Math.ceil(total / take),
        },
      };
    } catch (error: any) {
      logger.error('Error retrieving user tasks', { userId, error: error.message });
      throw error;
    }
  }

  /**
   * Update task status
   */
  static async updateTaskStatus(taskId: string, status: string) {
    const validStatuses = ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'];

    if (!validStatuses.includes(status)) {
      throw new ValidationError(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
    }

    try {
      const task = await prisma.workflowTask.update({
        where: { id: taskId },
        data: {
          status,
          completedAt: status === 'COMPLETED' ? new Date() : null,
        },
        include: {
          assignedTo: { select: { username: true, email: true } },
        },
      });

      logger.info('Task status updated', { taskId, newStatus: status });
      return task;
    } catch (error: any) {
      if (error.code === 'P2025') {
        throw new NotFoundError('Task');
      }
      logger.error('Error updating task status', { taskId, error: error.message });
      throw error;
    }
  }

  /**
   * Assign task to a user
   */
  static async assignTask(taskId: string, userId: string) {
    try {
      const task = await prisma.workflowTask.update({
        where: { id: taskId },
        data: {
          assignedToId: userId,
        },
        include: {
          assignedTo: { select: { username: true, email: true } },
        },
      });

      logger.info('Task assigned', { taskId, assignedToId: userId });
      return task;
    } catch (error: any) {
      if (error.code === 'P2025') {
        throw new NotFoundError('Task');
      }
      logger.error('Error assigning task', { taskId, userId, error: error.message });
      throw error;
    }
  }

  /**
   * Delete a task
   */
  static async deleteTask(taskId: string) {
    try {
      await prisma.workflowTask.delete({
        where: { id: taskId },
      });

      logger.info('Task deleted', { taskId });
    } catch (error: any) {
      if (error.code === 'P2025') {
        throw new NotFoundError('Task');
      }
      logger.error('Error deleting task', { taskId, error: error.message });
      throw error;
    }
  }

  /**
   * Get overdue tasks
   */
  static async getOverdueTasks() {
    try {
      const now = new Date();
      const tasks = await prisma.workflowTask.findMany({
        where: {
          dueDate: {
            lt: now,
          },
          status: { not: 'COMPLETED' },
        },
        orderBy: { dueDate: 'asc' },
        include: {
          assignedTo: { select: { username: true, email: true } },
          loan: { select: { id: true, loanNumber: true } },
        },
      });

      return tasks;
    } catch (error: any) {
      logger.error('Error retrieving overdue tasks', { error: error.message });
      throw error;
    }
  }

  /**
   * Get task statistics
   */
  static async getTaskStats() {
    try {
      const stats = await prisma.workflowTask.groupBy({
        by: ['status'],
        _count: true,
      });

      return stats.reduce((acc, stat) => {
        acc[stat.status] = stat._count;
        return acc;
      }, {} as Record<string, number>);
    } catch (error: any) {
      logger.error('Error retrieving task statistics', { error: error.message });
      throw error;
    }
  }
}
