// Tipos para dependencias
export interface Dependencia {
  id: number
  nombre: string
  idTipo: number
  tipoNombre?: string
  idPadre?: number
  padreNombre?: string
  nivel: number
  orden: number
  activo: boolean
  fechaAlta: Date
  fechaCreacion: Date
  fechaModificacion: Date
  hijos?: Dependencia[]
}

export interface TipoDependencia {
  id: number
  nombre: string
  fechaCreacion: Date
  fechaModificacion: Date
}

export interface DependenciaTree {
  dependencias: Dependencia[]
}

export interface DependenciasByLevel {
  [key: number]: Dependencia[]
}

export interface DependenciaStats {
  total: number
  porNivel: { [key: number]: number }
  activas: number
  inactivas: number
}