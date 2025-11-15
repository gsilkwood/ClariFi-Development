import { Request, Response } from 'express';
import { AuthService } from '../services/authService';
import { AuthenticatedRequest } from '../middleware/auth';
import { RegisterSchema, LoginSchema } from '../utils/validation';
import { ValidationError, AuthenticationError, ConflictError } from '../utils/errors';
import logger from '../lib/logger';

export class AuthController {
  async register(req: Request, res: Response): Promise<void> {
    const validationResult = RegisterSchema.safeParse(req.body);
    
    if (!validationResult.success) {
      throw new ValidationError('Registration validation failed', 
        validationResult.error.flatten().fieldErrors as Record<string, any>);
    }

    const { email, username, password, firstName, lastName } = validationResult.data;

    try {
      const result = await AuthService.register({
        email,
        username,
        password,
        firstName,
        lastName
      });

      // Set httpOnly cookie for refresh token
      res.cookie('refreshToken', result.tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        path: '/'
      });

      logger.info('User registered successfully', { email, username });

      // Return only access token in response body
      res.status(201).json({
        user: result.user,
        tokens: {
          accessToken: result.tokens.accessToken,
          expiresIn: result.tokens.expiresIn
        }
      });
    } catch (error: any) {
      if (error.message.includes('already exists')) {
        throw new ConflictError(error.message);
      }
      throw error;
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    const validationResult = LoginSchema.safeParse(req.body);
    
    if (!validationResult.success) {
      throw new ValidationError('Login validation failed',
        validationResult.error.flatten().fieldErrors as Record<string, any>);
    }

    const { email, password } = validationResult.data;

    try {
      const result = await AuthService.login({ email, password });

      // Set httpOnly cookie for refresh token
      res.cookie('refreshToken', result.tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        path: '/'
      });

      logger.info('User logged in successfully', { email });

      // Return only access token in response body
      res.json({
        user: result.user,
        tokens: {
          accessToken: result.tokens.accessToken,
          expiresIn: result.tokens.expiresIn
        }
      });
    } catch (error: any) {
      if (error.message.includes('Invalid')) {
        throw new AuthenticationError(error.message);
      }
      throw error;
    }
  }

  async refresh(req: Request, res: Response): Promise<void> {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      throw new ValidationError('Refresh token required');
    }

    try {
      const result = await AuthService.refreshToken(refreshToken);

      // Set new httpOnly cookie for refresh token
      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        path: '/'
      });

      // Return only access token in response body
      res.json({
        accessToken: result.accessToken,
        expiresIn: result.expiresIn
      });
    } catch (error: any) {
      throw new AuthenticationError('Invalid refresh token');
    }
  }

  async logout(req: Request, res: Response): Promise<void> {
    const authReq = req as AuthenticatedRequest;
    const refreshToken = req.cookies?.refreshToken;
    
    if (!authReq.user) {
      throw new AuthenticationError('Not authenticated');
    }
    
    try {
      await AuthService.logout(authReq.user.userId, refreshToken || '');
      
      // Clear the refresh token cookie
      res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/'
      });

      logger.info('User logged out', { userId: authReq.user.userId });
      
      res.json({ message: 'Logged out successfully' });
    } catch (error) {
      throw error;
    }
  }
}

export const authController = new AuthController();
