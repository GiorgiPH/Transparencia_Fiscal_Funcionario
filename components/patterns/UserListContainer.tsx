"use client"

import { useEffect } from 'react';
import { UserList } from './UserList';
import { useUsers } from '@/hooks/useUsers';
import type { User } from '@/types/auth';

interface UserListContainerProps {
  onUserSelect?: (user: User) => void;
  onEditUser?: (user: User) => void;
  onDeleteUser?: (user: User) => void;
  autoLoad?: boolean;
}

export function UserListContainer({
  onUserSelect,
  onEditUser,
  onDeleteUser,
  autoLoad = true,
}: UserListContainerProps) {
  const {
    users,
    isLoading,
    error,
    fetchUsers,
    clearError,
  } = useUsers();

  useEffect(() => {
    if (autoLoad) {
      fetchUsers();
    }
  }, [autoLoad, fetchUsers]);

  const handleRefresh = () => {
    clearError();
    fetchUsers();
  };

  const handleUserClick = (user: User) => {
    onUserSelect?.(user);
  };

  const handleEditUser = (user: User) => {
    onEditUser?.(user);
  };

  const handleDeleteUser = (user: User) => {
    if (window.confirm(`¿Estás seguro de que deseas eliminar a ${user.nombre}?`)) {
      onDeleteUser?.(user);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Usuarios del Sistema</h2>
          <p className="text-sm text-gray-600">
            {users.length} usuario{users.length !== 1 ? 's' : ''} encontrado{users.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            <svg className="-ml-0.5 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refrescar
          </button>
        </div>
      </div>

      <UserList
        users={users}
        isLoading={isLoading}
        error={error}
        onUserClick={onUserSelect ? handleUserClick : undefined}
        onRefresh={handleRefresh}
        onEditUser={onEditUser ? handleEditUser : undefined}
        onDeleteUser={onDeleteUser ? handleDeleteUser : undefined}
      />

      <div className="text-xs text-gray-500">
        <p>
          <strong>Patrón Presentational/Container:</strong> Este componente solo maneja la lógica (data fetching, estado).
          El componente <code>UserList</code> se encarga únicamente de la presentación.
        </p>
      </div>
    </div>
  );
}
