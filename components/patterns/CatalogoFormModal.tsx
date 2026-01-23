"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Catalogo, CatalogoTreeItem } from "@/types/catalog"
import { useCatalogs } from "@/hooks/useCatalogs"

interface CatalogoFormModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: any) => Promise<void>
  catalogo?: Catalogo | null
  parentCatalogo?: CatalogoTreeItem | null
  mode: 'create' | 'edit'
}

export function CatalogoFormModal({ open, onClose, onSubmit, catalogo, parentCatalogo, mode }: CatalogoFormModalProps) {
  const { catalogosTree } = useCatalogs()
  
  const [nombre, setNombre] = useState("")
  const [descripcion, setDescripcion] = useState("")
  const [parentId, setParentId] = useState<number | null>(null)
  const [orden, setOrden] = useState(1)
  const [permiteDocumentos, setPermiteDocumentos] = useState(false)
  const [activo, setActivo] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Calcular el siguiente nivel basado en el catálogo padre
  const getNextLevel = () => {
    if (parentCatalogo) {
      return parentCatalogo.nivel + 1
    }
    return 1 // Nivel raíz
  }

  // Calcular el siguiente orden basado en los hermanos
  const getNextOrder = () => {
    if (parentCatalogo && parentCatalogo.children) {
      return parentCatalogo.children.length + 1
    }
    // Buscar hermanos en el árbol
    const siblings = catalogosTree.filter(item => 
      item.parent_id === (parentCatalogo?.id || null)
    )
    return siblings.length + 1
  }

  // Verificar si el catálogo padre permite documentos
  const parentAllowsDocuments = parentCatalogo?.permite_documentos || false
  
  // Verificar si el catálogo actual tiene hijos (solo en modo edición)
  // Nota: catalogo es de tipo Catalogo, que no tiene children, pero _count sí
  const itemHasChildren = mode === 'edit' && catalogo && (
    (catalogo._count?.children && catalogo._count.children > 0)
  )

  useEffect(() => {
    if (open) {
      if (mode === 'edit' && catalogo) {
        // Modo edición
        setNombre(catalogo.nombre)
        setDescripcion(catalogo.descripcion || "")
        setParentId(catalogo.parent_id)
        setOrden(catalogo.orden)
        setPermiteDocumentos(catalogo.permite_documentos)
        setActivo(catalogo.activo)
      } else {
        // Modo creación
        setNombre("")
        setDescripcion("")
        // En modo creación, el parent_id SIEMPRE viene del catálogo desde donde se crea
        setParentId(parentCatalogo?.id || null)
        setOrden(getNextOrder())
        // Si el padre permite documentos, este catálogo NO puede permitir documentos
        setPermiteDocumentos(parentAllowsDocuments ? false : false) // Por defecto false
        setActivo(true)
      }
    }
  }, [open, mode, catalogo, parentCatalogo, catalogosTree, parentAllowsDocuments])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const submitData: any = {
        nombre,
        descripcion: descripcion || undefined,
        parent_id: parentId || undefined, // Convertir null a undefined
        orden,
        permite_documentos: permiteDocumentos,
        activo,
      }

      await onSubmit(submitData)
      handleClose()
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    setNombre("")
    setDescripcion("")
    setParentId(null)
    setOrden(1)
    setPermiteDocumentos(false)
    setActivo(true)
    onClose()
  }

  // Filtrar catálogos que pueden ser padres (excluyendo el actual en modo edición)
  const availableParents = catalogosTree.filter(item => 
    mode !== 'edit' || item.id !== catalogo?.id
  )

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === 'edit' ? 'Editar Catálogo' : parentCatalogo ? 'Crear Subcatálogo' : 'Crear Catálogo Raíz'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'edit' 
              ? 'Actualice la información del catálogo' 
              : parentCatalogo
                ? `Crear subcatálogo de "${parentCatalogo.nombre}"`
                : 'Complete los datos del nuevo catálogo raíz'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nombre">Nombre *</Label>
            <Input
              id="nombre"
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej: Plan Estatal de Desarrollo"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="descripcion">Descripción</Label>
            <Textarea
              id="descripcion"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Descripción del catálogo..."
              rows={3}
            />
          </div>

          {mode === 'create' && (
            <div className="space-y-2">
              <Label htmlFor="parentId">Catálogo Padre</Label>
              <div className="rounded-md border bg-gray-50 p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">
                      {parentCatalogo ? parentCatalogo.nombre : "Catálogo raíz"}
                    </div>
                    <div className="text-sm text-gray-500">
                      {parentCatalogo 
                        ? `Nivel ${parentCatalogo.nivel} → Nivel ${getNextLevel()}`
                        : "Nivel 1 (raíz)"}
                    </div>
                  </div>
                  {parentCatalogo && (
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                      parentAllowsDocuments 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {parentAllowsDocuments ? 'Permite documentos' : 'Categoría'}
                    </div>
                  )}
                </div>
                {parentAllowsDocuments && (
                  <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                    ⚠️ Este catálogo padre permite documentos. Los catálogos creados aquí NO podrán permitir documentos.
                  </div>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                El catálogo padre se establece automáticamente desde donde se crea.
              </p>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="orden">Orden *</Label>
            <Input
              id="orden"
              type="number"
              value={orden}
              onChange={(e) => setOrden(parseInt(e.target.value) || 1)}
              min="1"
              required
            />
            <p className="text-xs text-muted-foreground">
              Posición relativa entre catálogos del mismo nivel
            </p>
          </div>

          <div className="flex items-center justify-between space-x-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="permiteDocumentos"
                checked={permiteDocumentos}
                onCheckedChange={setPermiteDocumentos}
                disabled={parentAllowsDocuments || (mode === 'edit' && itemHasChildren)}
              />
              <Label htmlFor="permiteDocumentos" className={parentAllowsDocuments || (mode === 'edit' && itemHasChildren) ? "text-gray-400" : ""}>
                Permite documentos
                {parentAllowsDocuments && (
                  <span className="ml-2 text-xs text-red-600">(No disponible - padre permite documentos)</span>
                )}
                {mode === 'edit' && itemHasChildren && (
                  <span className="ml-2 text-xs text-red-600">(No disponible - tiene subcatálogos)</span>
                )}
              </Label>
            </div>

            {/* <div className="flex items-center space-x-2">
              <Switch
                id="activo"
                checked={activo}
                onCheckedChange={setActivo}
              />
              <Label htmlFor="activo">Activo</Label>
            </div> */}
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-medium mb-2">Información del catálogo</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-gray-500">Nivel:</span>
                <span className="ml-2 font-medium">{getNextLevel()}</span>
              </div>
              <div>
                <span className="text-gray-500">Padre:</span>
                <span className="ml-2 font-medium">
                  {parentCatalogo ? parentCatalogo.nombre : "Ninguno (raíz)"}
                </span>
              </div>
              <div>
                <span className="text-gray-500">Permite documentos:</span>
                <span className={`ml-2 font-medium ${
                  parentAllowsDocuments 
                    ? 'text-red-600' 
                    : permiteDocumentos ? 'text-green-600' : 'text-gray-600'
                }`}>
                  {parentAllowsDocuments ? 'No (padre permite docs)' : permiteDocumentos ? 'Sí' : 'No'}
                </span>
              </div>
              <div>
                <span className="text-gray-500">Estado:</span>
                <span className={`ml-2 font-medium ${activo ? 'text-green-600' : 'text-red-600'}`}>
                  {activo ? 'Activo' : 'Inactivo'}
                </span>
              </div>
            </div>
            {parentAllowsDocuments && (
              <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                <strong>⚠️ Restricción:</strong> Este catálogo se creará bajo un padre que permite documentos, 
                por lo que NO podrá permitir documentos ni tener subcatálogos.
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={handleClose} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Guardando..." : mode === 'edit' ? "Actualizar" : "Crear Catálogo"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
