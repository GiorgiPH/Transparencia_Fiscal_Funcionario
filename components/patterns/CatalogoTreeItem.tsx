import type { CatalogoTreeItem as CatalogoTreeItemType } from '@/types/catalog';
import { ChevronRight, ChevronDown, Folder, FileText, AlertCircle } from 'lucide-react';

interface CatalogoTreeItemProps {
  item: CatalogoTreeItemType;
  level?: number;
  onExpand?: (item: CatalogoTreeItemType) => void;
  onCollapse?: (item: CatalogoTreeItemType) => void;
  onSelect?: (item: CatalogoTreeItemType) => void;
  selectedId?: number | null;
  showDocumentos?: boolean;
}

export function CatalogoTreeItem({
  item,
  level = 0,
  onExpand,
  onCollapse,
  onSelect,
  selectedId,
  showDocumentos = false,
}: CatalogoTreeItemProps) {
  const hasChildren = item.children && item.children.length > 0;
  const isExpanded = item.isExpanded || false;
  const isLoading = item.isLoading || false;
  const isSelected = selectedId === item.id;
  const permiteDocumentos = item.permite_documentos;
  const hasDocumentos = item._count?.documentos && item._count.documentos > 0;

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
            />
          ))}
        </div>
      )}

      {/* Documentos section (only for leaf nodes that allow documents) */}
      {showDocumentos && isExpanded && permiteDocumentos && item.disponibilidadTiposDocumento && (
        <div style={{ paddingLeft: `${(level + 1) * 24 + 12}px` }} className="mt-2">
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
            <h4 className="font-medium text-gray-700 mb-2">Documentos disponibles</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {item.disponibilidadTiposDocumento.map((tipo) => (
                <div
                  key={tipo.tipoDocumentoId}
                  className={`p-3 rounded border ${
                    tipo.disponible
                      ? 'border-green-200 bg-green-50'
                      : 'border-gray-200 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900">{tipo.nombre}</div>
                      <div className="text-sm text-gray-500">.{tipo.extension}</div>
                    </div>
                    <div className="text-right">
                      {tipo.disponible ? (
                        <div>
                          <div className="text-sm font-medium text-green-700">
                            {tipo.documentoNombre}
                          </div>
                          <div className="text-xs text-green-600">Disponible</div>
                        </div>
                      ) : (
                        <div className="text-sm text-gray-500">No disponible</div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
