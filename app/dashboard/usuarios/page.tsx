"use client"

import { Container } from "@/components/shared/Container"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Shield } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import { UserListContainer } from "@/components/patterns/UserListContainer"

export default function UsuariosPage() {
  const { user: currentUser } = useAuth()

  if (currentUser?.rol !== "Admin") {
    return (
      <Container>
        <Alert variant="destructive">
          <Shield className="h-4 w-4" />
          <AlertDescription>No tiene permisos para acceder a esta sección. Solo usuarios Admin.</AlertDescription>
        </Alert>
      </Container>
    )
  }

  return (
    <Container>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-balance text-3xl font-bold tracking-tight text-foreground">Gestión de Usuarios</h1>
            <p className="mt-2 text-pretty text-muted-foreground">Administre usuarios del sistema</p>
          </div>
        </div>

        {/* User List Container */}
        <UserListContainer />
      </div>
    </Container>
  )
}
