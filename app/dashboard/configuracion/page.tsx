"use client"

import { useState } from "react"
import { Container } from "@/components/shared/Container"
import { ProfileForm } from "@/components/features/profile/ProfileForm"
import { PasswordChangeForm } from "@/components/features/profile/PasswordChangeForm"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/hooks/useAuth"
import { Loading } from "@/components/shared/Loading"
import type { User } from "@/types/auth"

export default function ConfiguracionPage() {
  const { user, isLoading } = useAuth()
  const [currentUser, setCurrentUser] = useState<User | null>(user)

  const handleProfileUpdate = (updatedUser: User) => {
    setCurrentUser(updatedUser)
    // TODO: Update auth context with new user data
  }

  if (isLoading || !currentUser) {
    return <Loading message="Cargando configuración..." />
  }

  return (
    <Container>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-balance text-3xl font-bold tracking-tight text-foreground">Configuración</h1>
          <p className="mt-2 text-pretty text-muted-foreground">Gestione su información personal y seguridad</p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList>
            <TabsTrigger value="profile">Perfil</TabsTrigger>
            <TabsTrigger value="security">Seguridad</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <ProfileForm user={currentUser} onUpdate={handleProfileUpdate} />
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <PasswordChangeForm user={currentUser} />
          </TabsContent>
        </Tabs>
      </div>
    </Container>
  )
}
