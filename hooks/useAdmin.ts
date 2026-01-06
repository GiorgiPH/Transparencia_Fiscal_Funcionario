"use client"

import { useState, useEffect } from "react"
import { adminService } from "@/services/adminService"
import type { UserManagement, CreateUserData, Permission, RolePermissions } from "@/types/user"

export function useAdmin() {
  const [users, setUsers] = useState<UserManagement[]>([])
  const [permissions, setPermissions] = useState<Permission[]>([])
  const [rolePermissions, setRolePermissions] = useState<RolePermissions[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setIsLoading(true)
      const [usersData, permsData, rolePermsData] = await Promise.all([
        adminService.getUsers(),
        adminService.getPermissions(),
        adminService.getRolePermissions(),
      ])
      setUsers(usersData)
      setPermissions(permsData)
      setRolePermissions(rolePermsData)
    } catch (err) {
      setError("Error al cargar datos de administración")
    } finally {
      setIsLoading(false)
    }
  }

  const createUser = async (data: CreateUserData) => {
    try {
      const newUser = await adminService.createUser(data)
      setUsers([...users, newUser])
      return newUser
    } catch (err) {
      setError("Error al crear usuario")
      throw err
    }
  }

  const updateUser = async (userId: string, data: Partial<UserManagement>) => {
    try {
      const updatedUser = await adminService.updateUser(userId, data)
      setUsers(users.map((u) => (u.id === userId ? updatedUser : u)))
      return updatedUser
    } catch (err) {
      setError("Error al actualizar usuario")
      throw err
    }
  }

  const deleteUser = async (userId: string) => {
    try {
      await adminService.deleteUser(userId)
      setUsers(users.filter((u) => u.id !== userId))
    } catch (err) {
      setError("Error al eliminar usuario")
      throw err
    }
  }

  const toggleUserStatus = async (userId: string, activo: boolean) => {
    try {
      await adminService.toggleUserStatus(userId, activo)
      setUsers(users.map((u) => (u.id === userId ? { ...u, activo } : u)))
    } catch (err) {
      setError("Error al cambiar estado del usuario")
      throw err
    }
  }

  const resetPassword = async (userId: string) => {
    try {
      await adminService.resetUserPassword(userId)
    } catch (err) {
      setError("Error al resetear contraseña")
      throw err
    }
  }

  const updateRolePermissions = async (rol: string, permisos: string[]) => {
    try {
      await adminService.updateRolePermissions(rol, permisos)
      setRolePermissions(rolePermissions.map((rp) => (rp.rol === rol ? { ...rp, permisos } : rp)))
    } catch (err) {
      setError("Error al actualizar permisos del rol")
      throw err
    }
  }

  return {
    users,
    permissions,
    rolePermissions,
    isLoading,
    error,
    createUser,
    updateUser,
    deleteUser,
    toggleUserStatus,
    resetPassword,
    updateRolePermissions,
  }
}
