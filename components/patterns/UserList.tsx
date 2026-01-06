import type { User } from '@/types/auth';

interface UserListProps {
  users: User[];
  isLoading?: boolean;
  error?: string | null;
  onUserClick?: (user: User) => void;
  onRefresh?: () => void;
  onEditUser?: (user: User) => void;
  onDeleteUser?: (user: User) => void;
}

export function UserList({
  users,
  isLoading = false,
  error = null,
  onUserClick,
  onRefresh,
  onEditUser,
  onDeleteUser,
}: UserListProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        <span className="ml-2">Cargando usuarios...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error</h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{error}</p>
            </div>
            {onRefresh && (
              <div className="mt-4">
                <button
                  type="button"
                  onClick={onRefresh}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Reintentar
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="text-center py-12">
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5 0c-.281.046-.562.093-.844.135m-4.272 0a24.003 24.003 0 01-.844-.135m4.272 0a3 3 0 01-4.272 0m4.272 0A6.984 6.984 0 0115 15m-4.5 0a6.984 6.984 0 014.5 0" />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">No hay usuarios</h3>
        <p className="mt-1 text-sm text-gray-500">No se encontraron usuarios en el sistema.</p>
        {onRefresh && (
          <div className="mt-6">
            <button
              type="button"
              onClick={onRefresh}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
              </svg>
              Refrescar
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
      <table className="min-w-full divide-y divide-gray-300">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
              Nombre
            </th>
            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
              Email
            </th>
            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
              Rol
            </th>
            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
              Área
            </th>
            <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
              <span className="sr-only">Acciones</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {users.map((user) => (
            <tr 
              key={user.id} 
              className={onUserClick ? 'hover:bg-gray-50 cursor-pointer' : ''}
              onClick={() => onUserClick?.(user)}
            >
              <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                <div className="flex items-center">
                  {user.fotoPerfil ? (
                    <img className="h-10 w-10 rounded-full" src={user.fotoPerfil} alt="" />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-500 font-medium">
                        {user.nombre.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div className="ml-4">
                    <div className="font-medium text-gray-900">{user.nombre}</div>
                    {user.apodo && (
                      <div className="text-gray-500">@{user.apodo}</div>
                    )}
                  </div>
                </div>
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{user.email}</td>
              <td className="whitespace-nowrap px-3 py-4 text-sm">
                <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                  user.rol === 'Admin' 
                    ? 'bg-purple-100 text-purple-800' 
                    : user.rol === 'Upload'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-green-100 text-green-800'
                }`}>
                  {user.rol}
                </span>
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{user.area || 'No especificada'}</td>
              <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                <div className="flex justify-end space-x-2" onClick={(e) => e.stopPropagation()}>
                  {onEditUser && (
                    <button
                      onClick={() => onEditUser(user)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Editar
                    </button>
                  )}
                  {onDeleteUser && (
                    <button
                      onClick={() => onDeleteUser(user)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Eliminar
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
