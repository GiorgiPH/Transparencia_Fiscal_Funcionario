import { apiClient } from '@/lib/api/axios-client'
import type { Dependencia, TipoDependencia, DependenciaTree, DependenciasByLevel, DependenciaStats } from '@/types/dependencia'

export class DependenciaService {
  /**
   * Obtener todas las dependencias
   */
  static async getAllDependencias(): Promise<Dependencia[]> {
    try {
      return await apiClient.get<Dependencia[]>('/admin/dependencias')
    } catch (error) {
      console.error('Error al obtener dependencias:', error)
      throw error
    }
  }

  /**
   * Obtener dependencias por nivel
   * @param nivel Nivel de dependencia (1, 2, 3)
   */
  static async getDependenciasByNivel(nivel: number): Promise<Dependencia[]> {
    try {
      return await apiClient.get<Dependencia[]>(`/admin/dependencias/nivel/${nivel}`)
    } catch (error) {
      console.error(`Error al obtener dependencias del nivel ${nivel}:`, error)
      throw error
    }
  }

  /**
   * Obtener dependencias del tercer nivel para selección de usuario
   */
  static async getDependenciasForUserSelection(): Promise<Dependencia[]> {
    try {
      return await apiClient.get<Dependencia[]>('/admin/dependencias/seleccion/usuario')
    } catch (error) {
      console.error('Error al obtener dependencias para selección de usuario:', error)
      throw error
    }
  }

  /**
   * Obtener una dependencia por ID
   */
  static async getDependenciaById(id: number): Promise<Dependencia> {
    try {
      return await apiClient.get<Dependencia>(`/admin/dependencias/${id}`)
    } catch (error) {
      console.error(`Error al obtener dependencia con ID ${id}:`, error)
      throw error
    }
  }

  /**
   * Obtener estructura de dependencias en árbol
   */
  static async getDependenciasTree(): Promise<DependenciaTree> {
    try {
      return await apiClient.get<DependenciaTree>('/admin/dependencias/arbol/estructura')
    } catch (error) {
      console.error('Error al obtener estructura de dependencias:', error)
      throw error
    }
  }

  /**
   * Obtener todos los tipos de dependencia
   */
  static async getTiposDependencia(): Promise<TipoDependencia[]> {
    try {
      return await apiClient.get<TipoDependencia[]>('/admin/dependencias/tipos')
    } catch (error) {
      console.error('Error al obtener tipos de dependencia:', error)
      throw error
    }
  }

  /**
   * Obtener dependencias agrupadas por nivel
   */
  static async getDependenciasByLevel(): Promise<DependenciasByLevel> {
    try {
      return await apiClient.get<DependenciasByLevel>('/admin/dependencias/niveles/todos')
    } catch (error) {
      console.error('Error al obtener dependencias por nivel:', error)
      throw error
    }
  }

  /**
   * Obtener estadísticas de dependencias
   */
  static async getDependenciasStats(): Promise<DependenciaStats> {
    try {
      return await apiClient.get<DependenciaStats>('/admin/dependencias/estadisticas/conteo')
    } catch (error) {
      console.error('Error al obtener estadísticas de dependencias:', error)
      throw error
    }
  }

  /**
   * Validar si una dependencia existe
   */
  static async validateDependenciaExists(id: number): Promise<boolean> {
    try {
      const response = await apiClient.get<{ existe: boolean }>(`/admin/dependencias/validar/existe/${id}`)
      return response.existe
    } catch (error) {
      console.error(`Error al validar dependencia con ID ${id}:`, error)
      return false
    }
  }

  /**
   * Obtener dependencias con ruta completa
   */
  static async getDependenciasWithFullPath(): Promise<Dependencia[]> {
    try {
      return await apiClient.get<Dependencia[]>('/admin/dependencias/ruta/completa')
    } catch (error) {
      console.error('Error al obtener dependencias con ruta completa:', error)
      throw error
    }
  }

  /**
   * Obtener estructura completa de dependencias
   */
  static async getDependenciaStructure(): Promise<any> {
    try {
      return await apiClient.get<any>('/admin/dependencias/estructura/completa')
    } catch (error) {
      console.error('Error al obtener estructura completa de dependencias:', error)
      throw error
    }
  }
}

export default DependenciaService
