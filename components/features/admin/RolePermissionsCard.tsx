"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Save } from "lucide-react"
import type { Permission, RolePermissions } from "@/types/user"

interface RolePermissionsCardProps {
  rol: "Admin" | "Upload" | "Edit"
  permissions: Permission[]
  rolePermissions: RolePermissions
  onUpdate: (rol: string, permisos: string[]) => Promise<void>
}

const roleTitles = {
  Admin: "Administrador",
  Upload: "Carga",
  Edit: "Edición",
}

const roleDescriptions = {
  Admin: "Acceso completo al sistema incluyendo gestión de usuarios",
  Upload: "Puede cargar documentos al sistema",
  Edit: "Puede cargar y editar documentos",
}

export function RolePermissionsCard({ rol, permissions, rolePermissions, onUpdate }: RolePermissionsCardProps) {
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>(rolePermissions.permisos)
  const [isSaving, setIsSaving] = useState(false)

  const handleTogglePermission = (permId: string) => {
    if (selectedPermissions.includes(permId)) {
      setSelectedPermissions(selectedPermissions.filter((p) => p !== permId))
    } else {
      setSelectedPermissions([...selectedPermissions, permId])
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await onUpdate(rol, selectedPermissions)
    } finally {
      setIsSaving(false)
    }
  }

  const hasChanges = JSON.stringify(selectedPermissions.sort()) !== JSON.stringify(rolePermissions.permisos.sort())

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              {roleTitles[rol]}
              <Badge variant="outline">{rol}</Badge>
            </CardTitle>
            <CardDescription className="mt-1">{roleDescriptions[rol]}</CardDescription>
          </div>
          {hasChanges && (
            <Button onClick={handleSave} disabled={isSaving} size="sm" className="gap-2">
              <Save className="h-4 w-4" />
              {isSaving ? "Guardando..." : "Guardar"}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {permissions.map((permission) => (
          <div key={permission.id} className="flex items-start gap-3">
            <Checkbox
              id={`${rol}-${permission.id}`}
              checked={selectedPermissions.includes(permission.id)}
              onCheckedChange={() => handleTogglePermission(permission.id)}
            />
            <div className="flex-1">
              <label htmlFor={`${rol}-${permission.id}`} className="cursor-pointer text-sm font-medium text-foreground">
                {permission.nombre}
              </label>
              <p className="text-xs text-muted-foreground">{permission.descripcion}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
