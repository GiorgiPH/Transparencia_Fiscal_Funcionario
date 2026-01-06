"use client"

import { useState } from "react"
import { Container } from "@/components/shared/Container"
import { Loading } from "@/components/shared/Loading"
import { UserTable } from "@/components/features/admin/UserTable"
import { UserFormModal } from "@/components/features/admin/UserFormModal"
import { RolePermissionsCard } from "@/components/features/admin/RolePermissionsCard"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { UserPlus, Shield } from "lucide-react"
import { useAdmin } from "@/hooks/useAdmin"
import { useAuth } from "@/hooks/useAuth"
import type { UserManagement } from "@/types/user"

export default function UsuariosPage() {
  const { user: currentUser } = useAuth()
  const {
    users,
    permissions,
    rolePermissions,
    isLoading,
    createUser,
    updateUser,
    deleteUser,
    toggleUserStatus,
    resetPassword,
    updateRolePermissions,
  } = useAdmin()
  const [userFormOpen, setUserFormOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<UserManagement | null>(null)

  const handleCreateUser = async (data: any) => {
    await createUser(data)
  }

  const handleUpdateUser = async (data: any) => {
    if (selectedUser) {
      await updateUser(selectedUser.id, data)
    }
  }

  const handleEditUser = (user: UserManagement) => {
    setSelectedUser(user)
    setUserFormOpen(true)
  }

  const handleDeleteUser = async (userId: string) => {
    if (confirm("¿Está seguro de que desea eliminar este usuario?")) {
      await deleteUser(userId)
    }
  }

  const handleResetPassword = async (userId: string) => {
    if (confirm("¿Está seguro de que desea resetear la contraseña de este usuario?")) {
      await resetPassword(userId)
      alert("Se ha enviado una nueva contraseña al correo del usuario")
    }
  }

  const handleCloseModal = () => {
    setSelectedUser(null)
    setUserFormOpen(false)
  }

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

  if (isLoading) {
    return <Loading message="Cargando gestión de usuarios..." />
  }

  return (
    <Container>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-balance text-3xl font-bold tracking-tight text-foreground">Gestión de Usuarios</h1>
            <p className="mt-2 text-pretty text-muted-foreground">Administre usuarios, roles y permisos del sistema</p>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList>
            <TabsTrigger value="users">Usuarios</TabsTrigger>
            <TabsTrigger value="roles">Roles y Permisos</TabsTrigger>
          </TabsList>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-4">
            <div className="flex justify-end">
              <Button onClick={() => setUserFormOpen(true)} className="gap-2">
                <UserPlus className="h-4 w-4" />
                Crear Usuario
              </Button>
            </div>

            <UserTable
              users={users}
              onEdit={handleEditUser}
              onDelete={handleDeleteUser}
              onToggleStatus={toggleUserStatus}
              onResetPassword={handleResetPassword}
            />
          </TabsContent>

          {/* Roles & Permissions Tab */}
          <TabsContent value="roles" className="space-y-6">
            <Alert>
              <Shield className="h-4 w-4" />
              <AlertDescription>
                Configure los permisos para cada rol. Los cambios se aplicarán a todos los usuarios con ese rol.
              </AlertDescription>
            </Alert>

            <div className="grid gap-6 lg:grid-cols-2">
              {rolePermissions.map((rp) => (
                <RolePermissionsCard
                  key={rp.rol}
                  rol={rp.rol}
                  permissions={permissions}
                  rolePermissions={rp}
                  onUpdate={updateRolePermissions}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* User Form Modal */}
        <UserFormModal
          open={userFormOpen}
          onClose={handleCloseModal}
          onSubmit={selectedUser ? handleUpdateUser : handleCreateUser}
          user={selectedUser}
        />
      </div>
    </Container>
  )
}
