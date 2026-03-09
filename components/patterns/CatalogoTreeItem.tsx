import React, { useCallback, useMemo, useState } from 'react';
import type { CatalogoTreeItem as CatalogoTreeItemType } from '@/types/catalog';
import type { Periodicidad as PeriodicidadType } from '@/services/periodicidadService';
import { ChevronRight, ChevronDown, Folder, FileText, AlertCircle, Download, Upload, Trash2, Plus, Edit, Trash, CheckCircle2 } from 'lucide-react';
import { PeriodicidadSelectors } from './PeriodicidadSelectors';
import { useAuth } from '@/hooks/useAuth';
import { useNotifications } from '@/hooks/useNotifications';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';

interface CatalogoTreeItemProps {
  item: CatalogoTreeItemType;
  level?: number;
  onExpand?: (item: CatalogoTreeItemType) => void;
  onCollapse?: (item: CatalogoTreeItemType) => void;
  onSelect?: (item: CatalogoTreeItemType) => void;
  selectedId?: number | null;
  showDocumentos?: boolean;
  onRefresh?: (catalogoId: number) => Promise<void>;
  onRefreshCatalogo?: (catalogoId: number) => Promise<any>;
  onRefreshDocumentos?: (catalogoId: number) => Promise<any>;
  isEditMode?: boolean;
  onCatalogoCreate?: (parentCatalogo: CatalogoTreeItemType) => void;
  onCatalogoEdit?: (catalogo: CatalogoTreeItemType) => void;
  onCatalogoDelete?: (catalogo: CatalogoTreeItemType) => Promise<boolean>;
  // New props for modals and actions
  onOpenDocumentoModal?: (mode: 'create' | 'edit', catalogoId: number, tipoDocumentoId?: number, documentoId?: number, selectedYear?: number | null, selectedPeriod?: number | null) => void;
  onOpenCatalogoModal?: (mode: 'create' | 'edit', catalogoId: number) => void;
  onDeleteDocumento?: (catalogoId: number, tipoDocumentoId: number, documentoId?: number, selectedYear?: number | null, selectedPeriod?: number | null) => Promise<void>;
  onDeleteCatalogo?: (catalogoId: number) => Promise<void>;
  onDownloadDocumento?: (documentoId: number) => void;
  onLoadDocumentsByPeriod?: (catalogoId: number, year: number, period?: number) => Promise<void>;
}

function CatalogoTreeItemComponent({
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
  // New props
  onOpenDocumentoModal,
  onOpenCatalogoModal,
  onDeleteDocumento,
  onDeleteCatalogo,
  onDownloadDocumento,
  onLoadDocumentsByPeriod,
}: CatalogoTreeItemProps) {
  const { user } = useAuth();
  const notifications = useNotifications();

  // Estado local para año y periodo seleccionados
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<number | null>(null);

  const hasChildren = useMemo(() => 
    (item.children && item.children.length > 0) || 
    (item._count?.children && item._count.children > 0) ||
    (item.hasChildren === true),
    [item.children, item._count?.children, item.hasChildren]
  );

  const isExpanded = item.isExpanded || false;
  const isLoading = item.isLoading || false;
  const isSelected = selectedId === item.id;
  const permiteDocumentos = item.permite_documentos;
  const hasDocumentos = item._count?.documentos && item._count.documentos > 0;

  // Memoized permission functions
  const canDownload = useCallback(() => {
    const userRole = user?.rol;
    return userRole === "Admin" || userRole === "Edit" || userRole === "Upload";
  }, [user?.rol]);

  const canUpload = useCallback(() => {
    const userRole = user?.rol;
    return userRole === "Admin" || userRole === "Edit" || userRole === "Upload";
  }, [user?.rol]);

  const canUpdate = useCallback(() => {
    const userRole = user?.rol;
    return userRole === "Admin" || userRole === "Edit";
  }, [user?.rol]);

  const canDelete = useCallback(() => {
    const userRole = user?.rol;
    return userRole === "Admin" || userRole === "Edit";
  }, [user?.rol]);

  const canEditCatalogs = useCallback(() => {
    const userRole = user?.rol;
    return userRole === "Admin" || userRole === "Edit";
  }, [user?.rol]);

  // Memoized handlers
  const handleToggle = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (isLoading) return;
    
    if (isExpanded && onCollapse) {
      onCollapse(item);
    } else if (!isExpanded && onExpand) {
      onExpand(item);
    }
  }, [isLoading, isExpanded, onCollapse, onExpand, item]);

  const handleClick = useCallback(() => {
    if (onSelect) {
      onSelect(item);
    }
  }, [onSelect, item]);

  const getIcon = useCallback(() => {
    if (item.icono) {
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
  }, [item.icono]);

  const getStatusBadge = useCallback(() => {
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
  }, [permiteDocumentos, hasDocumentos, item._count?.documentos]);

  const handleDownload = useCallback((documentoId?: number) => {
    if (!documentoId || !onDownloadDocumento) return;
    onDownloadDocumento(documentoId);
  }, [onDownloadDocumento]);

  const handleOpenDocumentoModal = useCallback((mode: 'create' | 'edit', tipoDocumentoId?: number, documentoId?: number) => {
    if (onOpenDocumentoModal) {
      onOpenDocumentoModal(mode, item.id, tipoDocumentoId, documentoId, selectedYear, selectedPeriod);
    }
  }, [onOpenDocumentoModal, item.id, selectedYear, selectedPeriod]);

  const handleOpenCatalogoModal = useCallback((mode: 'create' | 'edit') => {
    if (onOpenCatalogoModal) {
      onOpenCatalogoModal(mode, item.id);
    }
  }, [onOpenCatalogoModal, item.id]);

  const handleDeleteCatalogo = useCallback(async () => {
    if (!onDeleteCatalogo) return;
    
    const hasDocuments = item._count?.documentos && item._count.documentos > 0;
    const documentCount = item._count?.documentos || 0;
    
    const confirmed = await notifications.confirmDelete(
      `catálogo "${item.nombre}"`,
      hasDocuments ? `Este catálogo tiene ${documentCount} documento(s) asociados. Esta acción eliminará también todos los documentos asociados y no se puede deshacer.` : undefined
    );
    
    if (!confirmed) return;
    
    try {
      await onDeleteCatalogo(item.id);
    } catch (error) {
      // Error handling is done in the parent component
    }
  }, [onDeleteCatalogo, item, notifications]);

  const handleDeleteDocumento = useCallback(async (tipoDocumentoId: number, documentoId?: number) => {
    if (!documentoId || !onDeleteDocumento) return;
    
    const confirmed = await notifications.confirmDelete(
      'documento',
      'Esta acción no se puede deshacer.'
    );
    
    if (!confirmed) return;
    
    try {
      await onDeleteDocumento(item.id, tipoDocumentoId, documentoId, selectedYear, selectedPeriod);
    } catch (error) {
      // Error handling is done in the parent component
    }
  }, [onDeleteDocumento, item.id, selectedYear, selectedPeriod, notifications]);

  const handleLoadDocumentsByPeriod = useCallback(async (catalogoId: number, year: number, period: number | null, isAnnual: boolean) => {
    if (onLoadDocumentsByPeriod) {
      try {
        await onLoadDocumentsByPeriod(catalogoId, year, period ?? undefined);
      } catch (error) {
        notifications.showError('Error al cargar documentos', {
          description: 'No se pudieron cargar los documentos para el periodo seleccionado.'
        });
      }
    }
  }, [onLoadDocumentsByPeriod, notifications]);

  const handleYearChange = useCallback((year: number | null) => {
    setSelectedYear(year);
    setSelectedPeriod(null);
    // When year changes, clear the loaded documents
    // if (onRefreshDocumentos && year !== null) {
    //   onRefreshDocumentos(item.id);
    // }
  }, [onRefreshDocumentos, item.id]);

  const handlePeriodChange = useCallback((period: number | null, isAnnual: boolean) => {
    setSelectedPeriod(period);
    // Period change logic handled by onLoadDocumentsByPeriod
  }, []);

  const handlePeriodicityChange = useCallback((periodicity: PeriodicidadType | null) => {
    // Periodicity change logic
  }, []);

  const handleClearDocuments = useCallback(() => {
    // Limpiar los documentos cuando se cambia el año
    // Esto se puede hacer llamando a onRefreshDocumentos para recargar sin documentos
    if (onRefreshDocumentos) {
      onRefreshDocumentos(item.id);
    }
  }, [onRefreshDocumentos, item.id]);

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
            onClick={handleToggle}
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
            <CatalogoTreeItemComponent
              key={child.id}
              item={child}
              level={level + 1}
              onExpand={onExpand}
              onCollapse={onCollapse}
              onSelect={onSelect}
              selectedId={selectedId}
              showDocumentos={showDocumentos}
              onRefresh={onRefresh}
              onRefreshCatalogo={onRefreshCatalogo}
              onRefreshDocumentos={onRefreshDocumentos}
              isEditMode={isEditMode}
              onCatalogoCreate={onCatalogoCreate}
              onCatalogoEdit={onCatalogoEdit}
              onCatalogoDelete={onCatalogoDelete}
              onOpenDocumentoModal={onOpenDocumentoModal}
              onOpenCatalogoModal={onOpenCatalogoModal}
              onDeleteDocumento={onDeleteDocumento}
              onDeleteCatalogo={onDeleteCatalogo}
              onDownloadDocumento={onDownloadDocumento}
              onLoadDocumentsByPeriod={onLoadDocumentsByPeriod}
            />
          ))}
        </div>
      )}

      {/* Documentos section (only for leaf nodes that allow documents) */}
      {permiteDocumentos && item.disponibilidadTiposDocumento && (
         <div style={{ paddingLeft: `${(level + 1) * 24 + 12}px` }} className="mt-3 space-y-4">
           {/* Year and Period Selectors */}
           <div className="mb-4">
             <PeriodicidadSelectors
               catalogoId={item.id}
               onYearChange={handleYearChange}
               onPeriodChange={handlePeriodChange}
               onPeriodicityChange={handlePeriodicityChange}
               onLoadDocuments={handleLoadDocumentsByPeriod}
               onClearDocuments={handleClearDocuments}
             />
           </div>
           
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
                               onClick={() => handleDownload(tipo.documentoId)}
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
    </div>
  );
}

export const CatalogoTreeItem = React.memo(CatalogoTreeItemComponent);
                        