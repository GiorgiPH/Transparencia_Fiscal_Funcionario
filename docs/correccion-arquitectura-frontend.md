# Plan de Corrección de Arquitectura Frontend

## Análisis Actual

### ✅ Aspectos Correctos
1. **apiClient**: Ya implementado correctamente con `ApiResponse<T>` y `ApiError`
2. **Servicios**: Usan correctamente el `apiClient` y siguen el patrón de capas
3. **Hooks**: La mayoría siguen la arquitectura correcta (ej: `useCatalogs.ts`)
4. **Componentes**: No importan servicios directamente (verificado)

### ❌ Problemas Identificados
1. **SweetAlert centralizado pero no completamente**: El hook `useNotifications` existe pero algunos hooks podrían estar usando SweetAlert directamente
2. **Falta de métodos resetForm**: Los hooks de formularios no tienen métodos para resetear formularios
3. **Posibles violaciones de capas**: Necesito verificar más hooks

## Plan de Corrección

### Fase 1: Estándarización del apiClient
- [ ] Verificar que todos los servicios usen `ApiResponse<T>` correctamente
- [ ] Asegurar que los servicios devuelvan solo `data` (no el objeto completo de respuesta)
- [ ] Crear tipos genéricos para respuestas estándar

### Fase 2: Centralización de SweetAlert
- [ ] Verificar todos los hooks para uso directo de SweetAlert
- [ ] Actualizar `useNotifications` para ser más completo
- [ ] Crear documentación sobre uso correcto de notificaciones

### Fase 3: Corrección de Hooks
- [ ] Agregar métodos `resetForm` a hooks de formularios
- [ ] Verificar que ningún hook importe servicios directamente (deben usar hooks)
- [ ] Asegurar separación clara entre hooks de UI y lógica de negocio

### Fase 4: Verificación de Componentes
- [ ] Verificar que ningún componente importe servicios
- [ ] Asegurar que todos los componentes usen hooks
- [ ] Verificar patrones de importación

### Fase 5: Documentación y Pruebas
- [ ] Crear ejemplos de uso correcto
- [ ] Documentar la arquitectura de 4 capas
- [ ] Crear pruebas de validación de arquitectura

## Implementación Detallada

### 1. Mejoras al apiClient
```typescript
// En lib/api/axios-client.ts
export interface StandardApiResponse<T = any> {
  statusCode: number;
  message: string;
  data: T;
  timestamp: string;
  path: string;
}

// Métodos mejorados que siempre devuelven data
async get<T>(url: string): Promise<T> {
  const response = await this.instance.get<StandardApiResponse<T>>(url);
  return response.data.data;
}
```

### 2. Mejoras a useNotifications
```typescript
// Agregar métodos para formularios
const resetFormNotification = (formName: string) => {
  showInfo(`Formulario ${formName} reseteado`, {
    description: 'Todos los campos han sido limpiados'
  });
};

const formSuccessNotification = (action: string, resource: string) => {
  showSuccess(`${resource} ${action} exitosamente`);
};
```

### 3. Template para hooks de formularios
```typescript
export function useFormHook() {
  const [formData, setFormData] = useState(initialData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const notifications = useNotifications();

  const resetForm = () => {
    setFormData(initialData);
    notifications.showInfo('Formulario reseteado');
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Lógica de envío
      notifications.showSuccess('Operación exitosa');
      resetForm(); // Reset después de éxito
    } catch (error) {
      notifications.showError('Error en la operación');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    setFormData,
    isSubmitting,
    resetForm,
    handleSubmit
  };
}
```

## Validación de Arquitectura

### Reglas a Verificar
1. ✅ Componentes → Solo pueden importar hooks
2. ✅ Hooks → Solo pueden importar servicios
3. ✅ Servicios → Solo pueden importar apiClient
4. ✅ apiClient → Solo puede importar axios y stores de auth
5. ❌ SweetAlert → Solo debe usarse desde useNotifications

### Comandos de Verificación
```bash
# Buscar importaciones incorrectas en componentes
grep -r "import.*from.*services" components/

# Buscar SweetAlert directo en hooks
grep -r "import.*swal\|import.*Swal" hooks/

# Buscar axios directo en servicios
grep -r "import.*axios" services/ | grep -v "api-client"
```

## Cronograma
1. Día 1: Corrección de apiClient y servicios
2. Día 2: Centralización de SweetAlert
3. Día 3: Corrección de hooks
4. Día 4: Verificación de componentes
5. Día 5: Documentación y pruebas

## Métricas de Éxito
- 0 importaciones directas de servicios en componentes
- 0 importaciones directas de SweetAlert en hooks
- 100% de hooks con métodos resetForm (donde aplique)
- Documentación completa de arquitectura