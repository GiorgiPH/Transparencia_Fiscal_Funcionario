import { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Label } from '../ui/label';
import { ANIOS_DISPONIBLES } from '@/lib/constants';
import { usePeriodicidad } from '@/hooks/usePeriodicidad';
import type { Periodicidad as PeriodicidadType } from '@/services/periodicidadService';

interface PeriodicidadSelectorsProps {
  catalogoId: number;
  onYearChange?: (year: number | null) => void;
  onPeriodChange?: (period: number | null, isAnnual: boolean) => void;
  onPeriodicityChange?: (periodicity: PeriodicidadType | null) => void;
  onLoadDocuments?: (catalogoId: number, year: number, period: number | null, isAnnual: boolean) => void;
  selectedYear?: number | null;
  selectedPeriod?: number | null;
  isAnnual?: boolean;
}

export function PeriodicidadSelectors({
  catalogoId,
  onYearChange,
  onPeriodChange,
  onPeriodicityChange,
  onLoadDocuments,
  selectedYear: externalSelectedYear,
  selectedPeriod: externalSelectedPeriod,
  isAnnual: externalIsAnnual = false,
}: PeriodicidadSelectorsProps) {
  const [selectedYear, setSelectedYear] = useState<number | null>(externalSelectedYear || null);
  const [selectedPeriod, setSelectedPeriod] = useState<number | null>(externalSelectedPeriod || null);
  const [isAnnual, setIsAnnual] = useState<boolean>(externalIsAnnual);
  
  const { periodicidad, periodos, loading, obtenerPeriodicidad, limpiarPeriodicidad } = usePeriodicidad();

  // Sync with external props
  useEffect(() => {
    if (externalSelectedYear !== undefined) {
      setSelectedYear(externalSelectedYear);
    }
    if (externalSelectedPeriod !== undefined) {
      setSelectedPeriod(externalSelectedPeriod);
    }
    if (externalIsAnnual !== undefined) {
      setIsAnnual(externalIsAnnual);
    }
  }, [externalSelectedYear, externalSelectedPeriod, externalIsAnnual]);

  // Fetch periodicity when year changes
  useEffect(() => {
    if (!selectedYear || !catalogoId) {
      limpiarPeriodicidad();
      onPeriodicityChange?.(null);
      onPeriodChange?.(null, false);
      return;
    }

    const fetchPeriodicity = async () => {
      await obtenerPeriodicidad(catalogoId, selectedYear);
    };

    fetchPeriodicity();
  }, [selectedYear, catalogoId, obtenerPeriodicidad, limpiarPeriodicidad, onPeriodicityChange, onPeriodChange]);

  // Notify parent when periodicity changes
  useEffect(() => {
    onPeriodicityChange?.(periodicidad);
  }, [periodicidad, onPeriodicityChange]);

  const handleYearChange = (value: string) => {
    const year = value ? parseInt(value) : null;
    setSelectedYear(year);
    setSelectedPeriod(null);
    setIsAnnual(false);
    onYearChange?.(year);
    onPeriodChange?.(null, false);
  };

  const handlePeriodChange = (value: string) => {
    const period = value ? parseInt(value) : null;
    const isAnnualPeriod = period === 0;
    
    setSelectedPeriod(period);
    setIsAnnual(isAnnualPeriod);
    onPeriodChange?.(period, isAnnualPeriod);
    
    // Load documents when period is selected
    if (selectedYear && period !== null) {
      onLoadDocuments?.(catalogoId, selectedYear, period, isAnnualPeriod);
    }
  };

  return (
    <div className="space-y-4 p-4 bg-gray-50 rounded-lg border">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Year Selector */}
        <div className="space-y-2">
          <Label htmlFor="year-selector">Año</Label>
          <Select value={selectedYear?.toString() || ''} onValueChange={handleYearChange}>
            <SelectTrigger id="year-selector" className="w-full">
              <SelectValue placeholder="Selecciona un año" />
            </SelectTrigger>
            <SelectContent>
              {ANIOS_DISPONIBLES.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Period Selector */}
        <div className="space-y-2">
          <Label htmlFor="period-selector">Periodo</Label>
          <Select
            value={selectedPeriod?.toString() || ''}
            onValueChange={handlePeriodChange}
            disabled={!selectedYear || loading || periodos.length === 0}
          >
            <SelectTrigger id="period-selector" className="w-full">
              <SelectValue placeholder={loading ? 'Cargando...' : 'Selecciona un periodo'} />
            </SelectTrigger>
            <SelectContent>
              {periodos.map((period) => (
                <SelectItem key={period.value} value={period.value.toString()}>
                  {period.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Periodicity Information */}
      {periodicidad && (
        <div className="text-sm text-gray-600 p-3 bg-white rounded border">
          <div className="font-medium mb-1">Información de periodicidad:</div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="text-gray-500">Tipo:</span>{' '}
              <span className="font-medium">{periodicidad.nombre}</span>
            </div>
            <div>
              <span className="text-gray-500">Periodos por año:</span>{' '}
              <span className="font-medium">{periodicidad.periodosPorAnio}</span>
            </div>
            <div>
              <span className="text-gray-500">Meses por periodo:</span>{' '}
              <span className="font-medium">{periodicidad.mesesPorPeriodo}</span>
            </div>
            <div>
              <span className="text-gray-500">Nombre en portal:</span>{' '}
              <span className="font-medium">{periodicidad.nombrePortal}</span>
            </div>
          </div>
        </div>
      )}

      {/* Rules Information */}
      {/* <div className="text-xs text-gray-500 space-y-1">
        <div className="flex items-start">
          <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mt-1 mr-2 flex-shrink-0"></span>
          <span>El documento anual es obligatorio para cada año.</span>
        </div>
        <div className="flex items-start">
          <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mt-1 mr-2 flex-shrink-0"></span>
          <span>Si la periodicidad es "Sin periodicidad", solo se permite documento anual.</span>
        </div>
        <div className="flex items-start">
          <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mt-1 mr-2 flex-shrink-0"></span>
          <span>Al cambiar el año, se limpian los documentos cargados.</span>
        </div>
      </div> */}
    </div>
  );
}