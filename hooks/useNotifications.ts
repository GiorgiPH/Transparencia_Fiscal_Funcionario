"use client"

import { toast as shadcnToast } from "@/hooks/use-toast"
import { toast as sonnerToast } from "sonner"

export type NotificationType = "success" | "error" | "warning" | "info"
export type NotificationPosition = "top-right" | "top-center" | "top-left" | "bottom-right" | "bottom-center" | "bottom-left"

export interface NotificationOptions {
  title?: string
  description?: string
  duration?: number
  position?: NotificationPosition
  showIcon?: boolean
  showCloseButton?: boolean
  action?: {
    label: string
    onClick: () => void
  }
}

export interface NotificationHook {
  showNotification: (type: NotificationType, message: string, options?: NotificationOptions) => void
  showSuccess: (message: string, options?: NotificationOptions) => void
  showError: (message: string, options?: NotificationOptions) => void
  showWarning: (message: string, options?: NotificationOptions) => void
  showInfo: (message: string, options?: NotificationOptions) => void
  showLoading: (message: string, options?: NotificationOptions) => string | number
  dismissNotification: (id: string | number) => void
  dismissAllNotifications: () => void
}

export function useNotifications(): NotificationHook {
  // Usar Sonner para notificaciones más modernas y ricas
  const showNotification = (type: NotificationType, message: string, options?: NotificationOptions) => {
    const { title, description, duration = 5000, action } = options || {}

    switch (type) {
      case "success":
        sonnerToast.success(title || message, {
          description: description || (title ? message : undefined),
          duration,
          action: action ? {
            label: action.label,
            onClick: action.onClick,
          } : undefined,
        })
        break
      case "error":
        sonnerToast.error(title || message, {
          description: description || (title ? message : undefined),
          duration,
          action: action ? {
            label: action.label,
            onClick: action.onClick,
          } : undefined,
        })
        break
      case "warning":
        sonnerToast.warning(title || message, {
          description: description || (title ? message : undefined),
          duration,
          action: action ? {
            label: action.label,
            onClick: action.onClick,
          } : undefined,
        })
        break
      case "info":
        sonnerToast.info(title || message, {
          description: description || (title ? message : undefined),
          duration,
          action: action ? {
            label: action.label,
            onClick: action.onClick,
          } : undefined,
        })
        break
    }
  }

  const showSuccess = (message: string, options?: NotificationOptions) => {
    showNotification("success", message, options)
  }

  const showError = (message: string, options?: NotificationOptions) => {
    showNotification("error", message, options)
  }

  const showWarning = (message: string, options?: NotificationOptions) => {
    showNotification("warning", message, options)
  }

  const showInfo = (message: string, options?: NotificationOptions) => {
    showNotification("info", message, options)
  }

  const showLoading = (message: string, options?: NotificationOptions): string | number => {
    const { title, description } = options || {}
    return sonnerToast.loading(title || message, {
      description: description || (title ? message : undefined),
    })
  }

  const dismissNotification = (id: string | number) => {
    sonnerToast.dismiss(id)
  }

  const dismissAllNotifications = () => {
    sonnerToast.dismiss()
  }

  // Método alternativo usando ShadCN Toast (mantener compatibilidad)
  const showShadcnNotification = (type: NotificationType, message: string, options?: NotificationOptions) => {
    const { title, description, duration = 5000 } = options || {}
    
    shadcnToast({
      variant: type === "error" ? "destructive" : "default",
      title: title || message,
      description: description || (title ? message : undefined),
      duration,
    })
  }

  return {
    showNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showLoading,
    dismissNotification,
    dismissAllNotifications,
  }
}

// Hook simplificado para operaciones CRUD comunes
export function useCrudNotifications(resourceName: string) {
  const notifications = useNotifications()
  const { showSuccess, showError, showLoading, dismissNotification } = notifications

  const showCreateSuccess = () => {
    showSuccess(`${resourceName} creado exitosamente`)
  }

  const showCreateError = (error?: string) => {
    showError(`Error al crear ${resourceName.toLowerCase()}`, {
      description: error || "Por favor, intente nuevamente",
    })
  }

  const showUpdateSuccess = () => {
    showSuccess(`${resourceName} actualizado exitosamente`)
  }

  const showUpdateError = (error?: string) => {
    showError(`Error al actualizar ${resourceName.toLowerCase()}`, {
      description: error || "Por favor, intente nuevamente",
    })
  }

  const showDeleteSuccess = () => {
    showSuccess(`${resourceName} eliminado exitosamente`)
  }

  const showDeleteError = (error?: string) => {
    showError(`Error al eliminar ${resourceName.toLowerCase()}`, {
      description: error || "Por favor, intente nuevamente",
    })
  }

  const showFetchSuccess = () => {
    showSuccess(`${resourceName}s cargados exitosamente`)
  }

  const showFetchError = (error?: string) => {
    showError(`Error al cargar ${resourceName.toLowerCase()}s`, {
      description: error || "Por favor, intente nuevamente",
    })
  }

  const withLoading = async <T>(
    operation: () => Promise<T>,
    loadingMessage: string = "Procesando..."
  ): Promise<T> => {
    const loadingId = showLoading(loadingMessage)
    try {
      const result = await operation()
      dismissNotification(loadingId)
      return result
    } catch (error) {
      dismissNotification(loadingId)
      throw error
    }
  }

  return {
    // Métodos CRUD específicos
    showCreateSuccess,
    showCreateError,
    showUpdateSuccess,
    showUpdateError,
    showDeleteSuccess,
    showDeleteError,
    showFetchSuccess,
    showFetchError,
    withLoading,
    
    // Métodos básicos expuestos
    showSuccess: notifications.showSuccess,
    showError: notifications.showError,
    showWarning: notifications.showWarning,
    showInfo: notifications.showInfo,
    showLoading: notifications.showLoading,
    dismissNotification: notifications.dismissNotification,
    dismissAllNotifications: notifications.dismissAllNotifications,
  }
}