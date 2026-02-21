"use client"

import { useState, useCallback } from 'react';
import { estrategiasComunicacionService } from '@/services/estrategiasComunicacionService';
import type { Noticia, CreateNoticiaData, UpdateNoticiaData, NoticiasQueryParams } from '@/types/estrategias-comunicacion';
import { useCrudNotifications } from './useNotifications';

export function useNoticias() {
  const [noticias, setNoticias] = useState<Noticia[]>([]);
  const [currentNoticia, setCurrentNoticia] = useState<Noticia | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const notifications = useCrudNotifications("Noticia");

  const fetchNoticias = useCallback(async (params?: NoticiasQueryParams) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await estrategiasComunicacionService.getNoticias(params);
      setNoticias(data);
      notifications.showFetchSuccess();
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al cargar noticias';
      setError(message);
      notifications.showFetchError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [notifications]);

  const fetchNoticiaById = useCallback(async (id: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const noticia = await estrategiasComunicacionService.getNoticiaById(id);
      setCurrentNoticia(noticia);
      return noticia;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al cargar noticia';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createNoticia = useCallback(async (data: CreateNoticiaData, file?: File) => {
    setIsLoading(true);
    setError(null);
    try {
      const newNoticia = await estrategiasComunicacionService.createNoticia(data, file);
      setNoticias(prevNoticias => [...prevNoticias, newNoticia]);
      notifications.showCreateSuccess();
      return newNoticia;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al crear noticia';
      setError(message);
      notifications.showCreateError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [notifications]);

  const updateNoticia = useCallback(async (id: number, data: UpdateNoticiaData, file?: File) => {
    setIsLoading(true);
    setError(null);
    try {
      const updatedNoticia = await estrategiasComunicacionService.updateNoticia(id, data, file);
      
      // Update in noticias list if exists
      setNoticias(prevNoticias => 
        prevNoticias.map(noticia => 
          noticia.id === id ? updatedNoticia : noticia
        )
      );
      
      // Update current noticia if it's the same
      if (currentNoticia?.id === id) {
        setCurrentNoticia(updatedNoticia);
      }

      notifications.showUpdateSuccess();
      
      return updatedNoticia;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al actualizar noticia';
      setError(message);
      notifications.showUpdateError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [currentNoticia, notifications]);

  const toggleNoticiaActivo = useCallback(async (id: number, activo: boolean) => {
    setIsLoading(true);
    setError(null);
    try {
      const updatedNoticia = await estrategiasComunicacionService.toggleNoticiaActivo(id, activo);
      
      // Update in noticias list if exists
      setNoticias(prevNoticias => 
        prevNoticias.map(noticia => 
          noticia.id === id ? updatedNoticia : noticia
        )
      );
      
      // Update current noticia if it's the same
      if (currentNoticia?.id === id) {
        setCurrentNoticia(updatedNoticia);
      }

      notifications.showUpdateSuccess();
      
      return updatedNoticia;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al cambiar estado de noticia';
      setError(message);
      notifications.showUpdateError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [currentNoticia, notifications]);

  const deleteNoticia = useCallback(async (id: number) => {
    setIsLoading(true);
    setError(null);
    try {
      await estrategiasComunicacionService.deleteNoticia(id);
      
      // Remove noticia from list
      setNoticias(prevNoticias => 
        prevNoticias.filter(noticia => noticia.id !== id)
      );

      notifications.showDeleteSuccess();
      
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al eliminar noticia';
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
    noticias,
    currentNoticia,
    isLoading,
    error,
    
    // Actions
    fetchNoticias,
    fetchNoticiaById,
    createNoticia,
    updateNoticia,
    toggleNoticiaActivo,
    deleteNoticia,
    clearError,
    
    // Convenience
    getNoticiaById: (id: number) => noticias.find(noticia => noticia.id === id),
    hasNoticias: noticias.length > 0,
  };
}