import { JWTService } from '../../utils/jwt';
import { JWTPayload } from '../../types/auth';

describe('JWTService', () => {
  const testPayload: JWTPayload = {
    userId: '123',
    email: 'test@example.com',
    username: 'testuser',
    roleId: 1,
  };

  describe('generateAccessToken', () => {
    it('should generate a valid access token', () => {
      const token = JWTService.generateAccessToken(testPayload);
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3); // JWT format: header.payload.signature
    });

    it('should create token with correct payload data', () => {
      const token = JWTService.generateAccessToken(testPayload);
      const validation = JWTService.verifyAccessToken(token);
      expect(validation.valid).toBe(true);
      expect(validation.payload?.userId).toBe(testPayload.userId);
      expect(validation.payload?.email).toBe(testPayload.email);
    });
  });

  describe('generateRefreshToken', () => {
    it('should generate a valid refresh token', () => {
      const token = JWTService.generateRefreshToken(testPayload);
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
    });

    it('should create refresh token verifiable with refreshToken method', () => {
      const token = JWTService.generateRefreshToken(testPayload);
      const validation = JWTService.verifyRefreshToken(token);
      expect(validation.valid).toBe(true);
      expect(validation.payload?.userId).toBe(testPayload.userId);
    });
  });

  describe('verifyAccessToken', () => {
    it('should verify a valid access token', () => {
      const token = JWTService.generateAccessToken(testPayload);
      const validation = JWTService.verifyAccessToken(token);
      expect(validation.valid).toBe(true);
      expect(validation.payload).toBeDefined();
    });

    it('should reject an invalid token', () => {
      const validation = JWTService.verifyAccessToken('invalid.token.here');
      expect(validation.valid).toBe(false);
      expect(validation.error).toBeDefined();
    });

    it('should reject a refresh token when verifying as access token', () => {
      const refreshToken = JWTService.generateRefreshToken(testPayload);
      const validation = JWTService.verifyAccessToken(refreshToken);
      // Different secrets mean verification fails
      expect(validation.valid).toBe(false);
    });
  });

  describe('verifyRefreshToken', () => {
    it('should verify a valid refresh token', () => {
      const token = JWTService.generateRefreshToken(testPayload);
      const validation = JWTService.verifyRefreshToken(token);
      expect(validation.valid).toBe(true);
    });

    it('should reject an invalid refresh token', () => {
      const validation = JWTService.verifyRefreshToken('not.a.token');
      expect(validation.valid).toBe(false);
    });
  });

  describe('decodeToken', () => {
    it('should decode a token without verification', () => {
      const token = JWTService.generateAccessToken(testPayload);
      const decoded = JWTService.decodeToken(token);
      expect(decoded).toBeDefined();
      expect(decoded?.userId).toBe(testPayload.userId);
    });

    it('should return null for invalid tokens', () => {
      const decoded = JWTService.decodeToken('invalid');
      expect(decoded).toBeNull();
    });
  });

  describe('extractTokenFromHeader', () => {
    it('should extract token from valid Bearer header', () => {
      const token = 'test.token.here';
      const header = `Bearer ${token}`;
      const extracted = JWTService.extractTokenFromHeader(header);
      expect(extracted).toBe(token);
    });

    it('should return null for missing header', () => {
      const extracted = JWTService.extractTokenFromHeader();
      expect(extracted).toBeNull();
    });

    it('should return null for non-Bearer header', () => {
      const extracted = JWTService.extractTokenFromHeader('Basic abc123');
      expect(extracted).toBeNull();
    });

    it('should return null for malformed Bearer header', () => {
      const extracted = JWTService.extractTokenFromHeader('Bearer');
      expect(extracted).toBeNull();
    });
  });
});
