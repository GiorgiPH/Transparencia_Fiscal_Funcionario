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
import { MoreVertical, Edit, Trash2, Eye, EyeOff, Link, Hash } from "lucide-react"
import type { RedSocial } from "@/types/estrategias-comunicacion"

interface RedSocialTableProps {
  redesSociales: RedSocial[]
  onEdit: (redSocial: RedSocial) => void
  onDelete: (redSocialId: number) => void
  onToggleStatus: (redSocialId: number, activo: boolean) => void
}

export function RedSocialTable({ redesSociales, onEdit, onDelete, onToggleStatus }: RedSocialTableProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <Card>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b bg-muted/30">
            <tr>
              <th className="p-4 text-left text-sm font-semibold text-foreground">Nombre</th>
              <th className="p-4 text-left text-sm font-semibold text-foreground">Descripción</th>
              <th className="p-4 text-left text-sm font-semibold text-foreground">URL</th>
              <th className="p-4 text-left text-sm font-semibold text-foreground">Orden</th>
              <th className="p-4 text-left text-sm font-semibold text-foreground">Estado</th>
              <th className="p-4 text-right text-sm font-semibold text-foreground">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {redesSociales.map((redSocial) => (
              <tr key={redSocial.id} className="border-b transition-colors hover:bg-muted/20">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    {/* <div className="flex h-10 w-10 items-center justify-center rounded bg-muted">
                      <span className="text-lg">{redSocial.icono}</span>
                    </div> */}
                    <div>
                      <div className="text-sm font-medium text-foreground">{redSocial.nombre}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Icono: {redSocial.icono}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="p-4 text-sm text-muted-foreground">
                  {redSocial.descripcion.length > 80 
                    ? `${redSocial.descripcion.substring(0, 80)}...` 
                    : redSocial.descripcion}
                </td>
                <td className="p-4">
                  <a 
                    href={redSocial.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    <Link className="h-3 w-3" />
                    Visitar
                  </a>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-1.5 text-sm">
                    <Hash className="h-3 w-3" />
                    {redSocial.orden}
                  </div>
                </td>
                <td className="p-4">
                  {redSocial.activo ? (
                    <div className="flex items-center gap-1.5 text-sm text-green-600">
                      <span className="h-2 w-2 rounded-full bg-green-600" />
                      Activa
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-sm text-red-600">
                      <span className="h-2 w-2 rounded-full bg-red-600" />
                      Inactiva
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
                      <DropdownMenuItem onClick={() => onEdit(redSocial)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onToggleStatus(redSocial.id, !redSocial.activo)}>
                        {redSocial.activo ? (
                          <>
                            <EyeOff className="mr-2 h-4 w-4" />
                            Desactivar
                          </>
                        ) : (
                          <>
                            <Eye className="mr-2 h-4 w-4" />
                            Activar
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => onDelete(redSocial.id)} className="text-destructive">
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