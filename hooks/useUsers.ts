"use client"

import { useState, useCallback } from 'react';
import { userService } from '@/services/userService';
import type { User, UpdateProfileData } from '@/types/auth';

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await userService.getUsers();
      setUsers(data);
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al cargar usuarios';
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
      
      return updatedUser;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al actualizar perfil';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [currentUser]);

  const updateCurrentUserProfile = useCallback(async (data: UpdateProfileData) => {
    setIsLoading(true);
    setError(null);
    try {
      const updatedUser = await userService.updateCurrentProfile(data);
      setCurrentUser(updatedUser);
      return updatedUser;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al actualizar perfil';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const uploadProfilePhoto = useCallback(async (file: File) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await userService.uploadProfilePhoto(file);
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al subir foto';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const changePassword = useCallback(async (currentPassword: string, newPassword: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await userService.changePassword({ currentPassword, newPassword });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al cambiar contraseña';
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
    isLoading,
    error,
    
    // Actions
    fetchUsers,
    fetchUserById,
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
