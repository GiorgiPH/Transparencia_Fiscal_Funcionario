"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, X, FileIcon } from "lucide-react"
import type { DocumentType, Periodicity } from "@/types/catalog"

interface DocumentUploadModalProps {
  open: boolean
  onClose: () => void
  onUpload: (data: { tipo: DocumentType; periodicidad: Periodicity; archivo: File }) => Promise<void>
  subcategoryName: string
}

const documentTypes: DocumentType[] = ["Excel", "PDF", "Word", "CSV", "JSON", "XML"]
const periodicities: Periodicity[] = ["Anual", "Mensual", "Semestral", "Trimestral"]

export function DocumentUploadModal({ open, onClose, onUpload, subcategoryName }: DocumentUploadModalProps) {
  const [tipo, setTipo] = useState<DocumentType>("PDF")
  const [periodicidad, setPeriodicidad] = useState<Periodicity>("Anual")
  const [archivo, setArchivo] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setArchivo(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!archivo) return

    setIsUploading(true)
    try {
      await onUpload({ tipo, periodicidad, archivo })
      handleClose()
    } finally {
      setIsUploading(false)
    }
  }

  const handleClose = () => {
    setTipo("PDF")
    setPeriodicidad("Anual")
    setArchivo(null)
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Subir Documento</DialogTitle>
          <DialogDescription>Suba documentación para: {subcategoryName}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Document Type */}
          <div className="space-y-2">
            <Label htmlFor="tipo">Tipo de Documento</Label>
            <Select value={tipo} onValueChange={(value) => setTipo(value as DocumentType)}>
              <SelectTrigger id="tipo">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {documentTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Periodicity */}
          <div className="space-y-2">
            <Label htmlFor="periodicidad">Periodicidad</Label>
            <Select value={periodicidad} onValueChange={(value) => setPeriodicidad(value as Periodicity)}>
              <SelectTrigger id="periodicidad">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {periodicities.map((period) => (
                  <SelectItem key={period} value={period}>
                    {period}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* File Upload */}
          <div className="space-y-2">
            <Label>Archivo</Label>
            <div className="flex flex-col gap-3">
              {archivo ? (
                <div className="flex items-center justify-between rounded-lg border bg-muted/30 p-3">
                  <div className="flex items-center gap-2">
                    <FileIcon className="h-5 w-5 text-primary" />
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{archivo.name}</span>
                      <span className="text-xs text-muted-foreground">{(archivo.size / 1024).toFixed(2)} KB</span>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setArchivo(null)}
                    className="h-8 w-8"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/10 p-6 transition-colors hover:border-primary hover:bg-muted/30">
                  <Upload className="mb-2 h-8 w-8 text-muted-foreground" />
                  <span className="text-sm font-medium text-foreground">Haga clic para seleccionar archivo</span>
                  <span className="mt-1 text-xs text-muted-foreground">o arrastre y suelte aquí</span>
                  <input type="file" className="hidden" onChange={handleFileChange} accept="*/*" />
                </label>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={handleClose} disabled={isUploading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={!archivo || isUploading}>
              {isUploading ? "Subiendo..." : "Subir Documento"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
