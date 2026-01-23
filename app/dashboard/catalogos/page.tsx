"use client"

import { Container } from "@/components/shared/Container"
import { Loading } from "@/components/shared/Loading"
import { CategoryAccordion } from "@/components/features/catalogs/CategoryAccordion"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Edit, X } from "lucide-react"
import { useCatalogs } from "@/hooks/useCatalogs"
import { useAuth } from "@/hooks/useAuth"
import { useState } from "react"

export default function CatalogosPage() {
  const { user } = useAuth()
  const { rootCatalogs, isLoading, refreshCatalogo } = useCatalogs()
  const [isEditMode, setIsEditMode] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  const canUpload = user?.rol === "Admin" || user?.rol === "Upload"
  const canEditCatalogs = user?.rol === "Admin" // Solo admin puede editar catálogos

  const handleRefreshCatalogo = async (catalogoId: number) => {
    console.log("🟢 [CatalogosPage] handleRefreshCatalogo llamado con catalogoId:", catalogoId);
    try {
      await refreshCatalogo(catalogoId);
      console.log("🟢 [CatalogosPage] refreshCatalogo completado exitosamente");
    } catch (error) {
      console.error("🔴 [CatalogosPage] Error en handleRefreshCatalogo:", error);
    }
  };

  if (isLoading) {
    return <Loading message="Cargando categorías..." />
  }

  // Filtrar catálogos por término de búsqueda
  const filteredCatalogs = rootCatalogs.filter(category => 
    !searchTerm || 
    category.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.descripcion?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <Container>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-balance text-3xl font-bold tracking-tight text-foreground">Catálogos</h1>
            <p className="mt-2 text-pretty text-muted-foreground">Modelo Temático de Transparencia Fiscal (MTTF)</p>
          </div>
          
          {canEditCatalogs && (
            <Button
              onClick={() => setIsEditMode(!isEditMode)}
              variant={isEditMode ? "destructive" : "default"}
              className="inline-flex items-center gap-2"
            >
              {isEditMode ? (
                <>
                  <X className="h-4 w-4" />
                  Salir modo edición
                </>
              ) : (
                <>
                  <Edit className="h-4 w-4" />
                  Administrar catálogos
                </>
              )}
            </Button>
          )}
        </div>

        {/* Edit mode warning */}
        {isEditMode && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">Modo edición activado</h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>• Puede agregar, editar y eliminar catálogos</p>
                  <p>• La carga de documentos está deshabilitada</p>
                  <p>• Los cambios se reflejarán inmediatamente</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Search */}
        <div className="rounded-lg border bg-card p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input 
              type="text" 
              placeholder="Buscar categorías, subcategorías o documentos..." 
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-gray-900">{rootCatalogs.length}</div>
            <div className="text-sm text-gray-600">Categorías principales</div>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-green-700">
              {rootCatalogs.filter(c => c.activo).length}
            </div>
            <div className="text-sm text-green-600">Activas</div>
          </div>
          <div className={`rounded-lg p-4 ${isEditMode ? 'bg-yellow-50 border border-yellow-200' : 'bg-gray-50'}`}>
            <div className="text-2xl font-bold text-yellow-700">{isEditMode ? 'ACTIVO' : 'INACTIVO'}</div>
            <div className="text-sm text-yellow-600">Modo edición</div>
          </div>
        </div>

        {/* Categories Accordion */}
        <div className="space-y-4">
          {filteredCatalogs.length === 0 ? (
            <div className="text-center py-8">
              <Search className="h-12 w-12 text-gray-400 mx-auto" />
              <h3 className="mt-4 text-sm font-medium text-gray-900">No se encontraron resultados</h3>
              <p className="mt-1 text-sm text-gray-500">
                No hay categorías que coincidan con "{searchTerm}"
              </p>
            </div>
          ) : (
            filteredCatalogs.map((category, index) => (
              <CategoryAccordion 
                key={category.id} 
                category={category} 
                index={index + 1} 
                canUpload={isEditMode ? false : canUpload} // Deshabilitar carga en modo edición
                onRefresh={handleRefreshCatalogo}
                isEditMode={isEditMode}
              />
            ))
          )}
        </div>

        {/* Footer info */}
        <div className="border-t pt-4 text-sm text-muted-foreground">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-medium">{filteredCatalogs.length}</span> de{' '}
              <span className="font-medium">{rootCatalogs.length}</span> categorías mostradas
              {isEditMode && (
                <span className="ml-4 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                  MODO EDICIÓN
                </span>
              )}
            </div>
            <div className="text-right">
              <p>Estructura jerárquica sin límite de niveles</p>
            </div>
          </div>
        </div>
      </div>
    </Container>
  )
}
