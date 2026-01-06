import type { Catalogo, Documento, TipoDocumento } from "@/types/catalog"
import { apiClient } from "@/lib/api/axios-client"

export const catalogService = {
  // Obtener catálogos raíz
  async getRootCatalogs(): Promise<Catalogo[]> {
    return apiClient.get<Catalogo[]>("/admin/catalogos/raices")
  },

  // Obtener hijos de un catálogo
  async getCatalogChildren(catalogId: number): Promise<Catalogo[]> {
    return apiClient.get<Catalogo[]>(`/admin/catalogos/${catalogId}/hijos`)
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
    return apiClient.get<TipoDocumento[]>("/catalogos/tipos-documento")
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
