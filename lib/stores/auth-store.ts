import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, AuthTokens, AuthState } from '@/types/auth';

interface AuthStore extends AuthState {
  setUser: (user: User | null) => void;
  setTokens: (tokens: AuthTokens | null) => void;
  setLoading: (isLoading: boolean) => void;
  login: (user: User, tokens: AuthTokens) => void;
  logout: () => void;
  getAccessToken: () => string | null;
  getRefreshToken: () => string | null;
  isTokenExpired: () => boolean;
}

export const authStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      tokens: null,
      isAuthenticated: false,
      isLoading: false,

      setUser: (user) => set({ user, isAuthenticated: !!user }),

      setTokens: (tokens) => set({ tokens }),

      setLoading: (isLoading) => set({ isLoading }),

      login: (user, tokens) => 
        set({ 
          user, 
          tokens, 
          isAuthenticated: true,
          isLoading: false 
        }),

      logout: () => 
        set({ 
          user: null, 
          tokens: null, 
          isAuthenticated: false,
          isLoading: false 
        }),

      getAccessToken: () => get().tokens?.accessToken || null,

      getRefreshToken: () => get().tokens?.refreshToken || null,

      isTokenExpired: () => {
        const tokens = get().tokens;
        if (!tokens) return true;
        
        // Check if token is expired (simplified - in real app, decode JWT)
        // For now, we'll assume tokens expire after expiresIn seconds
        // This is a placeholder implementation
        return false;
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        tokens: state.tokens,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// Helper functions for token management
export const tokenHelper = {
  saveTokens: (tokens: AuthTokens) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('access_token', tokens.accessToken);
      localStorage.setItem('refresh_token', tokens.refreshToken);
      // expiresIn is ISO string, store as timestamp
      const expiryDate = new Date(tokens.expiresIn).getTime();
      localStorage.setItem('token_expiry', expiryDate.toString());
    }
  },

  clearTokens: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('token_expiry');
    }
  },

  getStoredAccessToken: () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('access_token');
    }
    return null;
  },

  getStoredRefreshToken: () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('refresh_token');
    }
    return null;
  },
};
