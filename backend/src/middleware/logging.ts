import { Request, Response, NextFunction } from 'express';
import logger from '../lib/logger';

export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const startTime = Date.now();

  // Log incoming request
  logger.info('Incoming request', {
    method: req.method,
    path: req.path,
    ip: req.ip,
  });

  // Capture original res.json to log response
  const originalJson = res.json.bind(res);
  res.json = function(body: any) {
    const duration = Date.now() - startTime;
    logger.info('Outgoing response', {
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
    });
    return originalJson(body);
  };

  next();
};
