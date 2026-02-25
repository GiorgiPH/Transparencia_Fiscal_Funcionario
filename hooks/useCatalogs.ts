"use client"

import { useState, useEffect } from "react"
import { catalogService, type CreateCatalogoData, type UpdateCatalogoData, type EstadisticasCatalogos } from "@/services/catalogService"
import type { Catalogo, Documento, TipoDocumento, CatalogoTreeItem, Periodicidad } from "@/types/catalog"
import { useCrudNotifications } from "./useNotifications"

export function useCatalogs() {
  const [rootCatalogs, setRootCatalogs] = useState<Catalogo[]>([])
  const [catalogosTree, setCatalogosTree] = useState<CatalogoTreeItem[]>([])
  const [estadisticas, setEstadisticas] = useState<EstadisticasCatalogos | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingEstadisticas, setIsLoadingEstadisticas] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [documentTypes, setDocumentTypes] = useState<TipoDocumento[]>([])
  const [periodicidades, setPeriodicidades] = useState<Periodicidad[]>([])
  const notifications = useCrudNotifications("Catálogo")

  useEffect(() => {
    loadRootCatalogs()
    loadDocumentTypes()
    loadPeriodicidades()
    fetchCatalogoTree()
    loadEstadisticas()
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

  const loadPeriodicidades = async () => {
    try {
      const data = await catalogService.getPeriodicidades()
      setPeriodicidades(data)
    } catch (err) {
      console.error("Error al cargar periodicidades:", err)
    }
  }

  const loadEstadisticas = async () => {
    try {
      setIsLoadingEstadisticas(true)
      const data = await catalogService.getEstadisticas()
      setEstadisticas(data)
    } catch (err) {
      console.error("Error al cargar estadísticas:", err)
    } finally {
      setIsLoadingEstadisticas(false)
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

  // Métodos CRUD para catálogos
  const getCatalog = async (catalogId: number): Promise<Catalogo | null> => {
    try {
      return await catalogService.getCatalogById(catalogId)
    } catch (err) {
      console.error("Error al cargar catálogo:", err)
      return null
    }
  }

  const createCatalog = async (data: CreateCatalogoData): Promise<Catalogo | null> => {
    try {
      const result = await catalogService.createCatalog(data)
      notifications.showCreateSuccess()
      return result
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Error al crear catálogo"
      notifications.showCreateError(errorMessage)
      console.error("Error al crear catálogo:", err)
      return null
    }
  }

  const updateCatalog = async (catalogId: number, data: UpdateCatalogoData): Promise<Catalogo | null> => {
    try {
      const result = await catalogService.updateCatalog(catalogId, data)
      notifications.showUpdateSuccess()
      return result
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Error al actualizar catálogo"
      notifications.showUpdateError(errorMessage)
      console.error("Error al actualizar catálogo:", err)
      return null
    }
  }

  const deleteCatalog = async (catalogId: number): Promise<boolean> => {
    try {
      await catalogService.deleteCatalog(catalogId)
      notifications.showDeleteSuccess()
      return true
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Error al eliminar catálogo"
      notifications.showDeleteError(errorMessage)
      console.error("Error al eliminar catálogo:", err)
      return false
    }
  }

  const createDocument = async (formData: FormData): Promise<Documento> => {
    try {
      const result = await catalogService.createDocument(formData)
      notifications.showSuccess("Documento creado exitosamente")
      return result
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Error al crear documento"
      notifications.showError("Error al crear documento", {
        description: errorMessage,
      })
      console.error(err)
      throw err
    }
  }

  const updateDocument = async (documentId: number, formData: FormData): Promise<Documento> => {
    try {
      const result = await catalogService.updateDocument(documentId, formData)
      notifications.showSuccess("Documento actualizado exitosamente")
      return result
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Error al actualizar documento"
      notifications.showError("Error al actualizar documento", {
        description: errorMessage,
      })
      console.error(err)
      throw err
    }
  }

  const deleteDocument = async (documentId: number): Promise<void> => {
    try {
      await catalogService.deleteDocument(documentId)
      notifications.showSuccess("Documento eliminado exitosamente")
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Error al eliminar documento"
      notifications.showError("Error al eliminar documento", {
        description: errorMessage,
      })
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

  
  const refreshDisponibilidadDocumentos = async (catalogId: number): Promise<any> => {
    try {
      // Usar el nuevo endpoint que obtiene solo la disponibilidad de documentos
      const disponibilidad = await catalogService.getDocumentAvailability(catalogId)
      
      // Actualizar solo la disponibilidad del catálogo
      updateTreeItem(catalogId, {
        disponibilidadTiposDocumento: disponibilidad.disponibilidadTiposDocumento
      })
      
      return disponibilidad
    } catch (err) {
      console.error("Error al refrescar disponibilidad de documentos:", err)
      throw err
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

  const clearError = () => {
    setError(null)
  }

  // Alias para compatibilidad con componentes existentes
  const fetchTiposDocumento = async (): Promise<void> => {
    await loadDocumentTypes()
  }

  const fetchPeriodicidades = async (): Promise<void> => {
    await loadPeriodicidades()
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
    estadisticas,
    isLoadingEstadisticas,
    loadCatalogChildren,
    loadDocument,
    createDocument,
    updateDocument,
    deleteDocument,
    fetchCatalogoTree,
    expandCatalogo,
    collapseCatalogo,
    refreshCatalogo,
    clearError,
    
    // Métodos CRUD para catálogos
    getCatalog,
    createCatalog,
    updateCatalog,
    deleteCatalog,
    
    // Nuevos métodos para refresco específico
    refreshDisponibilidadDocumentos,
    
    // Métodos para estadísticas
    loadEstadisticas,
    
    // Alias para compatibilidad
    fetchTiposDocumento,
    fetchPeriodicidades,
    fetchDocumento,
    tiposDocumento: documentTypes,
    periodicidades,
    
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