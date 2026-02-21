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
import { MoreVertical, Edit, Trash2, Eye, EyeOff, Calendar, FileText } from "lucide-react"
import type { Noticia } from "@/types/estrategias-comunicacion"

interface NoticiaTableProps {
  noticias: Noticia[]
  onEdit: (noticia: Noticia) => void
  onDelete: (noticiaId: number) => void
  onToggleStatus: (noticiaId: number, activo: boolean) => void
}

export function NoticiaTable({ noticias, onEdit, onDelete, onToggleStatus }: NoticiaTableProps) {
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
              <th className="p-4 text-left text-sm font-semibold text-foreground">Título</th>
              <th className="p-4 text-left text-sm font-semibold text-foreground">Descripción Corta</th>
              <th className="p-4 text-left text-sm font-semibold text-foreground">Fecha Publicación</th>
              <th className="p-4 text-left text-sm font-semibold text-foreground">Estado</th>
              <th className="p-4 text-right text-sm font-semibold text-foreground">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {noticias.map((noticia) => (
              <tr key={noticia.id} className="border-b transition-colors hover:bg-muted/20">
                <td className="p-4">
                  <div className="flex items-start gap-3">
                    {noticia.imagen_url && (
                      <img
                        src={noticia.imagen_url}
                        alt={noticia.titulo}
                        className="h-12 w-12 object-cover rounded"
                      />
                    )}
                    <div>
                      <div className="text-sm font-medium text-foreground">{noticia.titulo}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Creada: {formatDate(noticia.fecha_creacion)}
                        </div>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="p-4 text-sm text-muted-foreground">
                  {noticia.descripcion_corta.length > 100 
                    ? `${noticia.descripcion_corta.substring(0, 100)}...` 
                    : noticia.descripcion_corta}
                </td>
                <td className="p-4 text-sm text-muted-foreground">
                  {formatDate(noticia.fecha_publicacion)}
                </td>
                <td className="p-4">
                  {noticia.activo ? (
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
                      <DropdownMenuItem onClick={() => onEdit(noticia)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onToggleStatus(noticia.id, !noticia.activo)}>
                        {noticia.activo ? (
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
                      <DropdownMenuItem onClick={() => onDelete(noticia.id)} className="text-destructive">
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