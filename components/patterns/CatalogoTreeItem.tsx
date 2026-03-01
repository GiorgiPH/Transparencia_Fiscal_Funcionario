import { useState } from 'react';
import type { CatalogoTreeItem as CatalogoTreeItemType, DocumentoCreateData, DocumentoUpdateData } from '@/types/catalog';
import { ChevronRight, ChevronDown, Folder, FileText, AlertCircle, Download, Upload, Trash2, Plus, Edit, Trash, CheckCircle2 } from 'lucide-react';
import { DocumentoModal } from './DocumentoModal';
import { CatalogoFormModal } from './CatalogoFormModal';
import { useCatalogs } from '@/hooks/useCatalogs';
import { useAuth } from '@/hooks/useAuth';
import { useNotifications } from '@/hooks/useNotifications';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import loading from '@/app/dashboard/catalogos/loading';

interface CatalogoTreeItemProps {
  item: CatalogoTreeItemType;
  level?: number;
  onExpand?: (item: CatalogoTreeItemType) => void;
  onCollapse?: (item: CatalogoTreeItemType) => void;
  onSelect?: (item: CatalogoTreeItemType) => void;
  selectedId?: number | null;
  showDocumentos?: boolean;
  onRefresh?: (catalogoId: number) => Promise<void>; // CAMBIADO: ahora recibe el catalogoId
  onRefreshCatalogo?: (catalogoId: number) => Promise<any>; // Nuevo: refresco específico de catálogo
  onRefreshDocumentos?: (catalogoId: number) => Promise<any>; // Nuevo: refresco específico de documentos
  isEditMode?: boolean;
  onCatalogoCreate?: (parentCatalogo: CatalogoTreeItemType) => void;
  onCatalogoEdit?: (catalogo: CatalogoTreeItemType) => void;
  onCatalogoDelete?: (catalogo: CatalogoTreeItemType) => Promise<boolean>;
}

export function  CatalogoTreeItem({
  item,
  level = 0,
  onExpand,
  onCollapse,
  onSelect,
  selectedId,
  showDocumentos = false,
  onRefresh,
  onRefreshCatalogo,
  onRefreshDocumentos,
  isEditMode = false,
  onCatalogoCreate,
  onCatalogoEdit,
  onCatalogoDelete,
}: CatalogoTreeItemProps) {
  console.log(`🔵 [CatalogoTreeItem] Renderizando item ${item.id} "${item.nombre}", onRefresh existe?:`, !!onRefresh);
  
  const { user } = useAuth();
  const notifications = useNotifications();
  const [isDocumentoModalOpen, setIsDocumentoModalOpen] = useState(false);
  const [isCatalogoModalOpen, setIsCatalogoModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedTipoDocumentoId, setSelectedTipoDocumentoId] = useState<number | null>(null);
  const [selectedDocumentoId, setSelectedDocumentoId] = useState<number | null>(null);

  
  const { createDocument, updateDocument, deleteDocument, createCatalog, updateCatalog, deleteCatalog, refreshDisponibilidadDocumentos } = useCatalogs();
  
  const hasChildren = (item.children && item.children.length > 0) || 
                     (item._count?.children && item._count.children > 0) ||
                     (item.hasChildren === true);
  const isExpanded = item.isExpanded || false;
  const isLoading = item.isLoading || false;
  const isSelected = selectedId === item.id;
  const permiteDocumentos = item.permite_documentos;
  const hasDocumentos = item._count?.documentos && item._count.documentos > 0;

  // Funciones helper para control de permisos basados en rol
  const canDownload = () => {
    const userRole = user?.rol;
    return userRole === "Admin" || userRole === "Edit" || userRole === "Upload";
  };

  const canUpload = () => {
    const userRole = user?.rol;
    return userRole === "Admin" || userRole === "Edit" || userRole === "Upload";
  };

  const canUpdate = () => {
    const userRole = user?.rol;
    return userRole === "Admin" || userRole === "Edit";
  };

  const canDelete = () => {
    const userRole = user?.rol;
    return userRole === "Admin" || userRole === "Edit";
  };

  const canEditCatalogs = () => {
    const userRole = user?.rol;
    return userRole === "Admin" || userRole === "Edit";
  };

  const handleToggle = () => {
    if (isLoading) return;
    
    if (isExpanded && onCollapse) {
      onCollapse(item);
    } else if (!isExpanded && onExpand) {
      onExpand(item);
    }
  };

  const handleClick = () => {
    if (onSelect) {
      onSelect(item);
    }
  };

  const getIcon = () => {
    if (item.icono) {
      // Aquí podrías mapear iconos por nombre
      switch (item.icono.toLowerCase()) {
        case 'filetext':
          return <FileText className="h-4 w-4 text-blue-500" />;
        case 'dollarsign':
          return <FileText className="h-4 w-4 text-green-500" />;
        default:
          return <Folder className="h-4 w-4 text-gray-500" />;
      }
    }
    return <Folder className="h-4 w-4 text-gray-500" />;
  };

  const getStatusBadge = () => {
    if (!permiteDocumentos) {
      return (
        <span className="ml-2 rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
          Categoría
        </span>
      );
    }

    if (hasDocumentos) {
      return (
        <span className="ml-2 rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-800">
          {item._count?.documentos} doc{item._count?.documentos !== 1 ? 's' : ''}
        </span>
      );
    }

    return (
      <span className="ml-2 rounded-full bg-yellow-100 px-2 py-0.5 text-xs text-yellow-800">
        Vacío
      </span>
    );
  };

  const handleDownload = (tipoDocumentoId: number, documentoId?: number) => {
    if (!documentoId) return;
    
    // Construir URL de descarga usando la URL del backend
    // La URL base del backend está configurada en axios-client.ts como 'http://localhost:3001'
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const downloadUrl = `${baseUrl}/busqueda-documentos/${documentoId}/descargar`;
    window.open(downloadUrl, '_blank');
  };

  const handleOpenDocumentoModal = (mode: 'create' | 'edit', tipoDocumentoId?: number, documentoId?: number) => {
    setModalMode(mode);
    setSelectedTipoDocumentoId(tipoDocumentoId || null);
    setSelectedDocumentoId(documentoId || null);

    setIsDocumentoModalOpen(true);
  };

  const handleCloseDocumentoModal = () => {
    setIsDocumentoModalOpen(false);
    setSelectedTipoDocumentoId(null);
  };

  const handleOpenCatalogoModal = (mode: 'create' | 'edit') => {
    setModalMode(mode);
    setIsCatalogoModalOpen(true);
  };

  const handleCloseCatalogoModal = () => {
    setIsCatalogoModalOpen(false);
  };

  const handleSubmitDocumentoModal = async (data: DocumentoCreateData | DocumentoUpdateData) => {

    
    try {
      if (modalMode === 'create') {
        await createDocument(data as FormData);
      } else {
        await updateDocument(selectedDocumentoId!, data as FormData);
      }
      
      
      // Refrescar solo la disponibilidad de documentos usando el nuevo endpoint específico
      if (onRefreshDocumentos) {
        await onRefreshDocumentos(item.id);
      } else if (onRefresh) {
        await onRefresh(item.id);
      } else {
      }
      
      // Pequeño delay para asegurar que la UI se actualice
      console.log('🔵 [CatalogoTreeItem] Esperando 100ms para UI...');
      await new Promise(resolve => setTimeout(resolve, 100));
      
      console.log('🔵 [CatalogoTreeItem] Cerrando modal...');
      handleCloseDocumentoModal();
    } catch (error) {
      console.error('❌ [CatalogoTreeItem] Error al guardar documento:', error);
      throw error;
    }
  };

  const handleSubmitCatalogoModal = async (data: any) => {
    console.log('🔵 [CatalogoTreeItem] handleSubmitCatalogoModal llamado, modalMode:', modalMode);
    
    try {
      if (modalMode === 'create') {
        console.log('🔵 [CatalogoTreeItem] Creando catálogo...');
        await createCatalog(data);
        if (onCatalogoCreate) {
          onCatalogoCreate(item);
        }
      } else {
        console.log('🔵 [CatalogoTreeItem] Actualizando catálogo ID:', item.id);
        await updateCatalog(item.id, data);
        if (onCatalogoEdit) {
          onCatalogoEdit(item);
        }
      }
      
      console.log('🔵 [CatalogoTreeItem] Catálogo guardado exitosamente');
      
      // Refrescar el catálogo específico usando el nuevo endpoint
      if (onRefreshCatalogo) {
        console.log('🔵 [CatalogoTreeItem] Llamando a onRefreshCatalogo() con catalogoId:', item.id);
        await onRefreshCatalogo(item.id);
        console.log('🔵 [CatalogoTreeItem] onRefreshCatalogo() completado');
      } else if (onRefresh) {
        // Fallback al método antiguo si no hay onRefreshCatalogo
        console.log('🔵 [CatalogoTreeItem] Llamando a onRefresh() con catalogoId:', item.id);
        await onRefresh(item.id);
        console.log('🔵 [CatalogoTreeItem] onRefresh() completado');
      } else {
        console.warn('⚠️ [CatalogoTreeItem] No hay método de refresco disponible!');
      }
      
      // Pequeño delay para asegurar que la UI se actualice
      console.log('🔵 [CatalogoTreeItem] Esperando 100ms para UI...');
      await new Promise(resolve => setTimeout(resolve, 100));
      
      console.log('🔵 [CatalogoTreeItem] Cerrando modal...');
      handleCloseCatalogoModal();
    } catch (error) {
      console.error('❌ [CatalogoTreeItem] Error al guardar catálogo:', error);
      throw error;
    }
  };

  const handleDeleteCatalogo = async () => {
    // Validar si el catálogo tiene documentos
    const hasDocuments = item._count?.documentos && item._count.documentos > 0;
    const documentCount = item._count?.documentos || 0;
    
    const confirmed = await notifications.confirmDelete(
      `catálogo "${item.nombre}"`,
      hasDocuments ? `Este catálogo tiene ${documentCount} documento(s) asociados. Esta acción eliminará también todos los documentos asociados y no se puede deshacer.` : undefined
    );
    
    if (!confirmed) return;
    
    try {
      const success = await deleteCatalog(item.id);
      if (success && onCatalogoDelete) {
        await onCatalogoDelete(item);
      }
      
      // Refrescar el catálogo padre después de eliminar
      const parentId = item.parent_id || item.id;
      if (onRefreshCatalogo && parentId !== item.id) {
        await onRefreshCatalogo(parentId);
      } else if (onRefresh) {
        await onRefresh(parentId);
        console.log('🔴 [CatalogoTreeItem] onRefresh() completado');
      } else {
        console.warn('⚠️ [CatalogoTreeItem] No hay método de refresco disponible!');
      }
      
    } catch (error) {
      console.error('❌ [CatalogoTreeItem] Error al eliminar catálogo:', error);
    }
  };

  const handleDeleteDocumento = async (tipoDocumentoId: number, documentoId?: number) => {
    if (!documentoId) return;
    
    // Confirmación antes de eliminar usando SweetAlert2
    const confirmed = await notifications.confirmDelete(
      'documento',
      'Esta acción no se puede deshacer.'
    );
    
    if (!confirmed) return;
    
    console.log('🔴 [CatalogoTreeItem] Eliminando documento ID:', documentoId);
    
    try {
      await deleteDocument(documentoId);
      console.log('🔴 [CatalogoTreeItem] Documento eliminado exitosamente');
      
      // Refrescar solo la disponibilidad de documentos usando el nuevo endpoint específico
      if (onRefreshDocumentos) {
        console.log('🔴 [CatalogoTreeItem] Llamando a onRefreshDocumentos() con catalogoId:', item.id);
        await onRefreshDocumentos(item.id);
        console.log('🔴 [CatalogoTreeItem] onRefreshDocumentos() completado');
      } else if (onRefresh) {
        // Fallback al método antiguo si no hay onRefreshDocumentos
        console.log('🔴 [CatalogoTreeItem] Llamando a onRefresh() con catalogoId:', item.id);
        await onRefresh(item.id);
        console.log('🔴 [CatalogoTreeItem] onRefresh() completado');
      } else {
        console.warn('⚠️ [CatalogoTreeItem] No hay método de refresco disponible!');
      }
      
      // Pequeño delay para asegurar que la UI se actualice
      console.log('🔴 [CatalogoTreeItem] Esperando 100ms para UI...');
      await new Promise(resolve => setTimeout(resolve, 100));
      
    } catch (error) {
      console.error('❌ [CatalogoTreeItem] Error al eliminar documento:', error);
      notifications.showError('Error al eliminar el documento', {
        description: 'Por favor, intente nuevamente.'
      });
      throw error;
    }
  };

  return (
    <div className="select-none">
      <div
        className={`flex items-center py-2 px-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer ${
          isSelected ? 'bg-blue-50 border border-blue-200' : ''
        }`}
        style={{ paddingLeft: `${level * 24 + 12}px` }}
        onClick={handleClick}
      >
        {/* Toggle button for expandable items */}
        {hasChildren ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleToggle();
            }}
            className="mr-2 flex h-6 w-6 items-center justify-center rounded hover:bg-gray-200"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-500"></div>
            ) : isExpanded ? (
              <ChevronDown className="h-4 w-4 text-gray-500" />
            ) : (
              <ChevronRight className="h-4 w-4 text-gray-500" />
            )}
          </button>
        ) : (
          <div className="mr-2 h-6 w-6"></div>
        )}

        {/* Icon */}
        <div className="mr-3">{getIcon()}</div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center">
            <h3 className="font-medium text-gray-900 truncate">{item.nombre}</h3>
            {getStatusBadge()}
          </div>
          
          {item.descripcion && (
            <p className="text-sm text-gray-500 truncate mt-0.5">{item.descripcion}</p>
          )}

          {/* Metadata */}
          <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
            <span>Nivel {item.nivel}</span>
            <span>•</span>
            <span>Orden {item.orden}</span>
            {item._count?.children && item._count.children > 0 && (
              <>
                <span>•</span>
                <span>{item._count.children} subcat.</span>
              </>
            )}
          </div>
        </div>

        {/* Status indicator */}
        {!item.activo && (
          <AlertCircle className="h-4 w-4 text-red-500 ml-2" aria-label="Inactivo" />
        )}

        {/* Action buttons in edit mode */}
        {isEditMode && (
           <div className="flex items-center gap-1 ml-2" onClick={(e) => e.stopPropagation()}>
           {/* Botón Agregar subcatálogo - deshabilitado si permite documentos */}
           <Button
             onClick={() => handleOpenCatalogoModal('create')}
             size="sm"
             variant="ghost"
             className="h-7 w-7 p-0 hover:bg-blue-100 hover:text-blue-700 text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
             title={permiteDocumentos ? "No se pueden agregar subcatálogos a un catálogo que permite documentos" : "Agregar subcatálogo"}
             disabled={permiteDocumentos}
           >
             <Plus className="h-3.5 w-3.5" />
           </Button>
           <Button
             onClick={() => handleOpenCatalogoModal('edit')}
             size="sm"
             variant="ghost"
             className="h-7 w-7 p-0 hover:bg-amber-100 hover:text-amber-700 text-amber-600"
             title="Editar catálogo"
           >
             <Edit className="h-3.5 w-3.5" />
           </Button>
           <Button
             onClick={handleDeleteCatalogo}
             size="sm"
             variant="ghost"
             className="h-7 w-7 p-0 hover:bg-red-100 hover:text-red-700 text-red-600"
             title="Eliminar catálogo"
           >
             <Trash className="h-3.5 w-3.5" />
           </Button>
         </div>
        )}
      </div>

      {/* Children */}
      {isExpanded && hasChildren && item.children && (
        <div>
          {item.children.map((child) => (
            <CatalogoTreeItem
              key={child.id}
              item={child}
              level={level + 1}
              onExpand={onExpand}
              onCollapse={onCollapse}
              onSelect={onSelect}
              selectedId={selectedId}
              showDocumentos={showDocumentos}
              onRefresh={onRefresh}
              isEditMode={isEditMode}
              onCatalogoCreate={onCatalogoCreate}
              onCatalogoEdit={onCatalogoEdit}
              onCatalogoDelete={onCatalogoDelete}
            />
          ))}
        </div>
      )}

      {/* Documentos section (only for leaf nodes that allow documents) */}
      {/*showDocumentos && isExpanded &&*/ permiteDocumentos && item.disponibilidadTiposDocumento && (
         <div style={{ paddingLeft: `${(level + 1) * 24 + 12}px` }} className="mt-3">
         <Card className="shadow-sm">
           <CardHeader className="pb-3 space-y-0">
             <div className="flex items-center justify-between">
               <CardTitle className="text-base font-medium">Documentos disponibles</CardTitle>
               <Badge variant="secondary" className="text-xs">
                 {item.disponibilidadTiposDocumento.filter(d => d.disponible).length}/{item.disponibilidadTiposDocumento.length}
               </Badge>
             </div>
           </CardHeader>
           <CardContent className="pt-0">
             <div className="space-y-2">
               {item.disponibilidadTiposDocumento.map((tipo) => (
                 <div
                   key={tipo.tipoDocumentoId}
                   className={`flex items-center justify-between p-2.5 rounded-lg border transition-colors ${
                     tipo.disponible
                       ? 'border-green-200 bg-green-50/50 hover:bg-green-50'
                       : 'border-border bg-background hover:bg-muted/50'
                   }`}
                 >
                   {/* Left side - File info */}
                   <div className="flex items-center gap-2.5 min-w-0 flex-1">
                     <div className={`flex-shrink-0 p-1.5 rounded ${
                       tipo.disponible ? 'bg-green-100' : 'bg-muted'
                     }`}>
                       <FileText className={`h-3.5 w-3.5 ${
                         tipo.disponible ? 'text-green-700' : 'text-muted-foreground'
                       }`} />
                     </div>
                     
                     <div className="min-w-0 flex-1">
                       <div className="flex items-center gap-1.5">
                         <span className="font-medium text-sm">{tipo.nombre}</span>
                         <span className="text-xs text-muted-foreground">.{tipo.extension}</span>
                       </div>
                       {tipo.disponible && tipo.documentoNombre && (
                         <div className="text-xs text-muted-foreground truncate">
                           {tipo.documentoNombre}
                         </div>
                       )}
                     </div>
   
                     {/* Status badge */}
                     {tipo.disponible ? (
                       <Badge variant="default" className="bg-green-600 hover:bg-green-700 text-xs flex-shrink-0 gap-1">
                         <CheckCircle2 className="h-3 w-3" />
                         Disponible
                       </Badge>
                     ) : (
                       <span className="text-xs text-muted-foreground flex-shrink-0">No disponible</span>
                     )}
                   </div>
   
                   {/* Right side - Actions */}
                   <div className="flex items-center gap-1.5 ml-3 flex-shrink-0">
                     {tipo.disponible ? (
                       <>
                         {canDownload() && (
                           <Button
                             onClick={() => handleDownload(tipo.tipoDocumentoId, tipo.documentoId)}
                             size="sm"
                             variant="ghost"
                             className="h-7 px-2 text-green-700 hover:text-green-800 hover:bg-green-100"
                           >
                             <Download className="h-3.5 w-3.5 mr-1" />
                             Descargar
                           </Button>
                         )}
                         {canUpdate() && (
                           <Button
                             onClick={() => handleOpenDocumentoModal('edit', tipo.tipoDocumentoId, tipo.documentoId)}
                             size="sm"
                             variant="ghost"
                             className="h-7 px-2 text-blue-700 hover:text-blue-800 hover:bg-blue-100"
                           >
                             <Upload className="h-3.5 w-3.5 mr-1" />
                             Actualizar
                           </Button>
                         )}
                         {canDelete() && (
                           <Button
                             onClick={() => handleDeleteDocumento(tipo.tipoDocumentoId, tipo.documentoId)}
                             size="sm"
                             variant="ghost"
                             className="h-7 w-7 p-0 text-red-700 hover:text-red-800 hover:bg-red-100"
                           >
                             <Trash2 className="h-3.5 w-3.5" />
                           </Button>
                         )}
                       </>
                     ) : (
                       canUpload() && (
                         <Button
                           onClick={() => handleOpenDocumentoModal('create', tipo.tipoDocumentoId)}
                           size="sm"
                           variant="ghost"
                           className="h-7 px-2 hover:bg-muted"
                         >
                           <Upload className="h-3.5 w-3.5 mr-1" />
                           Subir
                         </Button>
                       )
                     )}
                   </div>
                 </div>
               ))}
             </div>
           </CardContent>
         </Card>
       </div>
      )}

      {/* Documento Modal */}
      <DocumentoModal
        isOpen={isDocumentoModalOpen}
        onClose={handleCloseDocumentoModal}
        onSubmit={handleSubmitDocumentoModal}
        mode={modalMode}
        catalogo={item}
        documentoId={selectedDocumentoId}
        tipoDocumentoId={selectedTipoDocumentoId}
      />

      {/* Catalogo Modal */}
      <CatalogoFormModal
        open={isCatalogoModalOpen}
        onClose={handleCloseCatalogoModal}
        onSubmit={handleSubmitCatalogoModal}
        catalogo={modalMode === 'edit' ? item : null}
        parentCatalogo={modalMode === 'create' ? item : null}
        mode={modalMode}
      />
    </div>
  );
}
