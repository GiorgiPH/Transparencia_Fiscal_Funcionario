"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { UserManagement, CreateUserData } from "@/types/user"
import { USER_ROLES } from "@/lib/constants"

interface UserFormModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: CreateUserData | Partial<UserManagement>) => Promise<void>
  user?: UserManagement | null
}

export function UserFormModal({ open, onClose, onSubmit, user }: UserFormModalProps) {
  const [nombre, setNombre] = useState("")
  const [email, setEmail] = useState("")
  const [rol, setRol] = useState<"Admin" | "Upload" | "Edit">("Upload")
  const [area, setArea] = useState("")
  const [password, setPassword] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (user) {
      setNombre(user.nombre)
      setEmail(user.email)
      setRol(user.rol)
      setArea(user.area)
    } else {
      setNombre("")
      setEmail("")
      setRol("Upload")
      setArea("")
      setPassword("")
    }
  }, [user, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      if (user) {
        await onSubmit({ nombre, email, rol, area })
      } else {
        await onSubmit({ nombre, email, rol, area, password })
      }
      handleClose()
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    setNombre("")
    setEmail("")
    setRol("Upload")
    setArea("")
    setPassword("")
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{user ? "Editar Usuario" : "Crear Nuevo Usuario"}</DialogTitle>
          <DialogDescription>
            {user ? "Actualice la información del usuario" : "Complete los datos del nuevo usuario"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nombre">Nombre Completo</Label>
            <Input
              id="nombre"
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Juan Pérez García"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Correo Electrónico</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="usuario@morelos.gob.mx"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="rol">Rol</Label>
            <Select value={rol} onValueChange={(value) => setRol(value as any)}>
              <SelectTrigger id="rol">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {USER_ROLES.map((role) => (
                  <SelectItem key={role} value={role}>
                    {role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="area">Área</Label>
            <Input
              id="area"
              type="text"
              value={area}
              onChange={(e) => setArea(e.target.value)}
              placeholder="Contabilidad"
              required
            />
          </div>

          {!user && (
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={8}
              />
              <p className="text-xs text-muted-foreground">Mínimo 8 caracteres</p>
            </div>
          )}

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={handleClose} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Guardando..." : user ? "Actualizar" : "Crear Usuario"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
