import { apiClient } from '@/lib/api/axios-client';

export interface Periodicidad {
  id: number;
  nombre: string;
  nombrePortal: string;
  mesesPorPeriodo: number;
  periodosPorAnio: number;
  activo: boolean;
}

export interface PeriodoOption {
  value: number;
  label: string;
}

class PeriodicidadService {
  /**
   * Obtiene la periodicidad de un catálogo para un año específico
   */
  async obtenerPeriodicidadPorAnio(catalogoId: number, anio: number): Promise<Periodicidad | null> {
    try {
      const periodicidad = await apiClient.get<Periodicidad>(
        `/admin/catalogos/${catalogoId}/periodos/${anio}`
      );
      return periodicidad;
    } catch (error) {
      console.error('Error al obtener periodicidad:', error);
      return null;
    }
  }

  /**
   * Genera las opciones de periodo basadas en la periodicidad
   */
  generarOpcionesPeriodo(periodicidad: Periodicidad | null): PeriodoOption[] {
    const opciones: PeriodoOption[] = [];

    if (periodicidad && periodicidad.periodosPorAnio > 0) {
      // Generar periodos según la periodicidad
      for (let i = 1; i <= periodicidad.periodosPorAnio; i++) {
        opciones.push({
          value: i,
          label: `${i} ${periodicidad.nombrePortal?.toLowerCase() || 'periodo'}`,
        });
      }
    }

    // Siempre agregar opción "Anual"
    opciones.push({
      value: 0,
      label: 'Anual',
    });

    return opciones;
  }

  /**
   * Obtiene todas las periodicidades activas
   */
  async obtenerTodasPeriodicidades(): Promise<Periodicidad[]> {
    try {
      const periodicidades = await apiClient.get<Periodicidad[]>(
        '/admin/catalogos/periodicidades'
      );
      return periodicidades;
    } catch (error) {
      console.error('Error al obtener todas las periodicidades:', error);
      return [];
    }
  }
}

export const periodicidadService = new PeriodicidadService();