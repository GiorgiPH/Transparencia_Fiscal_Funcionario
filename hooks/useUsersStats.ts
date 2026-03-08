"use client"

import { useState, useCallback } from 'react';
import { userService } from '@/services/userService';
import { useNotifications } from './useNotifications';

export interface UsersStats {
  totalUsuariosActivos: number;
  totalUsuariosInactivos: number;
  totalUsuariosAdmin: number;
  totalUsuariosCarga: number;
  totalUsuariosEdicion: number;
  totalUsuariosCon2FA: number;
  totalUsuariosConFotoPerfil: number;
  totalUsuariosConDependencia: number;
  totalUsuariosUltimoMes: number;
}

export function useUsersStats() {
  const [stats, setStats] = useState<UsersStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const notifications = useNotifications();

  const fetchStats = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await userService.getUsersStats();
      setStats(data);
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al cargar estadísticas de usuarios';
      setError(message);
      notifications.showError('Error al cargar estadísticas', { description: message });
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [notifications]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // State
    stats,
    isLoading,
    error,
    
    // Actions
    fetchStats,
    clearError,
    
    // Convenience
    hasStats: stats !== null,
    totalUsuarios: stats ? stats.totalUsuariosActivos + stats.totalUsuariosInactivos : 0,
  };
}