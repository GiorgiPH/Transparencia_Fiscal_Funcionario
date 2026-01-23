"use client"

import { useState, useEffect } from 'react';
import { CatalogoTreeItem } from './CatalogoTreeItem';
import { useCatalogs } from '@/hooks/useCatalogs';
import type { CatalogoTreeItem as CatalogoTreeItemType } from '@/types/catalog';
import { Search, RefreshCw, Filter, Download, Folder, Edit, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CatalogoTreeContainerProps {
  showDocumentos?: boolean;
  onCatalogoSelect?: (catalogo: CatalogoTreeItemType) => void;
  initialSelectedId?: number | null;
}

export function CatalogoTreeContainer({
  showDocumentos = false,
  onCatalogoSelect,
  initialSelectedId = null,
}: CatalogoTreeContainerProps) {
  const {
    catalogosTree,
    isLoading,
    error,
    fetchCatalogoTree,
    expandCatalogo,
    collapseCatalogo,
    refreshCatalogo,
    refreshCatalogoEspecifico,
    refreshDisponibilidadDocumentos,
    mockFetchCatalogosRaices,
    clearError,
    createCatalog,
    updateCatalog,
    deleteCatalog,
  } = useCatalogs();

  const [isEditMode, setIsEditMode] = useState(false);

  const [selectedId, setSelectedId] = useState<number | null>(initialSelectedId);
  const [searchTerm, setSearchTerm] = useState('');
  const [showInactive, setShowInactive] = useState(false);
  const [useMockData, setUseMockData] = useState(false);

  useEffect(() => {
    loadCatalogos();
  }, [useMockData]);

  const loadCatalogos = async () => {
    if (useMockData) {
      await mockFetchCatalogosRaices();
    } else {
      await fetchCatalogoTree();
    }
  };

  const handleExpand = async (item: CatalogoTreeItemType) => {
    try {
      await expandCatalogo(item);
    } catch (err) {
      console.error('Error al expandir catálogo:', err);
    }
  };

  const handleCollapse = (item: CatalogoTreeItemType) => {
    collapseCatalogo(item.id);
  };

  const handleSelect = (item: CatalogoTreeItemType) => {
    setSelectedId(item.id);
    if (onCatalogoSelect) {
      onCatalogoSelect(item);
    }
  };

  const handleRefresh = () => {
    clearError();
    loadCatalogos();
  };

  const handleRefreshCatalogo = async (catalogoId: number) => {
    console.log("🟢 [CatalogoTreeContainer] handleRefreshCatalogo llamado con catalogoId:", catalogoId);
    console.log("🟢 [CatalogoTreeContainer] refreshCatalogo existe?:", !!refreshCatalogo);
    
    try {
      // Usar el nuevo método refreshCatalogo que está diseñado para refrescar un catálogo específico
      console.log("🟢 [CatalogoTreeContainer] Llamando a refreshCatalogo...");
      await refreshCatalogo(catalogoId);
      console.log("🟢 [CatalogoTreeContainer] refreshCatalogo completado exitosamente");
    } catch (error) {
      console.error("🔴 [CatalogoTreeContainer] Error en handleRefreshCatalogo:", error);
    }
  };

  // Nuevos handlers para refresco específico
  const handleRefreshCatalogoEspecifico = async (catalogoId: number) => {
    console.log("🟢 [CatalogoTreeContainer] handleRefreshCatalogoEspecifico llamado con catalogoId:", catalogoId);
    
    try {
      // Usar el nuevo endpoint específico para catálogos
      console.log("🟢 [CatalogoTreeContainer] Llamando a refreshCatalogoEspecifico...");
      await refreshCatalogoEspecifico(catalogoId);
      console.log("🟢 [CatalogoTreeContainer] refreshCatalogoEspecifico completado exitosamente");
    } catch (error) {
      console.error("🔴 [CatalogoTreeContainer] Error en handleRefreshCatalogoEspecifico:", error);
    }
  };

  const handleRefreshDisponibilidadDocumentos = async (catalogoId: number) => {
    console.log("🟢 [CatalogoTreeContainer] handleRefreshDisponibilidadDocumentos llamado con catalogoId:", catalogoId);
    
    try {
      // Usar el nuevo endpoint específico para disponibilidad de documentos
      console.log("🟢 [CatalogoTreeContainer] Llamando a refreshDisponibilidadDocumentos...");
      await refreshDisponibilidadDocumentos(catalogoId);
      console.log("🟢 [CatalogoTreeContainer] refreshDisponibilidadDocumentos completado exitosamente");
    } catch (error) {
      console.error("🔴 [CatalogoTreeContainer] Error en handleRefreshDisponibilidadDocumentos:", error);
    }
  };

  const handleToggleMockData = () => {
    setUseMockData(!useMockData);
  };

  const handleCatalogoCreate = (parentCatalogo: CatalogoTreeItemType) => {
    console.log('🟢 [CatalogoTreeContainer] Catálogo creado bajo:', parentCatalogo.nombre);
    // El refresh se maneja en el CatalogoTreeItem
  };

  const handleCatalogoEdit = (catalogo: CatalogoTreeItemType) => {
    console.log('🟢 [CatalogoTreeContainer] Catálogo editado:', catalogo.nombre);
    // El refresh se maneja en el CatalogoTreeItem
  };

  const handleCatalogoDelete = async (catalogo: CatalogoTreeItemType): Promise<boolean> => {
    console.log('� [CatalogoTreeContainer] Catálogo eliminado:', catalogo.nombre);
    // El refresh se maneja en el CatalogoTreeItem
    return true;
  };

  const filteredCatalogos = catalogosTree.filter(item => {
    // Filter by search term
    if (searchTerm && !item.nombre.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !item.descripcion?.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    // Filter by active status
    if (!showInactive && !item.activo) {
      return false;
    }
    
    return true;
  });

  const getStats = () => {
    const total = catalogosTree.length;
    const active = catalogosTree.filter(item => item.activo).length;
    const withDocuments = catalogosTree.filter(item => 
      item.permite_documentos && item._count?.documentos && item._count.documentos > 0
    ).length;
    
    return { total, active, withDocuments };
  };

  const stats = getStats();

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Catálogos MTTF</h2>
            <p className="text-sm text-gray-500">Modelo Temático de Transparencia Fiscal</p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleToggleMockData}
              className={`px-3 py-1.5 text-sm rounded-md ${
                useMockData 
                  ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' 
                  : 'bg-blue-100 text-blue-800 border border-blue-200'
              }`}
            >
              {useMockData ? 'Usando Mock' : 'API Real'}
            </button>
            <button
              onClick={handleRefresh}
              disabled={isLoading}
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              {isLoading ? 'Cargando...' : 'Refrescar'}
            </button>
            <Button
              onClick={() => setIsEditMode(!isEditMode)}
              variant={isEditMode ? "destructive" : "default"}
              className="inline-flex items-center"
            >
              {isEditMode ? (
                <>
                  <X className="h-4 w-4 mr-2" />
                  Salir modo edición
                </>
              ) : (
                <>
                  <Edit className="h-4 w-4 mr-2" />
                  Administrar catálogos
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-3 mb-4">
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
            <div className="text-sm text-gray-600">Total catálogos</div>
          </div>
          <div className="bg-green-50 rounded-lg p-3">
            <div className="text-2xl font-bold text-green-700">{stats.active}</div>
            <div className="text-sm text-green-600">Activos</div>
          </div>
          <div className="bg-blue-50 rounded-lg p-3">
            <div className="text-2xl font-bold text-blue-700">{stats.withDocuments}</div>
            <div className="text-sm text-blue-600">Con documentos</div>
          </div>
          <div className={`rounded-lg p-3 ${isEditMode ? 'bg-yellow-50 border border-yellow-200' : 'bg-gray-50'}`}>
            <div className="text-2xl font-bold text-yellow-700">{isEditMode ? 'ACTIVO' : 'INACTIVO'}</div>
            <div className="text-sm text-yellow-600">Modo edición</div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar catálogo por nombre o descripción..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowInactive(!showInactive)}
              className={`inline-flex items-center px-3 py-2 border rounded-md text-sm font-medium ${
                showInactive
                  ? 'bg-red-100 text-red-800 border-red-300'
                  : 'bg-gray-100 text-gray-800 border-gray-300'
              }`}
            >
              <Filter className="h-4 w-4 mr-2" />
              {showInactive ? 'Mostrando inactivos' : 'Ocultar inactivos'}
            </button>
          </div>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg m-4 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
              <div className="mt-4">
                <button
                  type="button"
                  onClick={clearError}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Loading state */}
      {isLoading && catalogosTree.length === 0 && (
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando estructura de catálogos...</p>
          </div>
        </div>
      )}

      {/* Empty state */}
      {!isLoading && catalogosTree.length === 0 && (
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center">
            <Folder className="h-12 w-12 text-gray-400 mx-auto" />
            <h3 className="mt-4 text-sm font-medium text-gray-900">No hay catálogos</h3>
            <p className="mt-1 text-sm text-gray-500">
              {useMockData 
                ? 'Los datos de prueba no están disponibles' 
                : 'No se encontraron catálogos en el sistema.'}
            </p>
            <div className="mt-6">
              <button
                onClick={handleRefresh}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Reintentar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit mode warning */}
      {isEditMode && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg m-4 p-4">
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

      {/* Tree view */}
      {!isLoading && catalogosTree.length > 0 && (
        <div className="flex-1 overflow-y-auto p-4">
          {filteredCatalogos.length === 0 ? (
            <div className="text-center py-8">
              <Search className="h-12 w-12 text-gray-400 mx-auto" />
              <h3 className="mt-4 text-sm font-medium text-gray-900">No se encontraron resultados</h3>
              <p className="mt-1 text-sm text-gray-500">
                No hay catálogos que coincidan con "{searchTerm}"
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              {filteredCatalogos.map((item) => {
                console.log(`🟢 [CatalogoTreeContainer] Renderizando CatalogoTreeItem para item ${item.id} "${item.nombre}"`);
                return (
                    <CatalogoTreeItem
                      key={item.id}
                      item={item}
                      onExpand={handleExpand}
                      onCollapse={handleCollapse}
                      onSelect={handleSelect}
                      selectedId={selectedId}
                      showDocumentos={isEditMode ? false : showDocumentos} // Deshabilitar documentos en modo edición
                      onRefresh={() => handleRefreshCatalogo(item.id)}
                      onRefreshCatalogo={() => handleRefreshCatalogoEspecifico(item.id)}
                      onRefreshDocumentos={() => handleRefreshDisponibilidadDocumentos(item.id)}
                      isEditMode={isEditMode}
                      onCatalogoCreate={handleCatalogoCreate}
                      onCatalogoEdit={handleCatalogoEdit}
                      onCatalogoDelete={handleCatalogoDelete}
                    />
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="border-t border-gray-200 bg-gray-50 p-4">
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div>
            <span className="font-medium">{filteredCatalogos.length}</span> de{' '}
            <span className="font-medium">{catalogosTree.length}</span> catálogos mostrados
            {isEditMode && (
              <span className="ml-4 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                MODO EDICIÓN
              </span>
            )}
          </div>
          <div className="flex items-center">
            <Download className="h-4 w-4 mr-2" />
            <span>Estructura jerárquica sin límite de niveles</span>
          </div>
        </div>
      </div>
    </div>
  );
}
