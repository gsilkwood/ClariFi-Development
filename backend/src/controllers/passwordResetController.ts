import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { PasswordResetService } from '../services/passwordResetService';
import { ValidationError } from '../utils/errors';

export class PasswordResetController {
  /**
   * Request a password reset
   * POST /api/auth/password-reset/request
   */
  async requestReset(req: Request, res: Response): Promise<void> {
    const { email } = req.body;

    if (!email) {
      throw new ValidationError('Email is required');
    }

    const result = await PasswordResetService.requestReset(email);

    res.json({
      message: 'If an account exists with that email, a reset link has been sent',
      resetToken: process.env.NODE_ENV === 'development' ? result.resetToken : undefined,
    });
  }

  /**
   * Reset password using token
   * POST /api/auth/password-reset/confirm
   */
  async resetPassword(req: Request, res: Response): Promise<void> {
    const { resetToken, newPassword } = req.body;

    if (!resetToken || !newPassword) {
      throw new ValidationError('Reset token and new password are required');
    }

    const result = await PasswordResetService.resetPassword(resetToken, newPassword);

    res.json(result);
  }

  /**
   * Change password for authenticated user
   * POST /api/auth/password/change
   */
  async changePassword(req: Request, res: Response): Promise<void> {
    const authReq = req as AuthenticatedRequest;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      throw new ValidationError('Current password and new password are required');
    }

    const result = await PasswordResetService.changePassword(
      authReq.user!.userId,
      currentPassword,
      newPassword
    );

    res.json(result);
  }
}

export const passwordResetController = new PasswordResetController();
