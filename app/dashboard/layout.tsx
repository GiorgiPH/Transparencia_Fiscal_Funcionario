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
  const { user, isLoading } = useAuth()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return <Loading message="Cargando..." />
  }

  if (!user) {
    return null
  }

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
