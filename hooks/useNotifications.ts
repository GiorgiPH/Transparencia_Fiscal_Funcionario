"use client"

import { useSwal } from "@/lib/swal"

/**
 * Opciones para notificaciones
 */
export interface NotificationOptions {
  title?: string
  description?: string
  duration?: number
  showIcon?: boolean
  showCloseButton?: boolean
  action?: {
    label: string
    onClick: () => void
  }
}

/**
 * Hook para notificaciones usando SweetAlert2
 */
export function useNotifications() {
  const swal = useSwal()

  /**
   * Muestra una notificación de éxito
   */
  const showSuccess = (message: string, options?: NotificationOptions) => {
    const { title, description } = options || {}
    swal.success(title || message, description || (title ? message : undefined))
  }

  /**
   * Muestra una notificación de error
   */
  const showError = (message: string, options?: NotificationOptions) => {
    const { title, description } = options || {}
    swal.error(title || message, description || (title ? message : undefined))
  }

  /**
   * Muestra una notificación de advertencia
   */
  const showWarning = (message: string, options?: NotificationOptions) => {
    const { title, description } = options || {}
    swal.warning(title || message, description || (title ? message : undefined))
  }

  /**
   * Muestra una notificación de información
   */
  const showInfo = (message: string, options?: NotificationOptions) => {
    const { title, description } = options || {}
    swal.info(title || message, description || (title ? message : undefined))
  }

  /**
   * Muestra una notificación de carga
   */
  const showLoading = (message: string, options?: NotificationOptions): void => {
    const { title, description } = options || {}
    swal.loading(title || message, description || (title ? message : undefined))
  }

  /**
   * Cierra la notificación actual
   */
  const dismissNotification = () => {
    swal.close()
  }

  /**
   * Confirma la eliminación de un recurso
   */
  const confirmDelete = async (resourceName: string, customMessage?: string): Promise<boolean> => {
    return swal.confirmDelete(resourceName, customMessage)
  }

  /**
   * Confirma una acción con opciones personalizadas
   */
  const confirmAction = async (
    title: string,
    text: string,
    confirmText: string = 'Confirmar',
    cancelText: string = 'Cancelar'
  ): Promise<boolean> => {
    return swal.confirmAction(title, text, confirmText, cancelText)
  }

  /**
   * Ejecuta una operación con loading
   */
  const withLoading = async <T>(
    operation: () => Promise<T>,
    loadingMessage: string = "Procesando..."
  ): Promise<T> => {
    return swal.withLoading(operation, loadingMessage)
  }

  /**
   * Muestra un toast (notificación pequeña)
   */
  const toast = async (message: string, type: 'success' | 'error' | 'warning' | 'info' = 'success') => {
    return swal.toast(message, type)
  }

  /**
   * Notificación de reset de formulario
   */
  const formReset = (formName: string) => {
    swal.info('Formulario reiniciado', `El formulario "${formName}" ha sido reiniciado a sus valores iniciales.`)
  }

  /**
   * Notificación de éxito en formulario
   */
  const formSuccess = (action: string, formName: string) => {
    swal.success('Operación exitosa', `El formulario "${formName}" ha sido ${action} correctamente.`)
  }

  /**
   * Notificación de error en formulario
   */
  const formError = (action: string, formName: string, errorMessage?: string) => {
    const message = errorMessage 
      ? `Error al ${action} el formulario "${formName}": ${errorMessage}`
      : `Error al ${action} el formulario "${formName}"`
    swal.error('Error en formulario', message)
  }

  /**
   * Notificación de error de validación en formulario
   */
  const formValidationError = (errorMessages: string[]) => {
    const message = errorMessages.length === 1 
      ? errorMessages[0]
      : `Se encontraron ${errorMessages.length} errores de validación:\n\n• ${errorMessages.join('\n• ')}`
    swal.error('Errores de validación', message)
  }

  return {
    // Métodos básicos
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showLoading,
    dismissNotification,
    
    // Métodos específicos
    confirmDelete,
    confirmAction,
    withLoading,
    toast,
    
    // Métodos para formularios
    formReset,
    formSuccess,
    formError,
    formValidationError,
    
    // Métodos directos de swal (para casos avanzados)
    fire: swal.fire,
    question: swal.question,
  }
}

export default useNotifications