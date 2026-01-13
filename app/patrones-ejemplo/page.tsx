"use client"

import { UserListContainer } from '@/components/patterns/UserListContainer';

export const dynamic = 'force-dynamic';

export default function PatronesEjemploPage() {
  const handleUserSelect = (user: any) => {
    console.log('Usuario seleccionado:', user);
    alert(`Usuario seleccionado: ${user.nombre} (${user.email})`);
  };

  const handleEditUser = (user: any) => {
    console.log('Editar usuario:', user);
    alert(`Editar usuario: ${user.nombre}`);
  };

  const handleDeleteUser = (user: any) => {
    console.log('Eliminar usuario:', user);
    // En una implementación real, aquí llamarías al servicio
    alert(`Eliminar usuario: ${user.nombre} (simulado)`);
  };

  return (
    <div className="container mx-auto p-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Ejemplo de Patrones de Diseño</h1>
        <p className="text-gray-600 mt-2">
          Esta página demuestra la implementación de los patrones de diseño esenciales en el proyecto.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Ejemplo: Lista de Usuarios</h2>
            <p className="text-gray-600 mb-6">
              Este componente implementa la arquitectura de 4 capas:
            </p>
            
            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-medium text-blue-800 mb-2">Arquitectura de 4 Capas:</h3>
              <ol className="list-decimal pl-5 text-blue-700 space-y-1">
                <li><strong>Componente (UserListContainer):</strong> Maneja la lógica de presentación</li>
                <li><strong>Hook (useUsers):</strong> Encapsula la lógica de estado y efectos</li>
                <li><strong>Servicio (userService):</strong> Contiene las reglas de negocio y llamadas a API</li>
                <li><strong>Cliente API (apiClient):</strong> Maneja la comunicación HTTP con interceptores</li>
              </ol>
            </div>

            <UserListContainer
              onUserSelect={handleUserSelect}
            />
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-semibold text-gray-800 mb-3">Patrones Implementados</h3>
            
            <div className="space-y-4">
              <div className="p-3 bg-green-50 rounded border border-green-100">
                <h4 className="font-medium text-green-800">1. Layered Architecture ✅</h4>
                <p className="text-green-700 text-sm mt-1">
                  Separación clara entre Componentes → Hooks → Services → API Client
                </p>
              </div>

              <div className="p-3 bg-purple-50 rounded border border-purple-100">
                <h4 className="font-medium text-purple-800">2. Custom Hook Pattern ✅</h4>
                <p className="text-purple-700 text-sm mt-1">
                  <code>useUsers</code> encapsula toda la lógica de estado y efectos
                </p>
              </div>

              <div className="p-3 bg-blue-50 rounded border border-blue-100">
                <h4 className="font-medium text-blue-800">3. Service Layer Pattern ✅</h4>
                <p className="text-blue-700 text-sm mt-1">
                  <code>userService</code> contiene reglas de negocio y llamadas a API
                </p>
              </div>

              <div className="p-3 bg-yellow-50 rounded border border-yellow-100">
                <h4 className="font-medium text-yellow-800">4. Presentational/Container Pattern ✅</h4>
                <p className="text-yellow-700 text-sm mt-1">
                  <code>UserListContainer</code> (lógica) vs <code>UserList</code> (UI)
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-semibold text-gray-800 mb-3">Características del Cliente HTTP</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start">
                <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Interceptores para manejo automático de tokens JWT</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Refresh token automático en errores 401</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Formato estandarizado de respuestas API</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Manejo centralizado de errores</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Store de autenticación con Zustand</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-semibold text-gray-800 mb-3">Estructura de Archivos</h3>
            <div className="text-sm font-mono bg-gray-50 p-3 rounded">
              <div className="text-gray-500">fiscal-transparency-portal/</div>
              <div className="ml-4">
                <div className="text-blue-600">lib/api/axios-client.ts</div>
                <div className="text-purple-600 ml-4">← Cliente HTTP reutilizable</div>
                <div className="text-blue-600">lib/stores/auth-store.ts</div>
                <div className="text-purple-600 ml-4">← Store de autenticación (Zustand)</div>
                <div className="text-blue-600">services/userService.ts</div>
                <div className="text-purple-600 ml-4">← Capa de servicios</div>
                <div className="text-blue-600">hooks/useUsers.ts</div>
                <div className="text-purple-600 ml-4">← Custom hook pattern</div>
                <div className="text-blue-600">components/patterns/</div>
                <div className="ml-4">
                  <div className="text-green-600">UserList.tsx</div>
                  <div className="text-purple-600 ml-4">← Componente presentacional</div>
                  <div className="text-green-600">UserListContainer.tsx</div>
                  <div className="text-purple-600 ml-4">← Componente contenedor</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
