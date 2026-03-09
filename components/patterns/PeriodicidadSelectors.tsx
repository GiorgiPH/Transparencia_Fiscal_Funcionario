"use client"

import { useState, useEffect } from "react"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { usePeriodicidad } from "@/hooks/usePeriodicidad"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, RefreshCw, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { ANIOS_DISPONIBLES } from "@/lib/constants"
import type { Periodicidad as PeriodicidadType } from "@/services/periodicidadService"

interface PeriodicidadSelectorsProps {
  catalogoId: number
  onYearChange?: (year: number | null) => void
  onPeriodChange?: (period: number | null, isAnnual: boolean) => void
  onPeriodicityChange?: (periodicity: PeriodicidadType | null) => void
  onLoadDocuments?: (catalogoId: number, year: number, period: number | null, isAnnual: boolean) => void
  onClearDocuments?: () => void  // Nueva prop para limpiar documentos
  selectedYear?: number | null
  selectedPeriod?: number | null
  isAnnual?: boolean
  className?: string
  compact?: boolean
  showInfo?: boolean
}

export function PeriodicidadSelectors({
  catalogoId,
  onYearChange,
  onPeriodChange,
  onPeriodicityChange,
  onLoadDocuments,
  onClearDocuments,  // Nueva prop
  selectedYear: externalSelectedYear,
  selectedPeriod: externalSelectedPeriod,
  isAnnual: externalIsAnnual = false,
  className = "",
  compact = false,
  showInfo = true,
}: PeriodicidadSelectorsProps) {
  const [selectedYear, setSelectedYear] = useState<number | null>(externalSelectedYear || null)
  const [selectedPeriod, setSelectedPeriod] = useState<number | null>(externalSelectedPeriod || null)
  const [isAnnual, setIsAnnual] = useState<boolean>(externalIsAnnual)
  
  const { periodicidad, periodos, loading, obtenerPeriodicidad, limpiarPeriodicidad } = usePeriodicidad()

  // Sync with external props
  useEffect(() => {
    if (externalSelectedYear !== undefined) {
      setSelectedYear(externalSelectedYear)
    }
    if (externalSelectedPeriod !== undefined) {
      setSelectedPeriod(externalSelectedPeriod)
    }
    if (externalIsAnnual !== undefined) {
      setIsAnnual(externalIsAnnual)
    }
  }, [externalSelectedYear, externalSelectedPeriod, externalIsAnnual])

  // Fetch periodicity when year changes
  useEffect(() => {
    if (!selectedYear || !catalogoId) {
      limpiarPeriodicidad()
      onPeriodicityChange?.(null)
      onPeriodChange?.(null, false)
      return
    }

    const fetchPeriodicity = async () => {
      await obtenerPeriodicidad(catalogoId, selectedYear)
    }

    fetchPeriodicity()
  }, [selectedYear, catalogoId, obtenerPeriodicidad, limpiarPeriodicidad, onPeriodicityChange, onPeriodChange])

  // Notify parent when periodicity changes
  useEffect(() => {
    onPeriodicityChange?.(periodicidad)
  }, [periodicidad, onPeriodicityChange])

  const handleYearChange = (value: string) => {
    const year = value ? parseInt(value) : null
    
    // Limpiar documentos cuando se cambia el año
    if (onClearDocuments) {
      onClearDocuments()
    }
    
    setSelectedYear(year)
    setSelectedPeriod(null)
    setIsAnnual(false)
    onYearChange?.(year)
    onPeriodChange?.(null, false)
  }

  const handlePeriodChange = (value: string) => {
    const period = value ? parseInt(value) : null
    const isAnnualPeriod = period === 0
    
    setSelectedPeriod(period)
    setIsAnnual(isAnnualPeriod)
    onPeriodChange?.(period, isAnnualPeriod)
    
    // Load documents when period is selected
    if (selectedYear && period !== null) {
      onLoadDocuments?.(catalogoId, selectedYear, period, isAnnualPeriod)
    }
  }

  const handleRefresh = async () => {
    if (selectedYear && catalogoId) {
      await obtenerPeriodicidad(catalogoId, selectedYear)
    }
  }


  if (compact) {
    return (
      <div className={cn("space-y-3", className)}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Periodicidad</span>
          </div>
          <Button
            onClick={handleRefresh}
            disabled={loading}
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
          >
            <RefreshCw className={cn("h-3 w-3", loading && "animate-spin")} />
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="compact-year" className="text-xs">Año</Label>
            <Select value={selectedYear?.toString() || ""} onValueChange={handleYearChange}>
              <SelectTrigger id="compact-year" className="h-8 text-sm">
                <SelectValue placeholder="Año" />
              </SelectTrigger>
              <SelectContent>
                {ANIOS_DISPONIBLES.map((year) => (
                  <SelectItem key={year} value={year.toString()} className="text-sm">
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="compact-period" className="text-xs">Periodo</Label>
            <Select
              value={selectedPeriod?.toString() || ""}
              onValueChange={handlePeriodChange}
              disabled={!selectedYear || loading || periodos.length === 0}
            >
              <SelectTrigger id="compact-period" className="h-8 text-sm">
                <SelectValue placeholder={loading ? "Cargando..." : "Periodo"} />
              </SelectTrigger>
              <SelectContent>
                {periodos.map((period) => (
                  <SelectItem key={period.value} value={period.value.toString()} className="text-sm">
                    {period.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

      
      </div>
    )
  }

  return (
    <Card className={cn("border shadow-sm", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Calendar className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">Filtros de Periodicidad</CardTitle>
              <CardDescription>
                Seleccione el año y periodo para cargar documentos
              </CardDescription>
            </div>
          </div>
          <Button
            onClick={handleRefresh}
            disabled={loading}
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
            Refrescar
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          

          {/* Selectors */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* Year Selector */}
            <div className="space-y-2">
              <Label htmlFor="year-selector">Año</Label>
              <Select value={selectedYear?.toString() || ""} onValueChange={handleYearChange}>
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
                value={selectedPeriod?.toString() || ""}
                onValueChange={handlePeriodChange}
                disabled={!selectedYear || loading || periodos.length === 0}
              >
                <SelectTrigger id="period-selector" className="w-full">
                  <SelectValue placeholder={loading ? "Cargando..." : "Selecciona un periodo"} />
                </SelectTrigger>
                <SelectContent>
                  {periodos.map((period) => (
                    <SelectItem key={period.value} value={period.value.toString()}>
                      {period.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {!selectedYear && (
                <p className="text-xs text-muted-foreground">
                  Seleccione un año primero para ver los periodos disponibles
                </p>
              )}
            </div>
          </div>

          {/* Periodicity Information */}
          {periodicidad && showInfo && (
            <div className="rounded-lg border bg-card p-4">
              <div className="flex items-center gap-2 mb-3">
                <Info className="h-4 w-4 text-muted-foreground" />
                <h3 className="text-sm font-medium">Información de Periodicidad</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Tipo</p>
                  <p className="text-sm font-medium">{periodicidad.nombre}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Periodos por año</p>
                  <p className="text-sm font-medium">{periodicidad.periodosPorAnio}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Meses por periodo</p>
                  <p className="text-sm font-medium">{periodicidad.mesesPorPeriodo}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Nombre en portal</p>
                  <p className="text-sm font-medium">{periodicidad.nombrePortal}</p>
                </div>
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <RefreshCw className="h-4 w-4 animate-spin" />
                Cargando información de periodicidad...
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}