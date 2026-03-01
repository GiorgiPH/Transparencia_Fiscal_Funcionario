# Migración de Notificaciones a SweetAlert2

## Resumen

Se ha implementado un nuevo sistema de notificaciones basado en **SweetAlert2** que reemplaza el sistema anterior de toasts de Radix UI. El nuevo sistema ofrece:

- **Mejor UX**: Modales y toasts más atractivos visualmente
- **Funcionalidades avanzadas**: Confirmaciones, formularios, loading states
- **Consistencia visual**: Integración con la paleta de colores del proyecto
- **Mantenibilidad**: Código más limpio y reutilizable

## Estado Actual

✅ **Ya migrado:**
- Hook `useNotifications` (nuevo sistema)
- Hook `useSwalNotifications` (implementación base)
- Hook `useSwalCrudNotifications` (notificaciones CRUD)
- Componentes principales (`UserListContainer`, `CatalogoTreeItem`, etc.)

⚠️ **Por migrar:**
- Componente `Toaster` (solo UI, no funcionalidad)
- Cualquier uso directo de `useToast()` (si existe)

## Cómo Migrar

### 1. Reemplazar `useToast()` por `useNotifications()`

**Antes:**
```tsx
import { useToast } from '@/hooks/use-toast'

function Component() {
  const { toast } = useToast()

  const handleSuccess = () => {
    toast({
      title: "Éxito",
      description: "Operación completada",
      variant: "default",
    })
  }
}
```

**Después:**
```tsx
import { useNotifications } from '@/hooks/useNotifications'

function Component() {
  const notifications = useNotifications()

  const handleSuccess = () => {
    notifications.showSuccess("Operación completada")
  }
}
```

### 2. Métodos Equivalentes

| Antes (useToast) | Después (useNotifications) | Ejemplo |
|-----------------|---------------------------|---------|
| `toast({ title: "...", variant: "default" })` | `showSuccess(message)` | `showSuccess("Usuario creado")` |
| `toast({ title: "...", variant: "destructive" })` | `showError(message)` | `showError("Error al guardar")` |
| `toast({ title: "...", variant: "warning" })` | `showWarning(message)` | `showWarning("Campo requerido")` |
| `toast({ title: "...", variant: "info" })` | `showInfo(message)` | `showInfo("Proceso iniciado")` |

### 3. Funcionalidades Avanzadas (Nuevas)

#### Confirmaciones
```tsx
const confirmed = await notifications.confirmDelete(
  "usuario",
  "Esta acción no se puede deshacer"
)
if (confirmed) {
  // Eliminar usuario
}
```

#### Loading States
```tsx
const result = await notifications.withLoading(
  async () => {
    return await api.operacionLarga()
  },
  "Procesando..."
)
```

#### Notificaciones CRUD Específicas
```tsx
const crudNotifications = notifications.createCrudNotifications("Usuario")

// En operaciones CRUD
await crudNotifications.showCreateSuccess()
await crudNotifications.showUpdateError("Error específico")
```

### 4. Personalización de Notificaciones

```tsx
notifications.showSuccess("Título personalizado", {
  description: "Descripción detallada",
  duration: 3000, // 3 segundos
  showIcon: true,
  showCloseButton: true
})
```

### 5. Migración de Componentes CRUD

Para componentes que manejan operaciones CRUD, usar `useCrudNotifications`:

```tsx
import { useCrudNotifications } from '@/hooks/useNotifications'

function UserComponent() {
  const notifications = useCrudNotifications("Usuario")

  const handleCreate = async () => {
    try {
      await createUser(data)
      notifications.showCreateSuccess()
    } catch (error) {
      notifications.showCreateError(error.message)
    }
  }
}
```

## Beneficios del Nuevo Sistema

1. **Consistencia**: Todas las notificaciones tienen el mismo estilo
2. **Accesibilidad**: SweetAlert2 tiene mejor soporte de accesibilidad
3. **Internacionalización**: Fácil de traducir
4. **Responsive**: Se adapta mejor a dispositivos móviles
5. **Animaciones**: Transiciones más suaves

## Ejemplos Completos

### Ejemplo 1: Formulario con Validación
```tsx
import { useNotifications } from '@/hooks/useNotifications'

function UserForm() {
  const notifications = useNotifications()

  const handleSubmit = async (data) => {
    try {
      await notifications.withLoading(
        () => api.createUser(data),
        "Creando usuario..."
      )
      notifications.showSuccess("Usuario creado exitosamente")
    } catch (error) {
      notifications.showError("Error al crear usuario", {
        description: error.message
      })
    }
  }
}
```

### Ejemplo 2: Eliminación con Confirmación
```tsx
import { useNotifications } from '@/hooks/useNotifications'

function DeleteButton({ itemId, itemName }) {
  const notifications = useNotifications()

  const handleDelete = async () => {
    const confirmed = await notifications.confirmDelete(
      itemName,
      "Esta acción no se puede deshacer"
    )
    
    if (!confirmed) return
    
    try {
      await api.deleteItem(itemId)
      notifications.showSuccess(`${itemName} eliminado`)
    } catch (error) {
      notifications.showError(`Error al eliminar ${itemName}`)
    }
  }
}
```

## Notas Técnicas

### Dependencias
- `sweetalert2`: ^11.10.0
- `sweetalert2-react-content`: ^5.0.0

### Estilos
El sistema usa la paleta de colores definida en:
- `lib/swal-utils.ts` (configuración de temas)
- `tailwind.config.js` (colores del proyecto)

### Configuración Global
La configuración principal está en:
- `lib/swal-utils.ts`: Configuración de SweetAlert2
- `hooks/useSwalNotifications.ts`: Implementación de hooks
- `hooks/useNotifications.ts`: Exportaciones públicas

## Próximos Pasos

1. **Eliminar dependencias obsoletas:**
   ```bash
   npm uninstall @radix-ui/react-toast
   ```

2. **Remover componentes no usados:**
   - `components/ui/toast.tsx`
   - `components/ui/toaster.tsx`
   - `hooks/use-toast.ts`

3. **Actualizar imports:**
   Buscar y reemplazar todos los imports de `useToast` por `useNotifications`

## Soporte

Para problemas o preguntas:
1. Revisar `docs/ejemplo-uso-sweetalert2.md`
2. Consultar `lib/swal-utils.ts` para configuración
3. Revisar ejemplos en `components/examples/SweetAlertExample.tsx`

---

**Fecha de migración:** Febrero 2025  
**Versión:** SweetAlert2 v11.10.0  
**Responsable:** Equipo de Desarrollo Frontend