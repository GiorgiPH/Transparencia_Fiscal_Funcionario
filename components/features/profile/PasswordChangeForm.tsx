"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Lock, Mail, CheckCircle, AlertCircle } from "lucide-react"
import { useUserProfile } from "@/hooks/useUserProfile"
import type { User } from "@/types/auth"

interface PasswordChangeFormProps {
  user: User
}

export function PasswordChangeForm({ user }: PasswordChangeFormProps) {
  const { requestPasswordChange, verifyCode, updatePassword, isLoading } = useUserProfile()
  const [step, setStep] = useState<"request" | "verify" | "update" | "success">("request")
  const [verificationCode, setVerificationCode] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")

  const handleRequestChange = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    try {
      await requestPasswordChange(user.email)
      setStep("verify")
    } catch (err) {
      setError("Error al enviar el código de verificación")
    }
  }

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (verificationCode.length !== 6) {
      setError("El código debe tener 6 dígitos")
      return
    }

    try {
      const isValid = await verifyCode(user.email, verificationCode)
      if (isValid) {
        setStep("update")
      } else {
        setError("Código de verificación incorrecto")
      }
    } catch (err) {
      setError("Error al verificar el código")
    }
  }

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (newPassword.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres")
      return
    }

    if (newPassword !== confirmPassword) {
      setError("Las contraseñas no coinciden")
      return
    }

    try {
      await updatePassword(user.id, newPassword)
      setStep("success")
    } catch (err) {
      setError("Error al actualizar la contraseña")
    }
  }

  const handleReset = () => {
    setStep("request")
    setVerificationCode("")
    setNewPassword("")
    setConfirmPassword("")
    setError("")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cambiar Contraseña</CardTitle>
        <CardDescription>Autenticación de dos pasos para cambio de contraseña</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Step 1: Request Change */}
        {step === "request" && (
          <form onSubmit={handleRequestChange} className="space-y-4">
            <Alert>
              <Mail className="h-4 w-4" />
              <AlertDescription className="text-sm">
                Se enviará un código de verificación a su correo electrónico: <strong>{user.email}</strong>
              </AlertDescription>
            </Alert>

            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? "Enviando..." : "Solicitar Cambio de Contraseña"}
            </Button>
          </form>
        )}

        {/* Step 2: Verify Code */}
        {step === "verify" && (
          <form onSubmit={handleVerifyCode} className="space-y-4">
            <Alert>
              <Mail className="h-4 w-4" />
              <AlertDescription className="text-sm">
                Se ha enviado un código de verificación a su correo electrónico. Por favor, ingréselo a continuación.
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <Label htmlFor="code">Código de Verificación</Label>
              <Input
                id="code"
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="123456"
                maxLength={6}
                required
                className="text-center text-lg tracking-widest"
              />
              <p className="text-xs text-muted-foreground">Ingrese el código de 6 dígitos</p>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="flex gap-3">
              <Button type="button" variant="outline" onClick={handleReset} className="flex-1 bg-transparent">
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading || verificationCode.length !== 6} className="flex-1">
                {isLoading ? "Verificando..." : "Verificar Código"}
              </Button>
            </div>
          </form>
        )}

        {/* Step 3: Update Password */}
        {step === "update" && (
          <form onSubmit={handleUpdatePassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="newPassword">Nueva Contraseña</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pl-10"
                  required
                />
              </div>
              <p className="text-xs text-muted-foreground">Mínimo 8 caracteres</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pl-10"
                  required
                />
              </div>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="flex gap-3">
              <Button type="button" variant="outline" onClick={handleReset} className="flex-1 bg-transparent">
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading} className="flex-1">
                {isLoading ? "Actualizando..." : "Actualizar Contraseña"}
              </Button>
            </div>
          </form>
        )}

        {/* Step 4: Success */}
        {step === "success" && (
          <div className="space-y-4">
            <Alert className="border-green-500 bg-green-50 dark:bg-green-900/20">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800 dark:text-green-400">
                Su contraseña ha sido actualizada exitosamente.
              </AlertDescription>
            </Alert>

            <Button onClick={handleReset} variant="outline" className="w-full bg-transparent">
              Volver
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
