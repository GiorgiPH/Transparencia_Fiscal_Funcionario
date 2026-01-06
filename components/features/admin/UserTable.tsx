"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreVertical, Edit, Trash2, Lock, UserCheck, UserX } from "lucide-react"
import type { UserManagement } from "@/types/user"

interface UserTableProps {
  users: UserManagement[]
  onEdit: (user: UserManagement) => void
  onDelete: (userId: string) => void
  onToggleStatus: (userId: string, activo: boolean) => void
  onResetPassword: (userId: string) => void
}

const roleBadgeVariant = {
  Admin: "default",
  Upload: "secondary",
  Edit: "outline",
} as const

export function UserTable({ users, onEdit, onDelete, onToggleStatus, onResetPassword }: UserTableProps) {
  return (
    <Card>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b bg-muted/30">
            <tr>
              <th className="p-4 text-left text-sm font-semibold text-foreground">Nombre</th>
              <th className="p-4 text-left text-sm font-semibold text-foreground">Correo</th>
              <th className="p-4 text-left text-sm font-semibold text-foreground">Rol</th>
              <th className="p-4 text-left text-sm font-semibold text-foreground">Área</th>
              <th className="p-4 text-left text-sm font-semibold text-foreground">Estado</th>
              <th className="p-4 text-right text-sm font-semibold text-foreground">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b transition-colors hover:bg-muted/20">
                <td className="p-4 text-sm font-medium text-foreground">{user.nombre}</td>
                <td className="p-4 text-sm text-muted-foreground">{user.email}</td>
                <td className="p-4">
                  <Badge variant={roleBadgeVariant[user.rol]}>{user.rol}</Badge>
                </td>
                <td className="p-4 text-sm text-muted-foreground">{user.area}</td>
                <td className="p-4">
                  {user.activo ? (
                    <div className="flex items-center gap-1.5 text-sm text-green-600">
                      <span className="h-2 w-2 rounded-full bg-green-600" />
                      Activo
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-sm text-red-600">
                      <span className="h-2 w-2 rounded-full bg-red-600" />
                      Inactivo
                    </div>
                  )}
                </td>
                <td className="p-4 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEdit(user)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onResetPassword(user.id)}>
                        <Lock className="mr-2 h-4 w-4" />
                        Resetear Contraseña
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onToggleStatus(user.id, !user.activo)}>
                        {user.activo ? (
                          <>
                            <UserX className="mr-2 h-4 w-4" />
                            Desactivar
                          </>
                        ) : (
                          <>
                            <UserCheck className="mr-2 h-4 w-4" />
                            Activar
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => onDelete(user.id)} className="text-destructive">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Eliminar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
