"use client"

import { useState } from "react"
import { userService } from "@/services/userService"
import type { User } from "@/types/auth"

export function useUserProfile() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const updateProfile = async (userId: string, data: Partial<User>) => {
    setIsLoading(true)
    setError(null)
    try {
      const updatedUser = await userService.updateProfile(userId, data)
      return updatedUser
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error al actualizar perfil"
      setError(message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const requestPasswordChange = async (email: string) => {
    setIsLoading(true)
    setError(null)
    try {
      await userService.requestPasswordChange(email)
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error al solicitar cambio de contraseña"
      setError(message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const verifyCode = async (email: string, code: string) => {
    setIsLoading(true)
    setError(null)
    try {
      return await userService.verifyPasswordChangeCode(email, code)
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error al verificar código"
      setError(message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const updatePassword = async (userId: string, newPassword: string) => {
    setIsLoading(true)
    setError(null)
    try {
      await userService.updatePassword(userId, newPassword)
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error al actualizar contraseña"
      setError(message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const uploadPhoto = async (file: File) => {
    setIsLoading(true)
    setError(null)
    try {
      return await userService.uploadProfilePhoto(file)
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error al subir foto"
      setError(message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  return {
    isLoading,
    error,
    updateProfile,
    requestPasswordChange,
    verifyCode,
    updatePassword,
    uploadPhoto,
  }
}
