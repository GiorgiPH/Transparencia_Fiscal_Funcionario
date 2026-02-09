// Tipos para la API real (según ejemplo proporcionado)
export interface ApiUser {
  id: number
  email: string
  name: string
  roles: string[]
  permissions: string[]
}

// Tipos para compatibilidad con frontend existente
export interface User {
  id: string
  nombre: string
  email: string
  apodo?: string
  rol: "Admin" | "Upload" | "Edit"
  fotoPerfil?: string
  area?: string
  activo?: boolean
  telefono?: string
  requiere_2fa?: boolean
  dependenciaId?: number
  createdAt: string
  updatedAt: string
  // Campos adicionales para compatibilidad con API
  roles?: string[]
  permissions?: string[]
}

// Tipos para la API de administración de usuarios
export interface ApiAdminUser {
  id: number
  email: string
  name: string
  foto_perfil: string | null
  area_departamento: string | null
  telefono: string | null
  requiere_2fa: boolean
  activo: boolean
  ultimo_acceso: string | null
  fecha_creacion: string
  fecha_modificacion: string
  fecha_ultimo_cambio_pass: string | null
  usuario_creacion_id: number | null
  usuario_modif_id: number | null
  dependenciaId: number | null
  roles?: ApiRole[] // Se agregará cuando el endpoint regrese roles
}

export interface ApiRole {
  id: number
  nombre: string
  descripcion: string
  activo: boolean
  fecha_creacion: string
  fecha_modificacion: string
}

export interface CreateUserData {
  name: string
  email: string
  password: string
  dependenciaId?: number
  telefono?: string
  roleIds: number[]
  requiere_2fa?: boolean
  activo?: boolean
}

export interface UpdateUserData {
  name?: string
  email?: string
  dependenciaId?: number
  telefono?: string
  roleIds?: number[]
  requiere_2fa?: boolean
  activo?: boolean
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
  expiresIn: string // ISO string format
}

export interface AuthState {
  user: User | null
  tokens: AuthTokens | null
  isAuthenticated: boolean
  isLoading: boolean
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface ApiLoginResponse {
  accessToken: string
  refreshToken: string
  expiresIn: string
  user: ApiUser
}

export interface LoginResponse {
  user: User
  tokens: AuthTokens
}

export interface UpdateProfileData {
  nombre?: string;
  email?: string;
  apodo?: string;
  fotoPerfil?: string;
  area?: string;
}

// Helper functions para convertir entre tipos
export const authHelpers = {
  apiUserToUser: (apiUser: ApiUser): User => ({
    id: apiUser.id.toString(),
    nombre: apiUser.name,
    email: apiUser.email,
    rol: apiUser.roles.includes('ADMIN') ? 'Admin' : 
         apiUser.roles.includes('CARGA') ? 'Upload' : 'Edit',
    apodo: apiUser.email.split('@')[0],
    area: 'Secretaría de Administración y Finanzas', // Default
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    roles: apiUser.roles,
    permissions: apiUser.permissions,
  }),

  apiResponseToLoginResponse: (apiResponse: ApiLoginResponse): LoginResponse => ({
    user: authHelpers.apiUserToUser(apiResponse.user),
    tokens: {
      accessToken: apiResponse.accessToken,
      refreshToken: apiResponse.refreshToken,
      expiresIn: apiResponse.expiresIn,
    },
  }),
};
