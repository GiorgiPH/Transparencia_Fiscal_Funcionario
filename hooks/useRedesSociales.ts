"use client"

import { useState, useCallback } from 'react';
import { estrategiasComunicacionService } from '@/services/estrategiasComunicacionService';
import type { RedSocial, CreateRedSocialData, UpdateRedSocialData, RedesSocialesQueryParams } from '@/types/estrategias-comunicacion';
import { useCrudNotifications } from './useNotifications';

export function useRedesSociales() {
  const [redesSociales, setRedesSociales] = useState<RedSocial[]>([]);
  const [currentRedSocial, setCurrentRedSocial] = useState<RedSocial | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const notifications = useCrudNotifications("Red Social");

  const fetchRedesSociales = useCallback(async (params?: RedesSocialesQueryParams) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await estrategiasComunicacionService.getRedesSociales(params);
      setRedesSociales(data);
      notifications.showFetchSuccess();
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al cargar redes sociales';
      setError(message);
      notifications.showFetchError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [notifications]);

  const fetchRedSocialById = useCallback(async (id: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const redSocial = await estrategiasComunicacionService.getRedSocialById(id);
      setCurrentRedSocial(redSocial);
      return redSocial;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al cargar red social';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createRedSocial = useCallback(async (data: CreateRedSocialData) => {
    setIsLoading(true);
    setError(null);
    try {
      const newRedSocial = await estrategiasComunicacionService.createRedSocial(data);
      setRedesSociales(prevRedesSociales => [...prevRedesSociales, newRedSocial]);
      notifications.showCreateSuccess();
      return newRedSocial;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al crear red social';
      setError(message);
      notifications.showCreateError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [notifications]);

  const updateRedSocial = useCallback(async (id: number, data: UpdateRedSocialData) => {
    setIsLoading(true);
    setError(null);
    try {
      const updatedRedSocial = await estrategiasComunicacionService.updateRedSocial(id, data);
      
      // Update in redes sociales list if exists
      setRedesSociales(prevRedesSociales => 
        prevRedesSociales.map(redSocial => 
          redSocial.id === id ? updatedRedSocial : redSocial
        )
      );
      
      // Update current red social if it's the same
      if (currentRedSocial?.id === id) {
        setCurrentRedSocial(updatedRedSocial);
      }

      notifications.showUpdateSuccess();
      
      return updatedRedSocial;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al actualizar red social';
      setError(message);
      notifications.showUpdateError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [currentRedSocial, notifications]);

  const toggleRedSocialActivo = useCallback(async (id: number, activo: boolean) => {
    setIsLoading(true);
    setError(null);
    try {
      const updatedRedSocial = await estrategiasComunicacionService.toggleRedSocialActivo(id, activo);
      
      // Update in redes sociales list if exists
      setRedesSociales(prevRedesSociales => 
        prevRedesSociales.map(redSocial => 
          redSocial.id === id ? updatedRedSocial : redSocial
        )
      );
      
      // Update current red social if it's the same
      if (currentRedSocial?.id === id) {
        setCurrentRedSocial(updatedRedSocial);
      }

      notifications.showUpdateSuccess();
      
      return updatedRedSocial;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al cambiar estado de red social';
      setError(message);
      notifications.showUpdateError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [currentRedSocial, notifications]);

  const deleteRedSocial = useCallback(async (id: number) => {
    setIsLoading(true);
    setError(null);
    try {
      await estrategiasComunicacionService.deleteRedSocial(id);
      
      // Remove red social from list
      setRedesSociales(prevRedesSociales => 
        prevRedesSociales.filter(redSocial => redSocial.id !== id)
      );

      notifications.showDeleteSuccess();
      
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al eliminar red social';
      setError(message);
      notifications.showDeleteError(message);
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
    redesSociales,
    currentRedSocial,
    isLoading,
    error,
    
    // Actions
    fetchRedesSociales,
    fetchRedSocialById,
    createRedSocial,
    updateRedSocial,
    toggleRedSocialActivo,
    deleteRedSocial,
    clearError,
    
    // Convenience
    getRedSocialById: (id: number) => redesSociales.find(redSocial => redSocial.id === id),
    hasRedesSociales: redesSociales.length > 0,
  };
}