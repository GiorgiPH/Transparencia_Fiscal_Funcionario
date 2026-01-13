"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Camera, Save } from "lucide-react"
import type { User } from "@/types/auth"
import { useUserProfile } from "@/hooks/useUserProfile"

interface ProfileFormProps {
  user: User
  onUpdate: (user: User) => void
}

export function ProfileForm({ user, onUpdate }: ProfileFormProps) {
  const { updateProfile, uploadPhoto, isLoading } = useUserProfile()
  const [nombre, setNombre] = useState(user.nombre)
  const [email, setEmail] = useState(user.email)
  const [apodo, setApodo] = useState(user.apodo || "")
  const [fotoPerfil, setFotoPerfil] = useState(user.fotoPerfil || "")

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const result = await uploadPhoto(file)
      setFotoPerfil(result.url)
    } catch (error) {
      console.error("Error uploading photo:", error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const updatedUser = await updateProfile(user.id, {
        nombre,
        email,
        apodo,
        fotoPerfil,
      })
      onUpdate(updatedUser)
    } catch (error) {
      console.error("Error updating profile:", error)
    }
  }

  const initials = nombre
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Información Personal</CardTitle>
        <CardDescription>Actualice su información de perfil</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Photo */}
          <div className="flex items-center gap-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src={fotoPerfil || "/placeholder.svg"} />
              <AvatarFallback className="bg-primary text-lg text-primary-foreground">{initials}</AvatarFallback>
            </Avatar>
            <div>
              <Label htmlFor="photo" className="cursor-pointer">
                <div className="flex items-center gap-2 rounded-md border bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent">
                  <Camera className="h-4 w-4" />
                  <span>Cambiar Foto</span>
                </div>
                <input id="photo" type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
              </Label>
              <p className="mt-2 text-xs text-muted-foreground">JPG, PNG o GIF. Máximo 2MB.</p>
            </div>
          </div>

          {/* Name */}
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

          {/* Email */}
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

          {/* Nickname */}
          <div className="space-y-2">
            <Label htmlFor="apodo">Apodo (Opcional)</Label>
            <Input
              id="apodo"
              type="text"
              value={apodo}
              onChange={(e) => setApodo(e.target.value)}
              placeholder="jperez"
            />
          </div>

          {/* Role (Read-only) */}
          <div className="space-y-2">
            <Label htmlFor="rol">Rol</Label>
            <Input id="rol" type="text" value={user.rol} disabled className="bg-muted" />
          </div>

          {/* Area (Read-only) */}
          <div className="space-y-2">
            <Label htmlFor="area">Área</Label>
            <Input id="area" type="text" value={user.area || "N/A"} disabled className="bg-muted" />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <Button type="submit" disabled={isLoading} className="gap-2">
              <Save className="h-4 w-4" />
              {isLoading ? "Guardando..." : "Guardar Cambios"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
