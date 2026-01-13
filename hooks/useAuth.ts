"use client"

import { useEffect } from "react"
import { authService } from "@/services/authService"
import { authStore } from "@/lib/stores/auth-store"
import type { LoginCredentials, LoginResponse } from "@/types/auth"

export function useAuth() {
  const { user, tokens, isAuthenticated, isLoading, isInitialized } = authStore();

  useEffect(() => {
    // Solo verificar auth si no está inicializado
    if (!isInitialized) {
      checkAuth();
    }
  }, [isInitialized]);

  const checkAuth = async () => {
    authStore.getState().setLoading(true);
    try {
      const currentUser = await authService.getCurrentUser();
      if (currentUser) {
        // El usuario está autenticado, authService ya actualizó el store
      } else {
        authStore.getState().logout();
      }
    } catch (err) {
      console.error("Error al verificar autenticación:", err);
      authStore.getState().logout();
    } finally {
      authStore.getState().setLoading(false);
      authStore.getState().setInitialized(true);
    }
  };

  const login = async (credentials: LoginCredentials): Promise<LoginResponse> => {
    authStore.getState().setLoading(true);
    try {
      const response = await authService.login(credentials);
      authStore.getState().setInitialized(true);
      return response;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error al iniciar sesión";
      throw new Error(message);
    } finally {
      authStore.getState().setLoading(false);
    }
  };

  const mockLogin = async (credentials: LoginCredentials): Promise<LoginResponse> => {
    authStore.getState().setLoading(true);
    try {
      const response = await authService.mockLogin(credentials);
      authStore.getState().setInitialized(true);
      return response;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error al iniciar sesión mock";
      throw new Error(message);
    } finally {
      authStore.getState().setLoading(false);
    }
  };

  const logout = async () => {
    authStore.getState().setLoading(true);
    try {
      await authService.logout();
    } catch (err) {
      console.error("Error al cerrar sesión:", err);
      authStore.getState().logout();
    } finally {
      authStore.getState().setLoading(false);
    }
  };

  const recoverPassword = async (email: string) => {
    try {
      await authService.recoverPassword(email);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error al recuperar contraseña";
      throw new Error(message);
    }
  };

  const resetPassword = async (token: string, newPassword: string) => {
    try {
      await authService.resetPassword(token, newPassword);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error al restablecer contraseña";
      throw new Error(message);
    }
  };

  const updateProfile = async (userData: Partial<NonNullable<typeof user>>) => {
    if (!user) {
      throw new Error("No hay usuario autenticado");
    }
    
    try {
      const updatedUser = await authService.updateProfile(userData);
      return updatedUser;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error al actualizar perfil";
      throw new Error(message);
    }
  };

  const refreshTokens = async () => {
    try {
      const newTokens = await authService.refreshTokens();
      return newTokens;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error al refrescar tokens";
      throw new Error(message);
    }
  };

  return {
    // State
    user,
    tokens,
    isAuthenticated,
    isLoading,
    isInitialized,
    
    // Actions
    login,
    mockLogin,
    logout,
    checkAuth,
    recoverPassword,
    resetPassword,
    updateProfile,
    refreshTokens,
    
    // Convenience
    hasRole: (role: string) => user?.rol === role,
    hasAnyRole: (roles: string[]) => roles.includes(user?.rol || ""),
  };
}