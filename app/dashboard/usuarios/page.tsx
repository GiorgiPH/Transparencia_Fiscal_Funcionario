"use client"

import { Container } from "@/components/shared/Container"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Shield, Users, UserCheck, UserX, ShieldCheck, UserCog, Image, Building, Calendar } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import { UserListContainer } from "@/components/patterns/UserListContainer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useUsersStats } from "@/hooks/useUsersStats"
import { useEffect } from "react"

export default function UsuariosPage() {
  const { user: currentUser } = useAuth()
  const { stats, isLoading, fetchStats } = useUsersStats()

  useEffect(() => {
    if (currentUser?.rol === "Admin") {
      fetchStats()
    }
  }, [currentUser?.rol])

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

        {/* Estadísticas */}
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Usuarios Activos</CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoading ? "--" : stats?.totalUsuariosActivos || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Usuarios con acceso al sistema
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Usuarios Inactivos</CardTitle>
              <UserX className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoading ? "--" : stats?.totalUsuariosInactivos || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Usuarios desactivados
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Administradores</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoading ? "--" : stats?.totalUsuariosAdmin || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Usuarios con rol Admin
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Capturistas</CardTitle>
              <ShieldCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoading ? "--" : stats?.totalUsuariosCarga || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Usuarios con rol Capturista
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Editores</CardTitle>
              <Image className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoading ? "--" : stats?.totalUsuariosEdicion || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Usuarios con rol Editor
              </p>
            </CardContent>
          </Card>

        

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Último Mes</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoading ? "--" : stats?.totalUsuariosUltimoMes || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Nuevos usuarios este mes
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoading ? "--" : (stats ? stats.totalUsuariosActivos + stats.totalUsuariosInactivos : 0)}
              </div>
              <p className="text-xs text-muted-foreground">
                Total de usuarios registrados
              </p>
            </CardContent>
          </Card>
        </div>

        {/* User List Container */}
        <UserListContainer />
      </div>
    </Container>
  )
}
