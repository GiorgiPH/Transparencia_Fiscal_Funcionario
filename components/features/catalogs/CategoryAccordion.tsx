"use client"

import { useState, useEffect } from "react"
import { ChevronDown, Folder } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Catalogo } from "@/types/catalog"
import { useCatalogs } from "@/hooks/useCatalogs"
import { CatalogoTreeItem } from "@/components/patterns/CatalogoTreeItem"

interface CategoryAccordionProps {
  category: Catalogo
  index: number
  canUpload: boolean
}

export function CategoryAccordion({ category, index, canUpload }: CategoryAccordionProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [children, setChildren] = useState<Catalogo[]>([])
  const [isLoadingChildren, setIsLoadingChildren] = useState(false)
  const { loadCatalogChildren } = useCatalogs()

  useEffect(() => {
    if (isOpen && children.length === 0 && category._count?.children && category._count.children > 0) {
      loadChildren()
    }
  }, [isOpen])

  const loadChildren = async () => {
    setIsLoadingChildren(true)
    try {
      const childCatalogs = await loadCatalogChildren(category.id)
      setChildren(childCatalogs)
    } catch (error) {
      console.error("Error loading children:", error)
    } finally {
      setIsLoadingChildren(false)
    }
  }

  const handleToggle = () => {
    setIsOpen(!isOpen)
  }

  const getIcon = () => {
    if (category.icono) {
      // Aquí podrías mapear iconos por nombre
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
          {isLoadingChildren ? (
            <div className="flex items-center justify-center py-4">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
              <span className="ml-2 text-sm text-muted-foreground">Cargando subcategorías...</span>
            </div>
          ) : children.length > 0 ? (
            <div className="space-y-3">
              {children.map((child) => (
                <div key={child.id} className="pl-4 border-l-2 border-muted">
                  <CatalogoTreeItem
                    item={{
                      ...child,
                      children: [],
                      isExpanded: false,
                      isLoading: false
                    }}
                    level={0}
                    showDocumentos={child.permite_documentos}
                    onSelect={() => {}}
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
    </div>
  )
}
