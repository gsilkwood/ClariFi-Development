import { Request, Response } from 'express';
import { AuthService } from '../services/authService';
import { AuthenticatedRequest } from '../middleware/auth';

export class AuthController {
  async register(req: Request, res: Response): Promise<void> {
    try {
      const { email, username, password } = req.body;

      if (!email || !username || !password) {
        res.status(400).json({ error: 'Email, username, and password required' });
        return;
      }

      const result = await AuthService.register({
        email,
        username,
        password,
        firstName: req.body.firstName,
        lastName: req.body.lastName
      });

      res.status(201).json(result);
    } catch (error: any) {
      if (error.message.includes('already exists')) {
        res.status(409).json({ error: error.message });
      } else {
        throw error;
      }
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400).json({ error: 'Email and password required' });
        return;
      }

      const result = await AuthService.login({ email, password });
      res.json(result);
    } catch (error: any) {
      if (error.message.includes('Invalid')) {
        res.status(401).json({ error: error.message });
      } else {
        throw error;
      }
    }
  }

  async refresh(req: Request, res: Response): Promise<void> {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        res.status(400).json({ error: 'Refresh token required' });
        return;
      }

      const result = await AuthService.refreshToken(refreshToken);
      res.json(result);
    } catch (error: any) {
      res.status(403).json({ error: 'Invalid refresh token' });
    }
  }

  async logout(req: Request, res: Response): Promise<void> {
    try {
      const authReq = req as AuthenticatedRequest;
      if (!authReq.user) {
        res.status(401).json({ error: 'Not authenticated' });
        return;
      }
      await AuthService.logout(authReq.user.userId, '');
      res.json({ message: 'Logged out successfully' });
    } catch (error) {
      throw error;
    }
  }
}

export const authController = new AuthController();
