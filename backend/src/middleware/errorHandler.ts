import { Request, Response, NextFunction } from 'express';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { AppError, ValidationError } from '../utils/errors';
import logger from '../lib/logger';

interface ErrorResponse {
  error: string;
  message: string;
  details?: any;
  stack?: string;
}

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  logger.error('Error occurred', { error: err.message, stack: err.stack });

  // Handle custom AppError instances
  if (err instanceof AppError) {
    const response: ErrorResponse = {
      error: err.constructor.name,
      message: err.message,
    };

    if (err instanceof ValidationError && err.details) {
      response.details = err.details;
    }

    if (process.env.NODE_ENV === 'development') {
      response.stack = err.stack;
    }

    res.status(err.statusCode).json(response);
    return;
  }

  // Prisma errors
  if (err instanceof PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      logger.warn('Prisma unique constraint violation', { meta: err.meta });
      res.status(409).json({
        error: 'Conflict',
        message: 'Unique constraint violation',
        details: err.meta
      });
      return;
    }
    logger.error('Prisma error', { code: err.code, message: err.message });
  }

  // Default 500
  const response: ErrorResponse = {
    error: 'Internal Server Error',
    message: err.message || 'An unexpected error occurred'
  };

  if (process.env.NODE_ENV === 'development') {
    response.stack = err.stack;
  }

  res.status(500).json(response);
};
