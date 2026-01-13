import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, AuthTokens, AuthState } from '@/types/auth';

interface AuthStore extends AuthState {
  isInitialized: boolean; // NUEVO ESTADO
  setUser: (user: User | null) => void;
  setTokens: (tokens: AuthTokens | null) => void;
  setLoading: (isLoading: boolean) => void;
  setInitialized: (isInitialized: boolean) => void; // NUEVA ACCIÓN
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
      isLoading: false, // ← CAMBIO: iniciar en false
      isInitialized: false, // ← NUEVO: iniciar en false

      setUser: (user) => set({ user, isAuthenticated: !!user }),

      setTokens: (tokens) => set({ tokens }),

      setLoading: (isLoading) => set({ isLoading }),

      setInitialized: (isInitialized) => set({ isInitialized }),

      login: (user, tokens) => {
        // Guardar tokens en localStorage también
        tokenHelper.saveTokens(tokens);
        
        set({ 
          user, 
          tokens, 
          isAuthenticated: true,
          isLoading: false,
          isInitialized: true // ← NUEVO: marcar como inicializado
        });
      },

      logout: () => {
        // Limpiar tokens de localStorage
        tokenHelper.clearTokens();
        
        set({ 
          user: null, 
          tokens: null, 
          isAuthenticated: false,
          isLoading: false,
          isInitialized: true // ← NUEVO: mantener inicializado
        });
      },

      getAccessToken: () => get().tokens?.accessToken || null,

      getRefreshToken: () => get().tokens?.refreshToken || null,

      isTokenExpired: () => {
        if (typeof window === 'undefined') return true;
        
        const expiryTimestamp = localStorage.getItem('token_expiry');
        if (!expiryTimestamp) return true;
        
        const expiryDate = parseInt(expiryTimestamp, 10);
        const now = Date.now();
        
        // Token expirado si la fecha actual es mayor a la de expiración
        return now >= expiryDate;
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        tokens: state.tokens,
        isAuthenticated: state.isAuthenticated,
        // NO persistir isLoading ni isInitialized
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

  isTokenExpired: () => {
    if (typeof window === 'undefined') return true;
    
    const expiryTimestamp = localStorage.getItem('token_expiry');
    if (!expiryTimestamp) return true;
    
    const expiryDate = parseInt(expiryTimestamp, 10);
    const now = Date.now();
    
    return now >= expiryDate;
  },
};