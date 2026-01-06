import { apiClient } from '@/lib/api/axios-client';
import { authStore, tokenHelper } from '@/lib/stores/auth-store';
import type { LoginCredentials, LoginResponse, User, AuthTokens, ApiLoginResponse } from '@/types/auth';
import { authHelpers } from '@/types/auth';

export const authService = {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      // Call actual API endpoint - expecting ApiLoginResponse format
      const apiResponse = await apiClient.post<ApiLoginResponse>('/auth/login', credentials);
      
      // Convert API response to frontend format
      const response = authHelpers.apiResponseToLoginResponse(apiResponse);
      
      // Update auth store
      authStore.getState().login(response.user, response.tokens);
      
      // Save tokens to localStorage via helper
      tokenHelper.saveTokens(response.tokens);
      
      return response;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  },

  async logout(): Promise<void> {
    try {
      // Call logout endpoint if available
      await apiClient.post('/auth/logout', {});
    } catch (error) {
      console.warn('Logout API call failed:', error);
    } finally {
      // Clear store and localStorage
      authStore.getState().logout();
      
      if (typeof window !== 'undefined') {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('token_expiry');
      }
    }
  },

  async recoverPassword(email: string): Promise<void> {
    return apiClient.post('/auth/recover-password', { email });
  },

  async resetPassword(token: string, newPassword: string): Promise<void> {
    return apiClient.post('/auth/reset-password', { token, newPassword });
  },

  async getCurrentUser(): Promise<User | null> {
    try {
      // Try to get user from store first
      const currentUser = authStore.getState().user;
      if (currentUser) {
        return currentUser;
      }

      // If not in store, try to fetch from API
      const user = await apiClient.get<User>('/auth/me');
      if (user) {
        authStore.getState().setUser(user);
      }
      return user;
    } catch (error) {
      console.error('Failed to get current user:', error);
      return null;
    }
  },

  async refreshTokens(): Promise<AuthTokens | null> {
    try {
      const refreshToken = authStore.getState().getRefreshToken();
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const tokens = await apiClient.post<AuthTokens>('/auth/refresh', { refreshToken });
      authStore.getState().setTokens(tokens);
      
      // Update localStorage
      tokenHelper.saveTokens(tokens);
      
      return tokens;
    } catch (error) {
      console.error('Failed to refresh tokens:', error);
      authStore.getState().logout();
      return null;
    }
  },

  async updateProfile(userData: Partial<User>): Promise<User> {
    const user = await apiClient.put<User>('/auth/profile', userData);
    authStore.getState().setUser(user);
    return user;
  },

  // Mock implementation for development (to be removed in production)
  async mockLogin(credentials: LoginCredentials): Promise<LoginResponse> {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const mockUser: User = {
      id: "1",
      nombre: "Juan Pérez García",
      email: credentials.email,
      apodo: "jperez",
      rol: "Admin",
      area: "Secretaría de Administración y Finanzas",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      roles: ['ADMIN'],
      permissions: ['USUARIO_REGISTRAR', 'DOCUMENTO_CARGAR', 'DOCUMENTO_EDITAR'],
    };

    // Create expiry 30 minutes from now
    const expiryDate = new Date(Date.now() + 30 * 60 * 1000);

    const mockTokens: AuthTokens = {
      accessToken: "mock-jwt-access-token-12345",
      refreshToken: "mock-jwt-refresh-token-67890",
      expiresIn: expiryDate.toISOString(), // ISO string
    };

    authStore.getState().login(mockUser, mockTokens);
    tokenHelper.saveTokens(mockTokens);

    return {
      user: mockUser,
      tokens: mockTokens,
    };
  },
};
