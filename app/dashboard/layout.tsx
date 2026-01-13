"use client"

import type React from "react"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Sidebar } from "@/components/features/dashboard/Sidebar"
import { Header } from "@/components/features/dashboard/Header"
import { Footer } from "@/components/features/dashboard/Footer"
import { Loading } from "@/components/shared/Loading"
import { useAuth } from "@/hooks/useAuth"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { user, isLoading, isInitialized } = useAuth()

  useEffect(() => {
    // Solo redirigir si ya terminó la inicialización Y no hay usuario
    if (isInitialized && !isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, isInitialized, router])

  // Mostrar loading mientras se inicializa o está cargando
  if (!isInitialized || isLoading) {
    return <Loading message="Verificando sesión..." />
  }

  // Si ya inicializó y no hay usuario, no mostrar nada (está redirigiendo)
  if (!user) {
    return null
  }

  // Usuario autenticado, mostrar dashboard
  return (
    <div className="flex min-h-screen">
      <Sidebar user={user} />
      <div className="ml-64 flex flex-1 flex-col">
        <Header />
        <main className="flex-1 p-6">{children}</main>
        <Footer />
      </div>
    </div>
  )
}