import { PrismaClient } from '@prisma/client';
import { JWTPayload, AuthRequest, RegisterRequest, TokenResponse } from '../types/auth';
import { JWTService } from '../utils/jwt';
import { PasswordService } from '../utils/password';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

export class AuthService {
  /**
   * Register a new user
   */
  static async register(data: RegisterRequest): Promise<{ user: any; tokens: TokenResponse }> {
    // Validate input
    if (!data.email || !data.username || !data.password) {
      throw new Error('Missing required fields: email, username, password');
    }

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email: data.email }, { username: data.username }],
      },
    });

    if (existingUser) {
      throw new Error('User with this email or username already exists');
    }

    // Validate password strength
    const passwordValidation = PasswordService.validateStrength(data.password);
    if (!passwordValidation.valid) {
      throw new Error(`Password validation failed: ${passwordValidation.errors.join(', ')}`);
    }

    // Hash password
    const hashedPassword = await PasswordService.hash(data.password);

    // Get default role (BORROWER)
    let borrowerRole = await prisma.userRole.findUnique({
      where: { name: 'BORROWER' },
    });

    if (!borrowerRole) {
      borrowerRole = await prisma.userRole.create({
        data: {
          name: 'BORROWER',
          description: 'Default borrower role',
          permissions: ['view_own_loans', 'upload_documents', 'message_loan_officer'],
        },
      });
    }

    // Create user
    const user = await prisma.user.create({
      data: {
        email: data.email,
        username: data.username,
        passwordHash: hashedPassword,
        firstName: data.firstName,
        lastName: data.lastName,
        roleId: borrowerRole.id,
        status: 'active',
      },
      include: {
        role: true,
      },
    });

    // Generate tokens
    const jwtPayload: JWTPayload = {
      userId: user.id,
      email: user.email,
      username: user.username,
      roleId: user.roleId,
      role: user.role.name,
      branchId: user.branchId || undefined,
    };

    const accessToken = JWTService.generateAccessToken(jwtPayload);
    const refreshToken = JWTService.generateRefreshToken(jwtPayload);

    // Store refresh session on registration to support immediate refresh
    const tokenHash = await PasswordService.hash(refreshToken);
    await prisma.userSession.create({
      data: {
        userId: user.id,
        tokenHash,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
      tokens: {
        accessToken,
        refreshToken,
        expiresIn: 15 * 60, // 15 minutes in seconds
      },
    };
  }

  /**
   * Login user
   */
  static async login(data: AuthRequest): Promise<{ user: any; tokens: TokenResponse }> {
    if (!data.email || !data.password) {
      throw new Error('Missing required fields: email, password');
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: data.email },
      include: {
        role: true,
      },
    });

    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Check user status
    if (user.status !== 'active') {
      throw new Error('User account is not active');
    }

    // Verify password
    const isPasswordValid = await PasswordService.verify(data.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });

    // Generate tokens
    const jwtPayload: JWTPayload = {
      userId: user.id,
      email: user.email,
      username: user.username,
      roleId: user.roleId,
      role: user.role.name,
      branchId: user.branchId || undefined,
    };

    const accessToken = JWTService.generateAccessToken(jwtPayload);
    const refreshToken = JWTService.generateRefreshToken(jwtPayload);

    // Store refresh token in database
    const tokenHash = await PasswordService.hash(refreshToken);
    await prisma.userSession.create({
      data: {
        userId: user.id,
        tokenHash,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      },
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
      tokens: {
        accessToken,
        refreshToken,
        expiresIn: 15 * 60,
      },
    };
  }

  /**
   * Refresh access token
   */
  static async refreshToken(refreshToken: string): Promise<TokenResponse> {
    // Verify refresh token
    const validation = JWTService.verifyRefreshToken(refreshToken);
    if (!validation.valid || !validation.payload) {
      throw new Error('Invalid or expired refresh token');
    }

    // Find user session
    const session = await prisma.userSession.findFirst({
      where: {
        userId: validation.payload.userId,
        expiresAt: { gt: new Date() },
      },
    });

    if (!session) {
      throw new Error('Session not found or expired');
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { id: validation.payload.userId },
      include: { role: true },
    });

    if (!user || user.status !== 'active') {
      throw new Error('User not found or inactive');
    }

    // Generate new access token
    const jwtPayload: JWTPayload = {
      userId: user.id,
      email: user.email,
      username: user.username,
      roleId: user.roleId,
      role: user.role.name,
      branchId: user.branchId || undefined,
    };

    const newAccessToken = JWTService.generateAccessToken(jwtPayload);
    const newRefreshToken = JWTService.generateRefreshToken(jwtPayload);

    // Update session
    const newTokenHash = await PasswordService.hash(newRefreshToken);
    await prisma.userSession.update({
      where: { id: session.id },
      data: {
        tokenHash: newTokenHash,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      expiresIn: 15 * 60,
    };
  }

  /**
   * Logout user
   */
  static async logout(userId: string, _refreshToken: string): Promise<void> {
    await prisma.userSession.deleteMany({
      where: {
        userId,
      },
    });
  }

  /**
   * Verify token
   */
  static verifyToken(token: string): JWTPayload | null {
    const validation = JWTService.verifyAccessToken(token);
    return validation.valid ? validation.payload || null : null;
  }
}
