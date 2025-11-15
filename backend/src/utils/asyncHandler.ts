import { Request, Response, NextFunction } from 'express';

/**
 * Wrapper for async route handlers to catch and pass errors to Express error handler
 */
export const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
