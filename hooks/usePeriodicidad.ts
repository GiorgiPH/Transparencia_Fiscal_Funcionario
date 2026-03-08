import { useState, useCallback } from 'react';
import { periodicidadService, type Periodicidad, type PeriodoOption } from '@/services/periodicidadService';

interface UsePeriodicidadReturn {
  periodicidad: Periodicidad | null;
  periodos: PeriodoOption[];
  loading: boolean;
  error: string | null;
  obtenerPeriodicidad: (catalogoId: number, anio: number) => Promise<void>;
  limpiarPeriodicidad: () => void;
}

export function usePeriodicidad(): UsePeriodicidadReturn {
  const [periodicidad, setPeriodicidad] = useState<Periodicidad | null>(null);
  const [periodos, setPeriodos] = useState<PeriodoOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const obtenerPeriodicidad = useCallback(async (catalogoId: number, anio: number) => {
    if (!catalogoId || !anio) {
      setPeriodicidad(null);
      setPeriodos([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const periodicidadData = await periodicidadService.obtenerPeriodicidadPorAnio(catalogoId, anio);
      setPeriodicidad(periodicidadData);

      // Generar opciones de periodo basadas en la periodicidad
      const opcionesPeriodo = periodicidadService.generarOpcionesPeriodo(periodicidadData);
      setPeriodos(opcionesPeriodo);
    } catch (err) {
      console.error('Error en usePeriodicidad:', err);
      setError('Error al obtener la periodicidad');
      setPeriodicidad(null);
      setPeriodos([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const limpiarPeriodicidad = useCallback(() => {
    setPeriodicidad(null);
    setPeriodos([]);
    setError(null);
    setLoading(false);
  }, []);

  return {
    periodicidad,
    periodos,
    loading,
    error,
    obtenerPeriodicidad,
    limpiarPeriodicidad,
  };
}