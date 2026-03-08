"use client"

import { useState, useCallback } from 'react';
import { estrategiasComunicacionService } from '@/services/estrategiasComunicacionService';
import type { EstadisticasEstrategiasComunicacion } from '@/types/estrategias-comunicacion';
import { useNotifications } from './useNotifications';

export function useEstrategiasComunicacionStats() {
  const [estadisticas, setEstadisticas] = useState<EstadisticasEstrategiasComunicacion | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);


  const fetchEstadisticas = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await estrategiasComunicacionService.getEstadisticasTotal();
      setEstadisticas(data);
      return data;
    } catch (err) {
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // State
    estadisticas,
    isLoading,
    error,
    
    // Actions
    fetchEstadisticas,
    clearError,
    
    // Convenience
    hasEstadisticas: estadisticas !== null,
    getNoticiasActivas: () => estadisticas?.noticiasActivas ?? 0,
    getRedesSocialesActivas: () => estadisticas?.redesSocialesActivas ?? 0,
    getTotalElementos: () => (estadisticas?.noticiasActivas ?? 0) + (estadisticas?.redesSocialesActivas ?? 0),
  };
}