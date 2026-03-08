"use client"

import { useState, useEffect, useCallback } from "react"
import { ChevronDown, Folder } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Catalogo, CatalogoTreeItem as CatalogoTreeItemType } from "@/types/catalog"
import { useCatalogs } from "@/hooks/useCatalogs"
import { CatalogoTreeItem } from "@/components/patterns/CatalogoTreeItem"
import { DocumentoModal } from "@/components/patterns/DocumentoModal"

interface CategoryAccordionProps {
  category: Catalogo
  index: number
  canUpload: boolean
  onRefresh?: (catalogoId: number) => Promise<void>
  isEditMode?: boolean
}

export function CategoryAccordion({ category, index, canUpload, onRefresh, isEditMode = false }: CategoryAccordionProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [treeItems, setTreeItems] = useState<CatalogoTreeItemType[]>([])
  const [isLoadingChildren, setIsLoadingChildren] = useState(false)
  const [documentModalState, setDocumentModalState] = useState<{
    catalogoId: number
    mode: 'create' | 'edit'
    tipoDocumentoId?: number
    documentoId?: number
    selectedYear?: number | null
    selectedPeriod?: number | null
  } | null>(null)
  const {
    loadCatalogChildren,
    refreshDisponibilidadDocumentosPorPeriodo,
    deleteDocument,
    createDocument,
    updateDocument,
  } = useCatalogs()

  useEffect(() => {
    if (isOpen && treeItems.length === 0 && category._count?.children && category._count.children > 0) {
      loadChildren()
    }
  }, [isOpen])

  const loadChildren = async (parentId?: number) => {
    const targetId = parentId || category.id
    
    console.log('🔍 Loading children for:', targetId, 'parentId:', parentId)
    
    if (!parentId) {
      setIsLoadingChildren(true)
    }
    
    try {
      const childCatalogs = await loadCatalogChildren(targetId)
      
      console.log('✅ Loaded', childCatalogs.length, 'children for', targetId)
      console.log('Children data:', childCatalogs.map(c => ({ id: c.id, nombre: c.nombre, hasChildren: c._count?.children })))
      
      const mappedChildren = childCatalogs.map(child => ({
        ...child,
        children: undefined,
        isExpanded: false,
        isLoading: false,
        hasChildren: (child._count?.children || 0) > 0
      }))
      
      if (parentId) {
        console.log('📝 Updating tree item:', parentId)
        // Actualizar un elemento específico en el árbol
        setTreeItems(prev => {
          const updated = updateTreeItemRecursive(prev, parentId, {
            children: mappedChildren,
            isLoading: false,
            isExpanded: true
          })
          console.log('🔄 Updated tree:', JSON.stringify(updated, null, 2))
          return updated
        })
      } else {
        // Cargar hijos del nivel raíz
        console.log('🌳 Setting root tree items')
        setTreeItems(mappedChildren)
      }
    } catch (error) {
      console.error("❌ Error loading children:", error)
      if (parentId) {
        setTreeItems(prev => updateTreeItemRecursive(prev, parentId, { 
          isLoading: false,
          isExpanded: false 
        }))
      }
    } finally {
      if (!parentId) {
        setIsLoadingChildren(false)
      }
    }
  }

  // Función recursiva separada para mejor claridad
  const updateTreeItemRecursive = (
    items: CatalogoTreeItemType[], 
    catalogId: number, 
    updates: Partial<CatalogoTreeItemType>
  ): CatalogoTreeItemType[] => {
    return items.map(item => {
      if (item.id === catalogId) {
        //console.log('🎯 Found item to update:', item.id, 'updates:', updates)
        const updated = { ...item, ...updates }
        //console.log('✨ Updated item:', updated)
        return updated
      }
      
      // Si tiene children (array), buscar recursivamente
      if (item.children && Array.isArray(item.children) && item.children.length > 0) {
        return {
          ...item,
          children: updateTreeItemRecursive(item.children, catalogId, updates)
        }
      }
      
      return item
    })
  }

  const handleToggle = () => {
    setIsOpen(!isOpen)
  }

  const handleExpand = async (item: CatalogoTreeItemType) => {
    console.log('🔽 handleExpand called for:', item.id, item.nombre)
    console.log('Item state:', { 
      isExpanded: item.isExpanded, 
      hasChildren: item._count?.children,
      childrenLoaded: item.children !== undefined,
      childrenCount: item.children?.length 
    })
    
    // Si ya está expandido, no hacer nada
    if (item.isExpanded) {
      //console.log('⚠️ Already expanded, skipping')
      return
    }
    
    // Si no tiene hijos, no expandir
    if (!item._count?.children || item._count.children === 0) {
      //console.log('⚠️ No children to load')
      return
    }
    
    // Si ya tiene hijos cargados, solo expandir
    if (item.children && Array.isArray(item.children) && item.children.length > 0) {
      //console.log('📂 Children already loaded, just expanding')
      setTreeItems(prev => updateTreeItemRecursive(prev, item.id, { isExpanded: true }))
      return
    }
    
    // Marcar como cargando
    console.log('⏳ Setting loading state')
    setTreeItems(prev => updateTreeItemRecursive(prev, item.id, { isLoading: true }))
    
    // Cargar hijos
    await loadChildren(item.id)
  }

  const handleCollapse = (item: CatalogoTreeItemType) => {
    console.log('🔼 handleCollapse called for:', item.id, item.nombre)
    setTreeItems(prev => updateTreeItemRecursive(prev, item.id, { isExpanded: false }))
  }

  const getIcon = () => {
    if (category.icono) {
      switch (category.icono.toLowerCase()) {
        case 'filetext':
          return <Folder className="h-5 w-5 text-blue-500" />
        case 'dollarsign':
          return <Folder className="h-5 w-5 text-green-500" />
        default:
          return <Folder className="h-5 w-5 text-gray-500" />
      }
    }
    return <Folder className="h-5 w-5 text-gray-500" />
  }

  // Debug: Log cuando cambia treeItems
  useEffect(() => {
    if (treeItems.length > 0) {
      console.log('First item:', treeItems[0])
    }
  }, [treeItems])

  const findCatalogoRecursive = useCallback(
    (items: CatalogoTreeItemType[], catalogId: number): CatalogoTreeItemType | null => {
      for (const item of items) {
        if (item.id === catalogId) return item
        if (item.children?.length) {
          const found = findCatalogoRecursive(item.children, catalogId)
          if (found) return found
        }
      }
      return null
    },
    []
  )

  const handleLoadDocumentsByPeriod = async (catalogoId: number, year: number, period?: number) => {
    try {
      const disponibilidad = await refreshDisponibilidadDocumentosPorPeriodo(
        catalogoId,
        year,
        period
      )
      setTreeItems(prev =>
        updateTreeItemRecursive(prev, catalogoId, {
          disponibilidadTiposDocumento: disponibilidad.disponibilidadTiposDocumento,
        })
      )
    } catch (error) {
      console.error("❌ Error al cargar disponibilidad de documentos por periodo:", error)
    }
  }

  const handleOpenDocumentoModal = useCallback(
    (mode: 'create' | 'edit', catalogoId: number, tipoDocumentoId?: number, documentoId?: number, selectedYear?: number | null, selectedPeriod?: number | null) => {
      setDocumentModalState({ catalogoId, mode, tipoDocumentoId, documentoId, selectedYear, selectedPeriod })
    },
    []
  )

  const handleCloseDocumentoModal = useCallback(() => {
    setDocumentModalState(null)
  }, [])

  const handleDownloadDocumento = useCallback((documentoId: number) => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
    const downloadUrl = `${baseUrl}/busqueda-documentos/${documentoId}/descargar`
    window.open(downloadUrl, '_blank')
  }, [])

  const handleDeleteDocumento = useCallback(
    async (catalogoId: number, _tipoDocumentoId: number, documentoId?: number, selectedYear?: number | null, selectedPeriod?: number | null) => {
      if (!documentoId) return
      try {
        await deleteDocument(documentoId)
        // Solo refrescar si tenemos año y periodo
        if (selectedYear !== null && selectedYear !== undefined) {
          const disponibilidad = await refreshDisponibilidadDocumentosPorPeriodo(catalogoId, selectedYear, selectedPeriod ?? undefined)
          setTreeItems(prev =>
            updateTreeItemRecursive(prev, catalogoId, {
              disponibilidadTiposDocumento: disponibilidad.disponibilidadTiposDocumento,
            })
          )
        }
      } catch (error) {
        console.error("❌ Error al eliminar documento:", error)
      }
    },
    [deleteDocument]
  )

  const documentModalCatalogo =
    documentModalState &&
    findCatalogoRecursive(treeItems, documentModalState.catalogoId)

  return (
    <div className="overflow-hidden rounded-lg border bg-card">
      {/* Category Header */}
      <button
        onClick={handleToggle}
        className="flex w-full items-center justify-between gap-4 p-4 text-left transition-colors hover:bg-muted/50"
      >
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10">
            {getIcon()}
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-foreground">{category.nombre}</h3>
            <p className="text-sm text-muted-foreground">{category.descripcion}</p>
            <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
              <span>Nivel {category.nivel}</span>
              <span>•</span>
              <span>{category._count?.children || 0} subcategorías</span>
              <span>•</span>
              <span>{category._count?.documentos || 0} documentos</span>
            </div>
          </div>
        </div>
        <ChevronDown
          className={cn(
            "h-5 w-5 flex-shrink-0 text-muted-foreground transition-transform",
            isOpen && "rotate-180",
            isLoadingChildren && "animate-spin"
          )}
        />
      </button>

      {/* Children */}
      {isOpen && (
        <div className="border-t bg-muted/20 p-4">
          {isLoadingChildren && treeItems.length === 0 ? (
            <div className="flex items-center justify-center py-4">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
              <span className="ml-2 text-sm text-muted-foreground">Cargando subcategorías...</span>
            </div>
          ) : treeItems.length > 0 ? (
            <div className="space-y-3">
              {treeItems.map((item) => (
                <div key={item.id} className="pl-4 border-l-2 border-muted">
                    <CatalogoTreeItem
                      key={item.id}
                      item={item}
                      level={0}
                      showDocumentos={isEditMode ? false : item.permite_documentos}
                      onExpand={handleExpand}
                      onCollapse={handleCollapse}
                      onSelect={() => {}}
                      onRefresh={onRefresh}
                      onRefreshDocumentos={onRefresh}
                      isEditMode={isEditMode}
                      onCatalogoCreate={() => {}}
                      onCatalogoEdit={() => {}}
                      onCatalogoDelete={async () => true}
                      onOpenDocumentoModal={handleOpenDocumentoModal}
                      onOpenCatalogoModal={() => {}}
                      onDeleteDocumento={handleDeleteDocumento}
                      onDeleteCatalogo={async () => {}}
                      onDownloadDocumento={handleDownloadDocumento}
                      onLoadDocumentsByPeriod={handleLoadDocumentsByPeriod}
                    />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-sm text-muted-foreground">
              {category.permite_documentos
                ? "Este nivel permite documentos. Use el botón para cargar documentos."
                : "No hay subcategorías en este nivel."}
            </div>
          )}
        </div>
      )}

      {/* Modal de documento (nivel que permite documentos) */}
      {documentModalState && documentModalCatalogo && (
        <DocumentoModal
          isOpen={true}
          onClose={handleCloseDocumentoModal}
          onSubmit={async (data) => {
            try {
              // Crear FormData para enviar el archivo
              const formData = new FormData()
              
              // Agregar campos básicos
              formData.append('catalogo_id', documentModalState.catalogoId.toString())
              if (data.tipo_documento_id != null) {
                formData.append('tipo_documento_id', data.tipo_documento_id.toString())
              }
              
              if (data.periodicidad_id != null) {
                formData.append('periodicidad_id', data.periodicidad_id)
              }
              // Agregar campos opcionales si existen
              if (data.nombre) {
                formData.append('nombre', data.nombre)
              }
              if (data.descripcion) {
                formData.append('descripcion', data.descripcion)
              }
              if (data.ejercicio_fiscal) {
                formData.append('ejercicio_fiscal', data.ejercicio_fiscal.toString())
              }
              if (data.institucion_emisora) {
                formData.append('institucion_emisora', data.institucion_emisora)
              }
              
              // Agregar archivo si existe
              if (data.archivo) {
                formData.append('archivo', data.archivo)
              }
              
              // Agregar número de periodo si está disponible
              if (data.periodo_numero !== null) {
                formData.append('periodo_numero', data.periodo_numero.toString())
              }
              
              // Llamar a la API según el modo
              if (documentModalState.mode === 'create') {
                await createDocument(formData)
              } else if (documentModalState.mode === 'edit' && documentModalState.documentoId) {
                await updateDocument(documentModalState.documentoId, formData)
              }
              
              // Refrescar disponibilidad del catálogo tras crear/actualizar
              const disponibilidad = await refreshDisponibilidadDocumentosPorPeriodo(documentModalState.catalogoId, documentModalState.selectedYear!, documentModalState.selectedPeriod!)
              setTreeItems(prev =>
                updateTreeItemRecursive(prev, documentModalState.catalogoId, {
                  disponibilidadTiposDocumento: disponibilidad.disponibilidadTiposDocumento,
                })
              )
              handleCloseDocumentoModal()
            } catch (error) {
              console.error("❌ Error al guardar documento:", error)
            }
          }}
          mode={documentModalState.mode}
          catalogo={documentModalCatalogo}
          documentoId={documentModalState.documentoId ?? null}
          tipoDocumentoId={documentModalState.tipoDocumentoId ?? null}
          selectedYear={documentModalState.selectedYear ?? null}
          selectedPeriod={documentModalState.selectedPeriod ?? null}
        />
      )}
    </div>
  )
}