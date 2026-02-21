"use client"

import { useEffect, useState } from 'react';
import { RedSocialTable } from '@/components/features/estrategias-comunicacion/RedSocialTable';
import { RedSocialFormModal } from '@/components/features/estrategias-comunicacion/RedSocialFormModal';
import { useRedesSociales } from '@/hooks/useRedesSociales';
import type { RedSocial, CreateRedSocialData, UpdateRedSocialData } from '@/types/estrategias-comunicacion';
import { Button } from '../ui/button';
import { Plus, RefreshCw } from 'lucide-react';

interface RedesSocialesContainerProps {
  autoLoad?: boolean;
}

export function RedesSocialesContainer({
  autoLoad = true,
}: RedesSocialesContainerProps) {
  const {
    redesSociales,
    isLoading,
    error,
    fetchRedesSociales,
    createRedSocial,
    updateRedSocial,
    deleteRedSocial,
    toggleRedSocialActivo,
    clearError,
  } = useRedesSociales();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRedSocial, setSelectedRedSocial] = useState<RedSocial | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    if (autoLoad) {
      fetchRedesSociales();
    }
  }, [autoLoad]);

  const handleRefresh = () => {
    clearError();
    fetchRedesSociales();
  };

  const handleEditRedSocial = (redSocial: RedSocial) => {
    setSelectedRedSocial(redSocial);
    setIsCreating(false);
    setIsModalOpen(true);
  };

  const handleDeleteRedSocial = async (redSocialId: number) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta red social?')) {
      try {
        await deleteRedSocial(redSocialId);
      } catch (err) {
        console.error('Error al eliminar red social:', err);
      }
    }
  };

  const handleToggleRedSocialStatus = async (redSocialId: number, activo: boolean) => {
    const action = activo ? 'activar' : 'desactivar';
    if (window.confirm(`¿Estás seguro de que deseas ${action} esta red social?`)) {
      try {
        await toggleRedSocialActivo(redSocialId, activo);
      } catch (err) {
        console.error(`Error al ${action} red social:`, err);
      }
    }
  };

  const handleCreateRedSocial = () => {
    setSelectedRedSocial(null);
    setIsCreating(true);
    setIsModalOpen(true);
  };

  const handleModalSubmit = async (data: CreateRedSocialData | UpdateRedSocialData) => {
    try {
      if (isCreating) {
        await createRedSocial(data as CreateRedSocialData);
      } else if (selectedRedSocial) {
        await updateRedSocial(selectedRedSocial.id, data as UpdateRedSocialData);
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error('Error al guardar red social:', err);
      throw err;
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRedSocial(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Gestión de Redes Sociales</h2>
          <p className="text-sm text-gray-600">
            {redesSociales.length} red{redesSociales.length !== 1 ? 'es' : ''} social{redesSociales.length !== 1 ? 'es' : ''} encontrada{redesSociales.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex space-x-2">
          <Button
            type="button"
            onClick={handleCreateRedSocial}
            variant="default"
            size="sm"
            className="gap-2 whitespace-nowrap"
          >
            <Plus className="h-4 w-4" />
            Nueva Red Social
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

      <RedSocialTable
        redesSociales={redesSociales}
        onEdit={handleEditRedSocial}
        onDelete={handleDeleteRedSocial}
        onToggleStatus={handleToggleRedSocialStatus}
      />

      <RedSocialFormModal
        open={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleModalSubmit}
        redSocial={selectedRedSocial}
      />

      <div className="text-xs text-gray-500">
        <p>
          <strong>Patrón Presentational/Container:</strong> Este componente solo maneja la lógica (data fetching, estado).
          El componente <code>RedSocialTable</code> se encarga únicamente de la presentación.
        </p>
      </div>
    </div>
  );
}