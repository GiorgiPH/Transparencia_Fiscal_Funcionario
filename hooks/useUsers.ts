"use client"

import { useState, useCallback } from 'react';
import { userService } from '@/services/userService';
import type { User, UpdateProfileData, ApiRole, CreateUserData, UpdateUserData } from '@/types/auth';
import { useNotifications } from './useNotifications';

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [roles, setRoles] = useState<ApiRole[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const notifications = useNotifications();

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await userService.getAdminUsers();
      setUsers(data);
      notifications.showSuccess('Usuarios cargados exitosamente');
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al cargar usuarios';
      setError(message);
      notifications.showError('Error al cargar usuarios', { description: message });
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [notifications]);

  const fetchRoles = useCallback(async (activo: boolean = true) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await userService.getRoles(activo);
      setRoles(data);
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al cargar roles';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchUserById = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const user = await userService.getUserById(id);
      setCurrentUser(user);
      return user;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al cargar usuario';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateUserProfile = useCallback(async (userId: string, data: UpdateProfileData) => {
    setIsLoading(true);
    setError(null);
    try {
      const updatedUser = await userService.updateProfile(userId, data);
      
      // Update in users list if exists
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === userId ? updatedUser : user
        )
      );
      
      // Update current user if it's the same
      if (currentUser?.id === userId) {
        setCurrentUser(updatedUser);
      }

      notifications.showSuccess('Perfil de usuario actualizado exitosamente');
      
      return updatedUser;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al actualizar perfil';
      setError(message);
      notifications.showError('Error al actualizar perfil', { description: message });
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [currentUser, notifications]);

  const updateCurrentUserProfile = useCallback(async (data: UpdateProfileData) => {
    setIsLoading(true);
    setError(null);
    try {
      const updatedUser = await userService.updateCurrentProfile(data);
      setCurrentUser(updatedUser);
      notifications.showSuccess('Perfil actualizado exitosamente');
      return updatedUser;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al actualizar perfil';
      setError(message);
      notifications.showError('Error al actualizar perfil', { description: message });
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [notifications]);

  const uploadProfilePhoto = useCallback(async (file: File) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await userService.uploadProfilePhoto(file);
      notifications.showSuccess("Foto de perfil actualizada exitosamente");
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al subir foto';
      setError(message);
      notifications.showError("Error al subir foto de perfil", {
        description: message,
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [notifications]);

  const changePassword = useCallback(async (currentPassword: string, newPassword: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await userService.changePassword({ currentPassword, newPassword });
      notifications.showSuccess("Contraseña cambiada exitosamente");
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al cambiar contraseña';
      setError(message);
      notifications.showError("Error al cambiar contraseña", {
        description: message,
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [notifications]);

  const createUser = useCallback(async (data: CreateUserData, file?: File) => {
    setIsLoading(true);
    setError(null);
    try {
      const newUser = await userService.createAdminUser(data, file);
      setUsers(prevUsers => [...prevUsers, newUser]);
      notifications.showSuccess('Usuario creado exitosamente');
      return newUser;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al crear usuario';
      setError(message);
      notifications.showError('Error al crear usuario', { description: message });
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [notifications]);

  const updateUser = useCallback(async (id: number, data: UpdateUserData, file?: File) => {
    setIsLoading(true);
    setError(null);
    try {
      const updatedUser = await userService.updateAdminUser(id, data, file);
      
      // Update in users list if exists
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === id.toString() ? updatedUser : user
        )
      );
      
      // Update current user if it's the same
      if (currentUser?.id === id.toString()) {
        setCurrentUser(updatedUser);
      }

      notifications.showSuccess('Usuario actualizado exitosamente');
      
      return updatedUser;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al actualizar usuario';
      setError(message);
      notifications.showError('Error al actualizar usuario', { description: message });
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [currentUser, notifications]);

  const deleteUser = useCallback(async (id: number) => {
    setIsLoading(true);
    setError(null);
    try {
      // El backend desactiva el usuario en lugar de eliminarlo físicamente
      await userService.deleteAdminUser(id);
      
      // Actualizar el usuario en la lista estableciendo activo: false
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === id.toString() 
            ? { ...user, activo: false } 
            : user
        )
      );

      notifications.showSuccess('Usuario eliminado exitosamente');
      
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al eliminar usuario';
      setError(message);
      notifications.showError('Error al eliminar usuario', { description: message });
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [notifications]);

  const fetchAdminUserById = useCallback(async (id: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const user = await userService.getAdminUserById(id);
      setCurrentUser(user);
      return user;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al cargar usuario';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // State
    users,
    currentUser,
    roles,
    isLoading,
    error,
    
    // Actions
    fetchUsers,
    fetchRoles,
    fetchUserById,
    fetchAdminUserById,
    createUser,
    updateUser,
    deleteUser,
    updateUserProfile,
    updateCurrentUserProfile,
    uploadProfilePhoto,
    changePassword,
    clearError,
    
    // Convenience
    getUserById: (id: string) => users.find(user => user.id === id),
    hasUsers: users.length > 0,
  };
}