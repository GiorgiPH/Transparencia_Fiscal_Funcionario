"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import type { Noticia, CreateNoticiaData, UpdateNoticiaData } from "@/types/estrategias-comunicacion"

interface NoticiaFormModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: CreateNoticiaData | UpdateNoticiaData, file?: File) => Promise<void>
  noticia?: Noticia | null
}

export function NoticiaFormModal({ open, onClose, onSubmit, noticia }: NoticiaFormModalProps) {
  const [titulo, setTitulo] = useState("")
  const [descripcionCorta, setDescripcionCorta] = useState("")
  const [contenido, setContenido] = useState("")
  const [link, setLink] = useState("")

  const [fechaPublicacion, setFechaPublicacion] = useState("")
  const [activo, setActivo] = useState(true)
  const [imagenFile, setImagenFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Establecer valores de la noticia cuando se abre el modal
  useEffect(() => {
    if (noticia && open) {
      setTitulo(noticia.titulo)
      setDescripcionCorta(noticia.descripcion_corta)
      setContenido(noticia.contenido)
      setLink(noticia.link)
      setFechaPublicacion(noticia.fecha_publicacion.split('T')[0]) // Formato YYYY-MM-DD
      setActivo(noticia.activo)
      setImagenFile(null)
    } else if (!noticia && open) {
      // Resetear valores para creación
      setTitulo("")
      setDescripcionCorta("")
      setContenido("")
      setLink("#")

      setFechaPublicacion(new Date().toISOString().split('T')[0]) // Fecha actual
      setActivo(true)
      setImagenFile(null)
    }
  }, [noticia, open])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImagenFile(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const fechaPublicacionISO = new Date(fechaPublicacion).toISOString()
      
      if (noticia) {
        // Modo edición
        const updateData: UpdateNoticiaData = {
          titulo,
          descripcion_corta: descripcionCorta,
          contenido,
          link,
          fecha_publicacion: fechaPublicacionISO,
          activo,
        }
        await onSubmit(updateData, imagenFile || undefined)
      } else {
        // Modo creación
        const createData: CreateNoticiaData = {
          titulo,
          descripcion_corta: descripcionCorta,
          contenido,
          link,
          fecha_publicacion: fechaPublicacionISO,
          activo,
        }
        await onSubmit(createData, imagenFile || undefined)
      }
      handleClose()
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    setTitulo("")
    setDescripcionCorta("")
    setContenido("")
    setFechaPublicacion("")
    setActivo(true)
    setImagenFile(null)
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{noticia ? "Editar Noticia" : "Crear Nueva Noticia"}</DialogTitle>
          <DialogDescription>
            {noticia ? "Actualice la información de la noticia" : "Complete los datos de la nueva noticia"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="titulo">Título *</Label>
            <Input
              id="titulo"
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Título de la noticia"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="descripcionCorta">Descripción Corta *</Label>
            <Textarea
              id="descripcionCorta"
              value={descripcionCorta}
              onChange={(e) => setDescripcionCorta(e.target.value)}
              placeholder="Breve descripción de la noticia"
              rows={3}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contenido">Contenido *</Label>
            <Textarea
              id="contenido"
              value={contenido}
              onChange={(e) => setContenido(e.target.value)}
              placeholder="Contenido completo de la noticia"
              rows={6}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contenido">Link</Label>
            <Input
              id="link"
              type="text"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="Link de la noticia"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fechaPublicacion">Fecha de Publicación *</Label>
              <Input
                id="fechaPublicacion"
                type="date"
                value={fechaPublicacion}
                onChange={(e) => setFechaPublicacion(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="imagenFile">Imagen</Label>
              <Input
                id="imagenFile"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
              <p className="text-xs text-muted-foreground">
                Formatos: JPG, PNG, GIF (Máx. 5MB)
              </p>
            </div>
          </div>

          {noticia?.imagen_url && !imagenFile && (
            <div className="space-y-2">
              <Label>Imagen Actual</Label>
              <div className="flex items-center space-x-2">
                <img
                  src={noticia.imagen_url}
                  alt="Imagen actual"
                  className="h-20 w-20 object-cover rounded"
                />
                <p className="text-sm text-muted-foreground">
                  Esta imagen se mantendrá a menos que suba una nueva
                </p>
              </div>
            </div>
          )}

          <div className="flex items-center space-x-2">
            <Switch
              id="activo"
              checked={activo}
              onCheckedChange={setActivo}
            />
            <Label htmlFor="activo">Noticia Activa</Label>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={handleClose} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Guardando..." : noticia ? "Actualizar" : "Crear Noticia"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}