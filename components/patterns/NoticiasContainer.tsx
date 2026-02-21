"use client"

import { useEffect, useState } from 'react';
import { NoticiaTable } from '@/components/features/estrategias-comunicacion/NoticiaTable';
import { NoticiaFormModal } from '@/components/features/estrategias-comunicacion/NoticiaFormModal';
import { useNoticias } from '@/hooks/useNoticias';
import type { Noticia, CreateNoticiaData, UpdateNoticiaData } from '@/types/estrategias-comunicacion';
import { Button } from '../ui/button';
import { Plus, RefreshCw } from 'lucide-react';

interface NoticiasContainerProps {
  autoLoad?: boolean;
}

export function NoticiasContainer({
  autoLoad = true,
}: NoticiasContainerProps) {
  const {
    noticias,
    isLoading,
    error,
    fetchNoticias,
    createNoticia,
    updateNoticia,
    deleteNoticia,
    toggleNoticiaActivo,
    clearError,
  } = useNoticias();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNoticia, setSelectedNoticia] = useState<Noticia | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    if (autoLoad) {
      fetchNoticias();
    }
  }, [autoLoad]);

  const handleRefresh = () => {
    clearError();
    fetchNoticias();
  };

  const handleEditNoticia = (noticia: Noticia) => {
    setSelectedNoticia(noticia);
    setIsCreating(false);
    setIsModalOpen(true);
  };

  const handleDeleteNoticia = async (noticiaId: number) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta noticia?')) {
      try {
        await deleteNoticia(noticiaId);
      } catch (err) {
        console.error('Error al eliminar noticia:', err);
      }
    }
  };

  const handleToggleNoticiaStatus = async (noticiaId: number, activo: boolean) => {
    const action = activo ? 'activar' : 'desactivar';
    if (window.confirm(`¿Estás seguro de que deseas ${action} esta noticia?`)) {
      try {
        await toggleNoticiaActivo(noticiaId, activo);
      } catch (err) {
        console.error(`Error al ${action} noticia:`, err);
      }
    }
  };

  const handleCreateNoticia = () => {
    setSelectedNoticia(null);
    setIsCreating(true);
    setIsModalOpen(true);
  };

  const handleModalSubmit = async (data: CreateNoticiaData | UpdateNoticiaData, file?: File) => {
    try {
      if (isCreating) {
        await createNoticia(data as CreateNoticiaData, file);
      } else if (selectedNoticia) {
        await updateNoticia(selectedNoticia.id, data as UpdateNoticiaData, file);
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error('Error al guardar noticia:', err);
      throw err;
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedNoticia(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Gestión de Noticias</h2>
          <p className="text-sm text-gray-600">
            {noticias.length} noticia{noticias.length !== 1 ? 's' : ''} encontrada{noticias.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex space-x-2">
          <Button
            type="button"
            onClick={handleCreateNoticia}
            variant="default"
            size="sm"
            className="gap-2 whitespace-nowrap"
          >
            <Plus className="h-4 w-4" />
            Nueva Noticia
          </Button>

          <Button
            onClick={handleRefresh}
            disabled={isLoading}
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Refrescar
          </Button>
        </div>
      </div>

      <NoticiaTable
        noticias={noticias}
        onEdit={handleEditNoticia}
        onDelete={handleDeleteNoticia}
        onToggleStatus={handleToggleNoticiaStatus}
      />

      <NoticiaFormModal
        open={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleModalSubmit}
        noticia={selectedNoticia}
      />

      <div className="text-xs text-gray-500">
        <p>
          <strong>Patrón Presentational/Container:</strong> Este componente solo maneja la lógica (data fetching, estado).
          El componente <code>NoticiaTable</code> se encarga únicamente de la presentación.
        </p>
      </div>
    </div>
  );
}