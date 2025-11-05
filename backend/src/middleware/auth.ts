import { Request, Response, NextFunction } from 'express';
import { JWTService } from '../utils/jwt';
import { JWTPayload } from '../types/auth';

export interface AuthenticatedRequest extends Request {
  user?: JWTPayload;
}

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith('Bearer ')
      ? authHeader.substring(7)
      : null;

    if (!token) {
      res.status(401).json({ error: 'Access token required' });
      return;
    }

    const validation = JWTService.verifyAccessToken(token);
    if (!validation.valid || !validation.payload) {
      res.status(403).json({ error: 'Invalid or expired token' });
      return;
    }

    (req as AuthenticatedRequest).user = validation.payload;
    next();
  } catch (error) {
    res.status(403).json({ error: 'Invalid or expired token' });
  }
};
