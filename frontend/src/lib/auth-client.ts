import axios, { AxiosInstance } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export interface RegisterRequest {
  email: string;
  username: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    username: string;
    firstName?: string;
    lastName?: string;
    role: { id: number; name: string };
  };
  tokens: {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
  };
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

class AuthClient {
  private client: AxiosInstance;
  private accessToken: string | null = null;
  private refreshToken: string | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Load tokens from localStorage
    this.loadTokens();

    // Add request interceptor to attach token
    this.client.interceptors.request.use((config) => {
      if (this.accessToken) {
        config.headers.Authorization = `Bearer ${this.accessToken}`;
      }
      return config;
    });

    // Add response interceptor to handle 401
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401 && this.refreshToken) {
          try {
            const newTokens = await this.refreshTokens();
            this.saveTokens(newTokens);
            // Retry original request
            const config = error.config;
            config.headers.Authorization = `Bearer ${newTokens.accessToken}`;
            return this.client(config);
          } catch (refreshError) {
            this.clearTokens();
            throw refreshError;
          }
        }
        throw error;
      }
    );
  }

  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await this.client.post<AuthResponse>('/auth/register', data);
    this.saveTokens(response.data.tokens);
    return response.data;
  }

  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await this.client.post<AuthResponse>('/auth/login', data);
    this.saveTokens(response.data.tokens);
    return response.data;
  }

  async logout(): Promise<void> {
    try {
      await this.client.post('/auth/logout');
    } finally {
      this.clearTokens();
    }
  }

  async refreshTokens(): Promise<TokenResponse> {
    if (!this.refreshToken) {
      throw new Error('No refresh token available');
    }
    const response = await this.client.post<TokenResponse>('/auth/refresh', {
      refreshToken: this.refreshToken,
    });
    return response.data;
  }

  private saveTokens(tokens: TokenResponse): void {
    this.accessToken = tokens.accessToken;
    this.refreshToken = tokens.refreshToken;
    if (typeof window !== 'undefined') {
      localStorage.setItem('accessToken', tokens.accessToken);
      localStorage.setItem('refreshToken', tokens.refreshToken);
      localStorage.setItem('tokenExpiry', (Date.now() + tokens.expiresIn * 1000).toString());
    }
  }

  private loadTokens(): void {
    if (typeof window !== 'undefined') {
      this.accessToken = localStorage.getItem('accessToken');
      this.refreshToken = localStorage.getItem('refreshToken');
    }
  }

  private clearTokens(): void {
    this.accessToken = null;
    this.refreshToken = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('tokenExpiry');
      localStorage.removeItem('user');
    }
  }

  getAccessToken(): string | null {
    return this.accessToken;
  }

  isAuthenticated(): boolean {
    return !!this.accessToken;
  }
}

export const authClient = new AuthClient();
