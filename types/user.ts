export interface UserManagement {
  id: string
  nombre: string
  email: string
  rol: "Admin" | "Upload" | "Edit"
  area: string
  activo: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateUserData {
  nombre: string
  email: string
  rol: "Admin" | "Upload" | "Edit"
  area: string
  password: string
}

export interface Permission {
  id: string
  nombre: string
  descripcion: string
  categoria: string
}

export interface RolePermissions {
  rol: "Admin" | "Upload" | "Edit"
  permisos: string[]
}
