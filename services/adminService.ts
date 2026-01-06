import type { UserManagement, CreateUserData, Permission, RolePermissions } from "@/types/user"

export const adminService = {
  async getUsers(): Promise<UserManagement[]> {
    // Mock implementation
    await new Promise((resolve) => setTimeout(resolve, 800))

    return [
      {
        id: "1",
        nombre: "Juan Pérez García",
        email: "juan.perez@morelos.gob.mx",
        rol: "Admin",
        area: "Dirección de Sistemas",
        activo: true,
        createdAt: "2025-01-01T10:00:00Z",
        updatedAt: "2025-01-06T14:30:00Z",
      },
      {
        id: "2",
        nombre: "María López Hernández",
        email: "maria.lopez@morelos.gob.mx",
        rol: "Upload",
        area: "Contabilidad",
        activo: true,
        createdAt: "2025-01-02T11:00:00Z",
        updatedAt: "2025-01-03T09:15:00Z",
      },
      {
        id: "3",
        nombre: "Carlos Ramírez Soto",
        email: "carlos.ramirez@morelos.gob.mx",
        rol: "Edit",
        area: "Contabilidad",
        activo: true,
        createdAt: "2025-01-02T11:30:00Z",
        updatedAt: "2025-01-04T16:45:00Z",
      },
    ]
  },

  async createUser(data: CreateUserData): Promise<UserManagement> {
    // Mock implementation
    await new Promise((resolve) => setTimeout(resolve, 1000))

    return {
      id: `user-${Date.now()}`,
      nombre: data.nombre,
      email: data.email,
      rol: data.rol,
      area: data.area,
      activo: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  },

  async updateUser(userId: string, data: Partial<UserManagement>): Promise<UserManagement> {
    // Mock implementation
    await new Promise((resolve) => setTimeout(resolve, 1000))

    return {
      id: userId,
      nombre: data.nombre || "Usuario",
      email: data.email || "usuario@morelos.gob.mx",
      rol: data.rol || "Upload",
      area: data.area || "N/A",
      activo: data.activo ?? true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  },

  async deleteUser(userId: string): Promise<void> {
    // Mock implementation
    await new Promise((resolve) => setTimeout(resolve, 500))
  },

  async toggleUserStatus(userId: string, activo: boolean): Promise<void> {
    // Mock implementation
    await new Promise((resolve) => setTimeout(resolve, 500))
  },

  async resetUserPassword(userId: string): Promise<void> {
    // Mock implementation
    await new Promise((resolve) => setTimeout(resolve, 1000))
  },

  async getPermissions(): Promise<Permission[]> {
    // Mock implementation
    await new Promise((resolve) => setTimeout(resolve, 500))

    return [
      {
        id: "perm-1",
        nombre: "Gestionar Usuarios",
        descripcion: "Crear, editar y eliminar usuarios del sistema",
        categoria: "Administración",
      },
      {
        id: "perm-2",
        nombre: "Subir Documentos",
        descripcion: "Cargar documentos en el sistema",
        categoria: "Documentos",
      },
      {
        id: "perm-3",
        nombre: "Editar Documentos",
        descripcion: "Modificar y eliminar documentos existentes",
        categoria: "Documentos",
      },
      {
        id: "perm-4",
        nombre: "Ver Reportes",
        descripcion: "Acceder a reportes y estadísticas del sistema",
        categoria: "Reportes",
      },
      {
        id: "perm-5",
        nombre: "Cambiar Contraseñas",
        descripcion: "Resetear contraseñas de otros usuarios",
        categoria: "Administración",
      },
    ]
  },

  async getRolePermissions(): Promise<RolePermissions[]> {
    // Mock implementation
    await new Promise((resolve) => setTimeout(resolve, 500))

    return [
      {
        rol: "Admin",
        permisos: ["perm-1", "perm-2", "perm-3", "perm-4", "perm-5"],
      },
      {
        rol: "Upload",
        permisos: ["perm-2", "perm-4"],
      },
      {
        rol: "Edit",
        permisos: ["perm-2", "perm-3", "perm-4"],
      },
    ]
  },

  async updateRolePermissions(rol: string, permisos: string[]): Promise<void> {
    // Mock implementation
    await new Promise((resolve) => setTimeout(resolve, 1000))
  },
}
