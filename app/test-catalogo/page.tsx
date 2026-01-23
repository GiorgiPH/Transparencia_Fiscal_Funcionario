"use client"

import { CatalogoTreeContainer } from "@/components/patterns/CatalogoTreeContainer"

export default function TestCatalogoPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Test: Modo Edición de Catálogos</h1>
        <p className="text-gray-600 mb-8">
          Esta página prueba el botón "Administrar catálogos" y el modo edición.
        </p>
        
        <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
          <div className="h-[800px]">
            <CatalogoTreeContainer showDocumentos={true} />
          </div>
        </div>
        
        <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
          <h2 className="text-xl font-semibold text-blue-900 mb-3">Instrucciones de prueba:</h2>
          <ol className="list-decimal list-inside space-y-2 text-blue-800">
            <li>Verifique que el botón "Administrar catálogos" aparece en la esquina superior derecha</li>
            <li>Haga clic en el botón para activar el modo edición</li>
            <li>Verifique que aparece un panel amarillo de advertencia "Modo edición activado"</li>
            <li>Verifique que cada catálogo muestra tres botones: + (agregar), ✏️ (editar), 🗑️ (eliminar)</li>
            <li>Haga clic en "Salir modo edición" para regresar al modo normal</li>
          </ol>
        </div>
      </div>
    </div>
  )
}
