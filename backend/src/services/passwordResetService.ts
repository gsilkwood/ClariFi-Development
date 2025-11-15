import { prisma } from '../lib/prisma';
import { PasswordService } from '../utils/password';
import { JWTService } from '../utils/jwt';
import logger from '../lib/logger';
import { ValidationError, NotFoundError, AuthenticationError } from '../utils/errors';

export class PasswordResetService {
  /**
   * Request password reset - generate a reset token and save it to the user
   * In production, this token would be sent via email
   */
  static async requestReset(email: string): Promise<{ resetToken: string }> {
    try {
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        // Don't reveal if email exists or not (security best practice)
        logger.warn('Password reset requested for non-existent email', { email });
        return { resetToken: '' };
      }

      // Generate a reset token (short-lived, 15 minutes)
      const resetToken = JWTService.generateAccessToken({
        userId: user.id,
        email: user.email,
        username: user.username,
        roleId: user.roleId,
        role: 'USER',
      });

      // In production, you would:
      // 1. Hash this token
      // 2. Save hash to DB with expiry
      // 3. Send the token via email
      // For now, we'll just log it
      logger.info('Password reset token generated', { email, userId: user.id });

      return { resetToken };
    } catch (error: any) {
      logger.error('Error requesting password reset', { email, error: error.message });
      throw error;
    }
  }

  /**
   * Validate and use a password reset token
   */
  static async resetPassword(
    resetToken: string,
    newPassword: string
  ): Promise<{ message: string }> {
    try {
      // Verify the token
      const validation = JWTService.verifyAccessToken(resetToken);

      if (!validation.valid) {
        throw new AuthenticationError('Invalid or expired reset token');
      }

      const payload = validation.payload!;

      // Validate new password strength
      const passwordValidation = PasswordService.validateStrength(newPassword);
      if (!passwordValidation.valid) {
        throw new ValidationError(
          `Password validation failed: ${passwordValidation.errors.join(', ')}`
        );
      }

      // Hash the new password
      const hashedPassword = await PasswordService.hash(newPassword);

      // Update user's password
      await prisma.user.update({
        where: { id: payload.userId },
        data: {
          passwordHash: hashedPassword,
        },
      });

      // Log the password change
      logger.info('Password reset completed', { userId: payload.userId });

      return { message: 'Password has been reset successfully' };
    } catch (error: any) {
      if (error instanceof AuthenticationError || error instanceof ValidationError) {
        throw error;
      }
      logger.error('Error resetting password', { error: error.message });
      throw error;
    }
  }

  /**
   * Change password for authenticated user
   */
  static async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string
  ): Promise<{ message: string }> {
    try {
      // Get user
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new NotFoundError('User');
      }

      // Verify current password
      const isValid = await PasswordService.verify(currentPassword, user.passwordHash);
      if (!isValid) {
        throw new AuthenticationError('Current password is incorrect');
      }

      // Validate new password strength
      const passwordValidation = PasswordService.validateStrength(newPassword);
      if (!passwordValidation.valid) {
        throw new ValidationError(
          `Password validation failed: ${passwordValidation.errors.join(', ')}`
        );
      }

      // Ensure new password is different from current
      const isSameAsOld = await PasswordService.verify(newPassword, user.passwordHash);
      if (isSameAsOld) {
        throw new ValidationError('New password must be different from current password');
      }

      // Hash new password
      const hashedPassword = await PasswordService.hash(newPassword);

      // Update password
      await prisma.user.update({
        where: { id: userId },
        data: {
          passwordHash: hashedPassword,
        },
      });

      logger.info('Password changed successfully', { userId });

      return { message: 'Password has been changed successfully' };
    } catch (error: any) {
      if (
        error instanceof AuthenticationError ||
        error instanceof ValidationError ||
        error instanceof NotFoundError
      ) {
        throw error;
      }
      logger.error('Error changing password', { userId, error: error.message });
      throw error;
    }
  }
}
