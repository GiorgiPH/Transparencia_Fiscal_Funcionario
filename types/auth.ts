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
  createdAt: string
  updatedAt: string
  // Campos adicionales para compatibilidad con API
  roles?: string[]
  permissions?: string[]
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
