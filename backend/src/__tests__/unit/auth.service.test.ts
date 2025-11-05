import { AuthService } from '../../services/authService';
import { cleanupTestDb, setupTestDb, closeTestDb } from '../helpers/test-db';

describe('AuthService', () => {
  beforeAll(() => {
    setupTestDb();
  });

  beforeEach(async () => {
    await cleanupTestDb();
  });

  afterAll(async () => {
    await closeTestDb();
  });

  describe('register', () => {
    it('should successfully register a new user', async () => {
      const result = await AuthService.register({
        email: 'newuser@example.com',
        username: 'newuser',
        password: 'SecurePass123!',
      });

      expect(result.user).toBeDefined();
      expect(result.user.email).toBe('newuser@example.com');
      expect(result.user.username).toBe('newuser');
      expect(result.tokens).toBeDefined();
      expect(result.tokens.accessToken).toBeDefined();
      expect(result.tokens.refreshToken).toBeDefined();
    });

    it('should reject duplicate email', async () => {
      await AuthService.register({
        email: 'test@example.com',
        username: 'user1',
        password: 'SecurePass123!',
      });

      await expect(
        AuthService.register({
          email: 'test@example.com',
          username: 'user2',
          password: 'SecurePass123!',
        })
      ).rejects.toThrow('already exists');
    });

    it('should reject duplicate username', async () => {
      await AuthService.register({
        email: 'user1@example.com',
        username: 'sameuser',
        password: 'SecurePass123!',
      });

      await expect(
        AuthService.register({
          email: 'user2@example.com',
          username: 'sameuser',
          password: 'SecurePass123!',
        })
      ).rejects.toThrow('already exists');
    });

    it('should reject weak password', async () => {
      await expect(
        AuthService.register({
          email: 'test@example.com',
          username: 'testuser',
          password: 'weak',
        })
      ).rejects.toThrow('Password validation failed');
    });

    it('should reject missing required fields', async () => {
      await expect(
        AuthService.register({
          email: '',
          username: 'testuser',
          password: 'SecurePass123!',
        })
      ).rejects.toThrow('Missing required fields');
    });
  });

  describe('login', () => {
    beforeEach(async () => {
      await AuthService.register({
        email: 'existing@example.com',
        username: 'existing',
        password: 'SecurePass123!',
      });
    });

    it('should successfully login user', async () => {
      const result = await AuthService.login({
        email: 'existing@example.com',
        password: 'SecurePass123!',
      });

      expect(result.user).toBeDefined();
      expect(result.user.email).toBe('existing@example.com');
      expect(result.tokens.accessToken).toBeDefined();
      expect(result.tokens.refreshToken).toBeDefined();
    });

    it('should reject invalid password', async () => {
      await expect(
        AuthService.login({
          email: 'existing@example.com',
          password: 'WrongPassword123!',
        })
      ).rejects.toThrow('Invalid email or password');
    });

    it('should reject non-existent user', async () => {
      await expect(
        AuthService.login({
          email: 'nonexistent@example.com',
          password: 'SecurePass123!',
        })
      ).rejects.toThrow('Invalid email or password');
    });

    it('should reject missing credentials', async () => {
      await expect(
        AuthService.login({
          email: 'existing@example.com',
          password: '',
        })
      ).rejects.toThrow('Missing required fields');
    });
  });

  describe('refreshToken', () => {
    let refreshToken: string;

    beforeEach(async () => {
      const result = await AuthService.register({
        email: 'test@example.com',
        username: 'testuser',
        password: 'SecurePass123!',
      });
      refreshToken = result.tokens.refreshToken;
    });

    it('should generate new access token from refresh token', async () => {
      const result = await AuthService.refreshToken(refreshToken);

      expect(result.accessToken).toBeDefined();
      expect(result.refreshToken).toBeDefined();
      expect(result.expiresIn).toBe(15 * 60);
    });

    it('should reject invalid refresh token', async () => {
      await expect(
        AuthService.refreshToken('invalid.token.here')
      ).rejects.toThrow('Invalid or expired refresh token');
    });
  });

  describe('logout', () => {
    let userId: string;

    beforeEach(async () => {
      const result = await AuthService.register({
        email: 'test@example.com',
        username: 'testuser',
        password: 'SecurePass123!',
      });
      userId = result.user.id;
    });

    it('should successfully logout user', async () => {
      await expect(
        AuthService.logout(userId, '')
      ).resolves.not.toThrow();
    });
  });

  describe('verifyToken', () => {
    it('should verify a valid token', async () => {
      const result = await AuthService.register({
        email: 'test@example.com',
        username: 'testuser',
        password: 'SecurePass123!',
      });

      const verified = AuthService.verifyToken(result.tokens.accessToken);
      expect(verified).toBeDefined();
      expect(verified?.userId).toBe(result.user.id);
    });

    it('should return null for invalid token', () => {
      const verified = AuthService.verifyToken('invalid.token');
      expect(verified).toBeNull();
    });
  });
});
