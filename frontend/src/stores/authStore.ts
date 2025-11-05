import { create } from 'zustand';
import { authClient, RegisterRequest, LoginRequest, AuthResponse } from '@/lib/auth-client';

export interface User {
  id: string;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  role: { id: number; name: string };
}

export interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  accessToken: string | null;
  refreshToken: string | null;

  // Actions
  register: (data: RegisterRequest) => Promise<AuthResponse>;
  login: (data: LoginRequest) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  clearError: () => void;
  setUser: (user: User | null) => void;
  hydrateFromStorage: () => void;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  accessToken: null,
  refreshToken: null,

  register: async (data: RegisterRequest) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authClient.register(data);
      set({
        user: response.user,
        isAuthenticated: true,
        accessToken: response.tokens.accessToken,
        refreshToken: response.tokens.refreshToken,
        isLoading: false,
      });
      if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(response.user));
      }
      return response;
    } catch (err: any) {
      const error = err.response?.data?.error || 'Registration failed';
      set({ error, isLoading: false });
      throw err;
    }
  },

  login: async (data: LoginRequest) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authClient.login(data);
      set({
        user: response.user,
        isAuthenticated: true,
        accessToken: response.tokens.accessToken,
        refreshToken: response.tokens.refreshToken,
        isLoading: false,
      });
      if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(response.user));
      }
      return response;
    } catch (err: any) {
      const error = err.response?.data?.error || 'Login failed';
      set({ error, isLoading: false });
      throw err;
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await authClient.logout();
      set({
        user: null,
        isAuthenticated: false,
        accessToken: null,
        refreshToken: null,
        isLoading: false,
        error: null,
      });
    } catch (err: any) {
      set({ isLoading: false });
      throw err;
    }
  },

  clearError: () => set({ error: null }),

  setUser: (user: User | null) =>
    set({
      user,
      isAuthenticated: !!user,
    }),

  hydrateFromStorage: () => {
    if (typeof window === 'undefined') return;
    
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    const userStr = localStorage.getItem('user');
    
    if (accessToken && userStr) {
      try {
        const user = JSON.parse(userStr);
        set({
          user,
          isAuthenticated: true,
          accessToken,
          refreshToken,
        });
      } catch (err) {
        localStorage.removeItem('user');
      }
    }
  },
}));
