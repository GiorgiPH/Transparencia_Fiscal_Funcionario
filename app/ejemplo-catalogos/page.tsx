"use client"

import { CatalogoTreeContainer } from "@/components/patterns/CatalogoTreeContainer"
import { DocumentoModal } from "@/components/patterns/DocumentoModal"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import type { CatalogoTreeItem } from "@/types/catalog"
import { Upload, FileText, Shield, Info } from "lucide-react"

export default function EjemploCatalogosPage() {
  const [selectedCatalogo, setSelectedCatalogo] = useState<CatalogoTreeItem | null>(null)
  const [showDocumentoModal, setShowDocumentoModal] = useState(false)
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create')

  const handleCatalogoSelect = (catalogo: CatalogoTreeItem) => {
    setSelectedCatalogo(catalogo)
    console.log('Catálogo seleccionado:', catalogo)
  }

  const handleCreateDocumento = () => {
    if (!selectedCatalogo) return
    setModalMode('create')
    setShowDocumentoModal(true)
  }

  const handleDocumentoModalClose = () => {
    setShowDocumentoModal(false)
  }

  const handleDocumentoModalSubmit = async (data: any) => {
    console.log('Documento submit:', data)
    // Aquí iría la lógica real para crear/actualizar documento
    alert(`Documento ${modalMode === 'create' ? 'creado' : 'actualizado'} exitosamente`)
    setShowDocumentoModal(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Ejemplo: Módulo de Catálogos MTTF</h1>
          <p className="text-gray-600 mt-2">
            Demostración del módulo de administración de catálogos del Modelo Temático de Transparencia Fiscal
          </p>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg border p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Estructura Jerárquica</h3>
                <p className="text-sm text-gray-600">Sin límite de niveles</p>
              </div>
            </div>
            <p className="text-gray-700">
              Catálogos organizados en categorías y subcategorías con expansión dinámica.
            </p>
          </div>

          <div className="bg-white rounded-lg border p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-green-100 p-3 rounded-full">
                <Upload className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Gestión de Documentos</h3>
                <p className="text-sm text-gray-600">CRUD completo</p>
              </div>
            </div>
            <p className="text-gray-700">
              Carga, edición y eliminación de documentos por tipo en cada catálogo.
            </p>
          </div>

          <div className="bg-white rounded-lg border p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-purple-100 p-3 rounded-full">
                <Shield className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Control de Accesos</h3>
                <p className="text-sm text-gray-600">Por roles de usuario</p>
              </div>
            </div>
            <p className="text-gray-700">
              Administrador, Usuario de Carga y Usuario de Edición con permisos diferenciados.
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Tree */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
              <div className="border-b p-4 bg-gray-50">
                <h2 className="text-xl font-semibold text-gray-900">Árbol de Catálogos MTTF</h2>
                <p className="text-sm text-gray-600 mt-1">
                  Explore la estructura jerárquica. Haga clic en un catálogo para ver detalles.
                </p>
              </div>
              <div className="h-[600px]">
                <CatalogoTreeContainer
                  showDocumentos={true}
                  onCatalogoSelect={handleCatalogoSelect}
                  initialSelectedId={selectedCatalogo?.id}
                />
              </div>
            </div>
          </div>

          {/* Right Column - Details */}
          <div className="space-y-6">
            {/* Selected Catalogo Info */}
            <div className="bg-white rounded-lg border p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Detalles del Catálogo</h2>
              
              {selectedCatalogo ? (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-gray-900">{selectedCatalogo.nombre}</h3>
                    {selectedCatalogo.descripcion && (
                      <p className="text-gray-600 text-sm mt-1">{selectedCatalogo.descripcion}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Nivel</p>
                      <p className="font-medium">{selectedCatalogo.nivel}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Orden</p>
                      <p className="font-medium">{selectedCatalogo.orden}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Estado</p>
                      <p className={`font-medium ${selectedCatalogo.activo ? 'text-green-600' : 'text-red-600'}`}>
                        {selectedCatalogo.activo ? 'Activo' : 'Inactivo'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Permite documentos</p>
                      <p className="font-medium">{selectedCatalogo.permite_documentos ? 'Sí' : 'No'}</p>
                    </div>
                  </div>

                  {selectedCatalogo.permite_documentos && (
                    <div className="pt-4 border-t">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-gray-900">Acciones</h4>
                        <Button onClick={handleCreateDocumento} size="sm">
                          <Upload className="h-4 w-4 mr-2" />
                          Cargar Documento
                        </Button>
                      </div>
                      <p className="text-sm text-gray-600">
                        Este catálogo permite cargar documentos. Solo un documento por tipo.
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Info className="h-12 w-12 text-gray-400 mx-auto" />
                  <p className="text-gray-600 mt-4">Seleccione un catálogo para ver sus detalles</p>
                </div>
              )}
            </div>

            {/* API Endpoints Info */}
            <div className="bg-white rounded-lg border p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Endpoints API</h2>
              <div className="space-y-3">
                <div className="p-3 bg-gray-50 rounded">
                  <code className="text-sm font-mono text-blue-600">GET /admin/catalogos/raices</code>
                  <p className="text-sm text-gray-600 mt-1">Obtiene catálogos raíz con iconos</p>
                </div>
                <div className="p-3 bg-gray-50 rounded">
                  <code className="text-sm font-mono text-blue-600">GET /admin/catalogos/&#123;id&#125;/hijos</code>
                  <p className="text-sm text-gray-600 mt-1">Obtiene hijos de un catálogo</p>
                </div>
                <div className="p-3 bg-gray-50 rounded">
                  <code className="text-sm font-mono text-blue-600">POST /admin/documentos</code>
                  <p className="text-sm text-gray-600 mt-1">Crea documento (multipart/form-data)</p>
                </div>
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="font-semibold text-blue-900 mb-3">Instrucciones de uso</h3>
              <ol className="list-decimal list-inside space-y-2 text-sm text-blue-800">
                <li>Explore el árbol de catálogos expandiendo los nodos</li>
                <li>Seleccione un catálogo para ver sus detalles</li>
                <li>En catálogos que permiten documentos, verá los tipos disponibles</li>
                <li>Use el botón "Cargar Documento" para subir archivos</li>
                <li>Cambie entre datos mock y API real usando el botón superior</li>
              </ol>
            </div>
          </div>
        </div>

        {/* Documento Modal */}
        {showDocumentoModal && selectedCatalogo && (
          <DocumentoModal
            isOpen={showDocumentoModal}
            onClose={handleDocumentoModalClose}
            onSubmit={handleDocumentoModalSubmit}
            mode={modalMode}
            catalogo={selectedCatalogo}
          />
        )}

        {/* Footer */}
        <div className="mt-8 pt-8 border-t text-center text-gray-600 text-sm">
          <p>Módulo de Catálogos MTTF • Transparencia Fiscal • Implementación con Next.js 14 + TypeScript</p>
          <p className="mt-2">Patrones aplicados: Layered Architecture, Custom Hooks, Service Layer, Presentational/Container</p>
        </div>
      </div>
    </div>
  )
}
