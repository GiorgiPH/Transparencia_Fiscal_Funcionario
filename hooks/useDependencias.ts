"use client"

import { useState, useCallback } from 'react'
import { DependenciaService } from '@/services/dependenciaService'
import type { Dependencia, TipoDependencia, DependenciaTree, DependenciasByLevel, DependenciaStats } from '@/types/dependencia'
import { useNotifications } from './useNotifications'

export function useDependencias() {
  const [dependencias, setDependencias] = useState<Dependencia[]>([])
  const [dependenciasTree, setDependenciasTree] = useState<DependenciaTree | null>(null)
  const [dependenciasByLevel, setDependenciasByLevel] = useState<DependenciasByLevel | null>(null)
  const [tiposDependencia, setTiposDependencia] = useState<TipoDependencia[]>([])
  const [estadisticas, setEstadisticas] = useState<DependenciaStats | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const notifications = useNotifications()

  /**
   * Obtener todas las dependencias
   */
  const fetchAllDependencias = useCallback(async (): Promise<Dependencia[]> => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await DependenciaService.getAllDependencias()
      setDependencias(data)
      return data
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al cargar dependencias'
      setError(message)
      notifications.showError('Error al cargar dependencias', { description: message })
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [notifications])

  /**
   * Obtener dependencias por nivel
   */
  const fetchDependenciasByNivel = useCallback(async (nivel: number): Promise<Dependencia[]> => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await DependenciaService.getDependenciasByNivel(nivel)
      return data
    } catch (err) {
      const message = err instanceof Error ? err.message : `Error al cargar dependencias del nivel ${nivel}`
      setError(message)
      notifications.showError(`Error al cargar dependencias del nivel ${nivel}`, { description: message })
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [notifications])

  /**
   * Obtener dependencias para selección de usuario (tercer nivel)
   */
  const fetchDependenciasForUserSelection = useCallback(async (): Promise<Dependencia[]> => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await DependenciaService.getDependenciasForUserSelection()
      return data
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al cargar dependencias para selección'
      setError(message)
      notifications.showError('Error al cargar dependencias', { description: message })
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [notifications])

  /**
   * Obtener una dependencia por ID
   */
  const fetchDependenciaById = useCallback(async (id: number): Promise<Dependencia> => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await DependenciaService.getDependenciaById(id)
      return data
    } catch (err) {
      const message = err instanceof Error ? err.message : `Error al cargar dependencia con ID ${id}`
      setError(message)
      notifications.showError('Error al cargar dependencia', { description: message })
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [notifications])



  /**
   * Obtener todos los tipos de dependencia
   */
  const fetchTiposDependencia = useCallback(async (): Promise<TipoDependencia[]> => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await DependenciaService.getTiposDependencia()
      setTiposDependencia(data)
      return data
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al cargar tipos de dependencia'
      setError(message)
      notifications.showError('Error al cargar tipos de dependencia', { description: message })
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [notifications])

 


  /**
   * Limpiar errores
   */
  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return {
    // Estado
    dependencias,
    dependenciasTree,
    dependenciasByLevel,
    tiposDependencia,
    estadisticas,
    isLoading,
    error,
    
    // Acciones
    fetchAllDependencias,
    fetchDependenciasByNivel,
    fetchDependenciasForUserSelection,
    fetchDependenciaById,
    fetchTiposDependencia,
    clearError,
    
    // Conveniencia
    getDependenciaById: (id: number) => dependencias.find(d => d.id === id),
    hasDependencias: dependencias.length > 0,
  }
}