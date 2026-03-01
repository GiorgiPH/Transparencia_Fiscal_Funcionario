"use client"

import { useState, useCallback } from "react"
import { useNotifications } from "./useNotifications"

/**
 * Template para hooks de formularios
 * 
 * Este template proporciona una estructura estándar para hooks que manejan formularios,
 * incluyendo métodos para resetear formularios y manejar notificaciones.
 */

export interface FormHookOptions<T> {
  initialData: T
  formName?: string
  onSuccess?: (data: T) => void
  onError?: (error: Error) => void
  onReset?: () => void
}

/**
 * Hook genérico para formularios
 */
export function useFormHook<T extends Record<string, any>>(options: FormHookOptions<T>) {
  const {
    initialData,
    formName = "Formulario",
    onSuccess,
    onError,
    onReset
  } = options

  const [formData, setFormData] = useState<T>(initialData)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({})
  const [isDirty, setIsDirty] = useState(false)

  const notifications = useNotifications()

  /**
   * Actualiza un campo específico del formulario
   */
  const updateField = useCallback(<K extends keyof T>(field: K, value: T[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setIsDirty(true)
    
    // Limpiar error del campo si existe
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }, [errors])

  /**
   * Actualiza múltiples campos del formulario
   */
  const updateFields = useCallback((updates: Partial<T>) => {
    setFormData(prev => ({ ...prev, ...updates }))
    setIsDirty(true)
    
    // Limpiar errores de los campos actualizados
    const updatedFields = Object.keys(updates) as Array<keyof T>
    const newErrors = { ...errors }
    updatedFields.forEach(field => {
      newErrors[field] = undefined
    })
    setErrors(newErrors)
  }, [errors])

  /**
   * Resetea el formulario a los valores iniciales
   */
  const resetForm = useCallback((showNotification: boolean = true) => {
    setFormData(initialData)
    setErrors({})
    setIsDirty(false)
    
    if (showNotification) {
      notifications.formReset(formName)
    }
    
    if (onReset) {
      onReset()
    }
  }, [initialData, formName, notifications, onReset])

  /**
   * Resetea el formulario a nuevos valores
   */
  const resetTo = useCallback((newData: T, showNotification: boolean = true) => {
    setFormData(newData)
    setErrors({})
    setIsDirty(false)
    
    if (showNotification) {
      notifications.formReset(formName)
    }
    
    if (onReset) {
      onReset()
    }
  }, [formName, notifications, onReset])

  /**
   * Valida el formulario
   */
  const validateForm = useCallback((): boolean => {
    // Esta función debe ser implementada por el hook específico
    // que extienda este template
    return true
  }, [])

  /**
   * Establece errores de validación
   */
  const setValidationErrors = useCallback((validationErrors: Partial<Record<keyof T, string>>) => {
    setErrors(validationErrors)
    
    if (Object.keys(validationErrors).length > 0) {
      const errorMessages = Object.values(validationErrors).filter(Boolean) as string[]
      notifications.formValidationError(errorMessages)
    }
  }, [notifications])

  /**
   * Maneja el envío del formulario
   */
  const handleSubmit = useCallback(async (
    submitFn: (data: T) => Promise<any>,
    successMessage?: string
  ) => {
    setIsSubmitting(true)
    setErrors({})
    
    try {
      // Validar antes de enviar
      if (!validateForm()) {
        setIsSubmitting(false)
        return
      }
      
      const result = await submitFn(formData)
      
      // Mostrar notificación de éxito
      if (successMessage) {
        notifications.showSuccess(successMessage)
      } else {
        notifications.formSuccess("guardado", formName)
      }
      
      // Resetear formulario después de éxito
      setIsDirty(false)
      
      if (onSuccess) {
        onSuccess(formData)
      }
      
      return result
    } catch (error: any) {
      // Manejar errores de validación del servidor
      if (error.response?.data?.errors) {
        setValidationErrors(error.response.data.errors)
      } else {
        const errorMessage = error.response?.data?.message || error.message || "Error al guardar"
        notifications.formError("guardar", formName, errorMessage)
      }
      
      if (onError) {
        onError(error)
      }
      
      throw error
    } finally {
      setIsSubmitting(false)
    }
  }, [formData, formName, notifications, onSuccess, onError, validateForm, setValidationErrors])

  /**
   * Maneja la eliminación de un recurso
   */
  const handleDelete = useCallback(async (
    deleteFn: () => Promise<any>,
    resourceName: string,
    customMessage?: string
  ) => {
    const confirmed = await notifications.confirmDelete(resourceName, customMessage)
    
    if (!confirmed) {
      return false
    }
    
    setIsSubmitting(true)
    
    try {
      const result = await deleteFn()
      notifications.showSuccess(`${resourceName} eliminado exitosamente`)
      return result
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || "Error al eliminar"
      notifications.showError(`Error al eliminar ${resourceName}`, {
        description: errorMessage,
      })
      throw error
    } finally {
      setIsSubmitting(false)
    }
  }, [notifications])

  /**
   * Limpia los errores del formulario
   */
  const clearErrors = useCallback(() => {
    setErrors({})
  }, [])

  /**
   * Verifica si el formulario tiene errores
   */
  const hasErrors = useCallback((): boolean => {
    return Object.values(errors).some(error => error !== undefined && error !== "")
  }, [errors])

  /**
   * Obtiene el mensaje de error de un campo específico
   */
  const getFieldError = useCallback((field: keyof T): string | undefined => {
    return errors[field]
  }, [errors])

  /**
   * Verifica si un campo específico tiene error
   */
  const hasFieldError = useCallback((field: keyof T): boolean => {
    return !!errors[field]
  }, [errors])

  return {
    // Estado
    formData,
    isSubmitting,
    errors,
    isDirty,
    
    // Métodos de actualización
    updateField,
    updateFields,
    setFormData,
    
    // Métodos de reset
    resetForm,
    resetTo,
    
    // Métodos de validación
    validateForm,
    setValidationErrors,
    clearErrors,
    hasErrors,
    getFieldError,
    hasFieldError,
    
    // Métodos de operación
    handleSubmit,
    handleDelete,
    
    // Utilidades
    setIsSubmitting,
    setIsDirty,
  }
}

export default useFormHook