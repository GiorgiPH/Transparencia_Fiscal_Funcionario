import { apiClient } from '@/lib/api/axios-client';
import type { User, ApiAdminUser, ApiRole, CreateUserData, UpdateUserData } from '@/types/auth';

export interface UpdateProfileData {
  nombre?: string;
  email?: string;
  apodo?: string;
  fotoPerfil?: string;
  area?: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

export interface UploadPhotoResponse {
  url: string;
  fileName: string;
  fileSize: number;
}

// Helper functions para convertir entre tipos
const adminUserToUser = (apiUser: ApiAdminUser): User => {
  // Determinar rol basado en los roles del API (si existen)
  let rol: "Admin" | "Upload" | "Edit" = "Upload"; // Default
  if (apiUser.roles && apiUser.roles.length > 0) {
    const roleNames = apiUser.roles.map(r => r.nombre);
    if (roleNames.includes('ADMIN')) {
      rol = 'Admin';
    } else if (roleNames.includes('EDICION')) {
      rol = 'Edit';
    }
  }

  return {
    id: apiUser.id.toString(),
    nombre: apiUser.name,
    email: apiUser.email,
    apodo: apiUser.email.split('@')[0],
    rol,
    fotoPerfil: apiUser.foto_perfil || undefined,
    area: apiUser.area_departamento || undefined,
    activo: apiUser.activo,
    telefono: apiUser.telefono || undefined,
    requiere_2fa: apiUser.requiere_2fa,
    dependenciaId: apiUser.dependenciaId ? apiUser.dependenciaId : undefined,
    createdAt: apiUser.fecha_creacion,
    updatedAt: apiUser.fecha_modificacion,
    roles: apiUser.roles?.map(r => r.nombre),
  };
};

export const userService = {
  // Endpoints de administración
  async getAdminUsers(includeRoles: boolean = true): Promise<User[]> {
    const apiUsers = await apiClient.get<ApiAdminUser[]>(`/admin/users?includeRoles=${includeRoles}` );
    return apiUsers.map(adminUserToUser);
  },

  async getAdminUserById(id: number, includeRoles: boolean = true): Promise<User> {
    const apiUser = await apiClient.get<ApiAdminUser>(`/admin/users/${id}?includeRoles=${includeRoles}`);
    return adminUserToUser(apiUser);
  },

  async createAdminUser(
    data: CreateUserData,
    file?: File,
  ): Promise<User> {
    const formData = new FormData();
  
    Object.entries(data).forEach(([key, value]) => {
      if (value === undefined || value === null) return;
  
      if (Array.isArray(value)) {
        formData.append(key, JSON.stringify(value));
        return;
      }
  
      formData.append(key, value.toString());
    });
  
    if (file) {
      formData.append('foto_perfil', file);
    }
  
  
  
    const response = await apiClient.post<ApiAdminUser>(
      '/admin/users',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );
  
    return adminUserToUser(response);
  }
  ,

  async updateAdminUser(
    id: number,
    data: UpdateUserData,
    file?: File,
  ): Promise<User> {
    const formData = new FormData();
  
    // 🔹 Agregar campos (manejo correcto de arrays)
    Object.entries(data).forEach(([key, value]) => {
      if (value === undefined || value === null) return;
  
      // ✅ Arrays (ej. roleIds)
      if (Array.isArray(value)) {
        formData.append(key, JSON.stringify(value));
        return;
      }
  
      // ✅ Valores simples
      formData.append(key, value.toString());
    });
  
    // 🔹 Archivo (si existe)
    if (file) {
      formData.append('foto_perfil', file);
    }
  
    // 🔹 Debug opcional (útil mientras pruebas)
    // for (const pair of formData.entries()) {
    //   console.log(pair[0], pair[1]);
    // }
  
    const response = await apiClient.patch<ApiAdminUser>(
      `/admin/users/${id}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        // opcional si usas cookies
        // withCredentials: true,
      },
    );
  
    return adminUserToUser(response);
  }
  ,

  async deleteAdminUser(id: number): Promise<void> {
    await apiClient.delete(`/admin/users/${id}`);
  },

  async getRoles(activo: boolean = true): Promise<ApiRole[]> {
    return apiClient.get<ApiRole[]>(`/admin/users/roles?activo=${activo}`);
  },

  // Endpoints existentes (mantener compatibilidad)
  async getUsers(): Promise<User[]> {
    return apiClient.get<User[]>('/users');
  },

  async getUserById(id: string): Promise<User> {
    return apiClient.get<User>(`/users/${id}`);
  },

  async updateProfile(userId: string, data: UpdateProfileData): Promise<User> {
    return apiClient.put<User>(`/users/${userId}/profile`, data);
  },

  async updateCurrentProfile(data: UpdateProfileData): Promise<User> {
    return apiClient.put<User>('/users/me/profile', data);
  },

  async changePassword(data: ChangePasswordData): Promise<void> {
    return apiClient.post('/users/me/change-password', data);
  },

  async requestPasswordReset(email: string): Promise<void> {
    return apiClient.post('/users/request-password-reset', { email });
  },

  async resetPassword(token: string, newPassword: string): Promise<void> {
    return apiClient.post('/users/reset-password', { token, newPassword });
  },

  async uploadProfilePhoto(file: File): Promise<UploadPhotoResponse> {
    const formData = new FormData();
    formData.append('file', file);

    return apiClient.post<UploadPhotoResponse>('/users/me/upload-photo', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  async deleteProfilePhoto(): Promise<void> {
    return apiClient.delete('/users/me/profile-photo');
  },

  async getProfileCompletion(): Promise<{ percentage: number; missingFields: string[] }> {
    return apiClient.get('/users/me/profile-completion');
  },

  // Funciones para cambio de contraseña
  async requestPasswordChange(email: string): Promise<void> {
    return apiClient.post('/users/request-password-change', { email });
  },

  async verifyPasswordChangeCode(email: string, code: string): Promise<{ valid: boolean }> {
    return apiClient.post('/users/verify-password-change-code', { email, code });
  },

  async updatePassword(userId: string, newPassword: string): Promise<void> {
    return apiClient.post(`/users/${userId}/update-password`, { newPassword });
  },

  // Mock implementations for development
  async mockUpdateProfile(userId: string, data: UpdateProfileData): Promise<User> {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return {
      id: userId,
      nombre: data.nombre || 'Usuario Actualizado',
      email: data.email || 'usuario@morelos.gob.mx',
      apodo: data.apodo,
      rol: 'Admin',
      fotoPerfil: data.fotoPerfil,
      area: data.area || 'Secretaría de Administración y Finanzas',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  },

  async mockUploadProfilePhoto(file: File): Promise<UploadPhotoResponse> {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return {
      url: URL.createObjectURL(file),
      fileName: file.name,
      fileSize: file.size,
    };
  },
};
