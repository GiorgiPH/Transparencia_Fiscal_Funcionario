import { apiClient } from '@/lib/api/axios-client';
import type { User } from '@/types/auth';

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

export const userService = {
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
