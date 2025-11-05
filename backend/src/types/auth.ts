// Authentication types and interfaces

export interface JWTPayload {
  userId: string;
  email: string;
  username: string;
  roleId: number;
  branchId?: number;
  iat?: number;
  exp?: number;
}

export interface AuthRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  username: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    accessToken: string;
    refreshToken: string;
    user: {
      id: string;
      email: string;
      username: string;
      firstName?: string;
      lastName?: string;
      role: {
        id: number;
        name: string;
      };
    };
  };
  error?: string;
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface TokenValidation {
  valid: boolean;
  payload?: JWTPayload;
  error?: string;
}
