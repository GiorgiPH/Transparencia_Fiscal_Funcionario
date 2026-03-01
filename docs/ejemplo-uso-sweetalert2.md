# Ejemplo de Uso de SweetAlert2 en el Portal Operativo

## Instalación y Configuración

SweetAlert2 ya está instalado en el proyecto (versión 11.26.20). Se ha creado una utilidad reutilizable en `/lib/swal-utils.ts` y un hook en `/hooks/useSwalNotifications.ts`.

## Utilidad Principal (`SwalUtils`)

### Importación básica

```typescript
import SwalUtils from '@/lib/swal-utils'
// o
import { SwalUtils } from '@/lib/swal-utils'
```

### Métodos disponibles

#### 1. Alertas básicas
```typescript
// Alerta de éxito
await SwalUtils.success('¡Éxito!', 'Operación completada correctamente')

// Alerta de error
await SwalUtils.error('Error', 'Ha ocurrido un problema')

// Alerta de advertencia
await SwalUtils.warning('Advertencia', 'Revise los datos ingresados')

// Alerta de información
await SwalUtils.info('Información', 'Proceso completado')
```

#### 2. Confirmaciones
```typescript
// Confirmación de eliminación
const confirmado = await SwalUtils.confirmDelete('Usuario')
if (confirmado) {
  // Lógica para eliminar
}

// Confirmación personalizada
const confirmado = await SwalUtils.confirmAction(
  '¿Continuar?',
  'Esta acción no se puede deshacer',
  'Sí, continuar',
  'Cancelar'
)
```

#### 3. Loading
```typescript
// Mostrar loading
await SwalUtils.loading('Procesando...', 'Por favor espere')

// Ejecutar operación con loading
const resultado = await SwalUtils.withLoading(
  async () => {
    // Tu operación asíncrona
    return await api.operacion()
  },
  'Procesando operación...'
)
```

#### 4. Toast (notificaciones pequeñas)
```typescript
// Toast de éxito
await SwalUtils.toast('Operación exitosa', 'success')

// Toast de error
await SwalUtils.toast('Error en la operación', 'error')
```

#### 5. Operaciones CRUD
```typescript
// Éxito en operaciones CRUD
await SwalUtils.showCrudSuccess('create', 'Usuario')
await SwalUtils.showCrudSuccess('update', 'Catálogo')
await SwalUtils.showCrudSuccess('delete', 'Documento')

// Error en operaciones CRUD
await SwalUtils.showCrudError('create', 'Usuario', 'Error específico')
```

## Hook de Notificaciones (`useNotifications`)

### Importación

```typescript
import { useNotifications } from '@/hooks/useNotifications'
// o
import { useCrudNotifications } from '@/hooks/useNotifications'
```

### Uso básico en componentes React

```typescript
"use client"

import { useNotifications } from '@/hooks/useNotifications'

export default function MiComponente() {
  const notifications = useNotifications()

  const handleSuccess = () => {
    notifications.showSuccess('Operación exitosa')
  }

  const handleError = () => {
    notifications.showError('Error en la operación', {
      description: 'Detalles del error aquí'
    })
  }

  const handleDelete = async () => {
    const confirmado = await notifications.confirmDelete('registro')
    if (confirmado) {
      // Lógica de eliminación
    }
  }

  return (
    <div>
      <button onClick={handleSuccess}>Mostrar éxito</button>
      <button onClick={handleError}>Mostrar error</button>
      <button onClick={handleDelete}>Eliminar</button>
    </div>
  )
}
```

### Hook específico para operaciones CRUD

```typescript
"use client"

import { useCrudNotifications } from '@/hooks/useNotifications'

export default function UsuariosComponent() {
  const usuariosNotifications = useCrudNotifications('Usuario')

  const crearUsuario = async () => {
    try {
      await usuariosNotifications.withLoading(async () => {
        // Lógica para crear usuario
        await api.crearUsuario(datos)
      })
      usuariosNotifications.showCreateSuccess()
    } catch (error) {
      usuariosNotifications.showCreateError(error.message)
    }
  }

  const eliminarUsuario = async (id: number) => {
    const confirmado = await usuariosNotifications.confirmDelete()
    if (confirmado) {
      try {
        await usuariosNotifications.withLoading(async () => {
          await api.eliminarUsuario(id)
        })
        usuariosNotifications.showDeleteSuccess()
      } catch (error) {
        usuariosNotifications.showDeleteError(error.message)
      }
    }
  }

  return (
    // JSX del componente
  )
}
```

## Ejemplos de reemplazo de alertas existentes

### Antes (usando alert nativo o toast)
```typescript
// Antes
alert('Usuario creado exitosamente')
// o
toast.success('Usuario creado exitosamente')
```

### Después (usando SweetAlert2)
```typescript
// Después
await SwalUtils.success('¡Éxito!', 'Usuario creado exitosamente')
// o usando el hook
notifications.showSuccess('Usuario creado exitosamente')
```

### Antes (confirmación de eliminación)
```typescript
// Antes
const confirmado = confirm('¿Está seguro de eliminar este usuario?')
if (confirmado) {
  // Eliminar
}
```

### Después (usando SweetAlert2)
```typescript
// Después
const confirmado = await SwalUtils.confirmDelete('Usuario')
if (confirmado) {
  // Eliminar
}
// o usando el hook
const confirmado = await notifications.confirmDelete('Usuario')
```

## Personalización de colores

Los colores de SweetAlert2 están configurados según la paleta del proyecto:

```typescript
import { SWAL_COLORS } from '@/lib/swal-utils'

// Colores disponibles:
console.log(SWAL_COLORS.primary)      // #2E3B2B dark green
console.log(SWAL_COLORS.secondary)    // #7C4A36 brown
console.log(SWAL_COLORS.success)      // Verde éxito
console.log(SWAL_COLORS.error)        // Rojo error
console.log(SWAL_COLORS.destructive)  // Rojo destructivo
```

## Integración con la arquitectura existente

### 1. En servicios
```typescript
import SwalUtils from '@/lib/swal-utils'

export class UserService {
  async createUser(data: UserData) {
    try {
      await SwalUtils.loading('Creando usuario...')
      const result = await api.post('/users', data)
      SwalUtils.close()
      await SwalUtils.showCrudSuccess('create', 'Usuario')
      return result
    } catch (error) {
      SwalUtils.close()
      await SwalUtils.showCrudError('create', 'Usuario', error.message)
      throw error
    }
  }
}
```

### 2. En hooks personalizados
```typescript
import { useSwalCrudNotifications } from '@/hooks/useSwalNotifications'

export function useUsers() {
  const notifications = useSwalCrudNotifications('Usuario')

  const createUser = async (data: UserData) => {
    return notifications.withLoading(async () => {
      const result = await api.post('/users', data)
      notifications.showCreateSuccess()
      return result
    }, 'Creando usuario...')
  }

  return { createUser }
}
```

### 3. En componentes de formulario
```typescript
"use client"

import { useNotifications } from '@/hooks/useNotifications'
import { useForm } from 'react-hook-form'

export default function UserForm() {
  const notifications = useNotifications()
  const { handleSubmit } = useForm()

  const onSubmit = async (data: any) => {
    try {
      await notifications.withLoading(async () => {
        await api.post('/users', data)
      }, 'Guardando usuario...')
      
      notifications.showSuccess('Usuario guardado exitosamente')
    } catch (error) {
      notifications.showError('Error al guardar usuario', {
        description: error.message
      })
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Campos del formulario */}
    </form>
  )
}
```

## Ventajas de la implementación

1. **Consistencia visual**: Todas las alertas siguen la paleta de colores del proyecto
2. **Reutilización**: Código centralizado y fácil de mantener
3. **Experiencia de usuario mejorada**: Alertas más atractivas y profesionales
4. **Accesibilidad**: SweetAlert2 incluye características de accesibilidad
5. **Responsive**: Se adapta a diferentes tamaños de pantalla
6. **Internacionalización**: Fácil de traducir a diferentes idiomas
7. **Animaciones**: Transiciones suaves y profesionales

## Migración de código existente

Para migrar alertas existentes, busca estos patrones:

```typescript
// Buscar y reemplazar:
alert(.*) → await SwalUtils.info($1)
confirm(.*) → await SwalUtils.confirmAction($1, '¿Está seguro?')
toast\.(success|error|warning|info) → notifications.show$1
```

## Soporte y mantenimiento

La implementación está diseñada para ser:
- **Extensible**: Fácil de agregar nuevos tipos de alertas
- **Mantenible**: Código bien documentado y tipado
- **Probable**: Fácil de escribir tests unitarios
- **Actualizable**: Dependencia de SweetAlert2 fácil de actualizar