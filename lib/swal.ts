import Swal from 'sweetalert2'

/**
 * Configuración de colores basada en la paleta del proyecto
 * Extraídos de globals.css
 */
export const SWAL_COLORS = {
  // Colores principales del tema
  primary: 'oklch(0.28 0.03 120)',      // #2E3B2B dark green
  secondary: 'oklch(0.48 0.08 40)',     // #7C4A36 brown
  muted: 'oklch(0.55 0.04 110)',        // #71785b sage green
  accent: 'oklch(0.65 0.05 60)',        // #bc9b73 tan
  destructive: 'oklch(0.577 0.245 27.325)', // Rojo destructivo
  
  // Colores para estados
  success: 'oklch(0.6 0.2 150)',        // Verde éxito
  warning: 'oklch(0.8 0.2 80)',         // Amarillo advertencia
  info: 'oklch(0.5 0.1 240)',           // Azul información
  error: 'oklch(0.577 0.245 27.325)',   // Rojo error
  
  // Colores de fondo y texto
  background: 'oklch(1 0 0)',           // Fondo blanco
  foreground: 'oklch(0.145 0 0)',       // Texto oscuro
  card: 'oklch(1 0 0)',                 // Fondo de tarjeta
  border: 'oklch(0.922 0 0)',           // Borde
  
  // Modo oscuro
  dark: {
    background: 'oklch(0.145 0 0)',
    foreground: 'oklch(0.985 0 0)',
    card: 'oklch(0.145 0 0)',
    border: 'oklch(0.269 0 0)',
  }
} as const

/**
 * Tipos de alertas disponibles
 */
export type SwalType = 'success' | 'error' | 'warning' | 'info' | 'question'

/**
 * Utilidad principal para SweetAlert2
 */
export class SwalUtils {
  /**
   * Muestra una alerta básica
   */
  static async fire(title: string, text?: string, icon?: SwalType) {
    return Swal.fire({
      title,
      text,
      icon,
      background: SWAL_COLORS.background,
      color: SWAL_COLORS.foreground,
      confirmButtonColor: SWAL_COLORS.primary,
      showConfirmButton: true,
      showCloseButton: true,
      width: '32rem',
      padding: '2rem',
    })
  }

  /**
   * Muestra una alerta de éxito
   */
  static async success(title: string, text?: string) {
    return this.fire(title, text, 'success')
  }

  /**
   * Muestra una alerta de error
   */
  static async error(title: string, text?: string) {
    return this.fire(title, text, 'error')
  }

  /**
   * Muestra una alerta de advertencia
   */
  static async warning(title: string, text?: string) {
    return this.fire(title, text, 'warning')
  }

  /**
   * Muestra una alerta de información
   */
  static async info(title: string, text?: string) {
    return this.fire(title, text, 'info')
  }

  /**
   * Muestra una alerta de pregunta/confirmación
   */
  static async question(title: string, text?: string) {
    return Swal.fire({
      title,
      text,
      icon: 'question',
      background: SWAL_COLORS.background,
      color: SWAL_COLORS.foreground,
      confirmButtonColor: SWAL_COLORS.primary,
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Confirmar',
      showCloseButton: true,
      width: '32rem',
      padding: '2rem',
    })
  }

  /**
   * Muestra una alerta de carga
   */
  static async loading(title: string = 'Cargando...', text?: string) {
    Swal.fire({
      title,
      text,
      icon: 'info',
      background: SWAL_COLORS.background,
      color: SWAL_COLORS.foreground,
      showConfirmButton: false,
      showCancelButton: false,
      showCloseButton: false,
      allowOutsideClick: false,
      allowEscapeKey: false,
      allowEnterKey: false,
      didOpen: () => {
        Swal.showLoading()
      },
    })
  }

  /**
   * Cierra la alerta actual
   */
  static close() {
    Swal.close()
  }

  /**
   * Muestra un toast (notificación pequeña)
   */
  static async toast(title: string, type: SwalType = 'success') {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      },
    })

    return Toast.fire({
      title,
      icon: type,
    })
  }

  /**
   * Confirma una eliminación con mensaje personalizado
   */
  static async confirmDelete(resourceName: string, customMessage?: string) {
    const result = await Swal.fire({
      title: `¿Eliminar ${resourceName}?`,
      text: customMessage || `Esta acción eliminará permanentemente ${resourceName}. ¿Está seguro?`,
      icon: 'warning',
      background: SWAL_COLORS.background,
      color: SWAL_COLORS.foreground,
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: SWAL_COLORS.destructive,
      showCloseButton: true,
      width: '32rem',
      padding: '2rem',
    })

    return result.isConfirmed
  }

  /**
   * Confirma una acción con opciones personalizadas
   */
  static async confirmAction(
    title: string,
    text: string,
    confirmText: string = 'Confirmar',
    cancelText: string = 'Cancelar'
  ) {
    const result = await Swal.fire({
      title,
      text,
      icon: 'question',
      background: SWAL_COLORS.background,
      color: SWAL_COLORS.foreground,
      showCancelButton: true,
      confirmButtonText: confirmText,
      cancelButtonText: cancelText,
      confirmButtonColor: SWAL_COLORS.primary,
      showCloseButton: true,
      width: '32rem',
      padding: '2rem',
    })

    return result.isConfirmed
  }

  /**
   * Ejecuta una operación con loading
   */
  static async withLoading<T>(
    operation: () => Promise<T>,
    loadingTitle: string = 'Procesando...',
    loadingText?: string
  ): Promise<T> {
    try {
      await this.loading(loadingTitle, loadingText)
      const result = await operation()
      this.close()
      return result
    } catch (error) {
      this.close()
      throw error
    }
  }
}

/**
 * Hook simplificado para uso en componentes React
 */
export function useSwal() {
  return {
    // Métodos básicos
    fire: SwalUtils.fire.bind(SwalUtils),
    success: SwalUtils.success.bind(SwalUtils),
    error: SwalUtils.error.bind(SwalUtils),
    warning: SwalUtils.warning.bind(SwalUtils),
    info: SwalUtils.info.bind(SwalUtils),
    question: SwalUtils.question.bind(SwalUtils),
    loading: SwalUtils.loading.bind(SwalUtils),
    close: SwalUtils.close.bind(SwalUtils),
    toast: SwalUtils.toast.bind(SwalUtils),
    
    // Métodos específicos
    confirmDelete: SwalUtils.confirmDelete.bind(SwalUtils),
    confirmAction: SwalUtils.confirmAction.bind(SwalUtils),
    withLoading: SwalUtils.withLoading.bind(SwalUtils),
    
    // Utilidades
    colors: SWAL_COLORS,
  }
}

/**
 * Exportación por defecto para compatibilidad
 */
export default SwalUtils