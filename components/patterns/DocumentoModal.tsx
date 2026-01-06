"use client"

import { useState, useEffect } from 'react'
import { useCatalogs } from '@/hooks/useCatalogs'
import type { CatalogoTreeItem, DocumentoCreateData, DocumentoUpdateData, TipoDocumento } from '@/types/catalog'
import { X, Upload, FileText, Calendar, Building } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface DocumentoModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: DocumentoCreateData | DocumentoUpdateData) => Promise<void>
  mode: 'create' | 'edit'
  catalogo: CatalogoTreeItem
  documentoId?: number | null
}

export function DocumentoModal({
  isOpen,
  onClose,
  onSubmit,
  mode,
  catalogo,
  documentoId
}: DocumentoModalProps) {
  const { fetchTiposDocumento, tiposDocumento, fetchDocumento } = useCatalogs()
  
  const [formData, setFormData] = useState({
    tipo_documento_id: '',
    periodicidad: '',
    archivo: null as File | null,
    nombre: '',
    descripcion: '',
    ejercicio_fiscal: new Date().getFullYear().toString(),
    institucion_emisora: '',
  })

  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingDocumento, setIsLoadingDocumento] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen) {
      loadTiposDocumento()
      if (mode === 'edit' && documentoId) {
        loadDocumento(documentoId)
      }
    }
  }, [isOpen, mode, documentoId])

  const loadTiposDocumento = async () => {
    try {
      await fetchTiposDocumento()
    } catch (err) {
      setError('Error al cargar tipos de documento')
    }
  }

  const loadDocumento = async (id: number) => {
    setIsLoadingDocumento(true)
    try {
      const documento = await fetchDocumento(id)
      setFormData({
        tipo_documento_id: documento.tipo_documento_id.toString(),
        periodicidad: documento.periodicidad,
        archivo: null,
        nombre: documento.nombre,
        descripcion: documento.descripcion,
        ejercicio_fiscal: documento.ejercicio_fiscal.toString(),
        institucion_emisora: documento.institucion_emisora,
      })
    } catch (err) {
      setError('Error al cargar documento')
    } finally {
      setIsLoadingDocumento(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData(prev => ({ ...prev, archivo: file }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.tipo_documento_id) {
      setError('Seleccione un tipo de documento')
      return
    }

    if (!formData.periodicidad) {
      setError('Seleccione una periodicidad')
      return
    }

    if (mode === 'create' && !formData.archivo) {
      setError('Seleccione un archivo')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const submitData: any = {
        catalogo_id: catalogo.id,
        tipo_documento_id: parseInt(formData.tipo_documento_id),
        periodicidad: formData.periodicidad,
      }

      if (formData.archivo) {
        submitData.archivo = formData.archivo
      }

      if (mode === 'edit' && formData.nombre) {
        submitData.nombre = formData.nombre
      }

      if (formData.descripcion) {
        submitData.descripcion = formData.descripcion
      }

      if (formData.ejercicio_fiscal) {
        submitData.ejercicio_fiscal = parseInt(formData.ejercicio_fiscal)
      }

      if (formData.institucion_emisora) {
        submitData.institucion_emisora = formData.institucion_emisora
      }

      await onSubmit(submitData)
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar documento')
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  const getTipoDocumentoNombre = (id: string) => {
    const tipo = tiposDocumento.find(t => t.id === parseInt(id))
    return tipo?.nombre || 'Tipo de documento'
  }

  const periodicidades = [
    { value: 'anual', label: 'Anual' },
    { value: 'semestral', label: 'Semestral' },
    { value: 'trimestral', label: 'Trimestral' },
    { value: 'mensual', label: 'Mensual' },
    { value: 'bimestral', label: 'Bimestral' },
    { value: 'cuatrimestral', label: 'Cuatrimestral' },
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold">
              {mode === 'create' ? 'Cargar Documento' : 'Editar Documento'}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {catalogo.nombre} • Nivel {catalogo.nivel}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Tipo de Documento */}
          <div>
            <Label htmlFor="tipo_documento_id">Tipo de Documento *</Label>
            <Select
              value={formData.tipo_documento_id}
              onValueChange={(value) => handleSelectChange('tipo_documento_id', value)}
              disabled={isLoadingDocumento}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccione tipo de documento">
                  {formData.tipo_documento_id 
                    ? getTipoDocumentoNombre(formData.tipo_documento_id)
                    : 'Seleccione tipo de documento'}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {tiposDocumento.map((tipo: TipoDocumento) => (
                  <SelectItem key={tipo.id} value={tipo.id.toString()}>
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      <span>{tipo.nombre}</span>
                      <span className="text-gray-500 text-sm">(.{tipo.extension})</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Periodicidad */}
          <div>
            <Label htmlFor="periodicidad">Periodicidad *</Label>
            <Select
              value={formData.periodicidad}
              onValueChange={(value) => handleSelectChange('periodicidad', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccione periodicidad">
                  {formData.periodicidad 
                    ? periodicidades.find(p => p.value === formData.periodicidad)?.label
                    : 'Seleccione periodicidad'}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {periodicidades.map((periodicidad) => (
                  <SelectItem key={periodicidad.value} value={periodicidad.value}>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>{periodicidad.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Archivo (solo para crear o actualizar) */}
          <div>
            <Label htmlFor="archivo">
              {mode === 'create' ? 'Archivo *' : 'Nuevo Archivo (opcional)'}
            </Label>
            <div className="mt-2">
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="h-8 w-8 text-gray-400 mb-2" />
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Click para subir</span> o arrastra y suelta
                    </p>
                    <p className="text-xs text-gray-500">
                      {formData.archivo 
                        ? `Archivo seleccionado: ${formData.archivo.name}`
                        : 'CSV, JSON, XML, Excel (MAX. 10MB)'}
                    </p>
                  </div>
                  <input
                    id="archivo"
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                    accept=".csv,.json,.xml,.xlsx,.xls"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Nombre del Documento (solo para editar) */}
          {mode === 'edit' && (
            <div>
              <Label htmlFor="nombre">Nombre del Documento</Label>
              <Input
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                placeholder="Ej: Presupuesto de Egresos 2025"
              />
            </div>
          )}

          {/* Descripción */}
          <div>
            <Label htmlFor="descripcion">Descripción</Label>
            <Textarea
              id="descripcion"
              name="descripcion"
              value={formData.descripcion}
              onChange={handleInputChange}
              placeholder="Descripción del documento..."
              rows={3}
            />
          </div>

          {/* Ejercicio Fiscal */}
          <div>
            <Label htmlFor="ejercicio_fiscal">Ejercicio Fiscal</Label>
            <Input
              id="ejercicio_fiscal"
              name="ejercicio_fiscal"
              type="number"
              value={formData.ejercicio_fiscal}
              onChange={handleInputChange}
              min="2000"
              max="2100"
            />
          </div>

          {/* Institución Emisora */}
          <div>
            <Label htmlFor="institucion_emisora">Institución Emisora</Label>
            <div className="relative">
              <Building className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                id="institucion_emisora"
                name="institucion_emisora"
                value={formData.institucion_emisora}
                onChange={handleInputChange}
                className="pl-10"
                placeholder="Ej: Secretaría de Finanzas"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-6 border-t">
            <div className="text-sm text-gray-500">
              <p>Catálogo: <span className="font-medium">{catalogo.nombre}</span></p>
              <p className="mt-1">Solo se permite un documento por tipo en cada catálogo</p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isLoading || isLoadingDocumento}
              >
                {isLoading ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2"></div>
                    Guardando...
                  </>
                ) : mode === 'create' ? (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Cargar Documento
                  </>
                ) : (
                  'Guardar Cambios'
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
