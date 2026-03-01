"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { ApiRole, CreateUserData, UpdateUserData, User } from "@/types/auth"
import type { Dependencia } from "@/types/dependencia"
import { useDependencias } from "@/hooks/useDependencias"

interface UserFormModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: CreateUserData | UpdateUserData, file?: File) => Promise<void>
  user?: User | null
  roles: ApiRole[]
}

export function UserFormModal({ open, onClose, onSubmit, user, roles }: UserFormModalProps) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [selectedRoleIds, setSelectedRoleIds] = useState<number[]>([])
  const [dependenciaId, setDependenciaId] = useState<number | undefined>(undefined)
  const [telefono, setTelefono] = useState("")
  const [requiere2fa, setRequiere2fa] = useState(false)
  const [activo, setActivo] = useState(true)
  const [password, setPassword] = useState("")
  const [profileFile, setProfileFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const { 
    dependencias, 
    isLoading: isLoadingDependencias, 
    fetchDependenciasForUserSelection 
  } = useDependencias()

  // Cargar dependencias cuando se abre el modal
  useEffect(() => {
    const loadDependencias = async () => {
      if (open) {
        try {
          await fetchDependenciasForUserSelection()
        } catch (error) {
          console.error("Error al cargar dependencias:", error)
        }
      }
    }

    loadDependencias()
  }, [open, fetchDependenciasForUserSelection])

  // Establecer valores del usuario cuando se abre el modal y las dependencias están cargadas
  useEffect(() => {
    if (user && open && !isLoadingDependencias) {
      setName(user.nombre)
      setEmail(user.email)
        setDependenciaId(user.dependenciaId)

      setTelefono(user.telefono || "")
      setRequiere2fa(user.requiere_2fa || false)
      setActivo(user.activo !== false) // Si es undefined, mostrar como activo
      
      // Convertir roles del usuario a IDs seleccionados
      if (user.roles && roles.length > 0) {
        const userRoleIds = roles
          .filter(role => user.roles?.includes(role.nombre))
          .map(role => role.id)
        setSelectedRoleIds(userRoleIds)
      }
    } else if (!user && open) {
      // Resetear valores para creación
      setName("")
      setEmail("")
      setSelectedRoleIds([])
      setDependenciaId(undefined)
      setTelefono("")
      setRequiere2fa(false)
      setActivo(true)
      setPassword("")
      setProfileFile(null)
    }
  }, [user, open, roles, isLoadingDependencias])

  const handleRoleToggle = (roleId: number) => {
    setSelectedRoleIds(prev => 
      prev.includes(roleId) 
        ? prev.filter(id => id !== roleId)
        : [...prev, roleId]
    )
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setProfileFile(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      if (user) {
        // Modo edición
        const updateData: UpdateUserData = {
          name,
          email,
          dependenciaId,
          telefono: telefono || undefined,
          roleIds: selectedRoleIds.length > 0 ? selectedRoleIds : undefined,
          requiere_2fa: requiere2fa,
          activo,
        }
        await onSubmit(updateData, profileFile || undefined)
      } else {
        // Modo creación
        const createData: CreateUserData = {
          name,
          email,
          password,
          dependenciaId,
          telefono: telefono || undefined,
          roleIds: selectedRoleIds,
          requiere_2fa: requiere2fa,
          activo,
        }
        await onSubmit(createData, profileFile || undefined)
      }
      handleClose()
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    setName("")
    setEmail("")
    setSelectedRoleIds([])
    setDependenciaId(undefined)
    setTelefono("")
    setRequiere2fa(false)
    setActivo(true)
    setPassword("")
    setProfileFile(null)
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{user ? "Editar Usuario" : "Crear Nuevo Usuario"}</DialogTitle>
          <DialogDescription>
            {user ? "Actualice la información del usuario" : "Complete los datos del nuevo usuario"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre Completo *</Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Juan Pérez García"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Correo Electrónico *</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="usuario@morelos.gob.mx"
              required
            />
          </div>

          {!user && (
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña *</Label>
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

          <div className="space-y-2">
            <Label htmlFor="dependenciaId">Dependencia</Label>
            <Select
              value={dependenciaId?.toString() || "0"}
              onValueChange={(value) => setDependenciaId(value === "0" ? undefined : parseInt(value))}
              disabled={isLoadingDependencias}
            >
              <SelectTrigger id="dependenciaId">
                <SelectValue placeholder={isLoadingDependencias ? "Cargando dependencias..." : "Seleccione una dependencia"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Sin dependencia</SelectItem>
                {dependencias.map((dependencia) => (
                  <SelectItem key={dependencia.id} value={dependencia.id.toString()}>
                    {dependencia.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {isLoadingDependencias && (
              <p className="text-xs text-muted-foreground">Cargando dependencias...</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="telefono">Teléfono</Label>
            <Input
              id="telefono"
              type="tel"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              placeholder="7771234567"
            />
          </div>

          <div className="space-y-3">
            <Label>Roles *</Label>
            <div className="space-y-2">
              {roles.length === 0 ? (
                <p className="text-sm text-muted-foreground">Cargando roles...</p>
              ) : (
                roles.map((role) => (
                  <div key={role.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`role-${role.id}`}
                      checked={selectedRoleIds.includes(role.id)}
                      onCheckedChange={() => handleRoleToggle(role.id)}
                    />
                    <Label
                      htmlFor={`role-${role.id}`}
                      className="text-sm font-normal cursor-pointer"
                    >
                      {role.nombre}
                      <span className="text-xs text-muted-foreground ml-2">
                        {role.descripcion}
                      </span>
                    </Label>
                  </div>
                ))
              )}
            </div>
            {selectedRoleIds.length === 0 && (
              <p className="text-xs text-destructive">Seleccione al menos un rol</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="profileFile">Foto de Perfil</Label>
            <Input
              id="profileFile"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
            <p className="text-xs text-muted-foreground">
              Formatos: JPG, PNG, GIF (Máx. 5MB)
            </p>
          </div>

          <div className="flex items-center justify-between space-x-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="requiere2fa"
                checked={requiere2fa}
                onCheckedChange={setRequiere2fa}
              />
              <Label htmlFor="requiere2fa">Requiere 2FA</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="activo"
                checked={activo}
                onCheckedChange={setActivo}
              />
              <Label htmlFor="activo">Usuario Activo</Label>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={handleClose} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting || selectedRoleIds.length === 0}>
              {isSubmitting ? "Guardando..." : user ? "Actualizar" : "Crear Usuario"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}