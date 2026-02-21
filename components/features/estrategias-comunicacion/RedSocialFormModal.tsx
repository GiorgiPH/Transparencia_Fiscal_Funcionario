"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import type { RedSocial, CreateRedSocialData, UpdateRedSocialData } from "@/types/estrategias-comunicacion"

interface RedSocialFormModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: CreateRedSocialData | UpdateRedSocialData) => Promise<void>
  redSocial?: RedSocial | null
}

export function RedSocialFormModal({ open, onClose, onSubmit, redSocial }: RedSocialFormModalProps) {
  const [nombre, setNombre] = useState("")
  const [descripcion, setDescripcion] = useState("")
  const [url, setUrl] = useState("")
  const [icono, setIcono] = useState("")
  const [orden, setOrden] = useState(0)
  const [activo, setActivo] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Establecer valores de la red social cuando se abre el modal
  useEffect(() => {
    if (redSocial && open) {
      setNombre(redSocial.nombre)
      setDescripcion(redSocial.descripcion)
      setUrl(redSocial.url)
      setIcono(redSocial.icono)
      setOrden(redSocial.orden)
      setActivo(redSocial.activo)
    } else if (!redSocial && open) {
      // Resetear valores para creación
      setNombre("")
      setDescripcion("")
      setUrl("")
      setIcono("")
      setOrden(0)
      setActivo(true)
    }
  }, [redSocial, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      if (redSocial) {
        // Modo edición
        const updateData: UpdateRedSocialData = {
          nombre,
          descripcion,
          url,
          icono,
          orden,
          activo,
        }
        await onSubmit(updateData)
      } else {
        // Modo creación
        const createData: CreateRedSocialData = {
          nombre,
          descripcion,
          url,
          icono,
          orden,
          activo,
        }
        await onSubmit(createData)
      }
      handleClose()
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    setNombre("")
    setDescripcion("")
    setUrl("")
    setIcono("")
    setOrden(0)
    setActivo(true)
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{redSocial ? "Editar Red Social" : "Crear Nueva Red Social"}</DialogTitle>
          <DialogDescription>
            {redSocial ? "Actualice la información de la red social" : "Complete los datos de la nueva red social"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nombre">Nombre *</Label>
            <Input
              id="nombre"
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej: Facebook, Twitter, Instagram"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="descripcion">Descripción *</Label>
            <Textarea
              id="descripcion"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Breve descripción de la red social"
              rows={3}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="url">URL *</Label>
            <Input
              id="url"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://www.facebook.com/gobiernomorelos"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="icono">Icono *</Label>
              <Input
                id="icono"
                type="text"
                value={icono}
                onChange={(e) => setIcono(e.target.value)}
                placeholder="Ej: facebook, twitter, instagram"
                required
              />
              <p className="text-xs text-muted-foreground">
                Nombre del icono (usar nombres de Lucide icons)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="orden">Orden</Label>
              <Input
                id="orden"
                type="number"
                value={orden}
                onChange={(e) => setOrden(parseInt(e.target.value) || 0)}
                min="0"
              />
              <p className="text-xs text-muted-foreground">
                Número para ordenar (menor = primero)
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="activo"
              checked={activo}
              onCheckedChange={setActivo}
            />
            <Label htmlFor="activo">Red Social Activa</Label>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={handleClose} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Guardando..." : redSocial ? "Actualizar" : "Crear Red Social"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}