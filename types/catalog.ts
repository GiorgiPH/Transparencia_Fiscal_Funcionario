export type DocumentType = "Excel" | "PDF" | "Word" | "CSV" | "JSON" | "XML"
export type Periodicity = "Anual" | "Mensual" | "Semestral" | "Trimestral"
export type DocumentStatus = "publicado" | "pendiente" | "rechazado"

// Periodicidad del catálogo
export interface Periodicidad {
  id: number
  nombre: string
  mesesPorPeriodo: number
  periodosPorAnio: number
  activo: boolean
}

// Tipos de documento del catálogo
export interface TipoDocumento {
  id: number
  nombre: string
  descripcion: string
  extension: string
  extensiones: string
  activo: boolean
  fechaCreacion: string
  fechaModificacion: string
}

// Disponibilidad de tipo de documento para un catálogo
export interface DisponibilidadTipoDocumento {
  tipoDocumentoId: number
  nombre: string
  disponible: boolean
  extension: string
  documentoId?: number
  documentoNombre?: string
}

// Catálogo (categoría/subcategoría)
export interface Catalogo {
  id: number
  nombre: string
  descripcion: string
  descripcion_nivel: string | null
  icono: string | null
  parent_id: number | null
  nivel: number
  orden: number
  activo: boolean
  permite_documentos: boolean
  fecha_creacion: string
  fecha_modificacion: string
  usuario_creacion_id: number
  usuario_modif_id: number | null
  _count?: {
    children: number
    documentos: number
  }
  disponibilidadTiposDocumento?: DisponibilidadTipoDocumento[]
}

// Documento
export interface Documento {
  id: number
  catalogo_id: number
  tipo_documento_id: number
  nombre: string
  descripcion: string
  ejercicio_fiscal: number
  ruta_archivo: string
  extension: string
  peso_archivo: {
    s: number
    e: number
    d: number[]
  }
  version: number
  estatus: DocumentStatus
  fecha_publicacion: string
  activo: boolean
  institucion_emisora: string
  periodicidad: string
  fecha_creacion: string
  fecha_modificacion: string
  usuario_creacion_id: number
  usuario_modif_id: number | null
  catalogo?: Catalogo
}

// Para compatibilidad con código existente
export interface Document {
  id: string
  nombre: string
  tipo: DocumentType
  periodicidad: Periodicity
  categoria: string
  subcategoria: string
  archivo?: File
  url?: string
  uploadedBy: string
  uploadedAt: string
}

export interface Subcategory {
  id: string
  nombre: string
  descripcion: string
  documentos: Document[]
}

export interface Category {
  id: string
  nombre: string
  descripcion: string
  subcategorias: Subcategory[]
}

// Tipo para árbol de catálogos
export interface CatalogoTreeItem extends Catalogo {
  children?: CatalogoTreeItem[]
  isExpanded?: boolean
  isLoading?: boolean
  hasChildren?: boolean
}

// Tipos para creación/actualización de documentos
export interface DocumentoCreateData {
  catalogo_id: number
  tipo_documento_id: number
  periodicidad: string
  archivo: File
  nombre?: string
  descripcion?: string
  ejercicio_fiscal?: number
  institucion_emisora?: string
}

export interface DocumentoUpdateData {
  catalogo_id?: number
  tipo_documento_id?: number
  periodicidad?: string
  archivo?: File
  nombre?: string
  descripcion?: string
  ejercicio_fiscal?: number
  institucion_emisora?: string
}

export const THEMATIC_CATEGORIES: string[] = [
  "Plan Estatal de Desarrollo",
  "Ingresos",
  "Deuda Pública",
  "Presupuesto de Egresos",
  "Información Contable",
  "Rendición de Cuentas",
  "Marco Normativo",
]
