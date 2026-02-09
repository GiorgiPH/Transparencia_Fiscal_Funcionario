"use client"

import { Toaster } from "@/components/ui/sonner"
import { useNotifications } from "@/hooks/useNotifications"
import { ReactNode, createContext, useContext, useEffect } from "react"

interface NotificationsContextType {
  showSuccess: (message: string, options?: any) => void
  showError: (message: string, options?: any) => void
  showWarning: (message: string, options?: any) => void
  showInfo: (message: string, options?: any) => void
  showLoading: (message: string, options?: any) => string | number
  dismissNotification: (id: string | number) => void
  dismissAllNotifications: () => void
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined)

export function useNotificationsContext() {
  const context = useContext(NotificationsContext)
  if (!context) {
    throw new Error("useNotificationsContext must be used within a NotificationsProvider")
  }
  return context
}

interface NotificationsProviderProps {
  children: ReactNode
}

export function NotificationsProvider({ children }: NotificationsProviderProps) {
  const notifications = useNotifications()

  return (
    <NotificationsContext.Provider value={notifications}>
      {children}
      <Toaster />
    </NotificationsContext.Provider>
  )
}

// Componente de utilidad para mostrar notificaciones de operaciones CRUD
interface CrudNotificationProps {
  resourceName: string
  operation: "create" | "update" | "delete" | "fetch"
  success?: boolean
  error?: string
  onClose?: () => void
}

export function CrudNotification({
  resourceName,
  operation,
  success = true,
  error,
  onClose
}: CrudNotificationProps) {
  const { showSuccess, showError } = useNotifications()

  const getOperationText = () => {
    switch (operation) {
      case "create": return "creado"
      case "update": return "actualizado"
      case "delete": return "eliminado"
      case "fetch": return "cargado"
      default: return "procesado"
    }
  }

  const getResourceText = () => {
    if (operation === "fetch") {
      return `${resourceName}s`
    }
    return resourceName
  }

  useEffect(() => {
    if (success) {
      showSuccess(`${getResourceText()} ${getOperationText()} exitosamente`)
    } else {
      showError(`Error al ${getOperationText()} ${resourceName.toLowerCase()}`, {
        description: error || "Por favor, intente nuevamente",
      })
    }

    if (onClose) {
      const timer = setTimeout(() => {
        onClose()
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [success, error, operation, resourceName, showSuccess, showError, onClose])

  return null
}