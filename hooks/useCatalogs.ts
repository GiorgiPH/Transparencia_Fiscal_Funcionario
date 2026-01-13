"use client"

import { useState, useEffect } from "react"
import { catalogService } from "@/services/catalogService"
import type { Catalogo, Documento, TipoDocumento, CatalogoTreeItem } from "@/types/catalog"

export function useCatalogs() {
  const [rootCatalogs, setRootCatalogs] = useState<Catalogo[]>([])
  const [catalogosTree, setCatalogosTree] = useState<CatalogoTreeItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [documentTypes, setDocumentTypes] = useState<TipoDocumento[]>([])

  useEffect(() => {
    loadRootCatalogs()
    loadDocumentTypes()
    fetchCatalogoTree()
  }, [])

  const loadRootCatalogs = async () => {
    try {
      setIsLoading(true)
      const data = await catalogService.getRootCatalogs()
      setRootCatalogs(data)
    } catch (err) {
      setError("Error al cargar catálogos raíz")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const loadDocumentTypes = async () => {
    try {
      const data = await catalogService.getDocumentTypes()
      setDocumentTypes(data)
    } catch (err) {
      console.error("Error al cargar tipos de documento:", err)
    }
  }

  const loadCatalogChildren = async (catalogId: number): Promise<Catalogo[]> => {
    try {
      return await catalogService.getCatalogChildren(catalogId)
    } catch (err) {
      setError("Error al cargar subcategorías")
      console.error(err)
      return []
    }
  }

  const loadDocument = async (documentId: number): Promise<Documento | null> => {
    try {
      return await catalogService.getDocument(documentId)
    } catch (err) {
      setError("Error al cargar documento")
      console.error(err)
      return null
    }
  }

  const createDocument = async (formData: FormData): Promise<Documento> => {
    try {
      return await catalogService.createDocument(formData)
    } catch (err) {
      setError("Error al crear documento")
      console.error(err)
      throw err
    }
  }

  const updateDocument = async (documentId: number, formData: FormData): Promise<Documento> => {
    try {
      return await catalogService.updateDocument(documentId, formData)
    } catch (err) {
      setError("Error al actualizar documento")
      console.error(err)
      throw err
    }
  }

  const deleteDocument = async (documentId: number): Promise<void> => {
    try {
      await catalogService.deleteDocument(documentId)
    } catch (err) {
      setError("Error al eliminar documento")
      console.error(err)
      throw err
    }
  }

  // Métodos para árbol de catálogos
  const fetchCatalogoTree = async (): Promise<CatalogoTreeItem[]> => {
    try {
      setIsLoading(true)
      const catalogs = await catalogService.getRootCatalogs()
      const treeItems: CatalogoTreeItem[] = catalogs.map(catalog => ({
        ...catalog,
        children: [],
        isExpanded: false,
        isLoading: false,
        hasChildren: (catalog._count?.children || 0) > 0
      }))
      setCatalogosTree(treeItems)
      return treeItems
    } catch (err) {
      setError("Error al cargar árbol de catálogos")
      console.error(err)
      return []
    } finally {
      setIsLoading(false)
    }
  }

  const expandCatalogo = async (item: CatalogoTreeItem): Promise<void> => {
    try {
      // Marcar como cargando
      updateTreeItem(item.id, { isLoading: true })
      
      // Cargar hijos
      const children = await catalogService.getCatalogChildren(item.id)
      
      // Actualizar árbol
      updateTreeItem(item.id, {
        children: children.map(child => ({
          ...child,
          children: [],
          isExpanded: false,
          isLoading: false,
          hasChildren: (child._count?.children || 0) > 0
        })),
        isExpanded: true,
        isLoading: false
      })
    } catch (err) {
      console.error("Error al expandir catálogo:", err)
      updateTreeItem(item.id, { isLoading: false })
    }
  }

  const collapseCatalogo = (catalogId: number): void => {
    updateTreeItem(catalogId, { isExpanded: false })
  }

  const refreshCatalogo = async (catalogId: number): Promise<void> => {
    try {
      // Obtener el catálogo actualizado con disponibilidadTiposDocumento
      const catalogoActualizado = await catalogService.getCatalogChildren(catalogId)
      // Nota: getCatalogChildren devuelve un array, necesitamos encontrar el catálogo específico
      // Para simplificar, recargaremos todos los hijos del padre
      // En una implementación más avanzada, podríamos tener un endpoint para un catálogo específico
      
      // Por ahora, recargamos todo el árbol
      await fetchCatalogoTree()
    } catch (err) {
      console.error("Error al refrescar catálogo:", err)
    }
  }

  const updateTreeItem = (catalogId: number, updates: Partial<CatalogoTreeItem>) => {
    setCatalogosTree(prev => updateTreeItemRecursive(prev, catalogId, updates))
  }

  const updateTreeItemRecursive = (
    items: CatalogoTreeItem[],
    catalogId: number,
    updates: Partial<CatalogoTreeItem>
  ): CatalogoTreeItem[] => {
    return items.map(item => {
      if (item.id === catalogId) {
        return { ...item, ...updates }
      }
      if (item.children && item.children.length > 0) {
        return {
          ...item,
          children: updateTreeItemRecursive(item.children, catalogId, updates)
        }
      }
      return item
    })
  }

  const mockFetchCatalogosRaices = async (): Promise<void> => {
    // Datos mock para desarrollo
    const mockData: CatalogoTreeItem[] = [
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
        _count: { children: 5, documentos: 0 },
        children: [],
        isExpanded: false,
        isLoading: false,
        hasChildren: true
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
        _count: { children: 5, documentos: 0 },
        children: [],
        isExpanded: false,
        isLoading: false,
        hasChildren: true
      }
    ]
    
    setCatalogosTree(mockData)
    setIsLoading(false)
  }
  const clearError = () => {
    setError(null)
  }

  // Alias para compatibilidad con componentes existentes
  const fetchTiposDocumento = async (): Promise<void> => {
    await loadDocumentTypes()
  }

  const fetchDocumento = async (documentId: number): Promise<Documento> => {
    const documento = await loadDocument(documentId)
    if (!documento) {
      throw new Error("Documento no encontrado")
    }
    return documento
  }

  // Métodos legacy para compatibilidad
  const loadCategories = async () => {
    try {
      setIsLoading(true)
      const data = await catalogService.getCategories()
      return data
    } catch (err) {
      setError("Error al cargar categorías")
      console.error(err)
      return []
    } finally {
      setIsLoading(false)
    }
  }

  const loadSubcategories = async (categoryId: string): Promise<any[]> => {
    try {
      return await catalogService.getSubcategories(categoryId)
    } catch (err) {
      setError("Error al cargar subcategorías")
      console.error(err)
      return []
    }
  }

  const loadDocuments = async (subcategoryId: string): Promise<any[]> => {
    try {
      return await catalogService.getDocuments(subcategoryId)
    } catch (err) {
      setError("Error al cargar documentos")
      console.error(err)
      return []
    }
  }

  const uploadDocument = async (document: any): Promise<any> => {
    try {
      return await catalogService.uploadDocument(document)
    } catch (err) {
      setError("Error al subir documento")
      console.error(err)
      throw err
    }
  }

  return {
    // Nuevos métodos
    rootCatalogs,
    documentTypes,
    catalogosTree,
    loadCatalogChildren,
    loadDocument,
    createDocument,
    updateDocument,
    deleteDocument,
    fetchCatalogoTree,
    expandCatalogo,
    collapseCatalogo,
    refreshCatalogo,
    mockFetchCatalogosRaices,
    clearError,
    
    // Alias para compatibilidad
    fetchTiposDocumento,
    fetchDocumento,
    tiposDocumento: documentTypes,
    
    // Métodos legacy
    categories: rootCatalogs.map(catalog => ({
      id: catalog.id.toString(),
      nombre: catalog.nombre,
      descripcion: catalog.descripcion,
      subcategorias: []
    })),
    isLoading,
    error,
    loadSubcategories,
    loadDocuments,
    uploadDocument,
  }
}
