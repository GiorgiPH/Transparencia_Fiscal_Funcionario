import type { Catalogo, Documento, TipoDocumento } from "@/types/catalog"
import { apiClient } from "@/lib/api/axios-client"

// Datos mock para desarrollo cuando la API no está disponible
const mockRootCatalogs: Catalogo[] = [
  {
    id: 1,
    nombre: "PLAN ESTATAL DE DESARROLLO",
    descripcion: "Planes Estatales de Desarrollo y programas derivados",
    descripcion_nivel: null,
    icono: "FileText",
    parent_id: null,
    nivel: 1,
    orden: 1,
    activo: true,
    permite_documentos: false,
    fecha_creacion: "2025-12-30T12:46:50.193Z",
    fecha_modificacion: "2025-12-30T12:46:50.193Z",
    usuario_creacion_id: 1,
    usuario_modif_id: null,
    _count: {
      children: 3,
      documentos: 0
    }
  },
  {
    id: 2,
    nombre: "INGRESOS",
    descripcion: "Proyección, estimación y resultados de ingresos",
    descripcion_nivel: null,
    icono: "DollarSign",
    parent_id: null,
    nivel: 1,
    orden: 2,
    activo: true,
    permite_documentos: false,
    fecha_creacion: "2025-12-30T12:46:50.193Z",
    fecha_modificacion: "2025-12-30T12:46:50.193Z",
    usuario_creacion_id: 1,
    usuario_modif_id: null,
    _count: {
      children: 2,
      documentos: 0
    }
  }
]

const mockCatalogChildren: Record<number, Catalogo[]> = {
  1: [
    {
      id: 3,
      nombre: "Diagnóstico y análisis de la situación actual",
      descripcion: "Análisis del contexto estatal",
      descripcion_nivel: null,
      icono: null,
      parent_id: 1,
      nivel: 2,
      orden: 1,
      activo: true,
      permite_documentos: false,
      fecha_creacion: "2025-12-30T12:46:50.193Z",
      fecha_modificacion: "2025-12-30T12:46:50.193Z",
      usuario_creacion_id: 1,
      usuario_modif_id: null,
      _count: {
        children: 2,
        documentos: 0
      }
    },
    {
      id: 4,
      nombre: "Objetivos y estrategias",
      descripcion: "Objetivos generales y específicos del Plan",
      descripcion_nivel: null,
      icono: null,
      parent_id: 1,
      nivel: 2,
      orden: 2,
      activo: true,
      permite_documentos: false,
      fecha_creacion: "2025-12-30T12:46:50.193Z",
      fecha_modificacion: "2025-12-30T12:46:50.193Z",
      usuario_creacion_id: 1,
      usuario_modif_id: null,
      _count: {
        children: 3,
        documentos: 0
      }
    }
  ],
  3: [
    {
      id: 5,
      nombre: "Análisis demográfico",
      descripcion: "Características de la población",
      descripcion_nivel: null,
      icono: null,
      parent_id: 3,
      nivel: 3,
      orden: 1,
      activo: true,
      permite_documentos: true,
      fecha_creacion: "2025-12-30T12:46:50.193Z",
      fecha_modificacion: "2025-12-30T12:46:50.193Z",
      usuario_creacion_id: 1,
      usuario_modif_id: null,
      _count: {
        children: 0,
        documentos: 1
      },
      disponibilidadTiposDocumento: [
        {
          tipoDocumentoId: 1,
          nombre: "CSV",
          disponible: true,
          extension: "csv",
          documentoId: 1,
          documentoNombre: "Datos demográficos 2025"
        },
        {
          tipoDocumentoId: 2,
          nombre: "JSON",
          disponible: false,
          extension: "json"
        }
      ]
    },
    {
      id: 6,
      nombre: "Análisis económico",
      descripcion: "Indicadores económicos del estado",
      descripcion_nivel: null,
      icono: null,
      parent_id: 3,
      nivel: 3,
      orden: 2,
      activo: true,
      permite_documentos: true,
      fecha_creacion: "2025-12-30T12:46:50.193Z",
      fecha_modificacion: "2025-12-30T12:46:50.193Z",
      usuario_creacion_id: 1,
      usuario_modif_id: null,
      _count: {
        children: 0,
        documentos: 0
      },
      disponibilidadTiposDocumento: [
        {
          tipoDocumentoId: 1,
          nombre: "CSV",
          disponible: false,
          extension: "csv"
        },
        {
          tipoDocumentoId: 4,
          nombre: "Excel",
          disponible: false,
          extension: "xlsx"
        }
      ]
    }
  ],
  4: [
    {
      id: 7,
      nombre: "Objetivos generales",
      descripcion: "Objetivos de largo plazo del Plan",
      descripcion_nivel: null,
      icono: null,
      parent_id: 4,
      nivel: 3,
      orden: 1,
      activo: true,
      permite_documentos: true,
      fecha_creacion: "2025-12-30T12:46:50.193Z",
      fecha_modificacion: "2025-12-30T12:46:50.193Z",
      usuario_creacion_id: 1,
      usuario_modif_id: null,
      _count: {
        children: 0,
        documentos: 2
      },
      disponibilidadTiposDocumento: [
        {
          tipoDocumentoId: 1,
          nombre: "CSV",
          disponible: true,
          extension: "csv",
          documentoId: 2,
          documentoNombre: "Objetivos generales 2025-2030"
        },
        {
          tipoDocumentoId: 4,
          nombre: "Excel",
          disponible: true,
          extension: "xlsx",
          documentoId: 3,
          documentoNombre: "Metas por año"
        }
      ]
    }
  ]
}

const mockDocumentTypes: TipoDocumento[] = [
  {
    id: 1,
    nombre: "CSV",
    descripcion: "Archivo de valores separados por comas",
    extension: "csv",
    extensiones: "csv,tsv",
    activo: true,
    fechaCreacion: "2025-12-28T14:30:00.000Z",
    fechaModificacion: "2025-12-28T14:30:00.000Z"
  },
  {
    id: 2,
    nombre: "JSON",
    descripcion: "Archivo de notación de objetos JavaScript",
    extension: "json",
    extensiones: "json",
    activo: true,
    fechaCreacion: "2025-12-28T14:30:00.000Z",
    fechaModificacion: "2025-12-28T14:30:00.000Z"
  },
  {
    id: 3,
    nombre: "XML",
    descripcion: "Archivo de lenguaje de marcado extensible",
    extension: "xml",
    extensiones: "xml",
    activo: true,
    fechaCreacion: "2025-12-28T14:30:00.000Z",
    fechaModificacion: "2025-12-28T14:30:00.000Z"
  },
  {
    id: 4,
    nombre: "Excel",
    descripcion: "Archivo de hoja de cálculo de Microsoft Excel",
    extension: "xlsx",
    extensiones: "xlsx,xls",
    activo: true,
    fechaCreacion: "2025-12-28T14:30:00.000Z",
    fechaModificacion: "2025-12-28T14:30:00.000Z"
  }
]

// Función helper para manejar errores de API
async function withMockFallback<T>(apiCall: () => Promise<T>, mockData: T): Promise<T> {
  try {
    return await apiCall()
  } catch (error) {
    console.warn("API no disponible, usando datos mock:", error)
    return mockData
  }
}

export const catalogService = {
  // Obtener catálogos raíz
  async getRootCatalogs(): Promise<Catalogo[]> {
    return withMockFallback(
      () => apiClient.get<Catalogo[]>("/admin/catalogos/raices"),
      mockRootCatalogs
    )
  },

  // Obtener hijos de un catálogo
  async getCatalogChildren(catalogId: number): Promise<Catalogo[]> {
    return withMockFallback(
      () => apiClient.get<Catalogo[]>(`/admin/catalogos/${catalogId}/hijos`),
      mockCatalogChildren[catalogId] || []
    )
  },

  // Obtener documento por ID
  async getDocument(documentId: number): Promise<Documento> {
    return apiClient.get<Documento>(`/admin/documentos/${documentId}`)
  },

  // Crear documento (multipart/form-data)
  async createDocument(formData: FormData): Promise<Documento> {
    return apiClient.post<Documento>("/admin/documentos", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
  },

  // Actualizar documento (multipart/form-data)
  async updateDocument(documentId: number, formData: FormData): Promise<Documento> {
    return apiClient.patch<Documento>(`/admin/documentos/${documentId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
  },

  // Eliminar documento
  async deleteDocument(documentId: number): Promise<void> {
    return apiClient.delete(`/admin/documentos/${documentId}`)
  },

  // Obtener tipos de documento
  async getDocumentTypes(): Promise<TipoDocumento[]> {
    return withMockFallback(
      () => apiClient.get<TipoDocumento[]>("/catalogos/tipos-documento"),
      mockDocumentTypes
    )
  },

  // Métodos legacy para compatibilidad
  async getCategories(): Promise<any[]> {
    const catalogs = await this.getRootCatalogs()
    return catalogs.map(catalog => ({
      id: catalog.id.toString(),
      nombre: catalog.nombre,
      descripcion: catalog.descripcion,
      subcategorias: []
    }))
  },

  async getSubcategories(categoryId: string): Promise<any[]> {
    const children = await this.getCatalogChildren(parseInt(categoryId))
    return children.map(child => ({
      id: child.id.toString(),
      nombre: child.nombre,
      descripcion: child.descripcion,
      documentos: []
    }))
  },

  async getDocuments(subcategoryId: string): Promise<any[]> {
    // Para compatibilidad, devolver array vacío
    return []
  },

  async uploadDocument(document: any): Promise<any> {
    // Para compatibilidad, devolver mock
    return {
      ...document,
      id: `doc-${Date.now()}`,
      uploadedAt: new Date().toISOString(),
    }
  },
}
